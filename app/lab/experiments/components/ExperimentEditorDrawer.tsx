// app/lab/experiments/components/ExperimentEditorDrawer.tsx
"use client";

import { useState } from "react";
import { BaseDrawer } from "@/app/lab/components/shared/BaseDrawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ExperimentStatus, ExperimentType } from "../data/experiments";
import {
    Save, Trash2, Github, ExternalLink, Globe, Lock, Users,
    Plus, X, Loader2, Tag, Lightbulb, Activity, Sliders
} from "lucide-react";
import { usePermissions } from "@/components/auth/hooks/usePermissions";
import { BlockEditor } from "@/app/lab/notes/components/BlockEditor";

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
    const { isAdmin } = usePermissions();
    const isEdit = !!experiment?.id;

    const [title, setTitle] = useState(experiment?.title || "");
    const [description, setDescription] = useState(experiment?.description || "");
    const [status, setStatus] = useState<ExperimentStatus>(experiment?.status || "Active");
    const [type, setType] = useState<ExperimentType>(experiment?.type || "Full Stack");
    const [githubUrl, setGithubUrl] = useState(experiment?.githubUrl || "");
    const [liveUrl, setLiveUrl] = useState(experiment?.liveUrl || "");
    const [techStack, setTechStack] = useState<string[]>(experiment?.technologies || []);
    const [highlights, setHighlights] = useState<string[]>(experiment?.learnings || []);
    const [visibility, setVisibility] = useState<"private" | "public" | "shared">(experiment?.visibility || "public");

    // Phase 2: Metrics and Parameters
    const [parameters, setParameters] = useState<Record<string, string>>(experiment?.parameters || {});
    const [metrics, setMetrics] = useState<Record<string, string>>(experiment?.metrics || {});
    const [newParamKey, setNewParamKey] = useState("");
    const [newParamVal, setNewParamVal] = useState("");
    const [newMetricKey, setNewMetricKey] = useState("");
    const [newMetricVal, setNewMetricVal] = useState("");

    const [techInput, setTechInput] = useState("");
    const [highlightInput, setHighlightInput] = useState("");

    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSave = async () => {
        if (!title.trim()) {
            setError("Title is required");
            return;
        }

        setSaving(true);
        setError(null);

        try {
            const payload = {
                title,
                description,
                status,
                type,
                githubUrl,
                liveUrl,
                techStack,
                highlights,
                visibility,
                parameters,
                metrics,
            };

            const url = isEdit ? `/api/experiments/${experiment.id}` : "/api/experiments";
            const method = isEdit ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to save experiment");
            }

            const { experiment: savedExp } = await res.json();
            onSaved(savedExp);
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!isEdit) return;
        setDeleting(true);
        try {
            const res = await fetch(`/api/experiments/${experiment.id}`, { method: "DELETE" });
            if (res.ok) {
                onDeleted?.(experiment.id);
                onClose();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setDeleting(false);
        }
    };

    const handleAddParam = () => {
        if (newParamKey.trim() && newParamVal.trim()) {
            setParameters(prev => ({ ...prev, [newParamKey.trim()]: newParamVal.trim() }));
            setNewParamKey("");
            setNewParamVal("");
        }
    };

    const handleAddMetric = () => {
        if (newMetricKey.trim() && newMetricVal.trim()) {
            setMetrics(prev => ({ ...prev, [newMetricKey.trim()]: newMetricVal.trim() }));
            setNewMetricKey("");
            setNewMetricVal("");
        }
    };

    const headerLeft = (
        <div className="flex items-center gap-2.5">
            <span className="text-xs font-semibold text-foreground">
                {isEdit ? "Edit Experiment" : "New Experiment"}
            </span>
            <div className="h-3.5 w-px bg-border" />
            <div className="flex items-center rounded-md border border-border/50 bg-muted/20 p-0.5">
                <button
                    onClick={() => setVisibility("public")}
                    className={cn(
                        "flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] uppercase tracking-wider transition-colors",
                        visibility === "public"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-semibold shadow-sm"
                            : "bg-transparent text-muted-foreground hover:text-foreground"
                    )}
                >
                    <Globe className="h-3 w-3" /> Public
                </button>
                <button
                    onClick={() => setVisibility("shared")}
                    className={cn(
                        "flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] uppercase tracking-wider transition-colors",
                        visibility === "shared"
                            ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 font-semibold shadow-sm"
                            : "bg-transparent text-muted-foreground hover:text-foreground"
                    )}
                >
                    <Users className="h-3 w-3" /> Shared
                </button>
                <button
                    onClick={() => setVisibility("private")}
                    className={cn(
                        "flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] uppercase tracking-wider transition-colors",
                        visibility === "private"
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-semibold shadow-sm"
                            : "bg-transparent text-muted-foreground hover:text-foreground"
                    )}
                >
                    <Lock className="h-3 w-3" /> Private
                </button>
            </div>
        </div>
    );

    const headerIconTools = (
        <div className="flex items-center gap-2">
            {isEdit && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="h-8 w-8 text-red-500/70 hover:text-red-500 hover:bg-red-500/10"
                >
                    {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                </Button>
            )}
            <Button
                size="sm"
                onClick={handleSave}
                disabled={saving || !title.trim()}
                className="gap-1.5 h-8 px-3 rounded-md"
            >
                {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                <span className="hidden sm:inline">{isEdit ? "Save Changes" : "Create"}</span>
            </Button>
        </div>
    );

    return (
        <BaseDrawer
            onClose={onClose}
            defaultWidth="900px"
            defaultHeight="85vh"
            headerLeft={headerLeft}
            headerIconTools={headerIconTools}
        >
            <div className="p-4 flex flex-col gap-6 h-full overflow-y-auto">
                {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                        {error}
                    </div>
                )}

                {/* Title & Metadata */}
                <div className="space-y-4">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Experiment Title..."
                        className="w-full bg-transparent text-3xl font-bold placeholder:text-muted-foreground/30 border-b border-transparent focus:border-border focus:outline-none transition-colors pb-2"
                        autoFocus
                    />

                    <div className="flex flex-wrap items-center gap-4">
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value as ExperimentType)}
                            className="bg-muted/30 border border-border/50 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary/40 rounded-md px-3 py-1.5 cursor-pointer"
                        >
                            {EXPERIMENT_TYPES.map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value as ExperimentStatus)}
                            className="bg-muted/30 border border-border/50 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary/40 rounded-md px-3 py-1.5 cursor-pointer"
                        >
                            {EXPERIMENT_STATUSES.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Rich Text Description */}
                <div className="space-y-1.5 flex-1 min-h-[400px]">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Description / Lab Notes
                    </label>
                    <div className="h-[350px] border border-border/50 rounded-lg overflow-hidden">
                        <BlockEditor 
                            content={description} 
                            onChange={(html) => setDescription(html)} 
                        />
                    </div>
                </div>

                {/* Metrics and Parameters Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Parameters */}
                    <div className="space-y-3">
                        <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                            <Sliders className="h-3.5 w-3.5 text-blue-500" /> Parameters / Hyperparameters
                        </label>
                        <div className="space-y-2">
                            {Object.entries(parameters).map(([k, v]) => (
                                <div key={k} className="flex items-center gap-2 bg-muted/20 p-2 rounded border border-border/40 text-sm">
                                    <span className="font-mono text-muted-foreground flex-1">{k}</span>
                                    <span className="font-mono">{v}</span>
                                    <button 
                                        onClick={() => {
                                            const newParams = { ...parameters };
                                            delete newParams[k];
                                            setParameters(newParams);
                                        }}
                                        className="text-red-500 hover:bg-red-500/10 p-1 rounded"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                            <div className="flex gap-2">
                                <Input value={newParamKey} onChange={e => setNewParamKey(e.target.value)} placeholder="Key (e.g. batch_size)" className="h-8 text-xs font-mono" />
                                <Input value={newParamVal} onChange={e => setNewParamVal(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddParam()} placeholder="Value (e.g. 32)" className="h-8 text-xs font-mono" />
                                <Button size="sm" onClick={handleAddParam} className="h-8 px-2"><Plus className="h-3.5 w-3.5" /></Button>
                            </div>
                        </div>
                    </div>

                    {/* Metrics */}
                    <div className="space-y-3">
                        <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                            <Activity className="h-3.5 w-3.5 text-emerald-500" /> Metrics / Results
                        </label>
                        <div className="space-y-2">
                            {Object.entries(metrics).map(([k, v]) => (
                                <div key={k} className="flex items-center gap-2 bg-muted/20 p-2 rounded border border-border/40 text-sm">
                                    <span className="font-mono text-muted-foreground flex-1">{k}</span>
                                    <span className="font-mono">{v}</span>
                                    <button 
                                        onClick={() => {
                                            const newMetrics = { ...metrics };
                                            delete newMetrics[k];
                                            setMetrics(newMetrics);
                                        }}
                                        className="text-red-500 hover:bg-red-500/10 p-1 rounded"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                            <div className="flex gap-2">
                                <Input value={newMetricKey} onChange={e => setNewMetricKey(e.target.value)} placeholder="Key (e.g. accuracy)" className="h-8 text-xs font-mono" />
                                <Input value={newMetricVal} onChange={e => setNewMetricVal(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddMetric()} placeholder="Value (e.g. 0.95)" className="h-8 text-xs font-mono" />
                                <Button size="sm" onClick={handleAddMetric} className="h-8 px-2"><Plus className="h-3.5 w-3.5" /></Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Code & Demo Links */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
