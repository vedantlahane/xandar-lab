// app/lab/practice/components/focus/FocusEmpty.tsx

"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shuffle, RotateCcw, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SHEET } from "../../data/sheet";
import { useAuth } from "@/components/auth/AuthContext";

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

  const pickRandom = () => {
    const pool = allProblems.filter((p) => !completedSet.has(p.id));
    const source = pool.length > 0 ? pool : allProblems;
    if (source.length === 0) return;
    const picked = source[Math.floor(Math.random() * source.length)];
    router.push(`/lab/practice/focus?p=${picked.id}`);
  };

  // Review = revisit something already completed (spaced repetition target).
  // Random = attempt something new.
  // When real SR data exists, this picks the problem with oldest/most-due review date.
  const pickReview = () => {
    const completed = allProblems.filter((p) => completedSet.has(p.id));
    if (completed.length > 0) {
      // TODO: Sort by lastAttempted date (oldest first) when SR data is available
      const picked = completed[Math.floor(Math.random() * completed.length)];
      router.push(`/lab/practice/focus?p=${picked.id}`);
    } else {
      // Nothing to review yet — fall back to random uncompleted
      pickRandom();
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

          {/* TODO: Wire to same suggestion logic as TodaysFocus in Browse mode */}
          <Button
            variant="outline"
            className="h-14 font-medium text-base hover:border-primary/50 hover:bg-primary/5"
            disabled
            title="Coming soon — needs spaced repetition data"
          >
            <Star className="h-5 w-5 mr-3 text-amber-500 fill-amber-500" />
            ★ Today&apos;s Suggestion
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