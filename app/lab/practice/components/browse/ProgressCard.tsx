// app/lab/practice/components/browse/ProgressCard.tsx

"use client";

import { TrendingUp, Flame } from "lucide-react";

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

function CircularProgress({
  value,
  size = 80,
  strokeWidth = 6,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      {/* Track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-muted-foreground/10"
      />
      {/* Fill */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="url(#progressGradient)"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-1000 ease-out"
      />
      <defs>
        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="100%" stopColor="hsl(142 76% 46%)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function DifficultyRow({
  label,
  completed,
  total,
  color,
}: {
  label: string;
  completed: number;
  total: number;
  color: string;
}) {
  const pct = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className="flex items-center gap-3">
      <div className={`h-2 w-2 rounded-full ${color} shrink-0`} />
      <span className="text-xs text-muted-foreground w-10">{label}</span>
      <div className="flex-1 h-1.5 bg-muted/30 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[11px] font-mono tabular-nums text-muted-foreground w-12 text-right">
        {completed}/{total}
      </span>
    </div>
  );
}

export function ProgressCard({ stats }: ProgressCardProps) {
  const { easy, medium, hard, savedCount, weeklyDelta } = stats;

  const totalCompleted = easy.completed + medium.completed + hard.completed;
  const totalProblems = easy.total + medium.total + hard.total;
  const progressPct =
    totalProblems > 0 ? (totalCompleted / totalProblems) * 100 : 0;

  return (
    <div className="rounded-xl border border-white/40 dark:border-white/5 bg-linear-to-br from-white/60 to-white/30 dark:from-zinc-900/40 dark:to-zinc-900/10 backdrop-blur-md shadow-xl shadow-black/5 p-4 space-y-3">
      {/* Top: Circular progress + stats */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <CircularProgress value={progressPct} size={60} strokeWidth={5} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-base font-bold tabular-nums tracking-tight">
              {Math.round(progressPct)}%
            </span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xl font-bold tabular-nums tracking-tight leading-none">
            {totalCompleted}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            of {totalProblems} solved
          </div>
          {weeklyDelta !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              {weeklyDelta > 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : (
                <Flame className="h-3 w-3 text-amber-500" />
              )}
              <span className="text-[11px] text-muted-foreground">
                {weeklyDelta > 0 ? "+" : ""}
                {weeklyDelta} this week
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-border/40" />

      {/* Difficulty breakdown */}
      <div className="space-y-2">
        <DifficultyRow
          label="Easy"
          completed={easy.completed}
          total={easy.total}
          color="bg-green-500"
        />
        <DifficultyRow
          label="Med"
          completed={medium.completed}
          total={medium.total}
          color="bg-yellow-500"
        />
        <DifficultyRow
          label="Hard"
          completed={hard.completed}
          total={hard.total}
          color="bg-red-500"
        />
      </div>
    </div>
  );
}
