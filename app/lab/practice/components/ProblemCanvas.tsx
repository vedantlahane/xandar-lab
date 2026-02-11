"use client";

import { useState, useMemo } from "react";
import { SHEET, DSAProblem } from "../data/sheet";
import { Check, Bookmark, Search, Shuffle, Trophy, Hash } from "lucide-react";
import { useAuth } from "@/components/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

interface ProblemCanvasProps {
  activeProblemId: string | null;
  onProblemSelect: (id: string, event: React.MouseEvent) => void;
}

type FilterStatus = "All" | "Saved" | "Completed";
type FilterDifficulty = "All" | "Easy" | "Medium" | "Hard";
type FilterPlatform = "All" | "LeetCode" | "GeeksForGeeks" | "Other";

export default function ProblemCanvas({
  activeProblemId,
  onProblemSelect,
}: ProblemCanvasProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("All");
  const [difficultyFilter, setDifficultyFilter] = useState<FilterDifficulty>("All");
  const [platformFilter, setPlatformFilter] = useState<FilterPlatform>("All");
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
    <div className="relative h-full bg-card pt-12">
      {/* Top Fade */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-12 bg-linear-to-b from-card to-transparent z-20" />

      <div id="problem-scroll-container" className="h-full overflow-y-auto">
        <div className="max-w-7xl mx-auto px-8 md:px-12 pb-48 pt-12">
          <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-12">
            {/* Left Column: Filters & Stats */}
            <div className="hidden md:block">
              <div className="sticky top-32 space-y-8 text-right">

                {/* Progress Stats */}
                <div className="space-y-3 bg-muted/30 p-4 rounded-xl border border-border/50 transition-colors hover:bg-muted/50">
                  <div className="flex items-center justify-end gap-2 text-sm font-semibold text-foreground">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    Progress
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{Math.round(progressPercentage)}%</span>
                    <span>{totalCompleted} / {totalProblems}</span>
                  </div>
                  <div className="pt-2 flex justify-end gap-2 text-xs">
                    <div className="flex items-center gap-1 text-muted-foreground hover:text-yellow-500 transition-colors cursor-help" title="Saved Problems">
                      <Bookmark className="h-3 w-3" />
                      <span>{savedProblems.length} Saved</span>
                    </div>
                  </div>
                </div>

                {/* Status Filters */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">Activity</h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    {(["All", "Saved", "Completed"] as FilterStatus[]).map((filter) => (
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

              </div>
            </div>

            {/* Right Column: Problems */}
            <div className="space-y-6">

              {/* Search & Actions Bar */}
              <div className="sticky top-0 z-20 bg-card/95 pb-2 pt-4 backdrop-blur">
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
              </div>

              {filteredSheet.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border flex flex-col items-center justify-center">
                  <div className="bg-muted/50 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                    <Search className="h-6 w-6 opacity-50" />
                  </div>
                  <p className="font-medium">No problems found</p>
                  <p className="text-sm opacity-70 mt-1">Try adjusting your filters or search terms</p>
                </div>
              ) : (
                filteredSheet.map((topic) => (
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

                        return (
                          <button
                            key={problem.id}
                            onClick={(e) => onProblemSelect(problem.id, e)}
                            className={`group relative w-full rounded-xl border-b px-4 py-3 text-left transition-all  ${isActive
                                ? "bg-accent/50 border-primary/50 shadow-sm"
                                : isCompleted
                                  ? "bg-green-500/5 border-green-500/20 opacity-90 hover:opacity-100"
                                  : "bg-card border-border/40 hover:bg-accent/20"
                              }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="space-y-1.5 flex-1">
                                <div className="flex items-center gap-2">
                                  {isCompleted && (
                                    <div className="h-4 w-4 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                                      <Check className="h-2.5 w-2.5 text-green-500" />
                                    </div>
                                  )}
                                  <span
                                    className={`text-sm font-medium transition-colors line-clamp-1 ${isActive
                                        ? "text-primary"
                                        : isCompleted
                                          ? "text-foreground/70"
                                          : "text-foreground group-hover:text-primary"
                                      }`}
                                  >
                                    {problem.title}
                                  </span>
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

                              {/* Hover Actions */}
                              <div className={`flex items-center gap-1 transition-opacity ${isActive || isSaved || isCompleted ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                <div
                                  role="button"
                                  onClick={(e) => handleSaveProblem(problem.id, e)}
                                  className={`rounded-md p-1.5 hover:bg-background hover:shadow-sm transition-colors ${isSaved
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
                                  className={`rounded-md p-1.5 hover:bg-background hover:shadow-sm transition-colors ${isCompleted
                                      ? 'text-green-500 bg-green-500/5'
                                      : 'text-muted-foreground hover:text-green-500 hover:bg-green-500/10'
                                    }`}
                                  title={isCompleted ? "Mark as incomplete" : "Mark as completed"}
                                >
                                  <Check className="h-4 w-4" />
                                </div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </section>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-card to-transparent z-20" />
    </div>
  );
}
