// app/lab/hackathons/components/HackathonCanvas.tsx
"use client";

import { useState, useMemo } from "react";
import { HACKATHONS, HackathonStatus, HackathonType, HackathonPrize } from "../data/hackathons";
import {
    Trophy, Calendar, Users, MapPin, Globe, Wifi, Building,
    Layers, Clock, CheckCircle2, Ban, CalendarCheck,
    ArrowUpDown, ChevronDown, ChevronUp,
    DollarSign, Gift, Briefcase, CreditCard, CircleOff,
    Tag
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchBar } from "@/app/lab/practice/components/browse/SearchBar";

interface HackathonCanvasProps {
    activeHackId: string | null;
    onHackSelect: (id: string, event: React.MouseEvent) => void;
}

type FilterStatus = "All" | HackathonStatus;
type FilterType = "All" | HackathonType;
type FilterPrize = "All" | HackathonPrize;
type SortOption = "Date" | "Name" | "Team Size";

// ── Status filter config ────────────────────────────────────────────────
const STATUS_ITEMS: { value: FilterStatus; label: string; icon: typeof Layers }[] = [
    { value: "All", label: "All Hackathons", icon: Layers },
    { value: "Upcoming", label: "Upcoming", icon: Clock },
    { value: "Registered", label: "Registered", icon: CalendarCheck },
    { value: "In Progress", label: "In Progress", icon: Wifi },
    { value: "Completed", label: "Completed", icon: CheckCircle2 },
    { value: "Missed", label: "Missed", icon: Ban },
];

// ── Type filter config ──────────────────────────────────────────────────
const TYPE_ITEMS: { value: FilterType; label: string; icon: typeof Globe; dotColor: string; activeColor: string }[] = [
    { value: "Online", label: "Online", icon: Globe, dotColor: "bg-blue-500", activeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30" },
    { value: "In-Person", label: "In-Person", icon: Building, dotColor: "bg-orange-500", activeColor: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30" },
    { value: "Hybrid", label: "Hybrid", icon: Wifi, dotColor: "bg-purple-500", activeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30" },
];

// ── Prize filter config ─────────────────────────────────────────────────
const PRIZE_ITEMS: { value: FilterPrize; label: string; icon: typeof DollarSign }[] = [
    { value: "Cash", label: "Cash", icon: DollarSign },
    { value: "Swag", label: "Swag", icon: Gift },
    { value: "Job Opportunity", label: "Job Opp.", icon: Briefcase },
    { value: "Credits", label: "Credits", icon: CreditCard },
    { value: "None", label: "None", icon: CircleOff },
];

// ── Sort config ─────────────────────────────────────────────────────────
const SORT_ITEMS: { value: SortOption; label: string }[] = [
    { value: "Date", label: "Date" },
    { value: "Name", label: "Name" },
    { value: "Team Size", label: "Team Size" },
];

export default function HackathonCanvas({
    activeHackId,
    onHackSelect,
}: HackathonCanvasProps) {
    const [statusFilter, setStatusFilter] = useState<FilterStatus>("All");
    const [typeFilter, setTypeFilter] = useState<FilterType>("All");
    const [prizeFilter, setPrizeFilter] = useState<FilterPrize>("All");
    const [sortOption, setSortOption] = useState<SortOption>("Date");
    const [sortDesc, setSortDesc] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Upcoming': return 'text-blue-500';
            case 'Registered': return 'text-green-500';
            case 'In Progress': return 'text-yellow-500';
            case 'Completed': return 'text-purple-500';
            case 'Missed': return 'text-gray-400';
            default: return 'text-muted-foreground';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'Online': return '🌐';
            case 'In-Person': return '📍';
            case 'Hybrid': return '🔀';
            default: return '';
        }
    };

    const filteredHackathons = useMemo(() => {
        return HACKATHONS.map((monthGroup) => {
            const filteredItems = monthGroup.hackathons.filter((h) => {
                if (searchQuery) {
                    const q = searchQuery.toLowerCase();
                    if (!h.name.toLowerCase().includes(q) && !h.organizer.toLowerCase().includes(q) && !h.themes?.some(t => t.toLowerCase().includes(q))) return false;
                }
                if (statusFilter !== "All" && h.status !== statusFilter) return false;
                if (typeFilter !== "All" && h.type !== typeFilter) return false;
                if (prizeFilter !== "All" && !h.prizes?.includes(prizeFilter)) return false;
                return true;
            });

            // Sort
            const sorted = [...filteredItems].sort((a, b) => {
                let cmp = 0;
                if (sortOption === "Date") cmp = new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
                else if (sortOption === "Name") cmp = a.name.localeCompare(b.name);
                else if (sortOption === "Team Size") cmp = (parseInt(a.teamSize || "1") || 1) - (parseInt(b.teamSize || "1") || 1);
                return sortDesc ? -cmp : cmp;
            });

            return { ...monthGroup, hackathons: sorted };
        }).filter((m) => m.hackathons.length > 0);
    }, [statusFilter, typeFilter, prizeFilter, searchQuery, sortOption, sortDesc]);

    // Stats
    const allHackathons = HACKATHONS.flatMap(m => m.hackathons);
    const totalCount = allHackathons.length;
    const completedCount = allHackathons.filter(h => h.status === 'Completed').length;
    const wonCount = allHackathons.filter(h => h.result?.placement?.includes('Best') || h.result?.placement?.includes('Top') || h.result?.placement?.includes('Won')).length;

    return (
        <div className="relative h-full">
            {/* Top Fade */}
            <div className="pointer-events-none absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-background to-transparent z-10" />

            <div id="hackathons-scroll-container" className="h-full overflow-y-auto thin-scrollbar overscroll-contain">
                <div className="max-w-7xl mx-auto px-8 md:px-12">
                    <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-10 min-h-full">

                        {/* ── Left column: Filters — sticky, vertically centered ── */}
                        <aside className="relative sticky top-0 h-screen hidden md:flex flex-col justify-center">
                            <div className="space-y-4 py-6 overflow-y-auto no-scrollbar max-h-[calc(100vh-4rem)]">

                                {/* Stats card */}
                                <div className="rounded-xl border border-border/40 bg-card/50 backdrop-blur-sm p-3.5 space-y-2">
                                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                                        <Trophy className="h-4 w-4 text-amber-500" />
                                        Overview
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-center">
                                        <div>
                                            <div className="text-lg font-bold text-foreground">{totalCount}</div>
                                            <div className="text-[10px] text-muted-foreground">Total</div>
                                        </div>
                                        <div>
                                            <div className="text-lg font-bold text-purple-500">{completedCount}</div>
                                            <div className="text-[10px] text-muted-foreground">Done</div>
                                        </div>
                                        <div>
                                            <div className="text-lg font-bold text-amber-500">{wonCount}</div>
                                            <div className="text-[10px] text-muted-foreground">Won</div>
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
                                        Format
                                    </h3>
                                    <div className="flex gap-1.5">
                                        {TYPE_ITEMS.map((item) => {
                                            const isActive = typeFilter === item.value;
                                            return (
                                                <button
                                                    key={item.value}
                                                    onClick={() => setTypeFilter(isActive ? "All" : item.value)}
                                                    className={cn(
                                                        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex-1 justify-center",
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

                                {/* ── Prizes ── */}
                                <div className="space-y-1">
                                    <h3 className="text-[10px] uppercase font-semibold text-muted-foreground/60 tracking-widest px-2 mb-1.5">
                                        Prizes
                                    </h3>
                                    <div className="flex gap-1.5 flex-wrap">
                                        {PRIZE_ITEMS.map((item) => {
                                            const Icon = item.icon;
                                            const isActive = prizeFilter === item.value;
                                            return (
                                                <button
                                                    key={item.value}
                                                    onClick={() => setPrizeFilter(isActive ? "All" : item.value)}
                                                    className={cn(
                                                        "px-2.5 py-1 rounded-lg text-xs font-medium border transition-all flex items-center gap-1",
                                                        isActive
                                                            ? "bg-primary/10 text-primary border-primary/30"
                                                            : "border-transparent text-muted-foreground hover:bg-muted/30 hover:text-foreground",
                                                    )}
                                                >
                                                    <Icon className="h-3 w-3" />
                                                    {item.label}
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

                        {/* ── Right column: Search + Hackathons ── */}
                        <div className="space-y-4 pb-48 pt-8">
                            {/* Sticky search bar */}
                            <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm py-4">
                                <SearchBar
                                    query={searchQuery}
                                    onQueryChange={setSearchQuery}
                                    onRandom={(e) => {
                                        const pool = filteredHackathons.flatMap((m) => m.hackathons);
                                        if (pool.length === 0) return;
                                        const pick = pool[Math.floor(Math.random() * pool.length)];
                                        onHackSelect(pick.id, e as unknown as React.MouseEvent);
                                    }}
                                />
                            </div>

                            {filteredHackathons.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    <Trophy className="h-12 w-12 mx-auto mb-3 opacity-40" />
                                    <p className="text-lg font-medium">No hackathons match your filters</p>
                                    <p className="text-sm mt-1">Try adjusting your filters to see more events</p>
                                </div>
                            ) : (
                                filteredHackathons.map((monthGroup) => (
                                    <section
                                        key={monthGroup.month}
                                        id={monthGroup.month}
                                        data-category
                                        data-category-title={monthGroup.month}
                                        className="space-y-5"
                                    >
                                        <div className="sticky top-16 z-10 bg-background/95 py-4 backdrop-blur">
                                            <h2 className="text-lg font-semibold">{monthGroup.month}</h2>
                                            <p className="text-sm text-muted-foreground">
                                                {monthGroup.hackathons.length} hackathons
                                            </p>
                                        </div>

                                        <div className="space-y-1">
                                            {monthGroup.hackathons.map((hackathon) => {
                                                const isActive = activeHackId === hackathon.id;
                                                return (
                                                    <button
                                                        key={hackathon.id}
                                                        onClick={(e) => onHackSelect(hackathon.id, e)}
                                                        className={`group relative w-full rounded-xl border border-border/40 px-4 py-4 text-left transition-all backdrop-blur-md hover:bg-white/50 dark:hover:bg-zinc-900/30 hover:shadow-sm hover:border-zinc-200/60 dark:hover:border-zinc-800/60 mb-2 ${isActive ? "bg-white/50 dark:bg-zinc-900/30 border-zinc-200/60 dark:border-zinc-800/60 shadow-sm" : ""}`}
                                                    >
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2">
                                                                    <Trophy className={`h-4 w-4 ${getStatusColor(hackathon.status)}`} />
                                                                    <span className={`text-sm font-medium transition-colors ${activeHackId === hackathon.id ? "text-primary" : "text-foreground group-hover:text-primary"}`}>
                                                                        {hackathon.name}
                                                                    </span>
                                                                </div>
                                                                <p className="text-xs text-muted-foreground/70 line-clamp-1 pl-6">
                                                                    {hackathon.organizer} • {hackathon.description}
                                                                </p>
                                                                <div className="flex flex-wrap gap-2 text-[11px] font-medium text-muted-foreground pl-6">
                                                                    <span className={getStatusColor(hackathon.status)}>
                                                                        {hackathon.status}
                                                                    </span>
                                                                    <span className="text-muted-foreground/50">
                                                                        • {getTypeIcon(hackathon.type)} {hackathon.type}
                                                                    </span>
                                                                    {hackathon.teamSize && (
                                                                        <span className="flex items-center gap-0.5 text-muted-foreground/50">
                                                                            • <Users className="h-3 w-3" /> {hackathon.teamSize}
                                                                        </span>
                                                                    )}
                                                                    {hackathon.themes?.slice(0, 2).map((theme) => (
                                                                        <span key={theme} className="text-muted-foreground/50">
                                                                            • {theme}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            {/* Hover info */}
                                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3 opacity-0 transition-opacity group-hover:opacity-100">
                                                                <div className="flex items-center gap-1 text-xs text-muted-foreground/50">
                                                                    <Calendar className="h-3 w-3" />
                                                                    {hackathon.startDate}
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
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-background to-transparent z-10" />
        </div>
    );
}
