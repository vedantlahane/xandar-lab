// app/lab/experiments/components/ExperimentDrawer.tsx
"use client";

import { useState, useEffect } from "react";
import { ExternalLink, Github, Calendar, Lightbulb, Edit3, Globe, Lock, Pin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BaseDrawer } from "@/app/lab/components/shared/BaseDrawer";
import { useAuth } from "@/components/auth/AuthContext";
import { usePermissions } from "@/components/auth/hooks/usePermissions";
import { AuthorCard } from "@/components/shared/AuthorCard";
import { ChangeRequestBanner } from "@/components/shared/ChangeRequestBanner";
import { ModerationBar } from "@/components/shared/ModerationBar";
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

    const handleTogglePin = async (newPinned: boolean) => {
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

    const handleToggleCurated = async (newCurated: boolean) => {
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

    const handleToggleVisibility = async (newVisibility: "public" | "private") => {
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

    const handleRequestsUpdated = (requests: any[]) => {
        const updated = { ...currentExp, changeRequests: requests };
        setCurrentExp(updated);
        if (onExperimentUpdated) onExperimentUpdated(updated);
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

    const headerLeft = (
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
            <span className={cn(
                "px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                getStatusColor(currentExp.status)
            )}>
                {currentExp.status}
            </span>
            <span className={cn(
                "px-2 py-0.5 rounded-full text-[10px] font-semibold",
                getTypeColor(currentExp.type)
            )}>
                {currentExp.type}
            </span>
            {currentExp.isCurated && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/15 text-purple-400 border border-purple-500/30">
                    <Sparkles className="h-2.5 w-2.5" />
                    Curated
                </span>
            )}
            {currentExp.isPinned && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    <Pin className="h-3 w-3 fill-current" />
                    Pinned
                </span>
            )}
            {currentExp.visibility && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground border border-border/40">
                    {currentExp.visibility === "public" ? <Globe className="h-2.5 w-2.5 text-emerald-500" /> : <Lock className="h-2.5 w-2.5" />}
                    {currentExp.visibility === "public" ? "Community" : "Private"}
                </span>
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
            defaultHeight="600px"
            headerLeft={headerLeft}
        >
            <div className="p-6">
                <div className="space-y-5">
                    {/* Top Bar: Author Showcase & In-Situ Moderation Bar */}
                    <div className="flex items-center justify-between gap-3 flex-wrap pb-3.5 border-b border-border/40">
                        <AuthorCard
                            username={currentExp.authorUsername || "Anonymous"}
                            role={currentExp.authorRole || "user"}
                            date={currentExp.startDate || currentExp.createdAt}
                            size="md"
                        />

                        <ModerationBar
                            itemId={currentExp.id}
                            itemType="experiments"
                            isPinned={!!currentExp.isPinned}
                            isCurated={!!currentExp.isCurated}
                            visibility={currentExp.visibility || "public"}
                            authorId={currentExp.authorId}
                            currentUserId={user?._id}
                            currentUserRole={user?.role}
                            canPin={canPin}
                            canCurate={canCurate}
                            canChangeVisibility={canChangeVisibility(currentExp.authorId)}
                            canRequestChanges={canRequestChanges}
                            canEdit={canEdit(currentExp.authorId)}
                            canDelete={canDelete(currentExp.authorId)}
                            onTogglePin={handleTogglePin}
                            onToggleCurated={handleToggleCurated}
                            onToggleVisibility={handleToggleVisibility}
                            onRequestChangesClick={() => setShowRequestForm((prev) => !prev)}
                            onEditClick={() => setIsEditing(true)}
                            onDeleteClick={handleDelete}
                        />
                    </div>

                    {/* Change Request Banner (Revisions requested, mod form) */}
                    <ChangeRequestBanner
                        changeRequests={currentExp.changeRequests || []}
                        itemId={currentExp.id}
                        itemType="experiments"
                        isAuthor={isAuthor}
                        isModerator={isModerator}
                        isAdmin={isAdmin}
                        showRequestForm={showRequestForm}
                        onCloseForm={() => setShowRequestForm(false)}
                        onRequestsUpdated={handleRequestsUpdated}
                    />

                    {/* Title & Description */}
                    <div className="space-y-2.5">
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">{currentExp.title}</h2>
                        <p className="text-sm text-muted-foreground leading-relaxed">{currentExp.description}</p>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground/70 pt-1">
                            <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Started: {currentExp.startDate || "Recently"}
                            </span>
                            {currentExp.endDate && (
                                <span>Ended: {currentExp.endDate}</span>
                            )}
                        </div>
                    </div>

                    {/* Technologies */}
                    {technologies.length > 0 && (
                        <div className="space-y-2">
                            <h3 className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">Technologies</h3>
                            <div className="flex flex-wrap gap-1.5">
                                {technologies.map((tech: string) => (
                                    <span
                                        key={tech}
                                        className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-semibold border border-border/60 bg-muted/40"
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
                            <h3 className="text-xs font-semibold tracking-wider uppercase text-muted-foreground flex items-center gap-1.5">
                                <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
                                Key Learnings & Breakthroughs
                            </h3>
                            <ul className="space-y-1.5 rounded-xl border border-border/40 bg-muted/15 p-4">
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
                    <div className="flex gap-2.5 pt-2">
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
