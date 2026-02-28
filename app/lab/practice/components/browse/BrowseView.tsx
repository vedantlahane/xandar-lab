// app/lab/practice/components/browse/BrowseView.tsx

"use client";

import { useMemo } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { SHEET } from "../../data/sheet";
import { useProblemFilters } from "../../hooks/useProblemFilters";
import { ProgressCard } from "./ProgressCard";
import { FilterPanel } from "./FilterPanel";
import { SearchBar } from "./SearchBar";
import { TodaysFocus } from "./TodaysFocus";
import { ProblemList } from "./ProblemList";
import { TopicSidebar } from "./TopicSidebar";

interface BrowseViewProps {
  activeProblemId: string | null;
  onProblemSelect: (id: string, e: React.MouseEvent) => void;
}

export function BrowseView({ activeProblemId, onProblemSelect }: BrowseViewProps) {
  const { user, updateUser } = useAuth();

  const savedProblems = useMemo(() => user?.savedProblems ?? [], [user?.savedProblems]);
  const completedProblems = useMemo(
    () => user?.completedProblems ?? [],
    [user?.completedProblems],
  );

  const savedSet = useMemo(() => new Set(savedProblems), [savedProblems]);
  const completedSet = useMemo(() => new Set(completedProblems), [completedProblems]);

  const filters = useProblemFilters({ savedProblems, completedProblems });

  // Flattened once — used by stats + random picker
  const allProblems = useMemo(() => SHEET.flatMap((t) => t.problems), []);

  // ── Progress stats ─────────────────────────────────────────────────────

  const stats = useMemo(() => {
    const easy = allProblems.filter((p) => p.tags?.includes("Easy"));
    const medium = allProblems.filter((p) => p.tags?.includes("Medium"));
    const hard = allProblems.filter((p) => p.tags?.includes("Hard"));

    return {
      easy: {
        completed: easy.filter((p) => completedSet.has(p.id)).length,
        total: easy.length,
      },
      medium: {
        completed: medium.filter((p) => completedSet.has(p.id)).length,
        total: medium.length,
      },
      hard: {
        completed: hard.filter((p) => completedSet.has(p.id)).length,
        total: hard.length,
      },
      savedCount: savedSet.size,
      // TODO: Compute from actual completion timestamps once activity API exists
      // weeklyDelta: computeWeeklyDelta(completedProblems, activityLog),
    };
  }, [allProblems, completedSet, savedSet]);

  // ── Random picker ──────────────────────────────────────────────────────

  const handleRandom = (e: React.MouseEvent) => {
    const pool = allProblems.filter((p) => !completedSet.has(p.id));
    const source = pool.length > 0 ? pool : allProblems;
    if (source.length === 0) return;
    const picked = source[Math.floor(Math.random() * source.length)];
    onProblemSelect(picked.id, e);
  };

  // ── API actions ────────────────────────────────────────────────────────

  const handleSave = async (problemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    try {
      const res = await fetch("/api/problems/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username: user.username, problemId }),
      });
      const data = await res.json();
      if (res.ok) updateUser({ savedProblems: data.savedProblems });
    } catch (err) {
      console.error("Failed to save problem:", err);
    }
  };

  const handleComplete = async (problemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    try {
      const res = await fetch("/api/problems/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username: user.username, problemId }),
      });
      const data = await res.json();
      if (res.ok) updateUser({ completedProblems: data.completedProblems });
    } catch (err) {
      console.error("Failed to complete problem:", err);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="relative h-full bg-card">
      {/* Top edge fade */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-card to-transparent z-10" />

      {/* Scrollable content */}
      <div
        id="problem-scroll-container"
        className="h-full overflow-y-auto thin-scrollbar overscroll-contain"
      >
        <div className="max-w-7xl mx-auto px-8 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-12 min-h-full">

            {/* ── Left column: Progress + Filters — sticky, vertically centered ── */}
            <aside className="relative sticky top-0 h-screen hidden md:flex flex-col justify-center overflow-hidden">
              {/* Top fade */}
              <div className="pointer-events-none absolute top-0 left-0 right-0 h-80 bg-linear-to-b from-card to-transparent z-10" />
              <div className="space-y-8 text-right py-12 overflow-y-auto thin-scrollbar max-h-[calc(100vh-8rem)]">
                <ProgressCard stats={stats} />
                <FilterPanel
                  statusFilter={filters.statusFilter}
                  difficultyFilter={filters.difficultyFilter}
                  platformFilter={filters.platformFilter}
                  sortOption={filters.sortOption}
                  sortDesc={filters.sortDesc}
                  onStatusChange={filters.setStatusFilter}
                  onDifficultyChange={filters.setDifficultyFilter}
                  onPlatformChange={filters.setPlatformFilter}
                  onSortChange={filters.setSortOption}
                  onSortDescChange={filters.setSortDesc}
                />
              </div>
              {/* Bottom fade */}
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-72 bg-linear-to-t from-card to-transparent z-10" />
            </aside>

            {/* ── Right column: Search + Problem list ── */}
            <div className="space-y-4 pb-48 pt-8">
              {/* Sticky search bar */}
              <div className="sticky top-0 z-20 bg-card/95 backdrop-blur-sm py-4">
                <SearchBar
                  query={filters.searchQuery}
                  onQueryChange={filters.setSearchQuery}
                  onRandom={handleRandom}
                />
              </div>

              <TodaysFocus />

              <ProblemList
                topics={filters.filteredSheet}
                activeProblemId={activeProblemId}
                savedSet={savedSet}
                completedSet={completedSet}
                onSelect={onProblemSelect}
                onSave={handleSave}
                onComplete={handleComplete}
              />
            </div>

          </div>
        </div>
      </div>

      {/* Bottom edge fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-card to-transparent z-10" />

      {/* Topic dot sidebar — only in Browse, lives/dies with this view */}
      <TopicSidebar />
    </div>
  );
}