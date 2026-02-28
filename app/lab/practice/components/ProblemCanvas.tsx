// app/lab/practice/components/ProblemCanvas.tsx

"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { SHEET, DSAProblem } from "../data/sheet";
import { Check, Bookmark, Search, Shuffle, Trophy, Hash, X, ArrowRight, RotateCcw, Star } from "lucide-react";
import { useAuth } from "@/components/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

interface ProblemCanvasProps {
  activeProblemId: string | null;
  onProblemSelect: (id: string, event: React.MouseEvent) => void;
}

type FilterStatus = "All" | "Saved" | "Completed" | "Unresolved" | "Due for Review" | "Never Attempted";
type FilterDifficulty = "All" | "Easy" | "Medium" | "Hard";
type FilterPlatform = "All" | "LeetCode" | "GeeksForGeeks" | "Other";
type Mode = "Browse" | "Focus" | "Analyze" | "Interview";
type SortOption = "Difficulty" | "Staleness" | "Attempts" | null;

export default function ProblemCanvas({
  activeProblemId,
  onProblemSelect,
}: ProblemCanvasProps) {
  const [activeMode, setActiveMode] = useState<Mode>("Browse");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("All");
  const [difficultyFilter, setDifficultyFilter] = useState<FilterDifficulty>("All");
  const [platformFilter, setPlatformFilter] = useState<FilterPlatform>("All");
  const [sortOption, setSortOption] = useState<SortOption>(null);
  const [sortDesc, setSortDesc] = useState(true);
  const [isFocusDismissed, setIsFocusDismissed] = useState(false);
  const { user, updateUser } = useAuth();

  const savedProblems = useMemo(() => user?.savedProblems || [], [user?.savedProblems]);
  const completedProblems = useMemo(() => user?.completedProblems || [], [user?.completedProblems]);

  // Aggregate all problems for stats and random picker
  const allProblems = useMemo(() => {
    return SHEET.flatMap(topic => topic.problems);
  }, []);

  const totalProblems = allProblems.length;
  const totalCompleted = completedProblems.length;
  const progressPercentage = totalProblems > 0 ? (totalCompleted / totalProblems) * 100 : 0;

  const allEasy = useMemo(() => allProblems.filter(p => p.tags?.includes("Easy")), [allProblems]);
  const allMedium = useMemo(() => allProblems.filter(p => p.tags?.includes("Medium")), [allProblems]);
  const allHard = useMemo(() => allProblems.filter(p => p.tags?.includes("Hard")), [allProblems]);

  const completedEasy = allEasy.filter(p => completedProblems.includes(p.id)).length;
  const completedMedium = allMedium.filter(p => completedProblems.includes(p.id)).length;
  const completedHard = allHard.filter(p => completedProblems.includes(p.id)).length;

  const handleSaveProblem = async (problemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;

    try {
      const res = await fetch('/api/problems/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user.username, problemId }),
      });

      const data = await res.json();
      if (res.ok) {
        updateUser({ savedProblems: data.savedProblems });
      }
    } catch (error) {
      console.error('Failed to save problem:', error);
    }
  };

  const handleCompleteProblem = async (problemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;

    try {
      const res = await fetch('/api/problems/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user.username, problemId }),
      });

      const data = await res.json();
      if (res.ok) {
        updateUser({ completedProblems: data.completedProblems });
      }
    } catch (error) {
      console.error('Failed to complete problem:', error);
    }
  };

  const handleRandomProblem = (e: React.MouseEvent) => {
    // Try to find an uncompleted problem first
    const uncompleted = allProblems.filter(p => !completedProblems.includes(p.id));
    const pool = uncompleted.length > 0 ? uncompleted : allProblems;

    if (pool.length === 0) return;

    const randomProblem = pool[Math.floor(Math.random() * pool.length)];
    onProblemSelect(randomProblem.id, e);
  };

  // MOCK: Extension Data based on problem ID for UI demonstration
  const mockExtensionData: Record<string, { solveTime?: string; subs?: number; lastAttempted?: string; stuck?: boolean; reviewDue?: boolean }> = {
    // some IDs will match actual data if they exist, else we just use prefixes logic
  };

  // Inject some mock data dynamically to display the variations requested
  // We'll deterministically assign mock states for demonstrating UI based on problem properties or ID.
  const getExtensionData = (problemId: string, isCompleted: boolean) => {
    // Course Schedule II (Mocking "stuck")
    if (problemId.toLowerCase().includes('course-schedule-ii') || problemId === 'graph-5') {
      return { solveTime: '38m', subs: 5, lastAttempted: 'yesterday', stuck: true };
    }
    // Two Sum (Mocking "review due")
    if (problemId.toLowerCase().includes('two-sum') || problemId === 'array-1') {
      return { solveTime: '8m', subs: 1, lastAttempted: '14d ago', reviewDue: true };
    }
    // General completed (Mocking "solved")
    if (isCompleted) {
      // Pick a random problem for normal solved data
      return { solveTime: '14m', subs: 2, lastAttempted: '3d ago' };
    }
    return null;
  };

  // Filter Logic
  const filteredSheet = useMemo(() => {
    return SHEET.map((topic) => {
      const filteredProblems = topic.problems.filter((problem) => {
        // Search Filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          const matchesTitle = problem.title.toLowerCase().includes(query);
          const matchesPlatform = problem.platform.toLowerCase().includes(query);
          const matchesTags = problem.tags?.some(tag => tag.toLowerCase().includes(query));

          if (!matchesTitle && !matchesPlatform && !matchesTags) return false;
        }

        // Status Filter
        if (statusFilter === "Saved") {
          return savedProblems.includes(problem.id);
        }
        if (statusFilter === "Completed") {
          return completedProblems.includes(problem.id);
        }
        
        const extData = getExtensionData(problem.id, completedProblems.includes(problem.id));
        if (statusFilter === "Unresolved") {
          return extData?.stuck && !completedProblems.includes(problem.id);
        }
        if (statusFilter === "Due for Review") {
          return !!extData?.reviewDue;
        }
        if (statusFilter === "Never Attempted") {
          return !extData && !completedProblems.includes(problem.id);
        }

        // Difficulty Filter
        if (difficultyFilter !== "All") {
          const hasTag = problem.tags?.some(tag => tag.toLowerCase() === difficultyFilter.toLowerCase());
          if (!hasTag) return false;
        }

        // Platform Filter
        if (platformFilter !== "All") {
          if (platformFilter === "Other") {
            if (problem.platform === "LeetCode" || problem.platform === "GeeksForGeeks") return false;
          } else {
            if (problem.platform !== platformFilter) return false;
          }
        }

        return true;
      });

      return {
        ...topic,
        problems: filteredProblems,
      };
    }).filter((topic) => topic.problems.length > 0);
  }, [searchQuery, statusFilter, difficultyFilter, platformFilter, savedProblems, completedProblems]);

  return (
    <div className="relative h-full bg-card pt-12 flex flex-col overflow-hidden">
      {/* Top Fade */}
      <div className="pointer-events-none absolute top-12 left-0 right-0 h-12 bg-linear-to-b from-card to-transparent z-20" />

      <div className="flex-1 min-h-0 w-full relative">
        <div className="max-w-7xl mx-auto px-8 md:px-12 h-full">
          <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-12 h-full">
            {/* Left Column: Filters & Stats */}
            <div className="hidden md:block h-full overflow-hidden">
              <div className="h-full space-y-8 text-right overflow-y-auto thin-scrollbar overscroll-contain  pb-56 mt-8 pt-24 mb-56">
                {/* Top fade */}
                <div className="pointer-events-none absolute top-0 left-0 right-0 h-40 bg-linear-to-b from-card to-transparent z-20" />
                {/* Progress Stats */}
                <div className="space-y-4 bg-muted/30 p-4 rounded-xl border border-border/50 transition-colors hover:bg-muted/50">
                  <div className="flex items-center justify-end gap-2 text-sm font-semibold text-foreground">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    Progress
                  </div>
                  
                  <div className="space-y-2">
                    {/* Easy */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground w-8 text-right">Easy</span>
                      <Progress value={allEasy.length ? (completedEasy / allEasy.length) * 100 : 0} className="h-1.5 flex-1 bg-green-500/10 [&>div]:bg-green-500" />
                      <span className="text-[10px] text-muted-foreground w-8">{completedEasy}/{allEasy.length}</span>
                    </div>
                    {/* Medium */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground w-8 text-right">Med</span>
                      <Progress value={allMedium.length ? (completedMedium / allMedium.length) * 100 : 0} className="h-1.5 flex-1 bg-yellow-500/10 [&>div]:bg-yellow-500" />
                      <span className="text-[10px] text-muted-foreground w-8">{completedMedium}/{allMedium.length}</span>
                    </div>
                    {/* Hard */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground w-8 text-right">Hard</span>
                      <Progress value={allHard.length ? (completedHard / allHard.length) * 100 : 0} className="h-1.5 flex-1 bg-red-500/10 [&>div]:bg-red-500" />
                      <span className="text-[10px] text-muted-foreground w-8">{completedHard}/{allHard.length}</span>
                    </div>
                  </div>

                  <div className="border-t border-border/40 pt-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-foreground tracking-tight font-medium">{totalCompleted} / {totalProblems}</span>
                      <span className="text-muted-foreground">{Math.round(progressPercentage)}%</span>
                      <div className="flex items-center gap-1 text-muted-foreground" title="Saved Problems">
                        <Bookmark className="h-3 w-3" />
                        <span>{savedProblems.length} Saved</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-[11px] text-muted-foreground text-right mt-1">
                    ↑ 5 this week <span className="opacity-60">(was 3)</span>
                  </div>
                </div>

                {/* Status Filters */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">Activity</h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    {(["All", "Saved", "Completed", "Unresolved", "Due for Review", "Never Attempted"] as FilterStatus[]).map((filter) => (
                      <div
                        key={filter}
                        onClick={() => setStatusFilter(filter)}
                        className={`cursor-pointer transition-colors ${statusFilter === filter ? "text-primary font-medium" : "hover:text-foreground"
                          }`}
                      >
                        {filter === "All" ? "All Problems" : filter}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Difficulty Filter */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">Difficulty</h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    {(["Easy", "Medium", "Hard"] as FilterDifficulty[]).map((filter) => (
                      <div
                        key={filter}
                        onClick={() => setDifficultyFilter(difficultyFilter === filter ? "All" : filter)}
                        className={`cursor-pointer transition-colors ${difficultyFilter === filter ? "text-primary font-medium" : "hover:text-foreground"
                          }`}
                      >
                        {filter}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Platform Filter */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">Platform</h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    {(["LeetCode", "GeeksForGeeks", "Other"] as FilterPlatform[]).map((filter) => (
                      <div
                        key={filter}
                        onClick={() => setPlatformFilter(platformFilter === filter ? "All" : filter)}
                        className={`cursor-pointer transition-colors ${platformFilter === filter ? "text-primary font-medium" : "hover:text-foreground"
                          }`}
                      >
                        {filter}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sort Option */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">Sort by</h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    {(["Difficulty", "Staleness", "Attempts"] as SortOption[]).map((sort) => (
                      <div
                        key={sort}
                        onClick={() => {
                          if (sortOption === sort) {
                            setSortDesc(!sortDesc);
                          } else {
                            setSortOption(sort);
                            setSortDesc(true);
                          }
                        }}
                        className={`cursor-pointer transition-colors ${sortOption === sort ? "text-primary font-medium" : "hover:text-foreground"
                          }`}
                      >
                        {sort} ↕
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Right Column: Problems */}
            <div className="h-full overflow-hidden">
              <div id="problem-scroll-container" className="h-full overflow-y-auto thin-scrollbar overscroll-contain pb-48 pt-2 px-2 relative space-y-6">

                {/* Top Navigation & Actions */}
                <div className="sticky top-0 z-20 bg-card/95 pb-4 backdrop-blur space-y-4">
                  {/* Mode Switcher */}
                <div className="flex gap-6 border-b border-border/40 pb-2">
                  {(["Browse", "Focus", "Analyze", "Interview"] as Mode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setActiveMode(mode)}
                      className={`relative px-1 pb-2 text-sm font-medium transition-colors ${
                        activeMode === mode
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground/80"
                      }`}
                    >
                      {mode}
                      {activeMode === mode && (
                        <motion.div
                          layoutId="activeMode"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground"
                        />
                      )}
                    </button>
                  ))}
                </div>

                {/* Search & Actions Bar - Browse Mode Only */}
                {activeMode === "Browse" && (
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search problems, tags, platforms..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-background/50 border-border/50 focus:border-primary/50 text-sm h-10 transition-all hover:bg-background/80"
                      />
                    </div>
                    <Button
                      variant="outline"
                      className="gap-2 h-10 hover:bg-primary/10 hover:text-primary transition-colors"
                      onClick={handleRandomProblem}
                      title="Pick a random unsolved problem"
                    >
                      <Shuffle className="h-4 w-4" />
                      <span className="hidden sm:inline">Pick Random</span>
                    </Button>
                  </div>
                )}
              </div>

              {activeMode !== "Browse" ? (
                <div className="text-center py-16 text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border flex flex-col items-center justify-center">
                  <p className="font-medium">{activeMode} Mode</p>
                  <p className="text-sm opacity-70 mt-1">Coming soon...</p>
                </div>
              ) : filteredSheet.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border flex flex-col items-center justify-center">
                  <div className="bg-muted/50 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                    <Search className="h-6 w-6 opacity-50" />
                  </div>
                  <p className="font-medium">No problems found</p>
                  <p className="text-sm opacity-70 mt-1">Try adjusting your filters or search terms</p>
                </div>
              ) : (
                <>
                  {!isFocusDismissed && (
                    <div className="rounded-xl border border-border/40 bg-card p-5 space-y-4 mb-8">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-foreground">Today's Focus</h3>
                          <div className="flex gap-1" title="2/3 done">
                            <div className="w-2 h-2 rounded-sm bg-primary" />
                            <div className="w-2 h-2 rounded-sm bg-primary" />
                            <div className="w-2 h-2 rounded-sm bg-muted-foreground/30" />
                          </div>
                        </div>
                        <button 
                          onClick={() => setIsFocusDismissed(true)}
                          className="text-muted-foreground hover:text-foreground transition-colors p-1"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="h-px bg-border/40 w-full" />
                      
                      <div className="space-y-2">
                        {/* Mock Focus Items */}
                        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 transition-colors group cursor-pointer border border-transparent hover:border-border/40">
                          <div className="flex items-center gap-3">
                            <RotateCcw className="h-4 w-4 text-teal-500" />
                            <div>
                              <span className="text-sm text-muted-foreground mr-2">Review:</span>
                              <span className="text-sm font-medium">Two Sum</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Easy · Arrays</span>
                            <span className="w-16 text-right">14d stale</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 transition-colors group cursor-pointer border border-transparent hover:border-border/40">
                          <div className="flex items-center gap-3">
                            <RotateCcw className="h-4 w-4 text-teal-500" />
                            <div>
                              <span className="text-sm text-muted-foreground mr-2">Review:</span>
                              <span className="text-sm font-medium">Valid Parentheses</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Easy · Stacks</span>
                            <span className="w-16 text-right">9d stale</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 transition-colors group cursor-pointer border border-transparent hover:border-border/40">
                          <div className="flex items-center gap-3">
                            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                            <div>
                              <span className="text-sm text-muted-foreground mr-2">Retry:</span>
                              <span className="text-sm font-medium">Course Schedule II</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Hard · Graphs</span>
                            <span className="w-16 text-right">failed yday</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end pt-2">
                        <Button variant="ghost" className="gap-2 text-sm h-8 hover:bg-transparent hover:text-primary p-0">
                          Start session <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {filteredSheet.map((topic) => (
                  <section
                    key={topic.topicName}
                    id={topic.topicName}
                    data-topic
                    data-topic-title={topic.topicName}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-3 pb-2 border-b border-border/40">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <Hash className="h-4 w-4" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold">{topic.topicName}</h2>
                        <div className="flex gap-2 text-xs text-muted-foreground">
                          <span>{topic.problems.length} problems</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      {topic.problems.map((problem) => {
                        const isActive = activeProblemId === problem.id;
                        const isCompleted = completedProblems.includes(problem.id);
                        const isSaved = savedProblems.includes(problem.id);
                        
                        // Fake extension data mapping for UI showcase
                        const isCourseSchedule = problem.title.includes("Course Schedule II");
                        const isTwoSum = problem.title === "Two Sum";
                        
                        let extData = null;
                        if (isCourseSchedule) {
                          extData = { solveTime: "38m", subs: 5, lastAttempted: "yesterday", stuck: true };
                        } else if (isTwoSum) {
                          extData = { solveTime: "8m", subs: 1, lastAttempted: "14d ago", reviewDue: true };
                        } else if (isCompleted) {
                          extData = { solveTime: "14m", subs: 2, lastAttempted: "3d ago" };
                        }

                        // Determine Unresolved (Attempted but not completed) - matching the stuck case
                        const isUnresolved = extData?.stuck && !isCompleted;

                        return (
                          <button
                            key={problem.id}
                            onClick={(e) => onProblemSelect(problem.id, e)}
                            className={`group relative w-full border-b border-border/40 px-4 py-3 text-left transition-all hover:bg-gradient-to-r hover:from-transparent hover:to-accent/40 ${isActive ? "bg-accent/50" : ""
                              }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="space-y-1.5 flex-1">
                                <div className="flex items-center gap-2">
                                  {extData?.reviewDue && (
                                    <span className="text-teal-500" title="Review Due">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M3 21v-5h5" /></svg>
                                    </span>
                                  )}
                                  <div
                                    className={`text-sm font-medium transition-colors flex-1 ${isActive
                                        ? "text-primary"
                                        : isCompleted
                                          ? "text-foreground/60 line-through decoration-green-500/30"
                                          : "text-foreground group-hover:text-primary"
                                      }`}
                                  >
                                    {problem.title}
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-2 text-[11px] font-medium text-muted-foreground items-center">
                                  <span className="px-1.5 py-0.5 rounded bg-muted/50 border border-border/50 text-xs text-muted-foreground/70">
                                    {problem.platform}
                                  </span>
                                  {problem.tags?.map((tag) => {
                                    let color = "bg-muted/30 text-muted-foreground";
                                    if (tag === "Easy") color = "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20";
                                    if (tag === "Medium") color = "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20";
                                    if (tag === "Hard") color = "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
                                    return (
                                      <span
                                        key={tag}
                                        className={`px-1.5 py-0.5 rounded border ${color}`}
                                      >
                                        {tag}
                                      </span>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Hover Actions & Metadata */}
                              <div className="flex flex-col items-end gap-1">
                                <div className="flex items-center gap-3">
                                  {/* Extension Metadata */}
                                  {extData && (
                                    <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                                      <span>{extData.solveTime}</span>
                                      <span>·</span>
                                      <span>{extData.subs} sub</span>
                                    </div>
                                  )}
                                  <div className={`flex items-center gap-1 transition-opacity ${isActive || isSaved || isCompleted || isUnresolved ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                    <div
                                      role="button"
                                      onClick={(e) => handleSaveProblem(problem.id, e)}
                                      className={`rounded-md p-1.5 hover:bg-background hover:shadow-sm transition-colors cursor-pointer ${isSaved
                                          ? 'text-yellow-500 bg-yellow-500/5'
                                          : 'text-muted-foreground hover:text-yellow-500 hover:bg-yellow-500/10'
                                        }`}
                                      title={isSaved ? "Unsave" : "Save for later"}
                                    >
                                      <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                                    </div>
                                    <div
                                      role="button"
                                      onClick={(e) => handleCompleteProblem(problem.id, e)}
                                      className={`rounded-md p-1.5 hover:bg-background hover:shadow-sm transition-colors cursor-pointer ${isCompleted
                                          ? 'text-green-500 bg-green-500/5'
                                          : isUnresolved 
                                            ? 'text-amber-500 bg-amber-500/5'
                                            : 'text-muted-foreground hover:text-green-500 hover:bg-green-500/10'
                                        }`}
                                      title={isCompleted ? "Mark as incomplete" : "Mark as completed"}
                                    >
                                      {isUnresolved ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/></svg>
                                      ) : (
                                        <Check className="h-4 w-4" />
                                      )}
                                    </div>
                                  </div>
                                </div>
                                {/* Secondary Metadata row */}
                                {extData && (
                                  <div className="text-[10px] flex items-center justify-end gap-1.5">
                                    <span className="text-muted-foreground">{extData.lastAttempted}</span>
                                    {extData.stuck && (
                                      <>
                                        <span className="text-muted-foreground">·</span>
                                        <span className="text-amber-500/80 flex items-center gap-1">
                                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                          stuck
                                        </span>
                                      </>
                                    )}
                                    {extData.reviewDue && (
                                      <>
                                        <span className="text-muted-foreground">·</span>
                                        <span className="text-teal-500/80">review due</span>
                                      </>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </section>
                ))}
                </>
              )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-card to-transparent z-20" />
    </div>
  );
}
