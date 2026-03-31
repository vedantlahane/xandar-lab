"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  LineChart,
  Loader2,
  PenTool,
  Search,
  ShieldAlert,
  TriangleAlert,
  Wrench,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { AgentName } from "@/lib/ideaforge/types";
import { STAGES, type StageStatus } from "@/app/ideas/components/ideaForgeConfig";

const iconMap: Record<AgentName, React.ComponentType<{ className?: string }>> = {
  scout: Search,
  ideator: PenTool,
  critic: ShieldAlert,
  market_check: LineChart,
  tech_review: Wrench,
  synthesizer: PenTool,
};

type PipelineVisualizerProps = {
  activeAgent: AgentName | "idle";
  stageStatus: Record<AgentName, StageStatus>;
  stageThoughts: Record<AgentName, string[]>;
  stageErrors: Partial<Record<AgentName, string>>;
  iterationMessages: string[];
  isGenerating: boolean;
};

function StageStatusIcon(props: {
  status: StageStatus;
  isActive: boolean;
}) {
  const { status, isActive } = props;

  if (status === "complete") {
    return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
  }

  if (status === "error") {
    return <TriangleAlert className="h-5 w-5 text-red-500" />;
  }

  if (status === "active" || isActive) {
    return <Loader2 className="h-5 w-5 animate-spin text-teal-500" />;
  }

  return <Circle className="h-4 w-4 text-zinc-400" />;
}

export function PipelineVisualizer(props: PipelineVisualizerProps) {
  const {
    activeAgent,
    stageStatus,
    stageThoughts,
    stageErrors,
    iterationMessages,
    isGenerating,
  } = props;

  const completedCount = STAGES.filter((stage) => stageStatus[stage.id] === "complete").length;
  const progressValue = Math.round((completedCount / STAGES.length) * 100);

  return (
    <Card className="border-zinc-200/70 bg-white/70 shadow-sm backdrop-blur-sm dark:border-zinc-800/70 dark:bg-zinc-950/40">
      <CardHeader className="space-y-3">
        <CardTitle>Live Agent Pipeline</CardTitle>
        <CardDescription>
          {isGenerating
            ? "Agents are collaborating in real time."
            : "Run Idea Forge to watch each agent stage execute."}
        </CardDescription>
        <Progress value={progressValue} className="h-2" />
      </CardHeader>

      <CardContent className="space-y-3">
        {iterationMessages.length > 0 ? (
          <div className="rounded-lg border border-amber-300/50 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-600/30 dark:bg-amber-950/30 dark:text-amber-200">
            {iterationMessages[iterationMessages.length - 1]}
          </div>
        ) : null}

        <div className="space-y-3">
          {STAGES.map((stage, index) => {
            const Icon = iconMap[stage.id];
            const status = stageStatus[stage.id];
            const isActive = activeAgent === stage.id;
            const thoughts = stageThoughts[stage.id] || [];
            const stageError = stageErrors[stage.id];

            return (
              <div key={stage.id} className="relative rounded-xl border border-zinc-200/70 bg-white/80 p-3 dark:border-zinc-800/70 dark:bg-zinc-900/50">
                {index < STAGES.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="absolute left-[17px] top-11 h-[calc(100%+8px)] w-px bg-zinc-200 dark:bg-zinc-700"
                  />
                ) : null}

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-6 w-6 items-center justify-center">
                    <StageStatusIcon status={status} isActive={isActive} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                      <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">{stage.label}</h3>
                    </div>
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{stage.description}</p>

                    <AnimatePresence initial={false}>
                      {(isActive || thoughts.length > 0 || stageError) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-3 space-y-2 rounded-lg bg-zinc-100/80 p-2.5 text-xs dark:bg-zinc-800/70">
                            {thoughts.length === 0 && isActive ? (
                              <div className="animate-pulse text-zinc-500 dark:text-zinc-300">
                                Working on this stage...
                              </div>
                            ) : null}

                            {thoughts.slice(-5).map((thought, idx) => (
                              <div key={`${stage.id}-thought-${idx}`} className="text-zinc-600 dark:text-zinc-300">
                                {thought}
                              </div>
                            ))}

                            {stageError ? (
                              <div className="flex items-start gap-1.5 text-red-600 dark:text-red-400">
                                <TriangleAlert className="mt-[2px] h-3.5 w-3.5 shrink-0" />
                                <span>{stageError}</span>
                              </div>
                            ) : null}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
