// app/lab/practice/components/focus/FocusEmpty.tsx

"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shuffle, RotateCcw, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SHEET } from "../../data/sheet";
import { useAuth } from "@/components/auth/AuthContext";

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

  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center space-y-8">
        <div className="space-y-2">
          <p className="text-lg font-medium text-foreground">
            Pick a problem to focus on
          </p>
          <p className="text-sm text-muted-foreground">
            No distractions. Just you and one problem.
          </p>
        </div>

        <div className="flex flex-col gap-3 w-64 mx-auto">
          <Button
            variant="outline"
            className="h-14 font-medium text-base hover:border-primary/50 hover:bg-primary/5"
            onClick={pickRandom}
          >
            <Shuffle className="h-5 w-5 mr-3 text-primary" />
            ✧ Pick Random Problem
          </Button>

          <Button
            variant="outline"
            className="h-14 font-medium text-base hover:border-primary/50 hover:bg-primary/5"
            onClick={pickReview}
          >
            <RotateCcw className="h-5 w-5 mr-3 text-teal-500" />
            ↻ Next Review Problem
          </Button>

          <Button
            variant="outline"
            className="h-14 font-medium text-base hover:border-primary/50 hover:bg-primary/5"
            onClick={pickSuggestion}
            disabled={loadingSuggestion || !suggestion}
          >
            {loadingSuggestion ? (
              <Loader2 className="h-5 w-5 mr-3 animate-spin text-muted-foreground" />
            ) : (
              <Sparkles className="h-5 w-5 mr-3 text-violet-500" />
            )}
            {suggestion ? `★ ${suggestion.title}` : "★ Today\u0027s Suggestion"}
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
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