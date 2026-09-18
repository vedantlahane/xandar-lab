// app/lab/experiments/components/ExperimentDrawer.tsx
"use client";

import { useState, useEffect } from "react";
import {
    ExternalLink, Github, Calendar, Lightbulb, Edit3, Globe, Lock,
    Pin, Star, MessageSquare, Trash2, AlertCircle, CheckCircle2, Loader2, Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BaseDrawer } from "@/app/lab/components/shared/BaseDrawer";
import { useAuth } from "@/components/auth/AuthContext";
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
    const [currentExp, setCurrentExp] = useState(experiment);
    const [isEditing, setIsEditing] = useState(false);
    const [showRequestForm, setShowRequestForm] = useState(false);
    const [requestMessage, setRequestMessage] = useState("");
    const [submittingRequest, setSubmittingRequest] = useState(false);
    const [resolvingId, setResolvingId] = useState<string | null>(null);

    const { user } = useAuth();
    const {
        canPin,
        canCurate,
        canChangeVisibility,
        canRequestChanges,
        canEdit,
        canDelete,
        isAdmin,
        isModerator,
    } = usePermissions();

    useEffect(() => {
        setCurrentExp(experiment);
    }, [experiment]);

    const isAuthor = !!(
        user?._id &&
        currentExp?.authorId &&
        user._id.toString() === currentExp.authorId.toString()
    );

    const canResolve = isAuthor || isAdmin || isModerator;

    const handleTogglePin = async () => {
        const newPinned = !currentExp.isPinned;
        try {
            const res = await fetch(`/api/experiments/${currentExp.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isPinned: newPinned }),
            });
            const data = await res.json();
            if (res.ok && data.experiment) {
                setCurrentExp(data.experiment);
                if (onExperimentUpdated) onExperimentUpdated(data.experiment);
            }
        } catch (err) {
            console.error("Failed to toggle pin", err);
        }
    };

    const handleToggleCurated = async () => {
        const newCurated = !currentExp.isCurated;
        try {
            const res = await fetch(`/api/experiments/${currentExp.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isCurated: newCurated }),
            });
            const data = await res.json();
            if (res.ok && data.experiment) {
                setCurrentExp(data.experiment);
                if (onExperimentUpdated) onExperimentUpdated(data.experiment);
            }
        } catch (err) {
            console.error("Failed to toggle curated", err);
        }
    };

    const handleToggleVisibility = async () => {
        const newVisibility = currentExp.visibility === "public" ? "private" : "public";
        try {
            const res = await fetch(`/api/experiments/${currentExp.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ visibility: newVisibility }),
            });
            const data = await res.json();
            if (res.ok && data.experiment) {
                setCurrentExp(data.experiment);
                if (onExperimentUpdated) onExperimentUpdated(data.experiment);
            }
        } catch (err) {
            console.error("Failed to toggle visibility", err);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this experiment?")) return;
        try {
            const res = await fetch(`/api/experiments/${currentExp.id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                if (onExperimentDeleted) onExperimentDeleted(currentExp.id);
                onClose();
            }
        } catch (err) {
            console.error("Failed to delete experiment", err);
        }
    };

    const handleSubmitChangeRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!requestMessage.trim()) return;

        setSubmittingRequest(true);
        try {
            const res = await fetch(`/api/experiments/${currentExp.id}/change-request`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: requestMessage.trim() }),
            });
            const data = await res.json();
            if (res.ok && data.changeRequests) {
                const updated = { ...currentExp, changeRequests: data.changeRequests };
                setCurrentExp(updated);
                if (onExperimentUpdated) onExperimentUpdated(updated);
                setRequestMessage("");
                setShowRequestForm(false);
            }
        } catch (err) {
            console.error("Failed to submit change request", err);
        } finally {
            setSubmittingRequest(false);
        }
    };

    const handleResolveRequest = async (requestId?: string) => {
        setResolvingId(requestId || "latest");
        try {
            const res = await fetch(`/api/experiments/${currentExp.id}/change-request`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ requestId }),
            });
            const data = await res.json();
            if (res.ok && data.changeRequests) {
                const updated = { ...currentExp, changeRequests: data.changeRequests };
                setCurrentExp(updated);
                if (onExperimentUpdated) onExperimentUpdated(updated);
            }
        } catch (err) {
            console.error("Failed to resolve change request", err);
        } finally {
            setResolvingId(null);
        }
    };

    if (isEditing) {
        return (
            <ExperimentEditorDrawer
                experiment={currentExp}
                onClose={() => setIsEditing(false)}
                onSaved={(updated) => {
                    setIsEditing(false);
                    setCurrentExp(updated);
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
            case "Active": return "bg-green-500/20 text-green-400 border-green-500/30";
            case "Completed": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
            case "Archived": return "bg-gray-500/20 text-gray-400 border-gray-500/30";
            case "Planning": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
            default: return "bg-muted text-muted-foreground";
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case "Frontend": return "bg-purple-500/20 text-purple-400";
            case "Backend": return "bg-orange-500/20 text-orange-400";
            case "Full Stack": return "bg-cyan-500/20 text-cyan-400";
            case "AI/ML": return "bg-pink-500/20 text-pink-400";
            case "Mobile": return "bg-indigo-500/20 text-indigo-400";
            case "DevOps": return "bg-emerald-500/20 text-emerald-400";
            default: return "bg-muted text-muted-foreground";
        }
    };

    const pendingRequests = (currentExp.changeRequests || []).filter((r: any) => r.status === "pending");

    const headerLeft = (
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
            <span className={cn(
                "px-2 py-0.5 rounded text-[10px] font-semibold border",
                getStatusColor(currentExp.status)
            )}>
                {currentExp.status}
            </span>
            <span className={cn(
                "px-2 py-0.5 rounded text-[10px] font-semibold",
                getTypeColor(currentExp.type)
            )}>
                {currentExp.type}
            </span>
            {currentExp.isCurated && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-500 border border-amber-500/25">
                    <Star className="h-2.5 w-2.5" />
                    Curated
                </span>
            )}
            {currentExp.isPinned && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-500 border border-amber-500/25">
                    <Pin className="h-2.5 w-2.5 fill-current" />
                    Pinned
                </span>
            )}
            {currentExp.visibility && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted/60 text-muted-foreground border border-border/40">
                    {currentExp.visibility === "public" ? <Globe className="h-2.5 w-2.5 text-emerald-500" /> : <Lock className="h-2.5 w-2.5" />}
                    {currentExp.visibility === "public" ? "Community" : "Private"}
                </span>
            )}
        </div>
    );

    const headerIconTools = (
        <div className="flex items-center gap-0.5">
            {/* Curate (Admin) */}
            {canCurate && (
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                        "h-6 w-6 rounded-md transition-colors",
                        currentExp.isCurated
                            ? "text-amber-500 bg-amber-500/15 hover:bg-amber-500/25"
                            : "text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10"
                    )}
                    onClick={handleToggleCurated}
                    title={currentExp.isCurated ? "Certified Curated (Click to uncurate)" : "Mark as Official Curated Content"}
                >
                    <Star className={cn("h-3.5 w-3.5", currentExp.isCurated && "fill-current")} />
                </Button>
            )}

            {/* Pin (Mod & Admin) */}
            {canPin && (
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                        "h-6 w-6 rounded-md transition-colors",
                        currentExp.isPinned
                            ? "text-amber-500 bg-amber-500/15 hover:bg-amber-500/25"
                            : "text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10"
                    )}
                    onClick={handleTogglePin}
                    title={currentExp.isPinned ? "Pinned to Top (Click to unpin)" : "Pin Experiment to Top"}
                >
                    <Pin className={cn("h-3.5 w-3.5", currentExp.isPinned && "fill-current")} />
                </Button>
            )}

            {/* Visibility Toggle */}
            {canChangeVisibility(currentExp.authorId) && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-md text-muted-foreground hover:text-foreground"
                    onClick={handleToggleVisibility}
                    title={`Currently ${currentExp.visibility || "public"}. Click to switch.`}
                >
                    {currentExp.visibility === "public" ? (
                        <Globe className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                        <Lock className="h-3.5 w-3.5" />
                    )}
                </Button>
            )}

            {/* Request Changes (Mod & Admin) */}
            {canRequestChanges && (
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                        "h-6 w-6 rounded-md transition-colors",
                        showRequestForm
                            ? "text-amber-500 bg-amber-500/15"
                            : "text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10"
                    )}
                    onClick={() => setShowRequestForm(!showRequestForm)}
                    title="Request Revision from Author"
                >
                    <MessageSquare className="h-3.5 w-3.5" />
                </Button>
            )}

            {/* Edit (Author / Mod / Admin) */}
            {canEdit(currentExp.authorId) && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-md text-muted-foreground hover:text-foreground"
                    onClick={() => setIsEditing(true)}
                    title="Edit Experiment"
                >
                    <Edit3 className="h-3.5 w-3.5" />
                </Button>
            )}

            {/* Delete (Author / Admin) */}
            {canDelete(currentExp.authorId) && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={handleDelete}
                    title="Delete Experiment"
                >
                    <Trash2 className="h-3.5 w-3.5" />
                </Button>
            )}
        </div>
    );

    const technologies = currentExp.technologies || currentExp.techStack || [];
    const learnings = currentExp.learnings || currentExp.highlights || [];
    const demoUrl = currentExp.demoUrl || currentExp.liveUrl;
    const githubUrl = currentExp.githubUrl;

    return (
        <BaseDrawer
            onClose={onClose}
            position={position}
            defaultWidth="720px"
            defaultHeight="580px"
            headerLeft={headerLeft}
            headerIconTools={headerIconTools}
        >
            <div className="p-6">
                <div className="space-y-5">
                    {/* Inline Change Request Form (Mod / Admin) */}
                    {showRequestForm && (
                        <form
                            onSubmit={handleSubmitChangeRequest}
                            className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3.5 space-y-2.5 text-xs"
                        >
                            <div className="flex items-center justify-between text-amber-500 font-medium">
                                <span className="flex items-center gap-1.5">
                                    <MessageSquare className="h-3.5 w-3.5" /> Request changes from author
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setShowRequestForm(false)}
                                    className="text-muted-foreground hover:text-foreground text-[11px]"
                                >
                                    Cancel
                                </button>
                            </div>
                            <textarea
                                value={requestMessage}
                                onChange={(e) => setRequestMessage(e.target.value)}
                                placeholder="Specify what needs to be improved or corrected before approval..."
                                rows={2}
                                className="w-full text-xs p-2.5 rounded-md border border-border/60 bg-background focus:outline-none focus:border-amber-500/50 resize-none font-sans"
                                required
                            />
                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowRequestForm(false)}
                                    className="h-7 text-xs"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    size="sm"
                                    disabled={submittingRequest || !requestMessage.trim()}
                                    className="h-7 px-3 text-xs bg-amber-600 hover:bg-amber-700 text-white font-medium gap-1.5"
                                >
                                    {submittingRequest ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                                    Send Request
                                </Button>
                            </div>
                        </form>
                    )}

                    {/* Pending Change Requests Banner */}
                    {pendingRequests.map((req: any, idx: number) => (
                        <div
                            key={req._id || idx}
                            className="rounded-lg border border-amber-500/30 bg-amber-500/5 px-3.5 py-2.5 text-xs space-y-1.5"
                        >
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-1.5 text-amber-500 font-medium text-xs">
                                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                    <span>Revision requested by @{req.requestedBy}</span>
                                    {req.requestedByRole && req.requestedByRole !== "user" && (
                                        <RoleBadge role={req.requestedByRole} size="sm" />
                                    )}
                                </div>
                                {canResolve && (
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleResolveRequest(req._id)}
                                        disabled={resolvingId === (req._id || "latest")}
                                        className="h-6 px-2 text-[11px] font-medium text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10 gap-1"
                                    >
                                        {resolvingId === (req._id || "latest") ? (
                                            <Loader2 className="h-3 w-3 animate-spin" />
                                        ) : (
                                            <CheckCircle2 className="h-3 w-3" />
                                        )}
                                        Mark Resolved
                                    </Button>
                                )}
                            </div>
                            <p className="text-foreground/90 font-mono text-[11px] pl-5 border-l border-amber-500/30 leading-relaxed">
                                "{req.message}"
                            </p>
                        </div>
                    ))}

                    {/* Title & Author row */}
                    <div className="space-y-2">
                        <div className="flex items-baseline justify-between gap-3 flex-wrap">
                            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">{currentExp.title}</h2>
                            {currentExp.authorUsername && (
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
                                    <span>Built by <strong className="text-foreground font-medium">@{currentExp.authorUsername}</strong></span>
                                    {currentExp.authorRole && currentExp.authorRole !== "user" && String(currentExp.authorId) !== String(user?._id) && (
                                        <RoleBadge role={currentExp.authorRole} size="sm" />
                                    )}
                                </div>
                            )}
                        </div>

                        <p className="text-sm text-muted-foreground leading-relaxed">{currentExp.description}</p>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground/70 pt-0.5">
                            <span className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                Started: {currentExp.startDate || "Recently"}
                            </span>
                            {currentExp.endDate && (
                                <span>Ended: {currentExp.endDate}</span>
                            )}
                        </div>
                    </div>

                    {/* Technologies */}
                    {technologies.length > 0 && (
                        <div className="space-y-1.5">
                            <h3 className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">Technologies</h3>
                            <div className="flex flex-wrap gap-1.5">
                                {technologies.map((tech: string) => (
                                    <span
                                        key={tech}
                                        className="inline-flex items-center rounded px-2.5 py-0.5 text-[11px] font-semibold border border-border/60 bg-muted/40"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Learnings / Highlights */}
                    {learnings.length > 0 && (
                        <div className="space-y-1.5">
                            <h3 className="text-xs font-semibold tracking-wider uppercase text-muted-foreground flex items-center gap-1.5">
                                <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
                                Key Learnings & Breakthroughs
                            </h3>
                            <ul className="space-y-1.5 rounded-lg border border-border/40 bg-muted/15 p-3.5">
                                {learnings.map((learning: string, index: number) => (
                                    <li key={index} className="text-xs text-foreground/85 flex items-start gap-2 leading-relaxed">
                                        <span className="text-primary mt-0.5">•</span>
                                        <span>{learning}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Links */}
                    <div className="flex gap-2.5 pt-1">
                        {githubUrl && (
                            <Button variant="outline" size="sm" asChild className="h-8 text-xs font-medium">
                                <a href={githubUrl} target="_blank" rel="noopener noreferrer">
                                    <Github className="h-3.5 w-3.5 mr-1.5" />
                                    View Code
                                </a>
                            </Button>
                        )}
                        {demoUrl && (
                            <Button size="sm" asChild className="h-8 text-xs font-medium">
                                <a href={demoUrl} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
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
