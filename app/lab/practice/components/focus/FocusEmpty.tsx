// app/lab/practice/components/focus/FocusEmpty.tsx

"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shuffle, RotateCcw, Sparkles, Loader2, ArrowRight, Target } from "lucide-react";
import { SHEET } from "../../data/sheet";
import { useAuth } from "@/components/auth/AuthContext";
import { cn } from "@/lib/utils";

interface Suggestion {
  type: "review" | "retry" | "new";
  title: string;
  problemId: string;
}

/**
 * Shown in Focus mode when no problem is selected.
 * Provides three quick-pick options + a link back to Browse.
 */
export function FocusEmpty() {
  const router = useRouter();
  const { user } = useAuth();

  const completedSet = useMemo(
    () => new Set(user?.completedProblems ?? []),
    [user?.completedProblems],
  );

  const allProblems = useMemo(
    () => SHEET.flatMap((t) => t.problems),
    [],
  );

  // ── Fetch suggestion from API ──────────────────────────────────────────
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  const [loadingSuggestion, setLoadingSuggestion] = useState(true);

  useEffect(() => {
    fetch("/api/suggestions", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        if (data.suggestions?.length > 0) {
          setSuggestion(data.suggestions[0]);
        }
      })
      .catch(() => { })
      .finally(() => setLoadingSuggestion(false));
  }, []);

  const pickRandom = () => {
    const pool = allProblems.filter((p) => !completedSet.has(p.id));
    const source = pool.length > 0 ? pool : allProblems;
    if (source.length === 0) return;
    const picked = source[Math.floor(Math.random() * source.length)];
    router.push(`/lab/practice/focus?p=${picked.id}`);
  };

  const pickReview = () => {
    const completed = allProblems.filter((p) => completedSet.has(p.id));
    if (completed.length > 0) {
      const picked = completed[Math.floor(Math.random() * completed.length)];
      router.push(`/lab/practice/focus?p=${picked.id}`);
    } else {
      pickRandom();
    }
  };

  const pickSuggestion = () => {
    if (suggestion) {
      router.push(`/lab/practice/focus?p=${suggestion.problemId}`);
    }
  };

  const OPTIONS = [
    {
      label: "Pick Random Problem",
      subtitle: "Unsolved problem from your sheet",
      icon: Shuffle,
      iconColor: "text-primary",
      hoverBorder: "hover:border-primary/40",
      hoverBg: "hover:bg-primary/5",
      onClick: pickRandom,
      disabled: false,
      loading: false,
    },
    {
      label: "Next Review Problem",
      subtitle: "Revisit a completed problem",
      icon: RotateCcw,
      iconColor: "text-teal-500",
      hoverBorder: "hover:border-teal-500/40",
      hoverBg: "hover:bg-teal-500/5",
      onClick: pickReview,
      disabled: false,
      loading: false,
    },
    {
      label: suggestion ? suggestion.title : "Today's Suggestion",
      subtitle: suggestion ? `AI-picked ${suggestion.type} problem` : "Loading suggestions...",
      icon: Sparkles,
      iconColor: "text-violet-500",
      hoverBorder: "hover:border-violet-500/40",
      hoverBg: "hover:bg-violet-500/5",
      onClick: pickSuggestion,
      disabled: loadingSuggestion || !suggestion,
      loading: loadingSuggestion,
    },
  ];

  return (
    <div className="h-full flex items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
            <Target className="h-6 w-6 text-primary" />
          </div>
          <p className="text-lg font-semibold text-foreground tracking-tight">
            Pick a problem to focus on
          </p>
          <p className="text-sm text-muted-foreground">
            No distractions. Just you and one problem.
          </p>
        </div>

        {/* Option cards */}
        <div className="space-y-3">
          {OPTIONS.map((opt) => {
            const Icon = opt.icon;
            return (
              <button
                key={opt.label}
                onClick={opt.onClick}
                disabled={opt.disabled}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-white/50 dark:bg-zinc-900/30 backdrop-blur-sm",
                  "text-left transition-all duration-200",
                  opt.disabled
                    ? "opacity-50 cursor-not-allowed"
                    : `cursor-pointer ${opt.hoverBorder} ${opt.hoverBg} hover:shadow-sm`,
                )}
              >
                <div className={cn(
                  "h-10 w-10 rounded-lg flex items-center justify-center shrink-0",
                  opt.iconColor === "text-primary" && "bg-primary/10",
                  opt.iconColor === "text-teal-500" && "bg-teal-500/10",
                  opt.iconColor === "text-violet-500" && "bg-violet-500/10",
                )}>
                  {opt.loading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  ) : (
                    <Icon className={cn("h-5 w-5", opt.iconColor)} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{opt.label}</p>
                  <p className="text-xs text-muted-foreground">{opt.subtitle}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground/40 shrink-0" />
              </button>
            );
          })}
        </div>

        {/* Back to browse */}
        <p className="text-center text-sm text-muted-foreground">
          or{" "}
          <Link
            href="/lab/practice"
            className="underline underline-offset-2 hover:text-foreground transition-colors"
          >
            pick from Browse →
          </Link>
        </p>
      </div>
    </div>
  );
}