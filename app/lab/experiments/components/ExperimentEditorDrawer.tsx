// app/lab/experiments/components/ExperimentEditorDrawer.tsx
"use client";

import { useState } from "react";
import { BaseDrawer } from "@/app/lab/components/shared/BaseDrawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ExperimentStatus, ExperimentType } from "../data/experiments";
import {
    Save, Trash2, Github, ExternalLink, Globe, Lock,
    Plus, X, Loader2, Sparkles, Beaker, Tag, Lightbulb
} from "lucide-react";
import { usePermissions } from "@/components/auth/hooks/usePermissions";

interface ExperimentEditorDrawerProps {
    experiment?: any | null;
    onClose: () => void;
    onSaved: (experiment: any) => void;
    onDeleted?: (experimentId: string) => void;
}

const EXPERIMENT_TYPES: ExperimentType[] = [
    "Frontend", "Backend", "Full Stack", "AI/ML", "Mobile", "DevOps"
];

const EXPERIMENT_STATUSES: ExperimentStatus[] = [
    "Active", "Completed", "Planning", "Archived"
];

export function ExperimentEditorDrawer({
    experiment,
    onClose,
    onSaved,
    onDeleted,
}: ExperimentEditorDrawerProps) {
    const { isAdmin, isModerator } = usePermissions();
    const isEdit = !!experiment?.id && (!experiment.isCurated || isAdmin || isModerator);

    const [title, setTitle] = useState(experiment?.title || "");
    const [description, setDescription] = useState(experiment?.description || "");
    const [type, setType] = useState<ExperimentType>(experiment?.type || "Full Stack");
    const [status, setStatus] = useState<ExperimentStatus>(experiment?.status || "Active");
    const [githubUrl, setGithubUrl] = useState(experiment?.githubUrl || "");
    const [liveUrl, setLiveUrl] = useState(experiment?.demoUrl || experiment?.liveUrl || "");
    const [visibility, setVisibility] = useState<"private" | "public">(
        experiment?.visibility || "public"
    );

    // Tech stack tags
    const [techStack, setTechStack] = useState<string[]>(
        experiment?.technologies || experiment?.techStack || []
    );
    const [techInput, setTechInput] = useState("");

    // Highlights / Key Learnings
    const [highlights, setHighlights] = useState<string[]>(
        experiment?.learnings || experiment?.highlights || []
    );
    const [highlightInput, setHighlightInput] = useState("");

    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAddTech = () => {
        const trimmed = techInput.trim();
        if (trimmed && !techStack.includes(trimmed)) {
            setTechStack([...techStack, trimmed]);
            setTechInput("");
        }
    };

    const handleRemoveTech = (t: string) => {
        setTechStack(techStack.filter((item) => item !== t));
    };

    const handleAddHighlight = () => {
        const trimmed = highlightInput.trim();
        if (trimmed && !highlights.includes(trimmed)) {
            setHighlights([...highlights, trimmed]);
            setHighlightInput("");
        }
    };

    const handleRemoveHighlight = (idx: number) => {
        setHighlights(highlights.filter((_, i) => i !== idx));
    };

    const handleSave = async () => {
        if (!title.trim()) {
            setError("Title is required");
            return;
        }
        if (!description.trim()) {
            setError("Description is required");
            return;
        }

        setSaving(true);
        setError(null);

        try {
            const endpoint = isEdit ? `/api/experiments/${experiment.id}` : "/api/experiments";
            const method = isEdit ? "PUT" : "POST";

            const res = await fetch(endpoint, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: title.trim(),
                    description: description.trim(),
                    type,
                    status,
                    githubUrl: githubUrl.trim(),
                    liveUrl: liveUrl.trim(),
                    techStack,
                    highlights,
                    visibility,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Failed to save experiment");
            }

            onSaved(data.experiment);
        } catch (err: any) {
            setError(err.message || "Something went wrong saving the experiment");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!isEdit || !experiment?.id) return;
        if (!confirm("Are you sure you want to delete this experiment?")) return;

        setDeleting(true);
        setError(null);

        try {
            const res = await fetch(`/api/experiments/${experiment.id}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Failed to delete experiment");
            }
            if (onDeleted) onDeleted(experiment.id);
            onClose();
        } catch (err: any) {
            setError(err.message || "Failed to delete experiment");
            setDeleting(false);
        }
    };

    const headerLeft = (
        <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                <Beaker className="h-3.5 w-3.5" />
                {isEdit ? "Edit Experiment" : "New Experiment"}
            </span>
            <span className="text-muted-foreground/40">•</span>
            <span className="text-[11px] text-muted-foreground">
                {visibility === "public" ? "Community Feed" : "Private Only"}
            </span>
        </div>
    );

    const headerRight = (
        <div className="flex items-center gap-2 mr-2">
            {isEdit && onDeleted && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    disabled={deleting || saving}
                    className="h-7 px-2 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                    {deleting ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                    )}
                </Button>
            )}
            <Button
                size="sm"
                onClick={handleSave}
                disabled={saving || deleting}
                className="h-7 px-3 text-xs gap-1.5 font-medium shadow-sm"
            >
                {saving ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                    <Save className="h-3.5 w-3.5" />
                )}
                {isEdit ? "Update" : "Publish"}
            </Button>
        </div>
    );

    return (
        <BaseDrawer
            onClose={onClose}
            defaultWidth="720px"
            defaultHeight="680px"
            headerLeft={headerLeft}
            headerRight={headerRight}
        >
            <div className="p-5 sm:p-6 space-y-5">
                {error && (
                    <div className="px-3.5 py-2 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
                        {error}
                    </div>
                )}

                {/* Title */}
                <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Title
                    </label>
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Distributed Task Scheduler in Go"
                        className="text-base font-semibold h-10"
                    />
                </div>

                {/* Type and Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                            Domain Type
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                            {EXPERIMENT_TYPES.map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => setType(t)}
                                    className={cn(
                                        "px-2.5 py-1 rounded-md text-xs font-medium border transition-all",
                                        type === t
                                            ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                            : "bg-muted/40 text-muted-foreground border-border/60 hover:text-foreground"
                                    )}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                            Status
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                            {EXPERIMENT_STATUSES.map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => setStatus(s)}
                                    className={cn(
                                        "px-2.5 py-1 rounded-md text-xs font-medium border transition-all",
                                        status === s
                                            ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                            : "bg-muted/40 text-muted-foreground border-border/60 hover:text-foreground"
                                    )}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Visibility */}
                <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Visibility
                    </label>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setVisibility("public")}
                            className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all",
                                visibility === "public"
                                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-semibold"
                                    : "bg-muted/40 text-muted-foreground border-border/60 hover:text-foreground"
                            )}
                        >
                            <Globe className="h-3.5 w-3.5 text-emerald-500" />
                            Community (Public)
                        </button>
                        <button
                            type="button"
                            onClick={() => setVisibility("private")}
                            className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all",
                                visibility === "private"
                                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 font-semibold"
                                    : "bg-muted/40 text-muted-foreground border-border/60 hover:text-foreground"
                            )}
                        >
                            <Lock className="h-3.5 w-3.5 text-amber-500" />
                            Private (Only You)
                        </button>
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Description / Overview
                    </label>
                    <textarea
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Brief overview of what this experiment investigates or solves..."
                        className="w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 leading-relaxed resize-none"
                    />
                </div>

                {/* Tech Stack Tags */}
                <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <Tag className="h-3 w-3" /> Tech Stack
                    </label>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                        {techStack.map((tech) => (
                            <span
                                key={tech}
                                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted border border-border"
                            >
                                {tech}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveTech(tech)}
                                    className="hover:text-destructive transition-colors ml-0.5"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </span>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        <Input
                            value={techInput}
                            onChange={(e) => setTechInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleAddTech();
                                }
                            }}
                            placeholder="Add technology (e.g. Next.js, Rust, Redis) and press Enter"
                            className="h-8 text-xs flex-1"
                        />
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={handleAddTech}
                            className="h-8 px-2.5 text-xs gap-1"
                        >
                            <Plus className="h-3.5 w-3.5" /> Add
                        </Button>
                    </div>
                </div>

                {/* Key Highlights / Learnings */}
                <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <Lightbulb className="h-3 w-3 text-amber-500" /> Key Learnings & Highlights
                    </label>
                    {highlights.length > 0 && (
                        <div className="space-y-1.5 mb-2">
                            {highlights.map((h, i) => (
                                <div
                                    key={i}
                                    className="flex items-start justify-between gap-2 p-2 rounded-md bg-muted/30 border border-border/50 text-xs"
                                >
                                    <div className="flex items-start gap-1.5">
                                        <span className="text-primary mt-0.5">•</span>
                                        <span>{h}</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveHighlight(i)}
                                        className="text-muted-foreground hover:text-destructive shrink-0 mt-0.5"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <Input
                            value={highlightInput}
                            onChange={(e) => setHighlightInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleAddHighlight();
                                }
                            }}
                            placeholder="Add a key learning or breakthrough and press Enter"
                            className="h-8 text-xs flex-1"
                        />
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={handleAddHighlight}
                            className="h-8 px-2.5 text-xs gap-1"
                        >
                            <Plus className="h-3.5 w-3.5" /> Add
                        </Button>
                    </div>
                </div>

                {/* Code & Demo Links */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                            <Github className="h-3 w-3" /> GitHub Repository
                        </label>
                        <Input
                            value={githubUrl}
                            onChange={(e) => setGithubUrl(e.target.value)}
                            placeholder="https://github.com/..."
                            className="h-8 text-xs"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                            <ExternalLink className="h-3 w-3" /> Live Demo URL
                        </label>
                        <Input
                            value={liveUrl}
                            onChange={(e) => setLiveUrl(e.target.value)}
                            placeholder="https://..."
                            className="h-8 text-xs"
                        />
                    </div>
                </div>
            </div>
        </BaseDrawer>
    );
}
