// app/lab/hackathons/components/HackathonCard.tsx
"use client";

import { ExternalLink, Calendar, Users, Trophy, MapPin, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Hackathon } from "../data/hackathons";
import { cn } from "@/lib/utils";
import { BaseDrawer } from "@/app/lab/components/shared/BaseDrawer";

export function HackathonDrawer({
    hackathon,
    onClose,
    position,
}: {
    hackathon: Hackathon;
    onClose: () => void;
    position: { x: number; y: number };
}) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Upcoming': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'Registered': return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'In Progress': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'Completed': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
            case 'Missed': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
            default: return 'bg-muted text-muted-foreground';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'Online': return 'bg-cyan-500/20 text-cyan-400';
            case 'In-Person': return 'bg-orange-500/20 text-orange-400';
            case 'Hybrid': return 'bg-pink-500/20 text-pink-400';
            default: return 'bg-muted text-muted-foreground';
        }
    };

    const getPrizeIcon = (prize: string) => {
        switch (prize) {
            case 'Cash': return '💰';
            case 'Swag': return '🎁';
            case 'Job Opportunity': return '💼';
            case 'Credits': return '☁️';
            default: return '🏆';
        }
    };

    const headerLeft = (
        <div className="flex items-center gap-3">
            <span className={cn(
                "px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                getStatusColor(hackathon.status)
            )}>
                {hackathon.status}
            </span>
            <span className={cn(
                "px-2 py-0.5 rounded-full text-[10px] font-semibold",
                getTypeColor(hackathon.type)
            )}>
                {hackathon.type}
            </span>
        </div>
    );

    return (
        <BaseDrawer
            onClose={onClose}
            position={position}
            defaultWidth="700px"
            defaultHeight="550px"
            headerLeft={headerLeft}
        >
            <div className="p-6">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold tracking-tight">{hackathon.name}</h2>
                        <p className="text-sm text-muted-foreground">Organized by {hackathon.organizer}</p>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {hackathon.description}
                    </p>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Calendar className="h-3.5 w-3.5" />
                                Dates
                            </div>
                            <p className="text-sm font-medium">
                                {hackathon.startDate} → {hackathon.endDate}
                            </p>
                        </div>
                        {hackathon.teamSize && (
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Users className="h-3.5 w-3.5" />
                                    Team Size
                                </div>
                                <p className="text-sm font-medium">{hackathon.teamSize} members</p>
                            </div>
                        )}
                        {hackathon.registrationDeadline && (
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Calendar className="h-3.5 w-3.5" />
                                    Registration Deadline
                                </div>
                                <p className="text-sm font-medium">{hackathon.registrationDeadline}</p>
                            </div>
                        )}
                    </div>

                    {/* Themes */}
                    {hackathon.themes && hackathon.themes.length > 0 && (
                        <div className="space-y-2">
                            <h3 className="text-sm font-semibold">Themes</h3>
                            <div className="flex flex-wrap gap-2">
                                {hackathon.themes.map((theme) => (
                                    <span
                                        key={theme}
                                        className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold border border-border bg-muted/50"
                                    >
                                        {theme}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Prizes */}
                    {hackathon.prizes && hackathon.prizes.length > 0 && hackathon.prizes[0] !== 'None' && (
                        <div className="space-y-2">
                            <h3 className="text-sm font-semibold flex items-center gap-2">
                                <Trophy className="h-4 w-4 text-yellow-500" />
                                Prizes
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {hackathon.prizes.map((prize) => (
                                    <span
                                        key={prize}
                                        className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold bg-yellow-500/10 text-yellow-400"
                                    >
                                        {getPrizeIcon(prize)} {prize}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Results */}
                    {hackathon.result && (
                        <div className="rounded-lg border border-border/50 bg-muted/20 p-4 space-y-3">
                            <h3 className="text-sm font-semibold flex items-center gap-2">
                                <Trophy className="h-4 w-4 text-primary" />
                                Results
                            </h3>
                            {hackathon.result.placement && (
                                <p className="text-sm">
                                    <span className="text-muted-foreground">Placement: </span>
                                    <span className="font-medium text-primary">{hackathon.result.placement}</span>
                                </p>
                            )}
                            {hackathon.result.projectName && (
                                <p className="text-sm">
                                    <span className="text-muted-foreground">Project: </span>
                                    <span className="font-medium">{hackathon.result.projectName}</span>
                                </p>
                            )}
                            {hackathon.result.notes && (
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {hackathon.result.notes}
                                </p>
                            )}
                            {hackathon.result.projectUrl && (
                                <Button variant="outline" size="sm" asChild>
                                    <a href={hackathon.result.projectUrl} target="_blank" rel="noopener noreferrer">
                                        <Github className="h-4 w-4 mr-2" />
                                        View Project
                                    </a>
                                </Button>
                            )}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <Button asChild>
                            <a href={hackathon.website} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Visit Website
                            </a>
                        </Button>
                        {hackathon.status === 'Upcoming' && (
                            <Button variant="outline">
                                Register
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </BaseDrawer>
    );
}
