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
}

// ── Helpers ────────────────────────────────────────────────────────────────

export function getExtensionData(
  problemId: string,
  isCompleted: boolean,
): ExtensionData | null {
  if (
    problemId.toLowerCase().includes("course-schedule-ii") ||
    problemId === "graph-5"
  ) {
    return {
      solveTime: "38m",
      subs: 5,
      lastAttempted: "yesterday",
      stuck: true,
    };
  }
  if (
    problemId.toLowerCase().includes("two-sum") ||
    problemId === "array-1"
  ) {
    return {
      solveTime: "8m",
      subs: 1,
      lastAttempted: "14d ago",
      reviewDue: true,
    };
  }
  if (isCompleted) {
    return { solveTime: "14m", subs: 2, lastAttempted: "3d ago" };
  }
  return null;
}

// ── Hook ───────────────────────────────────────────────────────────────────

export function useProblemFilters({
  savedProblems,
  completedProblems,
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
        const extData = getExtensionData(problem.id, isCompleted);

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

      return { ...topic, problems: filtered };
    }).filter((topic) => topic.problems.length > 0);
  }, [
    searchQuery,
    statusFilter,
    difficultyFilter,
    platformFilter,
    sortOption,
    sortDesc,
    savedProblems,
    completedProblems,
  ]);

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
