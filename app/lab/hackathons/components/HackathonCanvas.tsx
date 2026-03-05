"use client";

import { useState, useMemo } from "react";
import { HACKATHONS, HackathonStatus, HackathonType } from "../data/hackathons";
import { Trophy, Calendar, Users, MapPin, Globe, Navigation, RotateCcw, CircleDot } from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchBar } from "@/app/lab/practice/components/browse/SearchBar";

interface HackathonCanvasProps {
    activeHackId: string | null;
    onHackSelect: (id: string, event: React.MouseEvent) => void;
}

type FilterStatus = "All" | HackathonStatus;
type FilterType = "All" | HackathonType;

export default function HackathonCanvas({
    activeHackId,
    onHackSelect,
}: HackathonCanvasProps) {
    const [statusFilter, setStatusFilter] = useState<FilterStatus>("All");
    const [typeFilter, setTypeFilter] = useState<FilterType>("All");
    const [searchQuery, setSearchQuery] = useState("");

    const statuses: FilterStatus[] = ["All", "Upcoming", "Registered", "In Progress", "Completed", "Missed"];
    const types: FilterType[] = ["All", "Online", "In-Person", "Hybrid"];

    const filteredHackathons = useMemo(() => {
        return HACKATHONS.map((monthData) => {
            const filteredItems = monthData.hackathons.filter((hack) => {
                if (
                    searchQuery &&
                    !hack.name.toLowerCase().includes(searchQuery.toLowerCase())
                ) {
                    return false;
                }
                if (statusFilter !== "All" && hack.status !== statusFilter) return false;
                if (typeFilter !== "All" && hack.type !== typeFilter) return false;
                return true;
            });

            return {
                ...monthData,
                hackathons: filteredItems,
            };
        }).filter((monthData) => monthData.hackathons.length > 0);
    }, [statusFilter, typeFilter, searchQuery]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Upcoming': return 'text-blue-400';
            case 'Registered': return 'text-green-400';
            case 'In Progress': return 'text-yellow-400';
            case 'Completed': return 'text-purple-400';
            case 'Missed': return 'text-gray-400';
            default: return 'text-muted-foreground';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'Online': return '🌐';
            case 'In-Person': return '📍';
            case 'Hybrid': return '🔄';
            default: return '📅';
        }
    };

    return (
        <div className="relative h-full pt-12">
            {/* Top Fade */}
            <div className="pointer-events-none absolute top-0 left-0 right-0 h-12 bg-linear-to-b from-card to-transparent z-20" />

            <div id="hackathons-scroll-container" className="h-full overflow-y-auto">
                <div className="max-w-7xl mx-auto px-8 md:px-12 pb-48 pt-12">
                    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-12">
                        {/* Left Column: Filters */}
                        <div className="hidden md:block">
                            <div className="sticky top-32 space-y-4">
                                <div className="space-y-0.5">
                                    <h3 className="text-[10px] uppercase font-semibold text-muted-foreground/60 tracking-widest px-2 mb-1.5">
                                        Status
                                    </h3>
                                    {statuses.map((filter) => {
                                        const isActive = statusFilter === filter;
                                        return (
                                            <button
                                                key={filter}
                                                onClick={() => setStatusFilter(filter)}
                                                className={cn(
                                                    "w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-sm transition-all text-left",
                                                    isActive
                                                        ? "bg-primary/10 text-primary font-medium"
                                                        : "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
                                                )}
                                            >
                                                <div className={cn(
                                                    "h-1.5 w-1.5 rounded-full shrink-0",
                                                    filter === "All" && "bg-muted-foreground",
                                                    filter === "Upcoming" && "bg-blue-500",
                                                    filter === "Registered" && "bg-green-500",
                                                    filter === "In Progress" && "bg-yellow-500",
                                                    filter === "Completed" && "bg-purple-500",
                                                    filter === "Missed" && "bg-gray-400",
                                                )} />
                                                {filter === "All" ? "All Hackathons" : filter}
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="space-y-1">
                                    <h3 className="text-[10px] uppercase font-semibold text-muted-foreground/60 tracking-widest px-2 mb-1.5">
                                        Type
                                    </h3>
                                    <div className="flex gap-1.5 flex-wrap px-1">
                                        {types.map((filter) => {
                                            const isActive = typeFilter === filter;
                                            return (
                                                <button
                                                    key={filter}
                                                    onClick={() => setTypeFilter(typeFilter === filter ? "All" : filter)}
                                                    className={cn(
                                                        "px-3 py-1 rounded-lg text-xs font-medium border transition-all",
                                                        isActive
                                                            ? "bg-primary/10 text-primary border-primary/30"
                                                            : "border-border/40 text-muted-foreground hover:bg-muted/30 hover:text-foreground",
                                                    )}
                                                >
                                                    {filter === "All" ? "All" : `${getTypeIcon(filter)} ${filter}`}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="pt-3 border-t border-border/40 space-y-1.5">
                                    <h3 className="text-[10px] uppercase font-semibold text-muted-foreground/60 tracking-widest px-2 mb-1.5">
                                        Stats
                                    </h3>
                                    <div className="space-y-1 text-xs text-muted-foreground px-2">
                                        <div className="flex items-center justify-between">
                                            <span>Total</span>
                                            <span className="font-mono">{HACKATHONS.reduce((acc, m) => acc + m.hackathons.length, 0)}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Completed</span>
                                            <span className="font-mono">{HACKATHONS.reduce((acc, m) => acc + m.hackathons.filter(h => h.status === 'Completed').length, 0)}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Won</span>
                                            <span className="font-mono">{HACKATHONS.reduce((acc, m) => acc + m.hackathons.filter(h => h.result?.placement?.includes('Best') || h.result?.placement?.includes('Top') || h.result?.placement?.includes('Won')).length, 0)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Hackathons */}
                        <div className="space-y-3">
                            {/* sticky header with search */}
                            <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm py-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold">Hackathons</h2>
                                    <div className="flex-1 ml-6">
                                        <SearchBar
                                            query={searchQuery}
                                            onQueryChange={setSearchQuery}
                                            onRandom={() => {
                                                const pool = filteredHackathons.flatMap((m) => m.hackathons);
                                                if (pool.length === 0) return;
                                                const pick = pool[Math.floor(Math.random() * pool.length)];
                                                onHackSelect(pick.id, new MouseEvent('click') as unknown as React.MouseEvent);
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            {filteredHackathons.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    No hackathons match your filters.
                                </div>
                            ) : (
                                filteredHackathons.map((monthData) => (
                                    <section
                                        key={monthData.month}
                                        id={monthData.month}
                                        data-month
                                        data-month-title={monthData.month}
                                        className="space-y-5"
                                    >
                                        <div className="sticky top-0 z-10 bg-background/95 py-4 backdrop-blur">
                                            <h2 className="text-lg font-semibold">{monthData.month}</h2>
                                            <p className="text-sm text-muted-foreground">
                                                {monthData.hackathons.length} hackathon{monthData.hackathons.length !== 1 ? 's' : ''}
                                            </p>
                                        </div>

                                        <div className="space-y-1">
                                            {monthData.hackathons.map((hack) => {
                                                const isActive = activeHackId === hack.id;
                                                return (
                                                    <button
                                                        key={hack.id}
                                                        onClick={(e) => onHackSelect(hack.id, e)}
                                                        className={`group relative w-full rounded-xl border border-border/40 px-4 py-4 text-left transition-all backdrop-blur-md hover:bg-white/50 dark:hover:bg-zinc-900/30 hover:shadow-sm hover:border-zinc-200/60 dark:hover:border-zinc-800/60 mb-2 ${isActive ? "bg-white/50 dark:bg-zinc-900/30 border-zinc-200/60 dark:border-zinc-800/60 shadow-sm" : ""
                                                            }`}
                                                    >
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2">
                                                                    <Trophy className={`h-4 w-4 ${getStatusColor(hack.status)}`} />
                                                                    <div
                                                                        className={`text-sm font-medium transition-colors ${isActive
                                                                            ? "text-primary"
                                                                            : "text-foreground group-hover:text-primary"
                                                                            }`}
                                                                    >
                                                                        {hack.name}
                                                                    </div>
                                                                </div>
                                                                <p className="text-xs text-muted-foreground/70 line-clamp-1 pl-6">
                                                                    {hack.organizer} • {hack.description.slice(0, 60)}...
                                                                </p>
                                                                <div className="flex flex-wrap gap-2 text-[11px] font-medium text-muted-foreground pl-6">
                                                                    <span className={getStatusColor(hack.status)}>
                                                                        {hack.status}
                                                                    </span>
                                                                    <span className="text-muted-foreground/50">
                                                                        • {getTypeIcon(hack.type)} {hack.type}
                                                                    </span>
                                                                    {hack.result?.placement && (
                                                                        <span className="text-yellow-400">
                                                                            • 🏆 {hack.result.placement}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Hover Info */}
                                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3 opacity-0 transition-opacity group-hover:opacity-100">
                                                                {hack.teamSize && (
                                                                    <div className="flex items-center gap-1 text-xs text-muted-foreground/50">
                                                                        <Users className="h-3 w-3" />
                                                                        {hack.teamSize}
                                                                    </div>
                                                                )}
                                                                <div className="flex items-center gap-1 text-xs text-muted-foreground/50">
                                                                    <Calendar className="h-3 w-3" />
                                                                    {hack.startDate}
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
