// app/lab/experiments/components/ExperimentCanvas.tsx
"use client";

import { useState, useMemo } from "react";
import { EXPERIMENTS, ExperimentStatus, ExperimentType } from "../data/experiments";
import { Beaker, Calendar, GitBranch } from "lucide-react";

interface ExperimentCanvasProps {
    activeExpId: string | null;
    onExpSelect: (id: string, event: React.MouseEvent) => void;
}

type FilterStatus = "All" | ExperimentStatus;
type FilterType = "All" | ExperimentType;

export default function ExperimentCanvas({
    activeExpId,
    onExpSelect,
}: ExperimentCanvasProps) {
    const [statusFilter, setStatusFilter] = useState<FilterStatus>("All");
    const [typeFilter, setTypeFilter] = useState<FilterType>("All");

    const statuses: FilterStatus[] = ["All", "Active", "Completed", "Planning", "Archived"];
    const types: FilterType[] = ["All", "Frontend", "Backend", "Full Stack", "AI/ML", "Mobile", "DevOps"];

    const filteredExperiments = useMemo(() => {
        return EXPERIMENTS.map((category) => {
            const filteredItems = category.experiments.filter((exp) => {
                if (statusFilter !== "All" && exp.status !== statusFilter) return false;
                if (typeFilter !== "All" && exp.type !== typeFilter) return false;
                return true;
            });

            return {
                ...category,
                experiments: filteredItems,
            };
        }).filter((category) => category.experiments.length > 0);
    }, [statusFilter, typeFilter]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active': return 'text-green-400';
            case 'Completed': return 'text-blue-400';
            case 'Archived': return 'text-gray-400';
            case 'Planning': return 'text-yellow-400';
            default: return 'text-muted-foreground';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'Frontend': return 'text-purple-400';
            case 'Backend': return 'text-orange-400';
            case 'Full Stack': return 'text-cyan-400';
            case 'AI/ML': return 'text-pink-400';
            case 'Mobile': return 'text-indigo-400';
            case 'DevOps': return 'text-emerald-400';
            default: return 'text-muted-foreground';
        }
    };

    return (
        <div className="relative h-full bg-card pt-12">
            {/* Top Fade */}
            <div className="pointer-events-none absolute top-0 left-0 right-0 h-12 bg-linear-to-b from-card to-transparent z-20" />

            <div id="experiments-scroll-container" className="h-full overflow-y-auto">
                <div className="max-w-7xl mx-auto px-8 md:px-12 pb-48 pt-12">
                    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-12">
                        {/* Left Column: Filters */}
                        <div className="hidden md:block">
                            <div className="sticky top-32 text-right space-y-6">
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-foreground">Status</h3>
                                    <div className="space-y-1 text-sm text-muted-foreground">
                                        {statuses.map((filter) => (
                                            <div
                                                key={filter}
                                                onClick={() => setStatusFilter(filter)}
                                                className={`cursor-pointer transition-colors ${statusFilter === filter ? "text-primary font-medium" : "hover:text-foreground"
                                                    }`}
                                            >
                                                {filter === "All" ? "All Status" : filter}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="font-semibold text-foreground">Type</h3>
                                    <div className="space-y-1 text-sm text-muted-foreground">
                                        {types.map((filter) => (
                                            <div
                                                key={filter}
                                                onClick={() => setTypeFilter(typeFilter === filter ? "All" : filter)}
                                                className={`cursor-pointer transition-colors ${typeFilter === filter ? "text-primary font-medium" : "hover:text-foreground"
                                                    }`}
                                            >
                                                {filter}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Experiments */}
                        <div className="space-y-3">
                            {filteredExperiments.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    No experiments match your filters.
                                </div>
                            ) : (
                                filteredExperiments.map((category) => (
                                    <section
                                        key={category.categoryName}
                                        id={category.categoryName}
                                        data-category
                                        data-category-title={category.categoryName}
                                        className="space-y-5"
                                    >
                                        <div className="sticky top-0 z-10 bg-card/95 py-4 backdrop-blur">
                                            <h2 className="text-lg font-semibold">{category.categoryName}</h2>
                                            <p className="text-sm text-muted-foreground">
                                                {category.experiments.length} experiments
                                            </p>
                                        </div>

                                        <div className="space-y-1">
                                            {category.experiments.map((exp) => {
                                                const isActive = activeExpId === exp.id;
                                                return (
                                                    <button
                                                        key={exp.id}
                                                        onClick={(e) => onExpSelect(exp.id, e)}
                                                        className={`group relative w-full border-b border-border/40 px-4 py-4 text-left transition-all hover:bg-gradient-to-r hover:from-transparent hover:to-accent/40 ${isActive ? "bg-accent/50" : ""
                                                            }`}
                                                    >
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2">
                                                                    <Beaker className={`h-4 w-4 ${getStatusColor(exp.status)}`} />
                                                                    <div
                                                                        className={`text-sm font-medium transition-colors ${isActive
                                                                                ? "text-primary"
                                                                                : "text-foreground group-hover:text-primary"
                                                                            }`}
                                                                    >
                                                                        {exp.title}
                                                                    </div>
                                                                </div>
                                                                <p className="text-xs text-muted-foreground/70 line-clamp-1 pl-6">
                                                                    {exp.description}
                                                                </p>
                                                                <div className="flex flex-wrap gap-2 text-[11px] font-medium text-muted-foreground pl-6">
                                                                    <span className={getStatusColor(exp.status)}>
                                                                        {exp.status}
                                                                    </span>
                                                                    <span className={getTypeColor(exp.type)}>
                                                                        • {exp.type}
                                                                    </span>
                                                                    {exp.technologies.slice(0, 3).map((tech) => (
                                                                        <span
                                                                            key={tech}
                                                                            className="text-xs text-muted-foreground/50"
                                                                        >
                                                                            • {tech}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            {/* Hover Info */}
                                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3 opacity-0 transition-opacity group-hover:opacity-100">
                                                                {exp.githubUrl && (
                                                                    <GitBranch className="h-4 w-4 text-muted-foreground" />
                                                                )}
                                                                <div className="flex items-center gap-1 text-xs text-muted-foreground/50">
                                                                    <Calendar className="h-3 w-3" />
                                                                    {exp.startDate}
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
