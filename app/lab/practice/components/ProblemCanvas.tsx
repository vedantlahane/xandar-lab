"use client";

import { useState, useMemo } from "react";
import { SHEET } from "../data/sheet";
import { Check, Bookmark, Search, Shuffle, Trophy } from "lucide-react";
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
          {/* Reverted column width to original 200px */}
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-12">

            {/* Left Column: Filters */}
            <div className="hidden md:block">
              <div className="sticky top-32 text-right space-y-6">

                {/* Minimal Progress Stats */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground flex items-center justify-end gap-2">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    Progress
                  </h3>
                  <div className="flex flex-col items-end gap-1">
                    <Progress value={progressPercentage} className="h-1.5 w-full bg-muted" />
                    <span className="text-xs text-muted-foreground">{Math.round(progressPercentage)}% Complete</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">Filters</h3>
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
            <div className="space-y-4">

              {/* Feature: Search & Random Pick (Minimal Design) */}
              <div className="flex items-center gap-4 mb-2">
                <div className="relative flex-1">
                  <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search problems..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-6 h-9 border-0 border-b border-border bg-transparent rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary placeholder:text-muted-foreground/50 transition-colors"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-muted-foreground hover:text-foreground h-9"
                  onClick={handleRandomProblem}
                  title="Pick random problem"
                >
                  <Shuffle className="h-4 w-4" />
                  <span className="hidden sm:inline">Random</span>
                </Button>
              </div>

              {filteredSheet.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No problems match your filters.
                </div>
              ) : (
                filteredSheet.map((topic) => (
                  <section
                    key={topic.topicName}
                    id={topic.topicName}
                    data-topic
                    data-topic-title={topic.topicName}
                    className="space-y-5"
                  >
                    <div className="sticky top-0 z-10 bg-card/95 py-4 backdrop-blur">
                      <h2 className="text-lg font-semibold">{topic.topicName}</h2>
                      <p className="text-sm text-muted-foreground">
                        {topic.problems.length} problems
                      </p>
                    </div>

                    <div className="space-y-1">
                      {topic.problems.map((problem) => {
                        const isActive = activeProblemId === problem.id;
                        const isCompleted = completedProblems.includes(problem.id);
                        const isSaved = savedProblems.includes(problem.id);

                        // Reverted to original styling
                        return (
                          <button
                            key={problem.id}
                            onClick={(e) => onProblemSelect(problem.id, e)}
                            className={`group relative w-full border-b border-border/40 px-4 py-3 text-left transition-all hover:bg-gradient-to-r hover:from-transparent hover:to-accent/40 ${isActive ? "bg-accent/50" : ""
                              }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="space-y-1.5 flex-1">
                                <div
                                  className={`text-sm font-medium transition-colors ${isActive
                                      ? "text-primary"
                                      : isCompleted
                                        ? "text-foreground/60 line-through decoration-green-500/30"
                                        : "text-foreground group-hover:text-primary"
                                    }`}
                                >
                                  {problem.title}
                                </div>
                                <div className="flex flex-wrap gap-2 text-[11px] font-medium text-muted-foreground">
                                  <span className="text-xs text-muted-foreground/70">
                                    {problem.platform}
                                  </span>
                                  {problem.tags?.map((tag) => (
                                    <span
                                      key={tag}
                                      className="text-xs text-muted-foreground/50"
                                    >
                                      • {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* Hover Actions (Restored original positioning but added check/bookmark logic) */}
                              <div className={`absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 transition-opacity ${isActive || isSaved || isCompleted ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                <div
                                  role="button"
                                  onClick={(e) => handleSaveProblem(problem.id, e)}
                                  className={`rounded-md p-1.5 hover:bg-background hover:shadow-sm transition-colors ${isSaved
                                      ? 'text-yellow-500'
                                      : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                  title="Save for later"
                                >
                                  <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                                </div>
                                <div
                                  role="button"
                                  onClick={(e) => handleCompleteProblem(problem.id, e)}
                                  className={`rounded-md p-1.5 hover:bg-background hover:shadow-sm transition-colors ${isCompleted
                                      ? 'text-green-500'
                                      : 'text-muted-foreground hover:text-green-500'
                                    }`}
                                  title="Mark as completed"
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
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-card to-transparent z-20" />
    </div>
  );
}
