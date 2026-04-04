"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Maximize2, Minimize2, X, ThumbsUp, Copy, ShieldAlert, Sparkles, Target, ChevronDown, ChevronUp, ExternalLink, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { IIdea } from "@/models/Idea";

export function IdeaDrawer({
    idea,
    onClose,
}: {
    idea: IIdea;
    onClose: () => void;
}) {
    const [isMaximized, setIsMaximized] = useState(false);
    const [hasVoted, setHasVoted] = useState(false);
    const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
    const [openSections, setOpenSections] = useState({ evidence: false });

    // Initial explicit math just centers it natively to mimic other Drawers.
    const initialPos = { x: typeof window !== "undefined" ? window.innerWidth / 2 - 350 : 100, y: typeof window !== "undefined" ? window.innerHeight / 2 - 275 : 100 };

    const getTone = (conf: number) => {
        if (conf >= 80) return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
        if (conf >= 60) return "bg-amber-500/20 text-amber-400 border-amber-500/30";
        return "bg-red-500/20 text-red-400 border-red-500/30";
    };

    const handleVote = async () => {
        if (hasVoted) return;
        try {
            setHasVoted(true);
            idea.upvotes += 1;
            fetch(`/api/ideas/${idea.slug}/vote`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "upvote" })
            });
        } catch { /* empty */ }
    };

    const copyMarkdown = async () => {
        const md = `## ${idea.title}\n\n- Confidence: ${idea.confidence}\n- Domain: ${idea.domain}\n\n### Problem\n${idea.problem}\n\n### Solution\n${idea.solution}`;
        try {
            await navigator.clipboard.writeText(md);
            setCopyState("copied");
            setTimeout(() => setCopyState("idle"), 2000);
        } catch {
            setCopyState("failed");
            setTimeout(() => setCopyState("idle"), 2000);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                onClick={onClose}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto"
            />

            {/* Window */}
            <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    width: isMaximized ? "100%" : "800px",
                    height: isMaximized ? "100%" : "80vh",
                    maxWidth: "100vw",
                    maxHeight: "100vh"
                }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className={cn(
                    "pointer-events-auto relative flex flex-col bg-card shadow-2xl border border-border overflow-hidden",
                    isMaximized ? "rounded-none" : "rounded-2xl"
                )}
            >
                {/* Header */}
                <div
                    className="flex items-center justify-between border-b border-border/40 px-4 py-3 bg-muted/30 select-none"
                    onDoubleClick={() => setIsMaximized(!isMaximized)}
                >
                    <div className="flex items-center gap-3">
                        <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold border", getTone(idea.confidence))}>
                            {idea.confidence}% Confidence
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider">
                            {idea.domain.replace(/-/g, " ")}
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsMaximized(!isMaximized)}>
                            {isMaximized ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-destructive/10 hover:text-destructive" onClick={onClose}>
                            <X className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 lg:p-8 thin-scrollbar">
                    <div className="space-y-8 max-w-4xl mx-auto">
                        
                        <div className="space-y-4">
                            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight leading-tight">{idea.title}</h2>
                            <div className="flex flex-wrap gap-3">
                                <Button onClick={handleVote} disabled={hasVoted} size="sm" className={cn("h-8 px-4", hasVoted ? "bg-primary/20 text-primary" : "")}>
                                    <ThumbsUp className="h-3.5 w-3.5 mr-2" />
                                    {hasVoted ? "Upvoted" : "Upvote"} ({idea.upvotes})
                                </Button>
                                <Button variant="outline" size="sm" onClick={copyMarkdown} className="h-8 px-4">
                                    <Copy className="h-3.5 w-3.5 mr-2" />
                                    {copyState === "copied" ? "Copied!" : "Copy MD"}
                                </Button>
                                <Button variant="outline" size="sm" asChild className="h-8 px-4 text-primary border-primary/30 hover:bg-primary/10">
                                    <a href="/lab/experiments"><Rocket className="h-3.5 w-3.5 mr-2" /> Build It</a>
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <h3 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground flex items-center gap-2">
                                    <span className="h-6 w-6 rounded-md bg-primary/10 flex items-center justify-center">
                                        <Target className="h-3.5 w-3.5 text-primary" />
                                    </span>
                                    The Problem
                                </h3>
                                <div className="text-sm text-foreground/80 leading-relaxed bg-muted/20 p-4 rounded-xl border border-border/40">
                                    {idea.problem}
                                </div>
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground flex items-center gap-2">
                                    <span className="h-6 w-6 rounded-md bg-emerald-500/10 flex items-center justify-center">
                                        <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
                                    </span>
                                    The Solution
                                </h3>
                                <div className="text-sm text-foreground/80 leading-relaxed bg-muted/20 p-4 rounded-xl border border-border/40">
                                    {idea.solution}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl border border-border/40 bg-card/30">
                            <div className="space-y-1.5"><span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Target User</span><p className="text-xs font-medium">{idea.targetUser}</p></div>
                            <div className="space-y-1.5"><span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Timeline</span><p className="text-xs font-medium">{idea.timeline || "2-4 weeks"}</p></div>
                            <div className="space-y-1.5"><span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Monetization</span><p className="text-xs font-medium line-clamp-2">{idea.monetization || "N/A"}</p></div>
                            <div className="space-y-1.5"><span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Stack</span><p className="text-xs font-medium line-clamp-2">{idea.techStack.join(", ")}</p></div>
                        </div>

                        {idea.risks && (
                            <div className="space-y-3">
                                <h3 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground flex items-center gap-2">
                                    <ShieldAlert className="h-4 w-4 text-red-500" /> Risks
                                </h3>
                                <ul className="space-y-2 text-sm text-foreground/80 pl-2 border-l-2 border-red-500/30">
                                    {idea.risks.split("\n").map((r, i) => <li key={i} className="pl-3">{r.replace(/^- /, "")}</li>)}
                                </ul>
                            </div>
                        )}

                        <div className="space-y-3">
                            <button
                                onClick={() => setOpenSections({ evidence: !openSections.evidence })}
                                className="flex w-full items-center justify-between p-4 rounded-xl bg-card border border-border/50 hover:bg-muted/30 transition-colors group"
                            >
                                <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">Market Evidence & Links</span>
                                {openSections.evidence ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </button>
                            
                            {openSections.evidence && (
                                <div className="p-4 bg-muted/10 rounded-xl border border-border/30 space-y-3">
                                    {idea.evidence?.length > 0 ? idea.evidence.map((ev, i) => (
                                        <a key={i} href={ev.url} target="_blank" rel="noreferrer" className="flex flex-col gap-1 p-3 rounded-lg border border-border/50 bg-background hover:border-primary/40 transition-colors">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-semibold">{ev.source}</span>
                                                <ExternalLink className="h-3 w-3 text-muted-foreground" />
                                            </div>
                                            {ev.snippet && <span className="text-[10px] text-muted-foreground line-clamp-2">{ev.snippet}</span>}
                                        </a>
                                    )) : (
                                        <p className="text-xs text-muted-foreground italic">No external links attached.</p>
                                    )}
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </motion.div>
        </div>
    );
}
