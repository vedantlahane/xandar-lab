// app/lab/practice/components/browse/FilterPanel.tsx

"use client";

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

// ── Small helper ───────────────────────────────────────────────────────────

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-foreground">{title}</h3>
      <div className="space-y-1 text-sm text-muted-foreground">{children}</div>
    </div>
  );
}

function FilterItem({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "cursor-pointer transition-colors",
        active ? "text-primary font-medium" : "hover:text-foreground",
      )}
    >
      {label}
    </div>
  );
}

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
  const STATUS_OPTIONS: FilterStatus[] = [
    "All",
    "Saved",
    "Completed",
    "Unresolved",
    "Due for Review",
    "Never Attempted",
  ];

  const DIFFICULTY_OPTIONS: FilterDifficulty[] = ["Easy", "Medium", "Hard"];
  const PLATFORM_OPTIONS: FilterPlatform[] = [
    "LeetCode",
    "GeeksForGeeks",
    "Other",
  ];
  const SORT_OPTIONS: SortOption[] = ["Difficulty", "Staleness", "Attempts"];

  return (
    <div className="space-y-8">
      {/* Activity / Status */}
      <FilterSection title="Activity">
        {STATUS_OPTIONS.map((f) => (
          <FilterItem
            key={f}
            label={f === "All" ? "All Problems" : f}
            active={statusFilter === f}
            onClick={() => onStatusChange(f)}
          />
        ))}
      </FilterSection>

      {/* Difficulty */}
      <FilterSection title="Difficulty">
        {DIFFICULTY_OPTIONS.map((f) => (
          <FilterItem
            key={f}
            label={f}
            active={difficultyFilter === f}
            onClick={() =>
              onDifficultyChange(difficultyFilter === f ? "All" : f)
            }
          />
        ))}
      </FilterSection>

      {/* Platform */}
      <FilterSection title="Platform">
        {PLATFORM_OPTIONS.map((f) => (
          <FilterItem
            key={f}
            label={f}
            active={platformFilter === f}
            onClick={() =>
              onPlatformChange(platformFilter === f ? "All" : f)
            }
          />
        ))}
      </FilterSection>

      {/* Sort */}
      <FilterSection title="Sort by">
        {SORT_OPTIONS.map((s) => (
          <div
            key={s}
            onClick={() => {
              if (sortOption === s) {
                onSortDescChange(!sortDesc);
              } else {
                onSortChange(s);
                onSortDescChange(true);
              }
            }}
            className={cn(
              "cursor-pointer transition-colors",
              sortOption === s ? "text-primary font-medium" : "hover:text-foreground",
            )}
          >
            {s} ↕
          </div>
        ))}
      </FilterSection>
    </div>
  );
}
