// app/lab/ideas/components/IdeaDrawer.tsx
"use client";

import { useState, useEffect } from "react";
import { Copy, ShieldAlert, Sparkles, Target, ChevronDown, ChevronUp, ExternalLink, Rocket, ThumbsUp, Pin, Trash2, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BaseDrawer } from "@/app/lab/components/shared/BaseDrawer";
import { useAuth } from "@/components/auth/AuthContext";
import { usePermissions } from "@/components/auth/hooks/usePermissions";
import { AuthorCard } from "@/components/shared/AuthorCard";
import type { IIdea } from "@/models/Idea";

export function IdeaDrawer({
    idea,
    onClose,
    position,
    onIdeaUpdated,
    onIdeaDeleted,
}: {
    idea: IIdea;
    onClose: () => void;
    position?: { x: number; y: number };
    onIdeaUpdated?: (updated: IIdea) => void;
    onIdeaDeleted?: (slug: string) => void;
}) {
    const [currentIdea, setCurrentIdea] = useState<IIdea>(idea);
    const [hasVoted, setHasVoted] = useState(false);
    const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
    const [openSections, setOpenSections] = useState({ evidence: false });
    const [loadingAction, setLoadingAction] = useState<string | null>(null);

    const { user } = useAuth();
    const { canPin, canCurate, canDelete } = usePermissions();

    useEffect(() => {
        setCurrentIdea(idea);
    }, [idea]);

    const isAuthor = !!(
        user?._id &&
        currentIdea?.authorId &&
        user._id.toString() === currentIdea.authorId.toString()
    );

    const userCanDelete = canDelete(currentIdea.authorId?.toString());

    const getTone = (conf: number) => {
        if (conf >= 80) return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
        if (conf >= 60) return "bg-amber-500/20 text-amber-400 border-amber-500/30";
        return "bg-red-500/20 text-red-400 border-red-500/30";
    };

    const handleVote = async () => {
        if (hasVoted) return;
        try {
            setHasVoted(true);
            const updated = { ...currentIdea, upvotes: currentIdea.upvotes + 1 };
            setCurrentIdea(updated);
            if (onIdeaUpdated) onIdeaUpdated(updated);

            await fetch(`/api/ideas/${currentIdea.slug}/vote`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "upvote" }),
            });
        } catch { /* empty */ }
    };

    const handleTogglePin = async () => {
        setLoadingAction("pin");
        try {
            const newPinned = !currentIdea.isPinned;
            const res = await fetch(`/api/ideas/${currentIdea.slug}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isPinned: newPinned }),
            });
            const data = await res.json();
            if (res.ok && data.idea) {
                setCurrentIdea(data.idea);
                if (onIdeaUpdated) onIdeaUpdated(data.idea);
            }
        } catch (err) {
            console.error("Failed to toggle pin", err);
        } finally {
            setLoadingAction(null);
        }
    };

    const handleToggleCurated = async () => {
        setLoadingAction("curate");
        try {
            const newCurated = !currentIdea.isCurated;
            const res = await fetch(`/api/ideas/${currentIdea.slug}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isCurated: newCurated }),
            });
            const data = await res.json();
            if (res.ok && data.idea) {
                setCurrentIdea(data.idea);
                if (onIdeaUpdated) onIdeaUpdated(data.idea);
            }
        } catch (err) {
            console.error("Failed to toggle curated", err);
        } finally {
            setLoadingAction(null);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to permanently delete this idea?")) return;
        setLoadingAction("delete");
        try {
            const res = await fetch(`/api/ideas/${currentIdea.slug}`, {
                method: "DELETE",
            });
            if (res.ok) {
                if (onIdeaDeleted) onIdeaDeleted(currentIdea.slug);
                onClose();
            }
        } catch (err) {
            console.error("Failed to delete idea", err);
        } finally {
            setLoadingAction(null);
        }
    };

    const copyMarkdown = async () => {
        const md = `## ${currentIdea.title}\n\n- Confidence: ${currentIdea.confidence}%\n- Domain: ${currentIdea.domain}\n\n### Problem\n${currentIdea.problem}\n\n### Solution\n${currentIdea.solution}`;
        try {
            await navigator.clipboard.writeText(md);
            setCopyState("copied");
            setTimeout(() => setCopyState("idle"), 2000);
        } catch {
            setCopyState("failed");
            setTimeout(() => setCopyState("idle"), 2000);
        }
    };

    const headerLeft = (
        <div className="flex items-center gap-2 flex-wrap">
            <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold border", getTone(currentIdea.confidence))}>
                {currentIdea.confidence}% Confidence
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider">
                {currentIdea.domain.replace(/-/g, " ")}
            </span>
            {currentIdea.isCurated && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/15 text-purple-400 border border-purple-500/30">
                    <Sparkles className="h-2.5 w-2.5" />
                    Curated
                </span>
            )}
            {currentIdea.isPinned && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    <Pin className="h-3 w-3 fill-current" />
                    Pinned
                </span>
            )}
        </div>
    );

    return (
        <BaseDrawer
            onClose={onClose}
            position={position}
            defaultWidth="800px"
            defaultHeight="85vh"
            headerLeft={headerLeft}
        >
            <div className="p-6 lg:p-8">
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Top Bar: Author Showcase & In-Situ Moderation Bar */}
                    <div className="flex items-center justify-between gap-3 flex-wrap pb-3.5 border-b border-border/40">
                        <AuthorCard
                            username={currentIdea.authorUsername || "AI Research Agent"}
                            role={currentIdea.authorRole || "admin"}
                            date={currentIdea.createdAt}
                            size="md"
                        />

                        {/* In-situ Moderation Controls */}
                        <div className="flex items-center gap-1.5 p-1 rounded-xl border border-border/60 bg-card/40 backdrop-blur-md">
                            {canCurate && (
                                <Button
                                    type="button"
                                    variant={currentIdea.isCurated ? "default" : "outline"}
                                    size="sm"
                                    onClick={handleToggleCurated}
                                    disabled={loadingAction === "curate"}
                                    className={cn(
                                        "h-7 px-2.5 text-xs font-semibold gap-1",
                                        currentIdea.isCurated
                                            ? "bg-purple-600 hover:bg-purple-700 text-white shadow-xs"
                                            : "text-purple-400 border-purple-500/30 hover:bg-purple-500/10"
                                    )}
                                    title={currentIdea.isCurated ? "Certified Curated" : "Mark as Official Curated Idea"}
                                >
                                    {loadingAction === "curate" ? (
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                    ) : (
                                        <Sparkles className="h-3 w-3" />
                                    )}
                                    <span>{currentIdea.isCurated ? "Curated" : "Curate"}</span>
                                </Button>
                            )}

                            {canPin && (
                                <Button
                                    type="button"
                                    variant={currentIdea.isPinned ? "default" : "ghost"}
                                    size="sm"
                                    onClick={handleTogglePin}
                                    disabled={loadingAction === "pin"}
                                    className={cn(
                                        "h-7 px-2.5 text-xs font-medium gap-1",
                                        currentIdea.isPinned
                                            ? "bg-amber-500 hover:bg-amber-600 text-white shadow-xs"
                                            : "text-muted-foreground hover:text-amber-500"
                                    )}
                                    title={currentIdea.isPinned ? "Pinned to Top" : "Pin Idea"}
                                >
                                    {loadingAction === "pin" ? (
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                    ) : (
                                        <Pin className={cn("h-3 w-3", currentIdea.isPinned && "fill-current")} />
                                    )}
                                    <span>{currentIdea.isPinned ? "Pinned" : "Pin"}</span>
                                </Button>
                            )}

                            {userCanDelete && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleDelete}
                                    disabled={loadingAction === "delete"}
                                    className="h-7 px-2 text-xs font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                    title="Delete Idea"
                                >
                                    {loadingAction === "delete" ? (
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                    ) : (
                                        <Trash2 className="h-3.5 w-3.5" />
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Title & Main Actions */}
                    <div className="space-y-4">
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight text-foreground">{currentIdea.title}</h2>
                        <div className="flex flex-wrap gap-2.5">
                            <Button onClick={handleVote} disabled={hasVoted} size="sm" className={cn("h-8 px-3.5 text-xs", hasVoted ? "bg-primary/20 text-primary" : "")}>
                                <ThumbsUp className="h-3.5 w-3.5 mr-1.5" />
                                {hasVoted ? "Upvoted" : "Upvote"} ({currentIdea.upvotes})
                            </Button>
                            <Button variant="outline" size="sm" onClick={copyMarkdown} className="h-8 px-3.5 text-xs">
                                {copyState === "copied" ? (
                                    <>
                                        <Check className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="h-3.5 w-3.5 mr-1.5" />
                                        Copy MD
                                    </>
                                )}
                            </Button>
                            <Button variant="outline" size="sm" asChild className="h-8 px-3.5 text-xs text-primary border-primary/30 hover:bg-primary/10">
                                <a href="/lab/experiments"><Rocket className="h-3.5 w-3.5 mr-1.5" /> Build It</a>
                            </Button>
                        </div>
                    </div>

                    {/* Problem & Solution Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2.5">
                            <h3 className="text-xs font-semibold tracking-wider uppercase text-muted-foreground flex items-center gap-2">
                                <span className="h-6 w-6 rounded-md bg-primary/10 flex items-center justify-center">
                                    <Target className="h-3.5 w-3.5 text-primary" />
                                </span>
                                The Problem
                            </h3>
                            <div className="text-sm text-foreground/85 leading-relaxed bg-muted/20 p-4 rounded-xl border border-border/40">
                                {currentIdea.problem}
                            </div>
                        </div>
                        <div className="space-y-2.5">
                            <h3 className="text-xs font-semibold tracking-wider uppercase text-muted-foreground flex items-center gap-2">
                                <span className="h-6 w-6 rounded-md bg-emerald-500/10 flex items-center justify-center">
                                    <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
                                </span>
                                The Solution
                            </h3>
                            <div className="text-sm text-foreground/85 leading-relaxed bg-muted/20 p-4 rounded-xl border border-border/40">
                                {currentIdea.solution}
                            </div>
                        </div>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 p-4 rounded-xl border border-border/40 bg-card/30 text-xs">
                        <div className="space-y-1"><span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Target User</span><p className="font-medium text-foreground">{currentIdea.targetUser}</p></div>
                        <div className="space-y-1"><span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Timeline</span><p className="font-medium text-foreground">{currentIdea.timeline || "2-4 weeks"}</p></div>
                        <div className="space-y-1"><span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Monetization</span><p className="font-medium text-foreground line-clamp-2">{currentIdea.monetization || "N/A"}</p></div>
                        <div className="space-y-1"><span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Stack</span><p className="font-medium text-foreground line-clamp-2">{currentIdea.techStack?.join(", ") || "Full Stack"}</p></div>
                    </div>

                    {/* Risks */}
                    {currentIdea.risks && (
                        <div className="space-y-2.5">
                            <h3 className="text-xs font-semibold tracking-wider uppercase text-muted-foreground flex items-center gap-2">
                                <ShieldAlert className="h-3.5 w-3.5 text-red-500" /> Identified Risks
                            </h3>
                            <ul className="space-y-1.5 text-xs text-foreground/80 pl-2 border-l-2 border-red-500/30">
                                {currentIdea.risks.split("\n").map((r, i) => (
                                    <li key={i} className="pl-2.5 leading-relaxed">{r.replace(/^- /, "")}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Market Evidence & Links */}
                    <div className="space-y-3">
                        <button
                            onClick={() => setOpenSections({ evidence: !openSections.evidence })}
                            className="flex w-full items-center justify-between p-3.5 rounded-xl bg-card border border-border/50 hover:bg-muted/30 transition-colors group"
                        >
                            <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">Market Evidence & Links</span>
                            {openSections.evidence ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </button>
                        
                        {openSections.evidence && (
                            <div className="p-4 bg-muted/10 rounded-xl border border-border/30 space-y-2.5">
                                {currentIdea.evidence?.length > 0 ? currentIdea.evidence.map((ev, i) => (
                                    <a key={i} href={ev.url} target="_blank" rel="noreferrer" className="flex flex-col gap-1 p-3 rounded-lg border border-border/50 bg-background hover:border-primary/40 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-semibold">{ev.source}</span>
                                            <ExternalLink className="h-3 w-3 text-muted-foreground" />
                                        </div>
                                        {ev.snippet && <span className="text-[11px] text-muted-foreground line-clamp-2">{ev.snippet}</span>}
                                    </a>
                                )) : (
                                    <p className="text-xs text-muted-foreground italic">No external links attached.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </BaseDrawer>
    );
}
