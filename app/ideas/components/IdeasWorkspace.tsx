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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

      <div id="ideas-scroll-container" className="h-full overflow-y-auto thin-scrollbar overscroll-contain">
        <div className="max-w-7xl mx-auto px-8 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10 min-h-full">
            <div className="space-y-6 pb-48 pt-8">
              <section className="rounded-xl border border-border/40 bg-card/50 backdrop-blur-sm p-4 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <h1 className="text-lg font-semibold tracking-tight">Ideas</h1>
                  <Badge variant="outline" className="gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" />
                    LangGraph Pipeline
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Multi-agent ideation workspace with Scout, Ideator, Critic, Market, Tech, and Synthesizer stages.
                </p>
              </section>

              {errorMessage ? (
                <Card className="border-red-500/30 bg-red-500/10">
                  <CardContent className="flex items-center gap-2 py-4 text-sm text-red-700 dark:text-red-300">
                    <TriangleAlert className="h-4 w-4" />
                    {errorMessage}
                  </CardContent>
                </Card>
              ) : null}

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

              {isGenerating && ideas.length === 0 ? (
                <section className="space-y-3">
                  <h2 className="text-[10px] uppercase font-semibold text-muted-foreground/60 tracking-widest">
                    Synthesizing Results
                  </h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    {[0, 1].map((item) => (
                      <div
                        key={item}
                        className="h-48 animate-pulse rounded-xl border border-zinc-200/60 bg-zinc-100/70 dark:border-zinc-800/60 dark:bg-zinc-800/40"
                      />
                    ))}
                  </div>
                </section>
              ) : null}

              {sortedIdeas.length > 0 ? (
                <section className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-base font-semibold">Final Ranked Ideas</h2>
                    <Badge variant="outline" className="gap-1">
                      <Lightbulb className="h-3.5 w-3.5" />
                      {sortedIdeas.length} generated
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    {sortedIdeas.map((idea, index) => (
                      <IdeaCard key={idea.id || `${idea.title}-${index}`} idea={idea} rank={index + 1} />
                    ))}
                  </div>
                </section>
              ) : null}

              {previousRun && sortedIdeas.length === 0 ? (
                <section>
                  <Card className="border-zinc-200/70 bg-white/70 dark:border-zinc-800/70 dark:bg-zinc-950/40">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Clock3 className="h-4 w-4" />
                        Previous Results
                      </CardTitle>
                      <CardDescription>
                        Last run for {previousRun.domain} on {new Date(previousRun.generatedAt).toLocaleString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {previousRun.skills.map((skill) => (
                          <Badge key={`previous-${skill}`} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIdeas(previousRun.ideas);
                            setDeliberationLog(previousRun.deliberationLog);
                          }}
                        >
                          <RefreshCcw className="h-3.5 w-3.5" />
                          Load Previous Results
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </section>
              ) : null}

              {(deliberationLog.length > 0 || isGenerating) ? (
                <section>
                  <details className="rounded-xl border border-zinc-200/70 bg-white/70 p-4 shadow-sm dark:border-zinc-800/70 dark:bg-zinc-950/40">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-2 font-medium text-zinc-800 dark:text-zinc-100">
                      <span className="inline-flex items-center gap-2">
                        <ListTree className="h-4 w-4" />
                        Behind the Scenes
                      </span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        {deliberationLog.length} log entries
                      </span>
                    </summary>

                    <div className="mt-4 max-h-96 space-y-2 overflow-y-auto pr-1 text-sm thin-scrollbar">
                      {deliberationLog.length === 0 ? (
                        <p className="text-zinc-500 dark:text-zinc-400">Logs will appear as agents reason through the pipeline.</p>
                      ) : (
                        deliberationLog.map((entry, index) => (
                          <div
                            key={`${entry.timestamp}-${entry.agent}-${index}`}
                            className="rounded-md border border-zinc-200/80 bg-zinc-50/80 px-3 py-2 dark:border-zinc-800/80 dark:bg-zinc-900/60"
                          >
                            <div className="flex items-center justify-between gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                              <span className="font-medium uppercase tracking-wide">{entry.agent}</span>
                              <span>{new Date(entry.timestamp).toLocaleTimeString()}</span>
                            </div>
                            <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-200">{entry.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </details>
                </section>
              ) : null}
            </div>

            <aside className="relative sticky top-0 h-screen hidden lg:flex flex-col justify-center">
              <div className="space-y-4 py-6 overflow-y-auto no-scrollbar max-h-[calc(100vh-10rem)]">
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

            <div className="lg:hidden pb-10">
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
