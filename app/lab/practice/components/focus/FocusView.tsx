// app/lab/practice/components/focus/FocusView.tsx

"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowRight, RotateCcw, Home, CheckCircle2, Flag } from "lucide-react";
import { usePracticeContext } from "../../context/PracticeContext";
import { FocusEmpty } from "./FocusEmpty";
import { FocusCard } from "./FocusCard";
import { cn } from "@/lib/utils";
import type { TimerHandle } from "../../hooks/useTimer";

interface FocusViewProps {
  timer: TimerHandle;
}

/**
 * Reads the ?p=<problemId> URL param to decide what to show:
 * - No param → <FocusEmpty> (pick a problem)
 * - Valid param → <FocusCard> (focused work session)
 * - After solving/giving up → inline "What's next?" suggestion
 */
export function FocusView({ timer }: FocusViewProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { problemIndex } = usePracticeContext();

  const problemId = searchParams.get("p");
  const problem = problemId ? problemIndex.get(problemId) ?? null : null;

  // ── "What's next?" state after completing a problem ──────────────────
  const [completedState, setCompletedState] = useState<{
    type: "solved" | "gave_up";
    problemTitle: string;
    problemId: string;
  } | null>(null);

  const handleSolved = (id: string) => {
    const p = problemIndex.get(id);
    setCompletedState({
      type: "solved",
      problemTitle: p?.title ?? id,
      problemId: id,
    });
  };

  const handleGaveUp = (id: string) => {
    const p = problemIndex.get(id);
    setCompletedState({
      type: "gave_up",
      problemTitle: p?.title ?? id,
      problemId: id,
    });
  };

  // ── "What's next?" view ────────────────────────────────────────────────
  if (completedState) {
    const isSolved = completedState.type === "solved";
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-full max-w-sm space-y-8">
          {/* Status */}
          <div className="text-center space-y-3">
            <div className={cn(
              "mx-auto h-14 w-14 rounded-2xl flex items-center justify-center",
              isSolved ? "bg-green-500/10" : "bg-amber-500/10",
            )}>
              {isSolved ? (
                <CheckCircle2 className="h-7 w-7 text-green-500" />
              ) : (
                <Flag className="h-7 w-7 text-amber-500" />
              )}
            </div>
            <p className="text-lg font-semibold text-foreground tracking-tight">
              {isSolved ? "Nice work!" : "No worries — every attempt counts."}
            </p>
            <p className="text-sm text-muted-foreground">
              {isSolved
                ? `You solved "${completedState.problemTitle}".`
                : `"${completedState.problemTitle}" saved. Review it later.`}
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border/40" />
            <span className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground/60">
              What&apos;s next?
            </span>
            <div className="flex-1 h-px bg-border/40" />
          </div>

          {/* Action cards */}
          <div className="space-y-2.5">
            <button
              onClick={() => {
                setCompletedState(null);
                router.push("/lab/practice/focus");
              }}
              className="w-full flex items-center gap-3.5 p-3.5 rounded-xl border border-border/50 bg-white/50 dark:bg-zinc-900/30 hover:border-primary/40 hover:bg-primary/5 transition-all text-left"
            >
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <ArrowRight className="h-4.5 w-4.5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Next Problem</p>
                <p className="text-xs text-muted-foreground">Pick a new problem to solve</p>
              </div>
            </button>

            {completedState.type === "gave_up" && (
              <button
                onClick={() => {
                  setCompletedState(null);
                  timer.reset();
                  timer.start();
                  router.push(`/lab/practice/focus?p=${completedState.problemId}`);
                }}
                className="w-full flex items-center gap-3.5 p-3.5 rounded-xl border border-border/50 bg-white/50 dark:bg-zinc-900/30 hover:border-teal-500/40 hover:bg-teal-500/5 transition-all text-left"
              >
                <div className="h-9 w-9 rounded-lg bg-teal-500/10 flex items-center justify-center shrink-0">
                  <RotateCcw className="h-4.5 w-4.5 text-teal-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Try Again</p>
                  <p className="text-xs text-muted-foreground">Retry with a fresh timer</p>
                </div>
              </button>
            )}

            <button
              onClick={() => router.push("/lab/practice")}
              className="w-full flex items-center gap-3.5 p-3.5 rounded-xl border border-transparent hover:bg-muted/30 transition-all text-left"
            >
              <div className="h-9 w-9 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                <Home className="h-4.5 w-4.5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Back to Browse</p>
                <p className="text-xs text-muted-foreground/70">Return to the problem list</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!problem) {
    return <FocusEmpty />;
  }

  return (
    <FocusCard
      key={problem.id}
      problem={problem}
      timer={timer}
      onSolved={handleSolved}
      onGaveUp={handleGaveUp}
    />
  );
}