// app/lab/practice/components/browse/BrowseView.tsx

"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthContext";
import { SHEET } from "../../data/sheet";
import { useProblemFilters } from "../../hooks/useProblemFilters";
import type { ExtensionData } from "../../hooks/useProblemFilters";
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
  const { user, updateUser, isAuthenticated, isLoading } = useAuth();

  const savedProblems = useMemo(() => user?.savedProblems ?? [], [user?.savedProblems]);
  const completedProblems = useMemo(
    () => user?.completedProblems ?? [],
    [user?.completedProblems],
  );

  const savedSet = useMemo(() => new Set(savedProblems), [savedProblems]);
  const completedSet = useMemo(() => new Set(completedProblems), [completedProblems]);

  // ── Extension data (attempt summaries) ─────────────────────────────────
  const [extensionMap, setExtensionMap] = useState<Map<string, ExtensionData>>(new Map());

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      setExtensionMap(new Map());
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);

    fetch("/api/attempts/summary", {
      credentials: "include",
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.summaries) {
          const map = new Map<string, ExtensionData>();
          data.summaries.forEach((s: ExtensionData & { problemId: string }) =>
            map.set(s.problemId, s)
          );
          setExtensionMap(map);
        }
      })
      .catch(() => { })
      .finally(() => {
        clearTimeout(timeout);
      });

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [isAuthenticated, isLoading]);

  const filters = useProblemFilters({ savedProblems, completedProblems, extensionMap });

  // Flattened once — used by stats + random picker
  const allProblems = useMemo(() => SHEET.flatMap((t) => t.problems), []);

  // ── Progress stats ─────────────────────────────────────────────────────
  const [weeklyDelta, setWeeklyDelta] = useState<number | undefined>();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      setWeeklyDelta(undefined);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);

    fetch("/api/analytics/activity", {
      credentials: "include",
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setWeeklyDelta(data?.weeklyDelta))
      .catch(() => { })
      .finally(() => {
        clearTimeout(timeout);
      });

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [isAuthenticated, isLoading]);

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
      weeklyDelta,
    };
  }, [allProblems, completedSet, savedSet, weeklyDelta]);

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

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.statusFilter !== "All") count++;
    if (filters.difficultyFilter !== "All") count++;
    if (filters.platformFilter !== "All") count++;
    return count;
  }, [filters.statusFilter, filters.difficultyFilter, filters.platformFilter]);

  return (
    <div className="relative h-full">
      {/* Top edge fade */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-background to-transparent z-10" />

      {/* Scrollable content */}
      <div
        id="problem-scroll-container"
        className="h-full overflow-y-auto thin-scrollbar overscroll-contain"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-10 min-h-full">

            {/* ── Left column: Progress + Filters — sticky, vertically centered (Desktop) ── */}
            <aside className="relative sticky top-0 h-screen hidden md:flex flex-col justify-center">
              <div className="space-y-5 py-6 overflow-y-auto no-scrollbar max-h-[calc(100vh-10rem)]">
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
            </aside>

            {/* ── Right column: Search + Problem list ── */}
            <div className="space-y-4 pb-48 pt-8">
              {/* Sticky search bar + Mobile Filter Button */}
              <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm py-4">
                <div className="flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <SearchBar
                      query={filters.searchQuery}
                      onQueryChange={filters.setSearchQuery}
                      onRandom={handleRandom}
                      placeholder="Search problems, tags..."
                      randomLabel="Pick Random"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowMobileFilters(true)}
                    className="md:hidden h-9 px-3 flex items-center gap-1.5 shrink-0 rounded-xl border-border bg-card/60 backdrop-blur-sm"
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium">Filters</span>
                    {activeFilterCount > 0 && (
                      <span className="h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                        {activeFilterCount}
                      </span>
                    )}
                  </Button>
                </div>
              </div>

              <TodaysFocus />

              <ProblemList
                topics={filters.filteredSheet}
                activeProblemId={activeProblemId}
                savedSet={savedSet}
                completedSet={completedSet}
                extensionMap={extensionMap}
                onSelect={onProblemSelect}
                onSave={handleSave}
                onComplete={handleComplete}
              />
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Filter Sheet */}
      <AnimatePresence>
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 flex items-end justify-center md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowMobileFilters(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="relative z-10 w-full max-h-[85vh] bg-card border-t border-border rounded-t-2xl shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-border/40 bg-muted/20">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-sm">Filters & Stats</h3>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setShowMobileFilters(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-4 overflow-y-auto space-y-5">
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bottom edge fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-background to-transparent z-10" />

      {/* Topic dot sidebar — only in Browse, lives/dies with this view */}
      <TopicSidebar />
    </div>
  );
}