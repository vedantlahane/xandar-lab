// app/lab/practice/components/focus/FocusView.tsx

"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowRight, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePracticeContext } from "../../context/PracticeContext";
import { FocusEmpty } from "./FocusEmpty";
import { FocusCard } from "./FocusCard";
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
  } | null>(null);

  const handleSolved = (id: string) => {
    const p = problemIndex.get(id);
    setCompletedState({
      type: "solved",
      problemTitle: p?.title ?? id,
    });
  };

  const handleGaveUp = (id: string) => {
    const p = problemIndex.get(id);
    setCompletedState({
      type: "gave_up",
      problemTitle: p?.title ?? id,
    });
  };

  // ── "What's next?" view ────────────────────────────────────────────────
  if (completedState) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md">
          <div className="space-y-2">
            <p className="text-lg font-medium text-foreground">
              {completedState.type === "solved"
                ? "✓ Nice work!"
                : "No worries — every attempt counts."}
            </p>
            <p className="text-sm text-muted-foreground">
              {completedState.type === "solved"
                ? `You solved "${completedState.problemTitle}".`
                : `"${completedState.problemTitle}" saved as gave-up. Review it later.`}
            </p>
          </div>

          <div className="h-px bg-border/40 w-48 mx-auto" />

          <p className="text-sm font-medium text-muted-foreground">What&apos;s next?</p>

          <div className="flex flex-col gap-3 w-56 mx-auto">
            <Button
              variant="outline"
              className="h-12 font-medium hover:border-primary/50 hover:bg-primary/5 gap-2"
              onClick={() => {
                setCompletedState(null);
                router.push("/lab/practice/focus");
              }}
            >
              <ArrowRight className="h-4 w-4 text-primary" />
              Next Problem
            </Button>

            {completedState.type === "gave_up" && (
              <Button
                variant="outline"
                className="h-12 font-medium hover:border-teal-500/50 hover:bg-teal-500/5 gap-2"
                onClick={() => {
                  setCompletedState(null);
                  // Retry the same problem
                }}
              >
                <RotateCcw className="h-4 w-4 text-teal-500" />
                Try Again
              </Button>
            )}

            <Button
              variant="ghost"
              className="h-10 text-sm text-muted-foreground hover:text-foreground gap-2"
              onClick={() => router.push("/lab/practice")}
            >
              <Home className="h-4 w-4" />
              Back to Browse
            </Button>
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