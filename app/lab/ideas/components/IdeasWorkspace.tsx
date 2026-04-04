"use client";

import { useEffect, useMemo, useState } from "react";
import { Clock3, Lightbulb, ListTree, RefreshCcw, Sparkles, TriangleAlert } from "lucide-react";
import { IdeaForgeForm } from "@/app/lab/ideas/components/IdeaForgeForm";
import {
  STAGES,
  type StageStatus,
} from "@/app/lab/ideas/components/ideaForgeConfig";
import { IdeaCard } from "@/app/lab/ideas/components/IdeaCard";
import { PipelineVisualizer } from "@/app/lab/ideas/components/PipelineVisualizer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  AgentName,
  FinalIdea,
  LogEntry,
  UserPreferences,
} from "@/lib/ideas/types";

const LOCAL_STORAGE_KEY = "xandar-ideas-last-run";

type StoredRun = {
  generatedAt: string;
  domain: string;
  skills: string[];
  preferences: UserPreferences;
  ideas: FinalIdea[];
  deliberationLog: LogEntry[];
};

function makeStageStatus(): Record<AgentName, StageStatus> {
  return {
    scout: "pending",
    ideator: "pending",
    critic: "pending",
    market_check: "pending",
    tech_review: "pending",
    synthesizer: "pending",
  };
}

function makeThoughtState(): Record<AgentName, string[]> {
  return {
    scout: [],
    ideator: [],
    critic: [],
    market_check: [],
    tech_review: [],
    synthesizer: [],
  };
}

function makeErrorState(): Partial<Record<AgentName, string>> {
  return {
    scout: undefined,
    ideator: undefined,
    critic: undefined,
    market_check: undefined,
    tech_review: undefined,
    synthesizer: undefined,
  };
}

function isAgentName(value: unknown): value is AgentName {
  return STAGES.some((stage) => stage.id === value);
}

function parseSsePayload(payload: string) {
  const chunks = payload.split("\n\n").filter(Boolean);

  return chunks
    .map((block) => {
      const lines = block.split("\n");
      const eventLine = lines.find((line) => line.startsWith("event:"));
      const dataLines = lines.filter((line) => line.startsWith("data:"));

      if (!eventLine || dataLines.length === 0) return null;

      const event = eventLine.replace("event:", "").trim();
      const rawData = dataLines
        .map((line) => line.replace("data:", "").trim())
        .join("\n");

      try {
        const data = JSON.parse(rawData) as Record<string, unknown>;
        return { event, data };
      } catch {
        return null;
      }
    })
    .filter((item): item is { event: string; data: Record<string, unknown> } => item !== null);
}

export function IdeasWorkspace() {
  const [domain, setDomain] = useState("Developer Tools");
  const [skills, setSkills] = useState<string[]>(["React", "TypeScript", "LangGraph"]);
  const [preferences, setPreferences] = useState<UserPreferences>({
    timeline: "2-4 weeks",
    goal: "side_project",
    monetization: "nice_to_have",
  });

  const [activeAgent, setActiveAgent] = useState<AgentName | "idle">("idle");
  const [stageStatus, setStageStatus] = useState<Record<AgentName, StageStatus>>(makeStageStatus());
  const [stageThoughts, setStageThoughts] = useState<Record<AgentName, string[]>>(makeThoughtState());
  const [stageErrors, setStageErrors] = useState<Partial<Record<AgentName, string>>>(makeErrorState());
  const [iterationMessages, setIterationMessages] = useState<string[]>([]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [ideas, setIdeas] = useState<FinalIdea[]>([]);
  const [deliberationLog, setDeliberationLog] = useState<LogEntry[]>([]);

  const [previousRun, setPreviousRun] = useState<StoredRun | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as StoredRun;
      if (parsed?.ideas && Array.isArray(parsed.ideas)) {
        setPreviousRun(parsed);
      }
    } catch {
      // ignore invalid local cache
    }
  }, []);

  const sortedIdeas = useMemo(
    () => [...ideas].sort((a, b) => b.confidenceScore - a.confidenceScore),
    [ideas]
  );

  const handleForge = async () => {
    setErrorMessage(null);
    setIsGenerating(true);
    setIdeas([]);
    setDeliberationLog([]);
    setActiveAgent("idle");
    setStageStatus(makeStageStatus());
    setStageThoughts(makeThoughtState());
    setStageErrors(makeErrorState());
    setIterationMessages([]);

    try {
      const response = await fetch("/api/ideas/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          domain,
          skills,
          preferences,
        }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error || `Request failed with status ${response.status}`);
      }

      if (!response.body) {
        throw new Error("Streaming response is unavailable");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = parseSsePayload(buffer);

        const lastBoundary = buffer.lastIndexOf("\n\n");
        if (lastBoundary >= 0) {
          buffer = buffer.slice(lastBoundary + 2);
        }

        for (const packet of events) {
          const { event, data } = packet;
          const agent = data.agent;

          if (event === "agent_start" && isAgentName(agent)) {
            setActiveAgent(agent);
            setStageStatus((current) => ({
              ...current,
              [agent]: "active",
            }));

            const message = typeof data.message === "string" ? data.message : "Agent started";
            setStageThoughts((current) => ({
              ...current,
              [agent]: [...current[agent], message],
            }));
            continue;
          }

          if (event === "agent_thinking" && isAgentName(agent)) {
            const thought = typeof data.thought === "string" ? data.thought : "Thinking...";
            setStageThoughts((current) => ({
              ...current,
              [agent]: [...current[agent], thought],
            }));
            continue;
          }

          if (event === "agent_complete" && isAgentName(agent)) {
            setStageStatus((current) => ({
              ...current,
              [agent]: "complete",
            }));

            setStageErrors((current) => ({
              ...current,
              [agent]: undefined,
            }));
            continue;
          }

          if (event === "agent_error" && isAgentName(agent)) {
            const error = typeof data.error === "string" ? data.error : "Agent error";
            setStageStatus((current) => ({
              ...current,
              [agent]: "error",
            }));
            setStageErrors((current) => ({
              ...current,
              [agent]: error,
            }));
            setStageThoughts((current) => ({
              ...current,
              [agent]: [...current[agent], error],
            }));
            continue;
          }

          if (event === "iteration") {
            const round = typeof data.round === "number" ? data.round : "?";
            const reason = typeof data.reason === "string" ? data.reason : "Critic requested another round.";
            const message = `Ideas did not survive critique. Iterating with feedback... (Round ${round}/3) ${reason}`;

            setIterationMessages((current) => [...current, message]);
            continue;
          }

          if (event === "complete") {
            const incomingIdeas = Array.isArray(data.ideas) ? (data.ideas as FinalIdea[]) : [];
            const incomingLog = Array.isArray(data.deliberation_log)
              ? (data.deliberation_log as LogEntry[])
              : [];

            setIdeas(incomingIdeas);
            setDeliberationLog(incomingLog);
            setActiveAgent("idle");

            const run: StoredRun = {
              generatedAt: new Date().toISOString(),
              domain,
              skills,
              preferences,
              ideas: incomingIdeas,
              deliberationLog: incomingLog,
            };

            setPreviousRun(run);
            window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(run));
          }
        }
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to run Idea Forge.");
    } finally {
      setIsGenerating(false);
      setActiveAgent("idle");
    }
  };

  return (
    <div className="relative h-full flex flex-col items-center">
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-background to-transparent z-10" />

      <div id="ideas-scroll-container" className="w-full h-full overflow-y-auto thin-scrollbar overscroll-contain pb-32">
        <div className="max-w-3xl mx-auto px-6 md:px-8 pt-12 md:pt-20 space-y-12">
          
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="mx-auto h-16 w-16 rounded-2xl flex items-center justify-center bg-primary/10 shadow-inner border border-primary/20">
              <Lightbulb className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Idea Forge</h1>
            <p className="text-muted-foreground text-sm max-w-lg mx-auto">
              Configure your domain and capabilities. Our multi-agent pipeline will autonomously brainstorm, critique, validate, and synthesize polished ideas for you.
            </p>
          </div>

          {errorMessage && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 flex items-center gap-3 text-red-700 dark:text-red-400">
              <TriangleAlert className="h-5 w-5 shrink-0" />
              <p className="text-sm font-medium">{errorMessage}</p>
            </div>
          )}

          {/* Form */}
          <div className="rounded-2xl border border-border/40 bg-card/40 backdrop-blur-md shadow-xl shadow-black/5 p-6 md:p-8">
            <IdeaForgeForm
              domain={domain}
              skills={skills}
              preferences={preferences}
              isGenerating={isGenerating}
              onChange={(payload) => {
                setDomain(payload.domain);
                setSkills(payload.skills);
                setPreferences(payload.preferences);
              }}
              onSubmit={handleForge}
            />
          </div>

          {/* Restore Previous Button if applicable */}
          {previousRun && sortedIdeas.length === 0 && !isGenerating && (
            <div className="rounded-xl border border-border/50 bg-card/60 p-5 mt-4 backdrop-blur-sm shadow-sm transition-all hover:bg-card/80 text-center max-w-sm mx-auto">
              <p className="text-xs text-foreground/70 mb-3 leading-relaxed">
                Found a previous session for <strong>{previousRun.domain}</strong>.
              </p>
              <Button
                variant="outline"
                className="w-full border-primary/30 text-primary hover:bg-primary/10 hover:text-primary transition-colors text-xs h-9 shadow-sm"
                onClick={() => {
                  setIdeas(previousRun.ideas);
                  setDeliberationLog(previousRun.deliberationLog);
                }}
              >
                <RefreshCcw className="h-3 w-3 mr-2" />
                Restore the Results
              </Button>
            </div>
          )}

          {/* Activity / Visualizer */}
          {(isGenerating || iterationMessages.length > 0) && (
            <div className="pt-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="text-center mb-6">
                <h2 className="text-sm font-bold tracking-widest uppercase text-muted-foreground">Pipeline Execution Activity</h2>
              </div>
              <PipelineVisualizer
                activeAgent={activeAgent}
                stageStatus={stageStatus}
                stageThoughts={stageThoughts}
                stageErrors={stageErrors}
                iterationMessages={iterationMessages}
                isGenerating={isGenerating}
              />
            </div>
          )}

          {/* Skeletons while assembling final ideas */}
          {isGenerating && ideas.length === 0 && Array.from(Object.values(stageStatus)).every(s => s === "complete") && (
            <div className="pt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="text-center flex justify-center items-center gap-2">
                 <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                 <h2 className="text-xs font-bold tracking-widest uppercase text-muted-foreground animate-pulse">Finalizing Forged Ideas...</h2>
              </div>
              <div className="space-y-4">
                {[0, 1].map((item) => (
                  <div key={item} className="h-64 animate-pulse rounded-2xl border border-border/40 bg-card/40 backdrop-blur-md" />
                ))}
              </div>
            </div>
          )}

          {/* Results! */}
          {sortedIdeas.length > 0 && (
            <div className="pt-12 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="flex flex-col items-center justify-center gap-3 border-b border-border/40 pb-6 text-center">
                <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center justify-center gap-2">
                  <Sparkles className="h-6 w-6 text-primary" />
                  Forged Validation complete
                </h2>
                <Badge variant="secondary" className="px-3 py-1 bg-primary/10 text-primary border-primary/20 shadow-inner text-xs">
                  {sortedIdeas.length} Verified Concepts Generated
                </Badge>
              </div>

              <div className="space-y-8">
                {sortedIdeas.map((idea, index) => (
                  <IdeaCard key={idea.id || `${idea.title}-${index}`} idea={idea} rank={index + 1} />
                ))}
              </div>
            </div>
          )}

          {/* Logs */}
          {deliberationLog.length > 0 && (
            <div className="pt-8 pb-12">
              <details className="rounded-xl border border-border/30 bg-muted/10 p-5 shadow-sm group backdrop-blur-md text-left">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-2 font-medium text-foreground outline-none">
                  <span className="inline-flex items-center gap-2.5">
                    <ListTree className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-sm font-semibold tracking-wide">Developer Trace Logs</span>
                  </span>
                  <span className="text-[10px] text-muted-foreground bg-background px-2 py-1 rounded-md border border-border/50">
                    {deliberationLog.length} entries
                  </span>
                </summary>

                <div className="mt-5 max-h-96 space-y-3 overflow-y-auto pr-2 text-sm thin-scrollbar">
                  {deliberationLog.map((entry, index) => (
                    <div
                      key={`${entry.timestamp}-${entry.agent}-${index}`}
                      className="rounded-lg border border-border/40 bg-background/80 px-4 py-3 shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className={cn(
                          "text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-md",
                          "bg-primary/10 text-primary border border-primary/20"
                        )}>
                          {entry.agent}
                        </span>
                        <span className="text-[10px] text-muted-foreground/60 font-mono">
                          {new Date(entry.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-xs text-foreground/80 leading-relaxed font-mono whitespace-pre-wrap">{entry.message}</p>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
