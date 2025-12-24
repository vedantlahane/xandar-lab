"use client";

import { useState, useMemo } from "react";
import { SHEET } from "../data/sheet";
import { Check, Bookmark } from "lucide-react";

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
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("All");
  const [difficultyFilter, setDifficultyFilter] = useState<FilterDifficulty>("All");
  const [platformFilter, setPlatformFilter] = useState<FilterPlatform>("All");

  // Filter Logic
  const filteredSheet = useMemo(() => {
    return SHEET.map((topic) => {
      const filteredProblems = topic.problems.filter((problem) => {
        // Status Filter
        if (statusFilter === "Saved") {
          // TODO: Implement saved logic
          return false; 
        }
        if (statusFilter === "Completed") {
           // TODO: Implement completed logic
           return problem.isCompleted;
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
  }, [statusFilter, difficultyFilter, platformFilter]);

  return (
    <div className="relative h-full bg-card pt-12">
      {/* Top Fade */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-12 bg-linear-to-b from-card to-transparent z-20" />

      <div id="problem-scroll-container" className="h-full overflow-y-auto">
        <div className="max-w-7xl mx-auto px-8 md:px-12 pb-48 pt-12">
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-12">
            {/* Left Column: Filters */}
            <div className="hidden md:block">
              <div className="sticky top-32 text-right space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">Filters</h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    {(["All", "Saved", "Completed"] as FilterStatus[]).map((filter) => (
                        <div 
                            key={filter}
                            onClick={() => setStatusFilter(filter)}
                            className={`cursor-pointer transition-colors ${
                                statusFilter === filter ? "text-primary font-medium" : "hover:text-foreground"
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
                            className={`cursor-pointer transition-colors ${
                                difficultyFilter === filter ? "text-primary font-medium" : "hover:text-foreground"
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
                            className={`cursor-pointer transition-colors ${
                                platformFilter === filter ? "text-primary font-medium" : "hover:text-foreground"
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
            <div className="space-y-3">
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
                        return (
                            <button
                            key={problem.id}
                            onClick={(e) => onProblemSelect(problem.id, e)}
                            className={`group relative w-full border-b border-border/40 px-4 py-3 text-left transition-all hover:bg-gradient-to-r hover:from-transparent hover:to-accent/40 ${
                                isActive ? "bg-accent/50" : ""
                            }`}
                            >
                            <div className="flex items-start justify-between gap-3">
                                <div className="space-y-1.5">
                                <div
                                    className={`text-sm font-medium transition-colors ${
                                    isActive
                                        ? "text-primary"
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

                                {/* Hover Actions */}
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                                <div
                                    role="button"
                                    onClick={(e) => {
                                    e.stopPropagation();
                                    // Handle save
                                    }}
                                    className="rounded-md p-1.5 text-muted-foreground hover:bg-background hover:text-foreground hover:shadow-sm"
                                    title="Save for later"
                                >
                                    <Bookmark className="h-4 w-4" />
                                </div>
                                <div
                                    role="button"
                                    onClick={(e) => {
                                    e.stopPropagation();
                                    // Handle complete
                                    }}
                                    className="rounded-md p-1.5 text-muted-foreground hover:bg-background hover:text-green-500 hover:shadow-sm"
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
