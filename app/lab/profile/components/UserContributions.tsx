// app/lab/profile/components/UserContributions.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    StickyNote, Beaker, Lightbulb, ExternalLink,
    Lock, Globe, Plus, Calendar, Tag, Loader2, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UserContributionsProps {
    initialCounts?: {
        notes?: number;
        experiments?: number;
        ideas?: number;
    };
}

export function UserContributions({ initialCounts }: UserContributionsProps) {
    const [activeSection, setActiveSection] = useState<"notes" | "experiments" | "ideas">("notes");
    const [notes, setNotes] = useState<any[]>([]);
    const [experiments, setExperiments] = useState<any[]>([]);
    const [ideas, setIdeas] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        async function fetchContributions() {
            setLoading(true);
            try {
                const [notesRes, expRes, ideasRes] = await Promise.all([
                    fetch("/api/notes?tab=my"),
                    fetch("/api/experiments?tab=my"),
                    fetch("/api/ideas?tab=my&limit=100"),
                ]);

                if (isMounted) {
                    if (notesRes.ok) {
                        const data = await notesRes.json();
                        setNotes(data.notes || []);
                    }
                    if (expRes.ok) {
                        const data = await expRes.json();
                        setExperiments(data.experiments || []);
                    }
                    if (ideasRes.ok) {
                        const data = await ideasRes.json();
                        // Backend returns ideas
                        setIdeas(data.ideas || []);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch user contributions:", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        fetchContributions();
        return () => { isMounted = false; };
    }, []);

    const notesCount = notes.length || initialCounts?.notes || 0;
    const experimentsCount = experiments.length || initialCounts?.experiments || 0;
    const ideasCount = ideas.length || initialCounts?.ideas || 0;

    return (
        <div className="space-y-6">
            {/* Section tabs */}
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-muted/40 border border-border/40 w-fit">
                <button
                    onClick={() => setActiveSection("notes")}
                    className={cn(
                        "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all",
                        activeSection === "notes"
                            ? "bg-background text-foreground shadow-sm font-semibold"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <StickyNote className={cn("h-3.5 w-3.5", activeSection === "notes" ? "text-primary" : "text-muted-foreground")} />
                    <span>My Notes</span>
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-muted font-bold text-muted-foreground">
                        {notesCount}
                    </span>
                </button>

                <button
                    onClick={() => setActiveSection("experiments")}
                    className={cn(
                        "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all",
                        activeSection === "experiments"
                            ? "bg-background text-foreground shadow-sm font-semibold"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <Beaker className={cn("h-3.5 w-3.5", activeSection === "experiments" ? "text-primary" : "text-muted-foreground")} />
                    <span>Experiments</span>
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-muted font-bold text-muted-foreground">
                        {experimentsCount}
                    </span>
                </button>

                <button
                    onClick={() => setActiveSection("ideas")}
                    className={cn(
                        "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all",
                        activeSection === "ideas"
                            ? "bg-background text-foreground shadow-sm font-semibold"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <Lightbulb className={cn("h-3.5 w-3.5", activeSection === "ideas" ? "text-primary" : "text-muted-foreground")} />
                    <span>Project Ideas</span>
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-muted font-bold text-muted-foreground">
                        {ideasCount}
                    </span>
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
            ) : (
                <AnimatePresence mode="wait">
                    {/* Notes List */}
                    {activeSection === "notes" && (
                        <motion.div
                            key="notes"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            className="space-y-3"
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Authored Notes ({notes.length})
                                </h3>
                                <Button asChild size="sm" variant="outline" className="h-7 text-xs gap-1.5">
                                    <Link href="/lab/notes">
                                        <Plus className="h-3.5 w-3.5" /> New Note
                                    </Link>
                                </Button>
                            </div>

                            {notes.length === 0 ? (
                                <div className="text-center py-12 border border-dashed border-border/60 rounded-xl bg-card/30">
                                    <StickyNote className="h-10 w-10 mx-auto mb-2 text-muted-foreground/40" />
                                    <p className="text-sm font-medium text-foreground">No notes created yet</p>
                                    <p className="text-xs text-muted-foreground mt-1 mb-4">
                                        Write private learning notes or publish them to the community feed.
                                    </p>
                                    <Button asChild size="sm" className="gap-1.5">
                                        <Link href="/lab/notes">
                                            <Plus className="h-3.5 w-3.5" /> Create Your First Note
                                        </Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-2.5">
                                    {notes.map((note) => (
                                        <Link
                                            key={note.id}
                                            href="/lab/notes"
                                            className="group block p-4 rounded-xl border border-border/50 bg-card/50 hover:bg-card hover:border-primary/30 transition-all shadow-sm"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                                                            {note.title}
                                                        </h4>
                                                        {note.visibility === "private" ? (
                                                            <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                                                <Lock className="h-2.5 w-2.5" /> Private
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                                                <Globe className="h-2.5 w-2.5" /> Public
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-muted-foreground line-clamp-1">
                                                        {note.content.replace(/[#\-\[\]`*]/g, "").substring(0, 120)}...
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0">
                                                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-muted border border-border">
                                                        {note.category}
                                                    </span>
                                                    <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-primary" />
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Experiments List */}
                    {activeSection === "experiments" && (
                        <motion.div
                            key="experiments"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            className="space-y-3"
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Published Experiments ({experiments.length})
                                </h3>
                                <Button asChild size="sm" variant="outline" className="h-7 text-xs gap-1.5">
                                    <Link href="/lab/experiments">
                                        <Plus className="h-3.5 w-3.5" /> New Experiment
                                    </Link>
                                </Button>
                            </div>

                            {experiments.length === 0 ? (
                                <div className="text-center py-12 border border-dashed border-border/60 rounded-xl bg-card/30">
                                    <Beaker className="h-10 w-10 mx-auto mb-2 text-muted-foreground/40" />
                                    <p className="text-sm font-medium text-foreground">No experiments published yet</p>
                                    <p className="text-xs text-muted-foreground mt-1 mb-4">
                                        Showcase projects, breakthroughs, architecture POCs, or tech explorations.
                                    </p>
                                    <Button asChild size="sm" className="gap-1.5">
                                        <Link href="/lab/experiments">
                                            <Plus className="h-3.5 w-3.5" /> Publish An Experiment
                                        </Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-2.5">
                                    {experiments.map((exp) => (
                                        <Link
                                            key={exp.id}
                                            href="/lab/experiments"
                                            className="group block p-4 rounded-xl border border-border/50 bg-card/50 hover:bg-card hover:border-primary/30 transition-all shadow-sm"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                                                            {exp.title}
                                                        </h4>
                                                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-muted/60 text-foreground">
                                                            {exp.status}
                                                        </span>
                                                        <span className="text-[10px] font-semibold text-muted-foreground">
                                                            • {exp.type}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground line-clamp-1">
                                                        {exp.description}
                                                    </p>
                                                    {(exp.technologies || exp.techStack)?.length > 0 && (
                                                        <div className="flex flex-wrap gap-1 pt-1">
                                                            {(exp.technologies || exp.techStack).slice(0, 4).map((t: string) => (
                                                                <span key={t} className="text-[10px] text-muted-foreground/70 bg-muted/40 px-1.5 py-0.2 rounded border border-border/30">
                                                                    #{t}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all mt-1" />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Ideas List */}
                    {activeSection === "ideas" && (
                        <motion.div
                            key="ideas"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            className="space-y-3"
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Project Ideas Catalog
                                </h3>
                                <Button asChild size="sm" variant="outline" className="h-7 text-xs gap-1.5">
                                    <Link href="/lab/ideas">
                                        <Plus className="h-3.5 w-3.5" /> Submit Idea
                                    </Link>
                                </Button>
                            </div>

                            {ideas.length === 0 ? (
                                <div className="text-center py-12 border border-dashed border-border/60 rounded-xl bg-card/30">
                                    <Lightbulb className="h-10 w-10 mx-auto mb-2 text-muted-foreground/40" />
                                    <p className="text-sm font-medium text-foreground">No ideas found</p>
                                    <p className="text-xs text-muted-foreground mt-1 mb-4">
                                        Contribute architecture concepts, startup ideas, or developer utility tools.
                                    </p>
                                    <Button asChild size="sm" className="gap-1.5">
                                        <Link href="/lab/ideas">
                                            <Plus className="h-3.5 w-3.5" /> Submit Idea
                                        </Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-2.5">
                                    {ideas.slice(0, 10).map((idea) => (
                                        <Link
                                            key={idea._id}
                                            href={`/lab/ideas/${idea.slug}`}
                                            className="group block p-4 rounded-xl border border-border/50 bg-card/50 hover:bg-card hover:border-primary/30 transition-all shadow-sm"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                                            {idea.confidence}%
                                                        </span>
                                                        <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                                                            {idea.title}
                                                        </h4>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground line-clamp-1">
                                                        {idea.problem}
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0">
                                                    <span className="text-[10px] uppercase font-semibold text-muted-foreground/70">
                                                        {idea.domain}
                                                    </span>
                                                    <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-primary" />
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </div>
    );
}
