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
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AgentName } from "@/lib/ideas/types";
import { STAGES, type StageStatus } from "@/app/lab/ideas/components/ideaForgeConfig";

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

function StageStatusIcon({ status, isActive }: { status: StageStatus; isActive: boolean }) {
  if (status === "complete") {
    return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
  }

  if (status === "error") {
    return <TriangleAlert className="h-5 w-5 text-red-500" />;
  }

  if (status === "active" || isActive) {
    return <Loader2 className="h-5 w-5 animate-spin text-primary" />;
  }

  return <Circle className="h-4 w-4 text-muted-foreground/30" />;
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
    <div className="rounded-xl border border-white/40 dark:border-white/5 bg-linear-to-br from-white/60 to-white/30 dark:from-zinc-900/40 dark:to-zinc-900/10 backdrop-blur-md shadow-xl shadow-black/5 p-6 md:p-8 flex flex-col h-full">
      <div className="space-y-2 mb-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-primary/10">
            <Activity className="h-4 w-4 text-primary" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">Agent Pipeline</h2>
        </div>
        <p className="text-sm text-muted-foreground pl-[40px]">
          {isGenerating
            ? "Agents are currently collaborating."
            : "Run Forge to watch agents execute."}
        </p>
      </div>

      <div className="h-1.5 w-full bg-muted/50 rounded-full overflow-hidden mb-8">
        <div 
          className="h-full bg-primary transition-all duration-500 ease-in-out"
          style={{ width: `${progressValue}%` }}
        />
      </div>

      <div className="flex-1 space-y-4">
        {iterationMessages.length > 0 && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs text-amber-700 dark:text-amber-400 font-medium mb-6">
            {iterationMessages[iterationMessages.length - 1]}
          </div>
        )}

        <div className="space-y-4">
          {STAGES.map((stage, index) => {
            const Icon = iconMap[stage.id];
            const status = stageStatus[stage.id];
            const isActive = activeAgent === stage.id;
            const thoughts = stageThoughts[stage.id] || [];
            const stageError = stageErrors[stage.id];

            return (
              <div 
                key={stage.id} 
                className={cn(
                  "relative rounded-xl border p-4 transition-all duration-300",
                  isActive ? "border-primary/50 bg-card shadow-sm" : "border-border/50 bg-background/30"
                )}
              >
                {/* Connecting line */}
                {index < STAGES.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute left-[29px] top-[50px] bottom-[-20px] w-px bg-border/60"
                  />
                )}

                <div className="flex items-start gap-4">
                  <div className={cn(
                    "mt-0.5 flex h-7 w-7 items-center justify-center rounded-full shrink-0 z-10 bg-background border",
                    isActive ? "border-primary shadow-sm" : "border-border/50",
                    status === "complete" ? "border-emerald-500/50" : ""
                  )}>
                    <StageStatusIcon status={status} isActive={isActive} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className={cn(
                        "h-4 w-4", 
                        isActive ? "text-primary" : "text-muted-foreground/60"
                      )} />
                      <h3 className={cn(
                        "text-sm font-semibold tracking-tight",
                        isActive ? "text-foreground" : "text-muted-foreground"
                      )}>
                        {stage.label}
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground/70 leading-relaxed uppercase tracking-wider font-medium">
                      {stage.description}
                    </p>

                    <AnimatePresence initial={false}>
                      {(isActive || thoughts.length > 0 || stageError) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-3 space-y-2 rounded-lg border border-border/40 bg-muted/20 p-3 text-xs">
                            {thoughts.length === 0 && isActive && (
                              <div className="animate-pulse text-muted-foreground italic flex items-center gap-2">
                                <Loader2 className="h-3 w-3 animate-spin" /> Processing...
                              </div>
                            )}

                            {thoughts.slice(-5).map((thought, idx) => (
                              <div key={`${stage.id}-thought-${idx}`} className="text-foreground/70 flex gap-2">
                                <span className="text-primary/50 select-none">›</span>
                                <span>{thought}</span>
                              </div>
                            ))}

                            {stageError && (
                              <div className="flex items-start gap-2 text-red-500 font-medium bg-red-500/10 p-2 rounded border border-red-500/20 mt-2">
                                <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                                <span>{stageError}</span>
                              </div>
                            )}
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
      </div>
    </div>
  );
}
