"use client";

import { useEffect, useMemo, useState } from "react";
import { Clock3, Lightbulb, ListTree, RefreshCcw, Sparkles, TriangleAlert } from "lucide-react";
import { IdeaForgeForm } from "@/app/ideas/components/IdeaForgeForm";
import {
  STAGES,
  type StageStatus,
} from "@/app/ideas/components/ideaForgeConfig";
import { IdeaCard } from "@/app/ideas/components/IdeaCard";
import { PipelineVisualizer } from "@/app/ideas/components/PipelineVisualizer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  AgentName,
  FinalIdea,
  LogEntry,
  UserPreferences,
} from "@/lib/ideaforge/types";

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
      const response = await fetch("/api/ideaforge/generate", {
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
    <div className="relative h-full">
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-background to-transparent z-10" />

      <div id="ideas-scroll-container" className="h-full overflow-y-auto thin-scrollbar overscroll-contain pb-20">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 pt-16">
          {/* Header */}
          <div className="mb-10 space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-primary/10">
                <Lightbulb className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Idea Forge</h1>
            </div>
            <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">
              Multi-agent ideation workspace. Provide your domain context and skills, and let an explicit team of agents brainstrorm, critique, completely validate, and refine ideas to bring to the Lab.
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-10 min-h-full">
            <div className="space-y-10 pb-16">

              {errorMessage && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 flex items-center gap-3 text-red-700 dark:text-red-400">
                  <TriangleAlert className="h-5 w-5 shrink-0" />
                  <p className="text-sm font-medium">{errorMessage}</p>
                </div>
              )}

              {/* Main Form container with Lab UI styling */}
              <div className="rounded-2xl border border-white/40 dark:border-white/5 bg-linear-to-br from-white/60 to-white/30 dark:from-zinc-900/40 dark:to-zinc-900/10 backdrop-blur-md shadow-xl shadow-black/5 p-6 md:p-8">
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

              {isGenerating && ideas.length === 0 && (
                <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="text-[10px] uppercase font-semibold text-muted-foreground/60 tracking-widest pl-1">
                    Synthesizing Pipeline Results...
                  </h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    {[0, 1].map((item) => (
                      <div
                        key={item}
                        className="h-64 animate-pulse rounded-xl border border-border/40 bg-muted/20"
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Final Ranked Ideas Output */}
              {sortedIdeas.length > 0 && (
                <section className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
                  <div className="flex items-center justify-between gap-2 border-b border-border/50 pb-4">
                    <h2 className="text-xl font-bold tracking-tight text-foreground">Final Ranked Sparks</h2>
                    <Badge variant="outline" className="gap-1.5 px-3 py-1 bg-background text-sm">
                      <Sparkles className="h-3.5 w-3.5 text-primary" />
                      {sortedIdeas.length} Generated
                    </Badge>
                  </div>

                  <div className="space-y-6">
                    {sortedIdeas.map((idea, index) => (
                      <IdeaCard key={idea.id || `${idea.title}-${index}`} idea={idea} rank={index + 1} />
                    ))}
                  </div>
                </section>
              )}

              {previousRun && sortedIdeas.length === 0 && !isGenerating && (
                <section className="animate-in fade-in duration-500">
                  <div className="rounded-xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm shadow-sm transition-all hover:bg-card/80">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="flex items-center gap-2 text-base font-semibold">
                        <Clock3 className="h-4 w-4 text-primary" />
                        Restore Previous Session
                      </h3>
                      <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
                        {new Date(previousRun.generatedAt).toLocaleString()}
                      </span>
                    </div>
                    
                    <p className="text-sm text-foreground/80 mb-4">
                      Last generated ideas for <strong className="text-foreground">{previousRun.domain}</strong> targeting {previousRun.skills.join(", ")}.
                    </p>

                    <Button
                      variant="outline"
                      className="border-primary/30 text-primary hover:bg-primary/10 hover:text-primary transition-colors text-sm h-9"
                      onClick={() => {
                        setIdeas(previousRun.ideas);
                        setDeliberationLog(previousRun.deliberationLog);
                      }}
                    >
                      <RefreshCcw className="h-3.5 w-3.5 mr-2" />
                      Load Previous Results
                    </Button>
                  </div>
                </section>
              )}

              {/* Dev Logs */}
              {(deliberationLog.length > 0 || isGenerating) && (
                <section>
                  <details className="rounded-xl border border-border/40 bg-card/40 p-5 shadow-sm group">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-2 font-medium text-foreground outline-none">
                      <span className="inline-flex items-center gap-2.5">
                        <ListTree className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="text-sm font-semibold tracking-wide">Under the Hood / Execution Logs</span>
                      </span>
                      <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded-md border border-border/50">
                        {deliberationLog.length} log entries
                      </span>
                    </summary>

                    <div className="mt-5 max-h-96 space-y-3 overflow-y-auto pr-2 text-sm thin-scrollbar">
                      {deliberationLog.length === 0 ? (
                        <p className="text-muted-foreground italic text-xs">Waiting for agent execution logs...</p>
                      ) : (
                        deliberationLog.map((entry, index) => (
                          <div
                            key={`${entry.timestamp}-${entry.agent}-${index}`}
                            className="rounded-lg border border-border/40 bg-background/50 px-4 py-3"
                          >
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                              <span className={cn(
                                "text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-md",
                                "bg-muted text-muted-foreground"
                              )}>
                                {entry.agent}
                              </span>
                              <span className="text-[10px] text-muted-foreground/60 font-mono">
                                {new Date(entry.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="text-xs text-foreground/80 leading-relaxed font-mono whitespace-pre-wrap">{entry.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </details>
                </section>
              )}
            </div>

            {/* Right Panel / Desktop */}
            <aside className="relative hidden xl:block">
               <div className="sticky top-24 h-[calc(100vh-8rem)]">
                 <PipelineVisualizer
                   activeAgent={activeAgent}
                   stageStatus={stageStatus}
                   stageThoughts={stageThoughts}
                   stageErrors={stageErrors}
                   iterationMessages={iterationMessages}
                   isGenerating={isGenerating}
                 />
               </div>
            </aside>

            {/* Right Panel / Mobile */}
            <div className="xl:hidden pb-10">
              <PipelineVisualizer
                activeAgent={activeAgent}
                stageStatus={stageStatus}
                stageThoughts={stageThoughts}
                stageErrors={stageErrors}
                iterationMessages={iterationMessages}
                isGenerating={isGenerating}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
