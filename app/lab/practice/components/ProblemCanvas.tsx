"use client";

import { SHEET } from "../data/sheet";

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
                <div className="max-w-5xl mx-auto px-8 md:px-12 pb-32 pt-24 space-y-12">
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

                            <div className="space-y-3">
                                {topic.problems.map((problem) => {
                                    const isActive = activeProblemId === problem.id;
                                    return (
                                        <button
                                            key={problem.id}
                                            onClick={(e) => onProblemSelect(problem.id, e)}
                                            className={`group w-full border-b border-border/40 px-2 py-4 text-left transition-all hover:bg-accent/50 ${
                                                isActive ? "bg-accent" : ""
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
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </section>
                    ))}
                </div>
            </div>

            {/* Bottom Fade */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-card to-transparent z-20" />
        </div>
    );
}