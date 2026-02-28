// app/lab/practice/components/browse/ProgressCard.tsx

"use client";

import { Trophy, Bookmark } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ProgressStats {
  easy: { completed: number; total: number };
  medium: { completed: number; total: number };
  hard: { completed: number; total: number };
  savedCount: number;
  weeklyDelta?: number;
}

interface ProgressCardProps {
  stats: ProgressStats;
}

export function ProgressCard({ stats }: ProgressCardProps) {
  const { easy, medium, hard, savedCount, weeklyDelta } = stats;

  const totalCompleted = easy.completed + medium.completed + hard.completed;
  const totalProblems = easy.total + medium.total + hard.total;
  const progressPct =
    totalProblems > 0 ? (totalCompleted / totalProblems) * 100 : 0;

  const easyPct = easy.total > 0 ? (easy.completed / easy.total) * 100 : 0;
  const medPct =
    medium.total > 0 ? (medium.completed / medium.total) * 100 : 0;
  const hardPct = hard.total > 0 ? (hard.completed / hard.total) * 100 : 0;

  return (
    <div className="space-y-4 bg-muted/30 p-4 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-end gap-2 text-sm font-semibold text-foreground">
        <Trophy className="h-4 w-4 text-yellow-500" />
        Progress
      </div>

      {/* Bars */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground w-8 text-right">
            Easy
          </span>
          <Progress
            value={easyPct}
            className="h-1.5 flex-1 bg-green-500/10 [&>div]:bg-green-500"
          />
          <span className="text-[10px] text-muted-foreground w-8">
            {easy.completed}/{easy.total}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground w-8 text-right">
            Med
          </span>
          <Progress
            value={medPct}
            className="h-1.5 flex-1 bg-yellow-500/10 [&>div]:bg-yellow-500"
          />
          <span className="text-[10px] text-muted-foreground w-8">
            {medium.completed}/{medium.total}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground w-8 text-right">
            Hard
          </span>
          <Progress
            value={hardPct}
            className="h-1.5 flex-1 bg-red-500/10 [&>div]:bg-red-500"
          />
          <span className="text-[10px] text-muted-foreground w-8">
            {hard.completed}/{hard.total}
          </span>
        </div>
      </div>

      {/* Footer row */}
      <div className="border-t border-border/40 pt-3">
        <div className="flex justify-between items-center text-xs">
          <span className="text-foreground tracking-tight font-medium">
            {totalCompleted} / {totalProblems}
          </span>
          <span className="text-muted-foreground">
            {Math.round(progressPct)}%
          </span>
          <div
            className="flex items-center gap-1 text-muted-foreground"
            title="Saved Problems"
          >
            <Bookmark className="h-3 w-3" />
            <span>{savedCount} Saved</span>
          </div>
        </div>
      </div>

      {/* Weekly delta */}
      {weeklyDelta !== undefined && (
        <div className="text-[11px] text-muted-foreground text-right">
          ↑ {weeklyDelta} this week{" "}
          <span className="opacity-60">(was 3)</span>
        </div>
      )}
    </div>
  );
}
