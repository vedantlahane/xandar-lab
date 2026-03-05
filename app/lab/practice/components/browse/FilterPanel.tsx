// app/lab/practice/components/browse/FilterPanel.tsx

"use client";

import {
  Layers,
  Bookmark,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  FilterStatus,
  FilterDifficulty,
  FilterPlatform,
  SortOption,
} from "../../hooks/useProblemFilters";

interface FilterPanelProps {
  statusFilter: FilterStatus;
  difficultyFilter: FilterDifficulty;
  platformFilter: FilterPlatform;
  sortOption: SortOption;
  sortDesc: boolean;
  onStatusChange: (v: FilterStatus) => void;
  onDifficultyChange: (v: FilterDifficulty) => void;
  onPlatformChange: (v: FilterPlatform) => void;
  onSortChange: (v: SortOption) => void;
  onSortDescChange: (v: boolean) => void;
}

// ── Status filter config ───────────────────────────────────────────────────

const STATUS_ITEMS: {
  value: FilterStatus;
  label: string;
  icon: typeof Layers;
}[] = [
    { value: "All", label: "All Problems", icon: Layers },
    { value: "Saved", label: "Saved", icon: Bookmark },
    { value: "Completed", label: "Completed", icon: CheckCircle2 },
    { value: "Unresolved", label: "Unresolved", icon: AlertTriangle },
    { value: "Due for Review", label: "Review Due", icon: RotateCcw },
    { value: "Never Attempted", label: "Untouched", icon: Sparkles },
  ];

// ── Difficulty config ──────────────────────────────────────────────────────

const DIFFICULTY_ITEMS: {
  value: FilterDifficulty;
  label: string;
  dotColor: string;
  activeColor: string;
}[] = [
    {
      value: "Easy",
      label: "Easy",
      dotColor: "bg-green-500",
      activeColor: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30",
    },
    {
      value: "Medium",
      label: "Medium",
      dotColor: "bg-yellow-500",
      activeColor: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/30",
    },
    {
      value: "Hard",
      label: "Hard",
      dotColor: "bg-red-500",
      activeColor: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30",
    },
  ];

// ── Platform config ────────────────────────────────────────────────────────

const PLATFORM_ITEMS: { value: FilterPlatform; label: string }[] = [
  { value: "LeetCode", label: "LeetCode" },
  { value: "GeeksForGeeks", label: "GFG" },
  { value: "Other", label: "Other" },
];

// ── Sort config ────────────────────────────────────────────────────────────

const SORT_ITEMS: { value: SortOption; label: string }[] = [
  { value: "Difficulty", label: "Difficulty" },
  { value: "Staleness", label: "Staleness" },
  { value: "Attempts", label: "Attempts" },
];

// ── Component ──────────────────────────────────────────────────────────────

export function FilterPanel({
  statusFilter,
  difficultyFilter,
  platformFilter,
  sortOption,
  sortDesc,
  onStatusChange,
  onDifficultyChange,
  onPlatformChange,
  onSortChange,
  onSortDescChange,
}: FilterPanelProps) {
  return (
    <div className="space-y-6">
      {/* ── Activity / Status ── */}
      <div className="space-y-1.5">
        <h3 className="text-[10px] uppercase font-semibold text-muted-foreground/60 tracking-widest px-2 mb-2">
          Activity
        </h3>
        {STATUS_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = statusFilter === item.value;
          return (
            <button
              key={item.value}
              onClick={() => onStatusChange(item.value)}
              className={cn(
                "flex items-center gap-2.5 w-full px-2.5 py-1.5 rounded-lg text-sm transition-all",
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/30",
              )}
            >
              <Icon
                className={cn(
                  "h-3.5 w-3.5 shrink-0",
                  isActive ? "text-primary" : "text-muted-foreground/50",
                )}
              />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Difficulty ── */}
      <div className="space-y-1.5">
        <h3 className="text-[10px] uppercase font-semibold text-muted-foreground/60 tracking-widest px-2 mb-2">
          Difficulty
        </h3>
        <div className="flex gap-1.5">
          {DIFFICULTY_ITEMS.map((item) => {
            const isActive = difficultyFilter === item.value;
            return (
              <button
                key={item.value}
                onClick={() =>
                  onDifficultyChange(isActive ? "All" : item.value)
                }
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex-1 justify-center",
                  isActive
                    ? item.activeColor
                    : "border-transparent text-muted-foreground hover:bg-muted/30 hover:text-foreground",
                )}
              >
                <div
                  className={cn("h-1.5 w-1.5 rounded-full", item.dotColor)}
                />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Platform ── */}
      <div className="space-y-1.5">
        <h3 className="text-[10px] uppercase font-semibold text-muted-foreground/60 tracking-widest px-2 mb-2">
          Platform
        </h3>
        <div className="flex gap-1.5">
          {PLATFORM_ITEMS.map((item) => {
            const isActive = platformFilter === item.value;
            return (
              <button
                key={item.value}
                onClick={() =>
                  onPlatformChange(isActive ? "All" : item.value)
                }
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex-1 text-center",
                  isActive
                    ? "bg-primary/10 text-primary border-primary/30"
                    : "border-transparent text-muted-foreground hover:bg-muted/30 hover:text-foreground",
                )}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Sort ── */}
      <div className="space-y-1.5">
        <h3 className="text-[10px] uppercase font-semibold text-muted-foreground/60 tracking-widest px-2 mb-2 flex items-center gap-1.5">
          <ArrowUpDown className="h-3 w-3" />
          Sort by
        </h3>
        <div className="space-y-0.5">
          {SORT_ITEMS.map((item) => {
            const isActive = sortOption === item.value;
            return (
              <button
                key={item.value}
                onClick={() => {
                  if (isActive) {
                    onSortDescChange(!sortDesc);
                  } else {
                    onSortChange(item.value);
                    onSortDescChange(true);
                  }
                }}
                className={cn(
                  "flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg text-sm transition-all",
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30",
                )}
              >
                <span>{item.label}</span>
                {isActive ? (
                  sortDesc ? (
                    <ChevronDown className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronUp className="h-3.5 w-3.5" />
                  )
                ) : (
                  <ArrowUpDown className="h-3 w-3 opacity-30" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}