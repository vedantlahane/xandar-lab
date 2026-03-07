// app/lab/experiments/components/ExperimentCanvas.tsx
"use client";

import { useState, useMemo } from "react";
import { EXPERIMENTS, ExperimentStatus, ExperimentType } from "../data/experiments";
import {
    Beaker, Calendar, GitBranch, ExternalLink,
    Layers, Activity, CheckCircle2, Archive, ClipboardList,
    Monitor, Server, Boxes, Brain, Smartphone, Settings,
    ArrowUpDown, ChevronDown, ChevronUp,
    Tag
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchBar } from "@/app/lab/practice/components/browse/SearchBar";

interface ExperimentCanvasProps {
    activeExpId: string | null;
    onExpSelect: (id: string, event: React.MouseEvent) => void;
}

type FilterStatus = "All" | ExperimentStatus;
type FilterType = "All" | ExperimentType;
type FilterTech = "All" | string;
type SortOption = "Date" | "Name" | "Status";

// ── Status filter config ────────────────────────────────────────────────
const STATUS_ITEMS: { value: FilterStatus; label: string; icon: typeof Layers }[] = [
    { value: "All", label: "All Experiments", icon: Layers },
    { value: "Active", label: "Active", icon: Activity },
    { value: "Completed", label: "Completed", icon: CheckCircle2 },
    { value: "Planning", label: "Planning", icon: ClipboardList },
    { value: "Archived", label: "Archived", icon: Archive },
];

// ── Type filter config ──────────────────────────────────────────────────
const TYPE_ITEMS: {
    value: Exclude<FilterType, "All">;
    label: string;
    icon: typeof Monitor;
    dotColor: string;
    activeColor: string;
}[] = [
        { value: "Frontend", label: "Frontend", icon: Monitor, dotColor: "bg-purple-500", activeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30" },
        { value: "Backend", label: "Backend", icon: Server, dotColor: "bg-orange-500", activeColor: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30" },
        { value: "Full Stack", label: "Full Stack", icon: Boxes, dotColor: "bg-cyan-500", activeColor: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30" },
        { value: "AI/ML", label: "AI/ML", icon: Brain, dotColor: "bg-pink-500", activeColor: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/30" },
        { value: "Mobile", label: "Mobile", icon: Smartphone, dotColor: "bg-indigo-500", activeColor: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30" },
        { value: "DevOps", label: "DevOps", icon: Settings, dotColor: "bg-emerald-500", activeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" },
    ];

// ── Sort config ─────────────────────────────────────────────────────────
const SORT_ITEMS: { value: SortOption; label: string }[] = [
    { value: "Date", label: "Date" },
    { value: "Name", label: "Name" },
    { value: "Status", label: "Status" },
];

// Extract unique technologies
const ALL_TECHNOLOGIES = Array.from(
    new Set(EXPERIMENTS.flatMap(c => c.experiments.flatMap(e => e.technologies)))
).sort();

export default function ExperimentCanvas({
    activeExpId,
    onExpSelect,
}: ExperimentCanvasProps) {
    const [statusFilter, setStatusFilter] = useState<FilterStatus>("All");
    const [typeFilter, setTypeFilter] = useState<FilterType>("All");
    const [techFilter, setTechFilter] = useState<FilterTech>("All");
    const [sortOption, setSortOption] = useState<SortOption>("Date");
    const [sortDesc, setSortDesc] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active': return 'text-green-500';
            case 'Completed': return 'text-blue-500';
            case 'Archived': return 'text-gray-400';
            case 'Planning': return 'text-yellow-500';
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

    const filteredExperiments = useMemo(() => {
        const statusOrder: Record<string, number> = { Active: 0, Planning: 1, Completed: 2, Archived: 3 };
        return EXPERIMENTS.map((category) => {
            const filteredItems = category.experiments.filter((exp) => {
                if (searchQuery) {
                    const q = searchQuery.toLowerCase();
                    if (!exp.title.toLowerCase().includes(q) && !exp.description.toLowerCase().includes(q) && !exp.technologies.some(t => t.toLowerCase().includes(q))) return false;
                }
                if (statusFilter !== "All" && exp.status !== statusFilter) return false;
                if (typeFilter !== "All" && exp.type !== typeFilter) return false;
                if (techFilter !== "All" && !exp.technologies.includes(techFilter)) return false;
                return true;
            });

            const sorted = [...filteredItems].sort((a, b) => {
                let cmp = 0;
                if (sortOption === "Date") cmp = new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
                else if (sortOption === "Name") cmp = a.title.localeCompare(b.title);
                else if (sortOption === "Status") cmp = (statusOrder[a.status] ?? 9) - (statusOrder[b.status] ?? 9);
                return sortDesc ? -cmp : cmp;
            });

            return { ...category, experiments: sorted };
        }).filter((category) => category.experiments.length > 0);
    }, [statusFilter, typeFilter, techFilter, searchQuery, sortOption, sortDesc]);

    // Stats
    const allExperiments = EXPERIMENTS.flatMap(c => c.experiments);
    const totalCount = allExperiments.length;
    const activeCount = allExperiments.filter(e => e.status === 'Active').length;
    const completedCount = allExperiments.filter(e => e.status === 'Completed').length;

    return (
        <div className="relative h-full">
            {/* Top Fade */}
            <div className="pointer-events-none absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-card to-transparent z-10" />

            <div id="experiments-scroll-container" className="h-full overflow-y-auto thin-scrollbar overscroll-contain">
                <div className="max-w-7xl mx-auto px-8 md:px-12">
                    <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-10 min-h-full">

                        {/* ── Left column: Filters — sticky, vertically centered ── */}
                        <aside className="relative sticky top-0 h-screen hidden md:flex flex-col justify-center">
                            <div className="space-y-4 py-6 overflow-y-auto no-scrollbar max-h-[calc(100vh-10rem)]">

                                {/* Stats card */}
                                <div className="rounded-xl border border-border/40 bg-card/50 backdrop-blur-sm p-3.5 space-y-2">
                                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                                        <Beaker className="h-4 w-4 text-rose-500" />
                                        Overview
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-center">
                                        <div>
                                            <div className="text-lg font-bold text-foreground">{totalCount}</div>
                                            <div className="text-[10px] text-muted-foreground">Total</div>
                                        </div>
                                        <div>
                                            <div className="text-lg font-bold text-green-500">{activeCount}</div>
                                            <div className="text-[10px] text-muted-foreground">Active</div>
                                        </div>
                                        <div>
                                            <div className="text-lg font-bold text-blue-500">{completedCount}</div>
                                            <div className="text-[10px] text-muted-foreground">Done</div>
                                        </div>
                                    </div>
                                </div>

                                {/* ── Status ── */}
                                <div className="space-y-0.5">
                                    <h3 className="text-[10px] uppercase font-semibold text-muted-foreground/60 tracking-widest px-2 mb-1.5">
                                        Status
                                    </h3>
                                    {STATUS_ITEMS.map((item) => {
                                        const Icon = item.icon;
                                        const isActive = statusFilter === item.value;
                                        return (
                                            <button
                                                key={item.value}
                                                onClick={() => setStatusFilter(item.value)}
                                                className={cn(
                                                    "flex items-center gap-2.5 w-full px-2.5 py-1.5 rounded-lg text-sm transition-all",
                                                    isActive
                                                        ? "bg-primary/10 text-primary font-medium"
                                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/30",
                                                )}
                                            >
                                                <Icon
                                                    className={cn(
                                                        "h-3.5 w-3.5 shrink-0",
                                                        isActive ? "text-primary" : "text-muted-foreground/50",
                                                    )}
                                                />
                                                <span className="truncate">{item.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* ── Type ── */}
                                <div className="space-y-1">
                                    <h3 className="text-[10px] uppercase font-semibold text-muted-foreground/60 tracking-widest px-2 mb-1.5">
                                        Type
                                    </h3>
                                    <div className="flex gap-1.5 flex-wrap">
                                        {TYPE_ITEMS.map((item) => {
                                            const isActive = typeFilter === item.value;
                                            return (
                                                <button
                                                    key={item.value}
                                                    onClick={() => setTypeFilter(isActive ? "All" : item.value)}
                                                    className={cn(
                                                        "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all",
                                                        isActive
                                                            ? item.activeColor
                                                            : "border-transparent text-muted-foreground hover:bg-muted/30 hover:text-foreground",
                                                    )}
                                                >
                                                    <div className={cn("h-1.5 w-1.5 rounded-full", item.dotColor)} />
                                                    {item.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* ── Technologies ── */}
                                <div className="space-y-1">
                                    <h3 className="text-[10px] uppercase font-semibold text-muted-foreground/60 tracking-widest px-2 mb-1.5 flex items-center gap-1.5">
                                        <Tag className="h-3 w-3" />
                                        Tech Stack
                                    </h3>
                                    <div className="flex gap-1 flex-wrap">
                                        {ALL_TECHNOLOGIES.slice(0, 12).map((tech) => {
                                            const isActive = techFilter === tech;
                                            return (
                                                <button
                                                    key={tech}
                                                    onClick={() => setTechFilter(isActive ? "All" : tech)}
                                                    className={cn(
                                                        "px-2 py-0.5 rounded-md text-[11px] font-medium border transition-all",
                                                        isActive
                                                            ? "bg-primary/10 text-primary border-primary/30"
                                                            : "border-transparent text-muted-foreground/70 hover:bg-muted/30 hover:text-foreground",
                                                    )}
                                                >
                                                    {tech}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* ── Sort ── */}
                                <div className="space-y-1">
                                    <h3 className="text-[10px] uppercase font-semibold text-muted-foreground/60 tracking-widest px-2 mb-1.5 flex items-center gap-1.5">
                                        <ArrowUpDown className="h-3 w-3" />
                                        Sort by
                                    </h3>
                                    <div className="space-y-0.5">
                                        {SORT_ITEMS.map((item) => {
                                            const isActive = sortOption === item.value;
                                            return (
                                                <button
                                                    key={item.value}
                                                    onClick={() => {
                                                        if (isActive) setSortDesc(!sortDesc);
                                                        else { setSortOption(item.value); setSortDesc(true); }
                                                    }}
                                                    className={cn(
                                                        "flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg text-sm transition-all",
                                                        isActive
                                                            ? "bg-primary/10 text-primary font-medium"
                                                            : "text-muted-foreground hover:text-foreground hover:bg-muted/30",
                                                    )}
                                                >
                                                    <span>{item.label}</span>
                                                    {isActive ? (
                                                        sortDesc ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />
                                                    ) : (
                                                        <ArrowUpDown className="h-3 w-3 opacity-30" />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* ── Right column: Search + Experiments ── */}
                        <div className="space-y-4 pb-48 pt-8">
                            {/* Sticky search bar */}
                            <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm py-4">
                                <SearchBar
                                    query={searchQuery}
                                    onQueryChange={setSearchQuery}
                                    placeholder="Search experiments, tech..."
                                />
                            </div>

                            {filteredExperiments.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    <Beaker className="h-12 w-12 mx-auto mb-3 opacity-40" />
                                    <p className="text-lg font-medium">No experiments match your filters</p>
                                    <p className="text-sm mt-1">Try adjusting your filters to see more experiments</p>
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
                                        <div className="sticky top-16 z-10 bg-background/95 py-4 backdrop-blur">
                                            <h2 className="text-lg font-semibold">{category.categoryName}</h2>
                                            <p className="text-sm text-muted-foreground">
                                                {category.experiments.length} experiments
                                            </p>
                                        </div>

                                        <div className="space-y-0">
                                            {category.experiments.map((exp) => {
                                                const isActive = activeExpId === exp.id;
                                                return (
                                                    <button
                                                        key={exp.id}
                                                        onClick={(e) => onExpSelect(exp.id, e)}
                                                        className={cn(
                                                            "group relative w-full border-b border-border/40 px-4 py-3 text-left backdrop-blur-md",
                                                            "transition-all hover:bg-linear-to-r hover:from-white/5 hover:to-white/10 dark:hover:from-white/5 dark:hover:to-white/10",
                                                            isActive && "bg-white/10 dark:bg-white/10"
                                                        )}
                                                    >
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2">
                                                                    <Beaker className={`h-4 w-4 ${getStatusColor(exp.status)}`} />
                                                                    <div className={`text-sm font-medium transition-colors ${isActive ? "text-primary" : "text-foreground group-hover:text-primary"}`}>
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
                                                                        <span key={tech} className="text-xs text-muted-foreground/50">
                                                                            • {tech}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            {/* Hover Info */}
                                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3 opacity-0 transition-opacity group-hover:opacity-100">
                                                                {exp.githubUrl && <GitBranch className="h-4 w-4 text-muted-foreground" />}
                                                                {exp.demoUrl && <ExternalLink className="h-4 w-4 text-muted-foreground" />}
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
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-card to-transparent z-10" />
        </div>
    );
}
