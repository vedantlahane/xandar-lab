"use client";

import { SHEET } from "../data/sheet";
import { Check, Bookmark } from "lucide-react";

interface ProblemCanvasProps {
    activeProblemId: string | null;
    onProblemSelect: (id: string, event: React.MouseEvent) => void;
}

export default function ProblemCanvas({ activeProblemId, onProblemSelect }: ProblemCanvasProps) {
    return (
        <div className="relative h-full bg-card">
            {/* Top Fade */}
            <div className="pointer-events-none absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-card to-transparent z-20" />

            <div
                id="problem-scroll-container"
                className="h-full overflow-y-auto"
            >
                <div className="max-w-7xl mx-auto px-8 md:px-12 pb-48 pt-32">
                    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-12">
                        {/* Left Column: Filters */}
                        <div className="hidden md:block">
                            <div className="sticky top-32 text-right space-y-8">
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-foreground">Filters</h3>
                                    <div className="space-y-2 text-sm text-muted-foreground">
                                        <div className="hover:text-foreground cursor-pointer transition-colors">All Problems</div>
                                        <div className="hover:text-foreground cursor-pointer transition-colors">Saved</div>
                                        <div className="hover:text-foreground cursor-pointer transition-colors">Completed</div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="font-semibold text-foreground">Difficulty</h3>
                                    <div className="space-y-2 text-sm text-muted-foreground">
                                        <div className="hover:text-foreground cursor-pointer transition-colors">Easy</div>
                                        <div className="hover:text-foreground cursor-pointer transition-colors">Medium</div>
                                        <div className="hover:text-foreground cursor-pointer transition-colors">Hard</div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="font-semibold text-foreground">Platform</h3>
                                    <div className="space-y-2 text-sm text-muted-foreground">
                                        <div className="hover:text-foreground cursor-pointer transition-colors">LeetCode</div>
                                        <div className="hover:text-foreground cursor-pointer transition-colors">GeeksForGeeks</div>
                                        <div className="hover:text-foreground cursor-pointer transition-colors">Other</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Problems */}
                        <div className="space-y-12">
                            {SHEET.map((topic) => (
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
                                            Curated set · {topic.problems.length} problems
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
                                                            <div className={`text-sm font-medium transition-colors ${
                                                                isActive ? "text-primary" : "text-foreground group-hover:text-primary"
                                                            }`}>
                                                                {problem.title}
                                                            </div>
                                                            <div className="flex flex-wrap gap-2 text-[11px] font-medium text-muted-foreground">
                                                                <span className="text-xs text-muted-foreground/70">{problem.platform}</span>
                                                                {problem.tags?.map((tag) => (
                                                                    <span key={tag} className="text-xs text-muted-foreground/50">
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
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Fade */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-card to-transparent z-20" />
        </div>
    );
}