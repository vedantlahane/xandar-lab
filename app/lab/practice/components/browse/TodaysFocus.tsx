// app/lab/practice/components/browse/TodaysFocus.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, RotateCcw, Star, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePracticeContext } from "../../context/PracticeContext";

interface Suggestion {
  type: "review" | "retry" | "new";
  title: string;
  meta: string;
  reason: string;
  problemId: string;
}

/**
 * "Today's Focus" suggestion card shown above the problem list in Browse mode.
 * Fetches personalized review + retry suggestions from the API. Dismissible per session.
 */
export function TodaysFocus() {
  const router = useRouter();
  const { openDrawer } = usePracticeContext();

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [progress, setProgress] = useState({ done: 0, total: 3 });
  const [loading, setLoading] = useState(true);

  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("todaysFocus-dismissed") === "true";
  });

  useEffect(() => {
    fetch("/api/suggestions", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        if (data.suggestions) setSuggestions(data.suggestions);
        if (data.progress) setProgress(data.progress);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const dismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("todaysFocus-dismissed", "true");
  };

  if (dismissed) return null;
  if (!loading && suggestions.length === 0) return null;

  const handleSuggestionClick = (problemId: string, event?: React.MouseEvent) => {
    openDrawer(problemId, event as React.MouseEvent);
  };

  const handleStartSession = () => {
    const first = suggestions[0];
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
          <div className="flex gap-1" title={`${progress.done}/${progress.total} done`}>
            {Array.from({ length: progress.total }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-sm ${i < progress.done ? 'bg-primary' : 'bg-muted-foreground/30'}`}
              />
            ))}
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
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          suggestions.map((s) => (
            <SuggestionRow
              key={s.problemId}
              icon={
                s.type === "review" ? (
                  <RotateCcw className="h-4 w-4 text-teal-500" />
                ) : s.type === "retry" ? (
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                ) : (
                  <Sparkles className="h-4 w-4 text-violet-500" />
                )
              }
              type={s.type}
              title={s.title}
              meta={s.meta}
              reason={s.reason}
              onClick={(e) => handleSuggestionClick(s.problemId, e)}
            />
          ))
        )}
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
  reason,
  onClick,
}: {
  icon: React.ReactNode;
  type: string;
  title: string;
  meta: string;
  reason: string;
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
        <span className="w-16 text-right">{reason}</span>
      </div>
    </div>
  );
}