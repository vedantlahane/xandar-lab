// app/lab/practice/hooks/useProblemFilters.ts

"use client";

import { useState, useMemo } from "react";
import { SHEET } from "../data/sheet";

// ── Types ──────────────────────────────────────────────────────────────────

export type FilterStatus =
  | "All"
  | "Saved"
  | "Completed"
  | "Unresolved"
  | "Due for Review"
  | "Never Attempted";

export type FilterDifficulty = "All" | "Easy" | "Medium" | "Hard";
export type FilterPlatform = "All" | "LeetCode" | "GeeksForGeeks" | "Other";
export type SortOption = "Difficulty" | "Staleness" | "Attempts" | null;

export interface ExtensionData {
  solveTime: string;
  subs: number;
  lastAttempted: string;
  stuck?: boolean;
  reviewDue?: boolean;
}

interface UseProblemFiltersOptions {
  savedProblems: string[];
  completedProblems: string[];
  extensionMap: Map<string, ExtensionData>;
}

// ── Hook ───────────────────────────────────────────────────────────────────

export function useProblemFilters({
  savedProblems,
  completedProblems,
  extensionMap,
}: UseProblemFiltersOptions) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("All");
  const [difficultyFilter, setDifficultyFilter] = useState<FilterDifficulty>("All");
  const [platformFilter, setPlatformFilter] = useState<FilterPlatform>("All");
  const [sortOption, setSortOption] = useState<SortOption>(null);
  const [sortDesc, setSortDesc] = useState(true);

  const filteredSheet = useMemo(() => {
    const savedSet = new Set(savedProblems);
    const completedSet = new Set(completedProblems);

    const DIFFICULTY_ORDER: Record<string, number> = { Easy: 1, Medium: 2, Hard: 3 };

    const getDifficultyRank = (tags?: string[]) => {
      if (!tags) return 2; // default Medium
      for (const t of tags) {
        if (DIFFICULTY_ORDER[t] !== undefined) return DIFFICULTY_ORDER[t];
      }
      return 2;
    };

    return SHEET.map((topic) => {
      let filtered = topic.problems.filter((problem) => {
        // ── Search ─────────────────────────────────────────────────────────
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const match =
            problem.title.toLowerCase().includes(q) ||
            problem.platform.toLowerCase().includes(q) ||
            problem.tags?.some((t) => t.toLowerCase().includes(q));
          if (!match) return false;
        }

        const isCompleted = completedSet.has(problem.id);
        const isSaved = savedSet.has(problem.id);
        const extData = extensionMap.get(problem.id) ?? null;

        // ── Status filter ─────────────────────────────────────────────────
        if (statusFilter === "Saved") return isSaved;
        if (statusFilter === "Completed") return isCompleted;
        if (statusFilter === "Unresolved")
          return !!extData?.stuck && !isCompleted;
        if (statusFilter === "Due for Review") return !!extData?.reviewDue;
        if (statusFilter === "Never Attempted")
          return !extData && !isCompleted;

        // ── Difficulty filter ─────────────────────────────────────────────
        if (difficultyFilter !== "All") {
          const hasTag = problem.tags?.some(
            (t) => t.toLowerCase() === difficultyFilter.toLowerCase(),
          );
          if (!hasTag) return false;
        }

        // ── Platform filter ───────────────────────────────────────────────
        if (platformFilter !== "All") {
          if (platformFilter === "Other") {
            if (
              problem.platform === "LeetCode" ||
              problem.platform === "GeeksForGeeks"
            )
              return false;
          } else {
            if (problem.platform !== platformFilter) return false;
          }
        }

        return true;
      });

      // ── Sorting ───────────────────────────────────────────────────────
      if (sortOption) {
        filtered = [...filtered].sort((a, b) => {
          let cmp = 0;

          if (sortOption === "Difficulty") {
            cmp = getDifficultyRank(a.tags) - getDifficultyRank(b.tags);
          } else if (sortOption === "Staleness") {
            const aExt = extensionMap.get(a.id);
            const bExt = extensionMap.get(b.id);
            const aTime = aExt?.lastAttempted ? new Date(aExt.lastAttempted).getTime() : 0;
            const bTime = bExt?.lastAttempted ? new Date(bExt.lastAttempted).getTime() : 0;
            cmp = aTime - bTime; // oldest first by default
          } else if (sortOption === "Attempts") {
            const aSubs = extensionMap.get(a.id)?.subs ?? 0;
            const bSubs = extensionMap.get(b.id)?.subs ?? 0;
            cmp = aSubs - bSubs;
          }

          return sortDesc ? -cmp : cmp;
        });
      }

      return { ...topic, problems: filtered };
    }).filter((topic) => topic.problems.length > 0);
  }, [searchQuery, statusFilter, difficultyFilter, platformFilter, sortOption, sortDesc, savedProblems, completedProblems, extensionMap]);

  return {
    // Values
    searchQuery,
    statusFilter,
    difficultyFilter,
    platformFilter,
    sortOption,
    sortDesc,
    filteredSheet,
    // Setters
    setSearchQuery,
    setStatusFilter,
    setDifficultyFilter,
    setPlatformFilter,
    setSortOption,
    setSortDesc,
  };
}