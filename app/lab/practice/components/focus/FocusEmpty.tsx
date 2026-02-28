// app/lab/practice/components/focus/FocusEmpty.tsx

"use client";

import { useRouter } from "next/navigation";
import { Shuffle, RotateCcw, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SHEET } from "../../data/sheet";
import { useAuth } from "@/components/auth/AuthContext";
import { useMemo } from "react";

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

  // For now, "Next Review" picks the first problem that hasn't been completed.
  // Wire to real spaced-repetition scheduling later.
  const pickReview = () => {
    const candidate = allProblems.find((p) => !completedSet.has(p.id));
    if (candidate) router.push(`/lab/practice/focus?p=${candidate.id}`);
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
          >
            <Star className="h-5 w-5 mr-3 text-amber-500 fill-amber-500" />
            ★ Today&apos;s Suggestion
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          or{" "}
          <a
            href="/lab/practice"
            className="underline underline-offset-2 hover:text-foreground transition-colors"
          >
            pick from Browse →
          </a>
        </p>
      </div>
    </div>
  );
}
