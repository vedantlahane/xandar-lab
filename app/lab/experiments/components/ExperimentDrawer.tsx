// app/lab/experiments/components/ExperimentDrawer.tsx
"use client";

import { ExternalLink, Github, Calendar, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Experiment } from "../data/experiments";
import { cn } from "@/lib/utils";
import { BaseDrawer } from "@/app/lab/components/shared/BaseDrawer";

export function ExperimentDrawer({
    experiment,
    onClose,
    position,
}: {
    experiment: Experiment;
    onClose: () => void;
    position: { x: number; y: number };
}) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active': return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'Completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'Archived': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
            case 'Planning': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            default: return 'bg-muted text-muted-foreground';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'Frontend': return 'bg-purple-500/20 text-purple-400';
            case 'Backend': return 'bg-orange-500/20 text-orange-400';
            case 'Full Stack': return 'bg-cyan-500/20 text-cyan-400';
            case 'AI/ML': return 'bg-pink-500/20 text-pink-400';
            case 'Mobile': return 'bg-indigo-500/20 text-indigo-400';
            case 'DevOps': return 'bg-emerald-500/20 text-emerald-400';
            default: return 'bg-muted text-muted-foreground';
        }
    };

    const headerLeft = (
        <div className="flex items-center gap-3">
            <span className={cn(
                "px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                getStatusColor(experiment.status)
            )}>
                {experiment.status}
            </span>
            <span className={cn(
                "px-2 py-0.5 rounded-full text-[10px] font-semibold",
                getTypeColor(experiment.type)
            )}>
                {experiment.type}
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
                    <div className="space-y-3">
                        <h2 className="text-2xl font-bold tracking-tight">{experiment.title}</h2>
                        <p className="text-sm text-muted-foreground">{experiment.description}</p>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground/70">
                            <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Started: {experiment.startDate}
                            </span>
                            {experiment.endDate && (
                                <span>Ended: {experiment.endDate}</span>
                            )}
                        </div>
                    </div>

                    {/* Technologies */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-semibold">Technologies</h3>
                        <div className="flex flex-wrap gap-2">
                            {experiment.technologies.map((tech) => (
                                <span
                                    key={tech}
                                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold border border-border bg-muted/50"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Notes */}
                    {experiment.notes && (
                        <div className="rounded-lg border border-border/50 bg-muted/20 p-4">
                            <h3 className="text-sm font-semibold mb-2">Notes</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {experiment.notes}
                            </p>
                        </div>
                    )}

                    {/* Learnings */}
                    {experiment.learnings && experiment.learnings.length > 0 && (
                        <div className="space-y-2">
                            <h3 className="text-sm font-semibold flex items-center gap-2">
                                <Lightbulb className="h-4 w-4 text-yellow-500" />
                                Key Learnings
                            </h3>
                            <ul className="space-y-1.5">
                                {experiment.learnings.map((learning, index) => (
                                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                                        <span className="text-primary mt-1.5 text-xs">•</span>
                                        {learning}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Links */}
                    <div className="flex gap-3 pt-2">
                        {experiment.githubUrl && (
                            <Button variant="outline" size="sm" asChild>
                                <a href={experiment.githubUrl} target="_blank" rel="noopener noreferrer">
                                    <Github className="h-4 w-4 mr-2" />
                                    View Code
                                </a>
                            </Button>
                        )}
                        {experiment.demoUrl && (
                            <Button size="sm" asChild>
                                <a href={experiment.demoUrl} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    Live Demo
                                </a>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </BaseDrawer>
    );
}
