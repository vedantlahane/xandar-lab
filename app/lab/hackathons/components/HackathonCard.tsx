// app/lab/hackathons/components/HackathonCard.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Maximize2, Minimize2, X, ExternalLink, Calendar, Users, Trophy, MapPin, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Hackathon } from "../data/hackathons";
import { cn } from "@/lib/utils";

export function HackathonDrawer({
    hackathon,
    onClose,
    position,
}: {
    hackathon: Hackathon;
    onClose: () => void;
    position: { x: number; y: number };
}) {
    const [isMaximized, setIsMaximized] = useState(false);

    const initialX = position.x > window.innerWidth / 2 ? position.x - 700 : position.x;
    const initialY = position.y > window.innerHeight / 2 ? position.y - 550 : position.y;

    const safeX = Math.max(20, Math.min(initialX, window.innerWidth - 720));
    const safeY = Math.max(20, Math.min(initialY, window.innerHeight - 570));

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

    return (
        <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <div
                onClick={onClose}
                className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-auto"
            />

            {/* Window */}
            <motion.div
                layout
                initial={{
                    opacity: 0,
                    scale: 0.5,
                    x: position.x,
                    y: position.y
                }}
                animate={{
                    opacity: 1,
                    scale: 1,
                    x: isMaximized ? 0 : safeX,
                    y: isMaximized ? 0 : safeY,
                    width: isMaximized ? "100%" : "700px",
                    height: isMaximized ? "100%" : "550px",
                }}
                exit={{
                    opacity: 0,
                    scale: 0.5,
                    x: position.x,
                    y: position.y
                }}
                transition={{
                    type: "spring",
                    damping: 25,
                    stiffness: 300,
                    mass: 0.8
                }}
                className={cn(
                    "pointer-events-auto absolute flex flex-col bg-card shadow-2xl border border-border overflow-hidden",
                    isMaximized ? "rounded-none" : "rounded-xl"
                )}
            >
                {/* Header */}
                <div
                    className="flex items-center justify-between border-b border-border/40 px-4 py-3 bg-muted/30 select-none"
                    onDoubleClick={() => setIsMaximized(!isMaximized)}
                >
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
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => setIsMaximized(!isMaximized)}
                        >
                            {isMaximized ? (
                                <Minimize2 className="h-3.5 w-3.5" />
                            ) : (
                                <Maximize2 className="h-3.5 w-3.5" />
                            )}
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 hover:bg-destructive/10 hover:text-destructive"
                            onClick={onClose}
                        >
                            <X className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
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
            </motion.div>
        </div>
    );
}
