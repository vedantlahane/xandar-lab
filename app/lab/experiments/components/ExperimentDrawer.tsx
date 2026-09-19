// app/lab/experiments/components/ExperimentDrawer.tsx
"use client";

import { useState } from "react";
import {
    Activity, ArrowUpCircle, BookOpen, Calendar, Clock, Code,
    ExternalLink, FileCode, Github, Layout, Server, Sparkles,
    Star, Target, Smartphone, Terminal, Cpu, Database, Edit3, Trash2, ShieldAlert, Check, Copy, Sliders
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { BaseDrawer } from "@/app/lab/components/shared/BaseDrawer";
import { useAuth } from "@/components/auth/AuthContext";
import { usePermissions } from "@/components/auth/hooks/usePermissions";
import { RoleBadge } from "@/components/shared/RoleBadge";
import { ExperimentEditorDrawer } from "./ExperimentEditorDrawer";
import { BlockEditor } from "@/app/lab/notes/components/BlockEditor";

const TYPE_ICONS: Record<string, React.ReactNode> = {
    "Frontend": <Layout className="h-3.5 w-3.5 text-blue-500" />,
    "Backend": <Server className="h-3.5 w-3.5 text-green-500" />,
    "Full Stack": <Code className="h-3.5 w-3.5 text-purple-500" />,
    "AI/ML": <Cpu className="h-3.5 w-3.5 text-amber-500" />,
    "Mobile": <Smartphone className="h-3.5 w-3.5 text-pink-500" />,
    "DevOps": <Terminal className="h-3.5 w-3.5 text-cyan-500" />,
};

const STATUS_COLORS: Record<string, string> = {
    "Active": "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    "Completed": "bg-blue-500/10 text-blue-500 border-blue-500/20",
    "Planning": "bg-amber-500/10 text-amber-500 border-amber-500/20",
    "Archived": "bg-muted text-muted-foreground border-border",
};

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
    onExperimentUpdated?: (updated?: any) => void;
    onExperimentDeleted?: (id: string) => void;
}) {
    const { user } = useAuth();
    const { isAdmin, isModerator } = usePermissions();
    const [isEditing, setIsEditing] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [copied, setCopied] = useState(false);

    const canEdit = () => {
        if (isAdmin || isModerator) return true;
        return String(experiment.authorId) === String(user?._id) || 
               experiment.sharedWith?.some((s: any) => s.userId === user?._id && s.permission === "editor");
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this experiment?")) return;
        setDeleting(true);
        try {
            const res = await fetch(`/api/experiments/${experiment.id}`, { method: 'DELETE' });
            if (res.ok) {
                onExperimentDeleted?.(experiment.id);
                onClose();
            }
        } catch (error) {
            console.error("Failed to delete", error);
        } finally {
            setDeleting(false);
        }
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(experiment.description);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (isEditing) {
        return (
            <ExperimentEditorDrawer
                experiment={experiment}
                onClose={() => setIsEditing(false)}
                onSaved={(updated) => {
                    setIsEditing(false);
                    onExperimentUpdated?.();
                }}
            />
        );
    }

    const isHTML = /<[a-z][\s\S]*>/i.test(experiment.description);

    const headerLeft = (
        <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground/70 flex items-center gap-1.5">
                {TYPE_ICONS[experiment.type] || <Sparkles className="h-3.5 w-3.5" />}
                {experiment.type}
            </span>
            <div className="h-3.5 w-px bg-border/50" />
            <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold border", STATUS_COLORS[experiment.status])}>
                {experiment.status}
            </span>
            {experiment.isCurated && (
                <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20 ml-1">
                    <Star className="h-2.5 w-2.5 fill-current" /> Curated
                </span>
            )}
        </div>
    );

    const headerIconTools = (
        <>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopy}>
                {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />}
            </Button>
            {canEdit() && (
                <>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground" onClick={() => setIsEditing(true)}>
                        <Edit3 className="h-3.5 w-3.5" />
                    </Button>
                    {isAdmin && (
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500/70 hover:text-red-500 hover:bg-red-500/10" onClick={handleDelete} disabled={deleting}>
                            <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                    )}
                </>
            )}
        </>
    );

    return (
        <BaseDrawer
            onClose={onClose}
            position={position}
            defaultWidth="900px"
            defaultHeight="85vh"
            headerLeft={headerLeft}
            headerIconTools={headerIconTools}
        >
            <div className="p-4 sm:p-6 flex flex-col h-full overflow-y-auto">
                <div className="space-y-6">
                    {/* Header */}
                    <div className="space-y-4">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-tight">
                                {experiment.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1.5 font-medium">
                                    <span className="opacity-70">By</span>
                                    <span className="text-foreground">@{experiment.authorUsername}</span>
                                    {experiment.authorRole && (
                                        <RoleBadge role={experiment.authorRole} className="scale-90 origin-left" />
                                    )}
                                </div>
                                <div className="h-1 w-1 rounded-full bg-border" />
                                <div className="flex items-center gap-1.5 opacity-80">
                                    <Calendar className="h-3.5 w-3.5" />
                                    {experiment.startDate}
                                    {experiment.endDate && ` - ${experiment.endDate}`}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2">
                            {experiment.githubUrl && (
                                <Button asChild variant="outline" size="sm" className="h-8 gap-1.5 font-medium">
                                    <a href={experiment.githubUrl} target="_blank" rel="noopener noreferrer">
                                        <Github className="h-3.5 w-3.5" /> Source Code
                                    </a>
                                </Button>
                            )}
                            {experiment.demoUrl && (
                                <Button asChild size="sm" className="h-8 gap-1.5 font-medium bg-primary text-primary-foreground hover:opacity-90">
                                    <a href={experiment.demoUrl} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="h-3.5 w-3.5" /> Live Demo
                                    </a>
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Tech Stack */}
                    {experiment.technologies && experiment.technologies.length > 0 && (
                        <div className="space-y-2">
                            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                <FileCode className="h-3.5 w-3.5" /> Technologies
                            </h3>
                            <div className="flex flex-wrap gap-1.5">
                                {experiment.technologies.map((tech: string) => (
                                    <span key={tech} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted/50 border border-border/50 text-foreground">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Metrics and Parameters Grid */}
                    {(Object.keys(experiment.parameters || {}).length > 0 || Object.keys(experiment.metrics || {}).length > 0) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.keys(experiment.parameters || {}).length > 0 && (
                                <div className="space-y-2 p-4 rounded-xl border border-border/40 bg-muted/10">
                                    <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-3">
                                        <Sliders className="h-3.5 w-3.5 text-blue-500" /> Parameters
                                    </h3>
                                    <div className="grid grid-cols-2 gap-2 gap-y-3">
                                        {Object.entries(experiment.parameters).map(([k, v]) => (
                                            <div key={k} className="flex flex-col">
                                                <span className="text-[10px] text-muted-foreground uppercase">{k}</span>
                                                <span className="text-sm font-mono font-medium">{String(v)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {Object.keys(experiment.metrics || {}).length > 0 && (
                                <div className="space-y-2 p-4 rounded-xl border border-border/40 bg-muted/10">
                                    <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-3">
                                        <Activity className="h-3.5 w-3.5 text-emerald-500" /> Metrics
                                    </h3>
                                    <div className="grid grid-cols-2 gap-2 gap-y-3">
                                        {Object.entries(experiment.metrics).map(([k, v]) => (
                                            <div key={k} className="flex flex-col">
                                                <span className="text-[10px] text-muted-foreground uppercase">{k}</span>
                                                <span className="text-sm font-mono font-medium text-emerald-600 dark:text-emerald-400">{String(v)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Description (BlockEditor) */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-primary" />
                            Lab Notes & Overview
                        </h3>
                        <div className="rounded-xl border border-border/40 bg-muted/10 p-4 sm:p-5">
                            {isHTML ? (
                                <BlockEditor content={experiment.description} readOnly={true} />
                            ) : (
                                <div className="prose prose-sm dark:prose-invert max-w-none">
                                    <p className="whitespace-pre-wrap">{experiment.description}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Learnings */}
                    {experiment.learnings && experiment.learnings.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <Target className="h-5 w-5 text-amber-500" />
                                Key Findings & Highlights
                            </h3>
                            <div className="grid gap-2">
                                {experiment.learnings.map((learning: string, i: number) => (
                                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/40">
                                        <div className="mt-0.5 p-1 rounded-full bg-amber-500/10 text-amber-500">
                                            <Star className="h-3 w-3 fill-current" />
                                        </div>
                                        <span className="text-sm text-foreground leading-relaxed">{learning}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </BaseDrawer>
    );
}
