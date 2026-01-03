"use client";

import { useState, useMemo } from "react";
import { HACKATHONS, HackathonStatus, HackathonType } from "../data/hackathons";
import { Trophy, Calendar, Users, MapPin } from "lucide-react";

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

    const statuses: FilterStatus[] = ["All", "Upcoming", "Registered", "In Progress", "Completed", "Missed"];
    const types: FilterType[] = ["All", "Online", "In-Person", "Hybrid"];

    const filteredHackathons = useMemo(() => {
        return HACKATHONS.map((monthData) => {
            const filteredItems = monthData.hackathons.filter((hack) => {
                if (statusFilter !== "All" && hack.status !== statusFilter) return false;
                if (typeFilter !== "All" && hack.type !== typeFilter) return false;
                return true;
            });

            return {
                ...monthData,
                hackathons: filteredItems,
            };
        }).filter((monthData) => monthData.hackathons.length > 0);
    }, [statusFilter, typeFilter]);

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
        <div className="relative h-full bg-card pt-12">
            {/* Top Fade */}
            <div className="pointer-events-none absolute top-0 left-0 right-0 h-12 bg-linear-to-b from-card to-transparent z-20" />

            <div id="hackathons-scroll-container" className="h-full overflow-y-auto">
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
                                                {filter === "All" ? "All Hackathons" : filter}
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
                                                {filter === "All" ? filter : `${getTypeIcon(filter)} ${filter}`}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="pt-4 border-t border-border/40 space-y-2">
                                    <h3 className="font-semibold text-foreground text-sm">Stats</h3>
                                    <div className="space-y-1 text-xs text-muted-foreground">
                                        <div>Total: {HACKATHONS.reduce((acc, m) => acc + m.hackathons.length, 0)}</div>
                                        <div>Completed: {HACKATHONS.reduce((acc, m) => acc + m.hackathons.filter(h => h.status === 'Completed').length, 0)}</div>
                                        <div>Won: {HACKATHONS.reduce((acc, m) => acc + m.hackathons.filter(h => h.result?.placement?.includes('Best') || h.result?.placement?.includes('Top') || h.result?.placement?.includes('Won')).length, 0)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Hackathons */}
                        <div className="space-y-3">
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
                                        <div className="sticky top-0 z-10 bg-card/95 py-4 backdrop-blur">
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
                                                        className={`group relative w-full border-b border-border/40 px-4 py-4 text-left transition-all hover:bg-gradient-to-r hover:from-transparent hover:to-accent/40 ${isActive ? "bg-accent/50" : ""
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
