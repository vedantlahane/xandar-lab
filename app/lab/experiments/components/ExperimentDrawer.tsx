// app/lab/experiments/components/ExperimentDrawer.tsx
"use client";

import { useState } from "react";
import { ExternalLink, Github, Calendar, Lightbulb, Edit3, Globe, Lock, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BaseDrawer } from "@/app/lab/components/shared/BaseDrawer";
import { usePermissions } from "@/components/auth/hooks/usePermissions";
import { RoleBadge } from "@/components/shared/RoleBadge";
import { ExperimentEditorDrawer } from "./ExperimentEditorDrawer";

export function ExperimentDrawer({
    experiment,
    onClose,
    position,
    onExperimentUpdated,
    onExperimentDeleted,
}: {
    experiment: any;
    onClose: () => void;
    position?: { x: number; y: number };
    onExperimentUpdated?: (updated: any) => void;
    onExperimentDeleted?: (id: string) => void;
}) {
    const [isEditing, setIsEditing] = useState(false);
    const { canEdit } = usePermissions();

    const canModify = !experiment.isCurated && canEdit(experiment.authorId);

    if (isEditing) {
        return (
            <ExperimentEditorDrawer
                experiment={experiment}
                onClose={() => setIsEditing(false)}
                onSaved={(updated) => {
                    setIsEditing(false);
                    if (onExperimentUpdated) onExperimentUpdated(updated);
                }}
                onDeleted={(id) => {
                    setIsEditing(false);
                    if (onExperimentDeleted) onExperimentDeleted(id);
                    onClose();
                }}
            />
        );
    }

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
        <div className="flex items-center gap-2 sm:gap-3">
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
            {experiment.visibility === "private" && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    <Lock className="h-3 w-3" />
                    Private
                </span>
            )}
        </div>
    );

    const headerRight = canModify ? (
        <div className="flex items-center gap-1 mr-2">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="h-7 px-2.5 text-xs gap-1.5 hover:bg-muted text-muted-foreground hover:text-foreground"
            >
                <Edit3 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Edit</span>
            </Button>
        </div>
    ) : null;

    const technologies = experiment.technologies || experiment.techStack || [];
    const learnings = experiment.learnings || experiment.highlights || [];
    const demoUrl = experiment.demoUrl || experiment.liveUrl;
    const githubUrl = experiment.githubUrl;

    return (
        <BaseDrawer
            onClose={onClose}
            position={position}
            defaultWidth="700px"
            defaultHeight="580px"
            headerLeft={headerLeft}
            headerRight={headerRight}
        >
            <div className="p-6">
                <div className="space-y-6">
                    <div className="space-y-3">
                        <div className="flex items-start justify-between gap-4">
                            <h2 className="text-2xl font-bold tracking-tight">{experiment.title}</h2>
                        </div>

                        {/* Author metadata */}
                        {experiment.authorUsername && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1.5">
                                    <UserIcon className="h-3.5 w-3.5 text-muted-foreground/70" />
                                    <span>Built by <strong className="text-foreground">@{experiment.authorUsername}</strong></span>
                                </span>
                                {experiment.authorRole && (
                                    <RoleBadge role={experiment.authorRole} size="sm" />
                                )}
                            </div>
                        )}

                        <p className="text-sm text-muted-foreground leading-relaxed">{experiment.description}</p>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground/70">
                            <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Started: {experiment.startDate || "Recently"}
                            </span>
                            {experiment.endDate && (
                                <span>Ended: {experiment.endDate}</span>
                            )}
                        </div>
                    </div>

                    {/* Technologies */}
                    {technologies.length > 0 && (
                        <div className="space-y-2">
                            <h3 className="text-sm font-semibold">Technologies</h3>
                            <div className="flex flex-wrap gap-2">
                                {technologies.map((tech: string) => (
                                    <span
                                        key={tech}
                                        className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold border border-border bg-muted/50"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Learnings / Highlights */}
                    {learnings.length > 0 && (
                        <div className="space-y-2">
                            <h3 className="text-sm font-semibold flex items-center gap-2">
                                <Lightbulb className="h-4 w-4 text-yellow-500" />
                                Key Learnings & Breakthroughs
                            </h3>
                            <ul className="space-y-1.5">
                                {learnings.map((learning: string, index: number) => (
                                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                                        <span className="text-primary mt-1.5 text-xs">•</span>
                                        <span>{learning}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Links */}
                    <div className="flex gap-3 pt-2">
                        {githubUrl && (
                            <Button variant="outline" size="sm" asChild>
                                <a href={githubUrl} target="_blank" rel="noopener noreferrer">
                                    <Github className="h-4 w-4 mr-2" />
                                    View Code
                                </a>
                            </Button>
                        )}
                        {demoUrl && (
                            <Button size="sm" asChild>
                                <a href={demoUrl} target="_blank" rel="noopener noreferrer">
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
