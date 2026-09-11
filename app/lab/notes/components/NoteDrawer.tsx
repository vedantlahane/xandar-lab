// app/lab/notes/components/NoteDrawer.tsx
"use client";

import { useState } from "react";
import { Copy, Check, Pin, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Note, NoteColor } from "../data/notes";
import { cn } from "@/lib/utils";
import { BaseDrawer } from "@/app/lab/components/shared/BaseDrawer";

export function NoteDrawer({
    note,
    onClose,
    position,
}: {
    note: Note;
    onClose: () => void;
    position: { x: number; y: number };
}) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(note.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'Learning': return 'bg-blue-500/15 text-blue-500 dark:text-blue-400 border-blue-500/30';
            case 'Ideas': return 'bg-pink-500/15 text-pink-500 dark:text-pink-400 border-pink-500/30';
            case 'Todo': return 'bg-orange-500/15 text-orange-500 dark:text-orange-400 border-orange-500/30';
            case 'Reference': return 'bg-emerald-500/15 text-emerald-500 dark:text-emerald-400 border-emerald-500/30';
            case 'Personal': return 'bg-purple-500/15 text-purple-500 dark:text-purple-400 border-purple-500/30';
            case 'Work': return 'bg-cyan-500/15 text-cyan-500 dark:text-cyan-400 border-cyan-500/30';
            default: return 'bg-muted text-muted-foreground border-border';
        }
    };

    const getColorDot = (color: NoteColor) => {
        switch (color) {
            case 'yellow': return 'bg-amber-400';
            case 'green': return 'bg-emerald-400';
            case 'blue': return 'bg-sky-400';
            case 'purple': return 'bg-purple-400';
            case 'pink': return 'bg-pink-400';
            case 'orange': return 'bg-orange-400';
            default: return 'bg-zinc-400';
        }
    };

    const headerLeft = (
        <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-muted-foreground/70">
                Notes
            </span>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-1.5">
                <span className={cn("h-2 w-2 rounded-full shrink-0", getColorDot(note.color))} />
                <span className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                    getCategoryColor(note.category)
                )}>
                    {note.category}
                </span>
            </div>
            {note.isPinned && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    <Pin className="h-3 w-3 fill-current" />
                    Pinned
                </span>
            )}
        </div>
    );

    const headerIconTools = (
        <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleCopy}
            title={copied ? "Copied!" : "Copy note content"}
        >
            {copied ? (
                <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
                <Copy className="h-3.5 w-3.5" />
            )}
        </Button>
    );

    return (
        <BaseDrawer
            onClose={onClose}
            position={position}
            defaultWidth="700px"
            defaultHeight="550px"
            headerLeft={headerLeft}
            headerIconTools={headerIconTools}
            backdropClass="bg-black/20 backdrop-blur-sm"
        >
            <div className="p-6">
                <div className="space-y-6">
                    <div className="space-y-3">
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">
                            {note.title}
                        </h2>
                        {note.tags && note.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {note.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="inline-flex items-center gap-1 rounded-md px-2.5 py-0.5 text-xs font-medium border border-border/50 bg-muted/40 text-muted-foreground"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="rounded-lg border border-border/50 bg-muted/20 p-5">
                        <div className="text-sm text-foreground/90 whitespace-pre-wrap font-sans leading-relaxed select-text">
                            {note.content}
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground/60 pt-2 border-t border-border/30">
                        <span className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            Created {note.createdAt}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            Updated {note.updatedAt}
                        </span>
                    </div>
                </div>
            </div>
        </BaseDrawer>
    );
}
