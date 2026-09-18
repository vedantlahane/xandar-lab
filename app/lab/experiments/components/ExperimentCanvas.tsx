// app/lab/experiments/components/ExperimentCanvas.tsx
"use client";

import { useState, useMemo } from "react";
import { EXPERIMENTS as DEFAULT_STATIC_EXPERIMENTS, ExperimentStatus, ExperimentType } from "../data/experiments";
import {
    Beaker, Calendar, GitBranch, ExternalLink,
    Layers, Activity, CheckCircle2, Archive, ClipboardList,
    Monitor, Server, Boxes, Brain, Smartphone, Settings,
    Tag, Plus, Lock, Globe, User as UserIcon, Users,
    Pin, Star, AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/app/lab/practice/components/browse/SearchBar";
import { BaseCanvas } from "@/app/lab/components/shared/BaseCanvas";
import { LabItemRow } from "@/app/lab/components/shared/LabItemRow";
import { CanvasSortSelect } from "@/app/lab/components/shared/CanvasSortSelect";
import { CanvasStatsCard } from "@/app/lab/components/shared/CanvasStatsCard";
import { useAuth } from "@/components/auth/AuthContext";
import { RoleBadge } from "@/components/shared/RoleBadge";

interface ExperimentCanvasProps {
    experiments?: any[];
    activeTab?: "all" | "my" | "community";
    onTabChange?: (tab: "all" | "my" | "community") => void;
    onNewExperiment?: () => void;
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

function getCategoryForExperiment(exp: any): string {
    if (exp.categoryName) return exp.categoryName;
    if (exp.type === "AI/ML") return "Machine Learning & AI";
    if (exp.type === "DevOps") return "Systems & DevOps";
    if (exp.type === "Mobile") return "Mobile & Other";
    return "Web Development";
}

const CATEGORY_NAMES = [
    "Web Development",
    "Machine Learning & AI",
    "Systems & DevOps",
    "Mobile & Other",
];

export default function ExperimentCanvas({
    experiments: propExperiments,
    activeTab = "all",
    onTabChange,
    onNewExperiment,
    activeExpId,
    onExpSelect,
}: ExperimentCanvasProps) {
    const { isAuthenticated, openLoginModal } = useAuth();
    const [statusFilter, setStatusFilter] = useState<FilterStatus>("All");
    const [typeFilter, setTypeFilter] = useState<FilterType>("All");
    const [techFilter, setTechFilter] = useState<FilterTech>("All");
    const [sortOption, setSortOption] = useState<SortOption>("Date");
    const [sortDesc, setSortDesc] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const sourceExperiments = useMemo(() => {
        if (propExperiments && propExperiments.length > 0) return propExperiments;
        return DEFAULT_STATIC_EXPERIMENTS.flatMap((c) => c.experiments);
    }, [propExperiments]);

    // Unique technologies across loaded experiments
    const allTechnologies = useMemo(() => {
        return Array.from(
            new Set(
                sourceExperiments.flatMap((e: any) =>
                    e.technologies || e.techStack || []
                )
            )
        ).sort();
    }, [sourceExperiments]);

    // Grouping
    const experimentGroups = useMemo(() => {
        const groups: { categoryName: string; experiments: any[] }[] = [];

        for (const catName of CATEGORY_NAMES) {
            const exps = sourceExperiments.filter(
                (e: any) => getCategoryForExperiment(e) === catName
            );
            if (exps.length > 0) {
                groups.push({ categoryName: catName, experiments: exps });
            }
        }

        // Catch any remaining
        const unassigned = sourceExperiments.filter(
            (e: any) => !CATEGORY_NAMES.includes(getCategoryForExperiment(e))
        );
        if (unassigned.length > 0) {
            groups.push({ categoryName: "Other Projects", experiments: unassigned });
        }

        return groups;
    }, [sourceExperiments]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Active": return "text-green-500";
            case "Completed": return "text-blue-500";
            case "Archived": return "text-muted-foreground";
            case "Planning": return "text-yellow-500";
            default: return "text-muted-foreground";
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case "Frontend": return "text-purple-400";
            case "Backend": return "text-orange-400";
            case "Full Stack": return "text-cyan-400";
            case "AI/ML": return "text-pink-400";
            case "Mobile": return "text-indigo-400";
            case "DevOps": return "text-emerald-400";
            default: return "text-muted-foreground";
        }
    };

    const filteredExperiments = useMemo(() => {
        const statusOrder: Record<string, number> = { Active: 0, Planning: 1, Completed: 2, Archived: 3 };
        return experimentGroups.map((category) => {
            const filteredItems = category.experiments.filter((exp: any) => {
                const techs: string[] = exp.technologies || exp.techStack || [];
                if (searchQuery) {
                    const q = searchQuery.toLowerCase();
                    if (
                        !exp.title.toLowerCase().includes(q) &&
                        !exp.description.toLowerCase().includes(q) &&
                        !techs.some((t) => t.toLowerCase().includes(q))
                    ) {
                        return false;
                    }
                }
                if (statusFilter !== "All" && exp.status !== statusFilter) return false;
                if (typeFilter !== "All" && exp.type !== typeFilter) return false;
                if (techFilter !== "All" && !techs.includes(techFilter)) return false;
                return true;
            });

            const sorted = [...filteredItems].sort((a: any, b: any) => {
                let cmp = 0;
                if (sortOption === "Date") {
                    const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
                    const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
                    cmp = dateA - dateB;
                } else if (sortOption === "Name") {
                    cmp = a.title.localeCompare(b.title);
                } else if (sortOption === "Status") {
                    cmp = (statusOrder[a.status] ?? 9) - (statusOrder[b.status] ?? 9);
                }
                return sortDesc ? -cmp : cmp;
            });

            return { ...category, experiments: sorted };
        }).filter((category) => category.experiments.length > 0);
    }, [experimentGroups, statusFilter, typeFilter, techFilter, searchQuery, sortOption, sortDesc]);

    // Stats
    const totalCount = sourceExperiments.length;
    const activeCount = sourceExperiments.filter((e: any) => e.status === "Active").length;
    const completedCount = sourceExperiments.filter((e: any) => e.status === "Completed").length;

    const handleCreateClick = () => {
        if (!isAuthenticated) {
            openLoginModal();
            return;
        }
        if (onNewExperiment) onNewExperiment();
    };

    return (
        <BaseCanvas
            scrollId="experiments-scroll-container"
            sidebarContent={
                <>
                    {/* Stats card */}
                    <CanvasStatsCard
                        icon={Beaker}
                        iconColor="text-rose-500"
                        stats={[
                            { label: "Total", value: totalCount },
                            { label: "Active", value: activeCount, color: "text-green-500" },
                            { label: "Done", value: completedCount, color: "text-blue-500" },
                        ]}
                    />

                    {/* Feed Selector (All / Mine / Public) */}
                    <div className="space-y-0.5">
                        <h3 className="text-[10px] uppercase font-semibold text-muted-foreground/60 tracking-widest px-2 mb-1.5 flex items-center justify-between">
                            <span>Feed</span>
                        </h3>
                        <button
                            onClick={() => onTabChange?.("all")}
                            className={cn(
                                "flex items-center gap-2.5 w-full px-2.5 py-1.5 rounded-lg text-sm transition-all",
                                activeTab === "all"
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                            )}
                        >
                            <Globe className="h-4 w-4 opacity-70" />
                            All
                        </button>
                        <button
                            onClick={() => {
                                if (!isAuthenticated) {
                                    openLoginModal();
                                    return;
                                }
                                onTabChange?.("my");
                            }}
                            className={cn(
                                "flex items-center gap-2.5 w-full px-2.5 py-1.5 rounded-lg text-sm transition-all",
                                activeTab === "my"
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                            )}
                        >
                            <UserIcon className="h-4 w-4 opacity-70" />
                            Mine
                        </button>
                        <button
                            onClick={() => onTabChange?.("community")}
                            className={cn(
                                "flex items-center gap-2.5 w-full px-2.5 py-1.5 rounded-lg text-sm transition-all",
                                activeTab === "community"
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                            )}
                        >
                            <Users className="h-4 w-4 opacity-70" />
                            Public
                        </button>
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
                    <div className="space-y-0.5">
                        <h3 className="text-[10px] uppercase font-semibold text-muted-foreground/60 tracking-widest px-2 mb-1.5">
                            Domain Type
                        </h3>
                        <button
                            onClick={() => setTypeFilter("All")}
                            className={cn(
                                "flex items-center gap-2.5 w-full px-2.5 py-1.5 rounded-lg text-sm transition-all",
                                typeFilter === "All"
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30",
                            )}
                        >
                            <span className="h-2 w-2 rounded-full bg-muted-foreground shrink-0" />
                            <span>All Types</span>
                        </button>
                        {TYPE_ITEMS.map((item) => {
                            const isActive = typeFilter === item.value;
                            return (
                                <button
                                    key={item.value}
                                    onClick={() => setTypeFilter(item.value)}
                                    className={cn(
                                        "flex items-center gap-2.5 w-full px-2.5 py-1.5 rounded-lg text-sm transition-all",
                                        isActive
                                            ? item.activeColor + " font-medium"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted/30",
                                    )}
                                >
                                    <span className={cn("h-2 w-2 rounded-full shrink-0", item.dotColor)} />
                                    <span className="truncate">{item.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* ── Technologies ── */}
                    {allTechnologies.length > 0 && (
                        <div className="space-y-1">
                            <h3 className="text-[10px] uppercase font-semibold text-muted-foreground/60 tracking-widest px-2 mb-1.5 flex items-center gap-1.5">
                                <Tag className="h-3 w-3" />
                                Tech Stack
                            </h3>
                            <div className="flex gap-1 flex-wrap">
                                {allTechnologies.slice(0, 14).map((tech) => {
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
                    )}

                    {/* ── Sort ── */}
                    <CanvasSortSelect
                        items={SORT_ITEMS}
                        currentSort={sortOption}
                        sortDesc={sortDesc}
                        onSortChange={setSortOption}
                        onSortDescChange={setSortDesc}
                    />
                </>
            }
        >
            {/* Sticky search bar + New Experiment button */}
            <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm py-2.5 sm:py-4 flex items-center gap-2.5">
                <div className="flex-1">
                    <SearchBar
                        query={searchQuery}
                        onQueryChange={setSearchQuery}
                        placeholder="Search experiments, tech..."
                    />
                </div>
                <Button
                    onClick={handleCreateClick}
                    className="shrink-0 h-10 px-3.5 gap-1.5 rounded-xl bg-primary text-primary-foreground font-medium shadow-sm hover:opacity-95 transition-all text-xs sm:text-sm"
                >
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">New Experiment</span>
                </Button>
            </div>

            {filteredExperiments.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                    <Beaker className="h-12 w-12 mx-auto mb-3 opacity-40" />
                    <p className="text-lg font-medium text-foreground">No experiments found</p>
                    <p className="text-sm mt-1 mb-5">
                        {activeTab === "my"
                            ? "You haven't added any experiments yet. Click below to publish one!"
                            : "Try adjusting your filters to see more experiments."}
                    </p>
                    {activeTab === "my" && (
                        <Button onClick={handleCreateClick} size="sm" className="gap-1.5">
                            <Plus className="h-4 w-4" /> Create First Experiment
                        </Button>
                    )}
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
                        <div className="sticky top-16 z-10 bg-background/95 py-4 backdrop-blur flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold">{category.categoryName}</h2>
                                <p className="text-xs text-muted-foreground">
                                    {category.experiments.length} {category.experiments.length === 1 ? "experiment" : "experiments"}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-0">
                            {category.experiments.map((exp: any) => {
                                const isActive = activeExpId === exp.id;
                                const techs: string[] = exp.technologies || exp.techStack || [];
                                const hasPendingChanges = exp.changeRequests?.some((r: any) => r.status === "pending");
                                return (
                                    <LabItemRow
                                        key={exp.id}
                                        id={exp.id}
                                        isActive={isActive}
                                        onClick={onExpSelect}
                                        title={exp.title}
                                        titleIcon={
                                            <>
                                                <Beaker className={cn("h-4 w-4 shrink-0", getStatusColor(exp.status))} />
                                                {exp.isPinned && <Pin className="h-3 w-3 text-amber-500 fill-current" />}
                                                {exp.isCurated && <Star className="h-3 w-3 text-amber-400 fill-current" />}
                                            </>
                                        }
                                        subtitle={exp.description}
                                        tags={
                                            <>
                                                <span className={getStatusColor(exp.status)}>
                                                    {exp.status}
                                                </span>
                                                <span className={getTypeColor(exp.type)}>
                                                    • {exp.type}
                                                </span>
                                                {hasPendingChanges && (
                                                    <span className="text-amber-500 font-medium">
                                                        • Revision needed
                                                    </span>
                                                )}
                                                {exp.authorUsername && activeTab !== "my" && (
                                                    <span className="inline-flex items-center gap-1 text-muted-foreground/60">
                                                        • @{exp.authorUsername}
                                                    </span>
                                                )}
                                                {exp.visibility === "private" && (
                                                    <span className="inline-flex items-center gap-0.5 text-muted-foreground/60">
                                                        • <Lock className="h-2.5 w-2.5" /> Private
                                                    </span>
                                                )}
                                                {techs.slice(0, 3).map((tech) => (
                                                    <span key={tech} className="text-muted-foreground/40">
                                                        • {tech}
                                                    </span>
                                                ))}
                                            </>
                                        }
                                        hoverContent={
                                            <>
                                                {exp.githubUrl && <GitBranch className="h-4 w-4 text-muted-foreground" />}
                                                {(exp.demoUrl || exp.liveUrl) && <ExternalLink className="h-4 w-4 text-muted-foreground" />}
                                                <div className="flex items-center gap-1 text-xs text-muted-foreground/50">
                                                    <Calendar className="h-3 w-3" />
                                                    {exp.startDate || "Recently"}
                                                </div>
                                            </>
                                        }
                                    />
                                );
                            })}
                        </div>
                    </section>
                ))
            )}
        </BaseCanvas>
    );
}
