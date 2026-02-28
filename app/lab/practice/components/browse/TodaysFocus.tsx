// app/lab/practice/components/browse/TodaysFocus.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, RotateCcw, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePracticeContext } from "../../context/PracticeContext";

// TODO: Replace with computed suggestions from:
// 1. useSpacedRepetition() — problems with nextReviewDate <= today
// 2. Recent failures — problems where last attempt was "gave-up"
// 3. Topic staleness — topics not practiced in >7 days
const SUGGESTIONS = [
  {
    type: "Review" as const,
    title: "Two Sum",
    meta: "Easy · Arrays",
    staleness: "14d stale",
    problemId: "array-1",
  },
  {
    type: "Review" as const,
    title: "Valid Parentheses",
    meta: "Easy · Stacks",
    staleness: "9d stale",
    problemId: "stack-1",
  },
  {
    type: "Retry" as const,
    title: "Course Schedule II",
    meta: "Hard · Graphs",
    staleness: "failed yday",
    problemId: "graph-5",
  },
] as const;

/**
 * "Today's Focus" suggestion card shown above the problem list in Browse mode.
 * Displays review + retry suggestions. Dismissible per session.
 */
export function TodaysFocus() {
  const router = useRouter();
  const { openDrawer } = usePracticeContext();

  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("todaysFocus-dismissed") === "true";
  });

  const dismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("todaysFocus-dismissed", "true");
  };

  if (dismissed) return null;

  const handleSuggestionClick = (problemId: string, event?: React.MouseEvent) => {
    // Opens drawer — no mouse event, so openDrawer uses center fallback
    openDrawer(problemId, event as React.MouseEvent);
  };

  const handleStartSession = () => {
    const first = SUGGESTIONS[0];
    if (first) {
      router.push(`/lab/practice/focus?p=${first.problemId}`);
    }
  };

  return (
    <div className="rounded-xl border border-border/40 bg-card p-5 space-y-4 mb-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-foreground">Today&apos;s Focus</h3>
          <div className="flex gap-1" title="2/3 done">
            <div className="w-2 h-2 rounded-sm bg-primary" />
            <div className="w-2 h-2 rounded-sm bg-primary" />
            <div className="w-2 h-2 rounded-sm bg-muted-foreground/30" />
          </div>
        </div>
        <button
          onClick={dismiss}
          className="text-muted-foreground hover:text-foreground transition-colors p-1"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="h-px bg-border/40 w-full" />

      {/* Suggestions */}
      <div className="space-y-2">
        {SUGGESTIONS.map((s) => (
          <SuggestionRow
            key={s.problemId}
            icon={
              s.type === "Review" ? (
                <RotateCcw className="h-4 w-4 text-teal-500" />
              ) : (
                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
              )
            }
            type={s.type}
            title={s.title}
            meta={s.meta}
            staleness={s.staleness}
            onClick={(e) => handleSuggestionClick(s.problemId, e)}
          />
        ))}
      </div>

      <div className="flex justify-end pt-2">
        <Button
          variant="ghost"
          className="gap-2 text-sm h-8 hover:bg-transparent hover:text-primary p-0"
          onClick={handleStartSession}
        >
          Start session <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function SuggestionRow({
  icon,
  type,
  title,
  meta,
  staleness,
  onClick,
}: {
  icon: React.ReactNode;
  type: string;
  title: string;
  meta: string;
  staleness: string;
  onClick: (e?: React.MouseEvent) => void;
}) {
  return (
    <div
      onClick={(e) => onClick(e as React.MouseEvent)}
      className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer border border-transparent hover:border-border/40"
    >
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <span className="text-sm text-muted-foreground mr-2">{type}:</span>
          <span className="text-sm font-medium">{title}</span>
        </div>
      </div>
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span>{meta}</span>
        <span className="w-16 text-right">{staleness}</span>
      </div>
    </div>
  );
}