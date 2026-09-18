// app/lab/notes/components/NoteDrawer.tsx
"use client";

import { useState, useEffect } from "react";
import { Copy, Check, Pin, Calendar, Clock, Edit3, Globe, Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Note, NoteColor } from "../data/notes";
import { cn } from "@/lib/utils";
import { BaseDrawer } from "@/app/lab/components/shared/BaseDrawer";
import { useAuth } from "@/components/auth/AuthContext";
import { usePermissions } from "@/components/auth/hooks/usePermissions";
import { AuthorCard } from "@/components/shared/AuthorCard";
import { ChangeRequestBanner } from "@/components/shared/ChangeRequestBanner";
import { ModerationBar } from "@/components/shared/ModerationBar";
import { NoteEditorDrawer } from "./NoteEditorDrawer";

export function NoteDrawer({
    note,
    onClose,
    position,
    onNoteUpdated,
    onNoteDeleted,
}: {
    note: any;
    onClose: () => void;
    position?: { x: number; y: number };
    onNoteUpdated?: (updated: any) => void;
    onNoteDeleted?: (id: string) => void;
}) {
    const [currentNote, setCurrentNote] = useState(note);
    const [copied, setCopied] = useState(false);
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
        setCurrentNote(note);
    }, [note]);

    const isAuthor = !!(
        user?._id &&
        currentNote?.authorId &&
        user._id.toString() === currentNote.authorId.toString()
    );

    const handleCopy = async () => {
        await navigator.clipboard.writeText(currentNote.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleTogglePin = async (newPinned: boolean) => {
        try {
            const res = await fetch(`/api/notes/${currentNote.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isPinned: newPinned }),
            });
            const data = await res.json();
            if (res.ok && data.note) {
                setCurrentNote(data.note);
                if (onNoteUpdated) onNoteUpdated(data.note);
            }
        } catch (err) {
            console.error("Failed to toggle pin", err);
        }
    };

    const handleToggleCurated = async (newCurated: boolean) => {
        try {
            const res = await fetch(`/api/notes/${currentNote.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isCurated: newCurated }),
            });
            const data = await res.json();
            if (res.ok && data.note) {
                setCurrentNote(data.note);
                if (onNoteUpdated) onNoteUpdated(data.note);
            }
        } catch (err) {
            console.error("Failed to toggle curated", err);
        }
    };

    const handleToggleVisibility = async (newVisibility: "public" | "private") => {
        try {
            const res = await fetch(`/api/notes/${currentNote.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ visibility: newVisibility }),
            });
            const data = await res.json();
            if (res.ok && data.note) {
                setCurrentNote(data.note);
                if (onNoteUpdated) onNoteUpdated(data.note);
            }
        } catch (err) {
            console.error("Failed to toggle visibility", err);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this note?")) return;
        try {
            const res = await fetch(`/api/notes/${currentNote.id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                if (onNoteDeleted) onNoteDeleted(currentNote.id);
                onClose();
            }
        } catch (err) {
            console.error("Failed to delete note", err);
        }
    };

    const handleRequestsUpdated = (requests: any[]) => {
        const updated = { ...currentNote, changeRequests: requests };
        setCurrentNote(updated);
        if (onNoteUpdated) onNoteUpdated(updated);
    };

    if (isEditing) {
        return (
            <NoteEditorDrawer
                note={currentNote}
                onClose={() => setIsEditing(false)}
                onSaved={(updated) => {
                    setIsEditing(false);
                    setCurrentNote(updated);
                    if (onNoteUpdated) onNoteUpdated(updated);
                }}
                onDeleted={(id) => {
                    setIsEditing(false);
                    if (onNoteDeleted) onNoteDeleted(id);
                    onClose();
                }}
            />
        );
    }

    const getCategoryColor = (category: string) => {
        switch (category) {
            case "Learning": return "bg-blue-500/15 text-blue-500 dark:text-blue-400 border-blue-500/30";
            case "Ideas": return "bg-pink-500/15 text-pink-500 dark:text-pink-400 border-pink-500/30";
            case "Todo": return "bg-orange-500/15 text-orange-500 dark:text-orange-400 border-orange-500/30";
            case "Reference": return "bg-emerald-500/15 text-emerald-500 dark:text-emerald-400 border-emerald-500/30";
            case "Personal": return "bg-purple-500/15 text-purple-500 dark:text-purple-400 border-purple-500/30";
            case "Work": return "bg-cyan-500/15 text-cyan-500 dark:text-cyan-400 border-cyan-500/30";
            default: return "bg-muted text-muted-foreground border-border";
        }
    };

    const getColorDot = (color: NoteColor) => {
        switch (color) {
            case "yellow": return "bg-amber-400";
            case "green": return "bg-emerald-400";
            case "blue": return "bg-sky-400";
            case "purple": return "bg-purple-400";
            case "pink": return "bg-pink-400";
            case "orange": return "bg-orange-400";
            default: return "bg-zinc-400";
        }
    };

    const headerLeft = (
        <div className="flex items-center gap-2.5">
            <span className="text-xs font-medium text-muted-foreground/70">
                Notes
            </span>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-1.5">
                <span className={cn("h-2 w-2 rounded-full shrink-0", getColorDot(currentNote.color))} />
                <span className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                    getCategoryColor(currentNote.category)
                )}>
                    {currentNote.category}
                </span>
            </div>
            {currentNote.isCurated && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/15 text-purple-400 border border-purple-500/30">
                    <Sparkles className="h-2.5 w-2.5" />
                    Curated
                </span>
            )}
            {currentNote.isPinned && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    <Pin className="h-3 w-3 fill-current" />
                    Pinned
                </span>
            )}
            {currentNote.visibility && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground border border-border/40">
                    {currentNote.visibility === "public" ? <Globe className="h-2.5 w-2.5 text-emerald-500" /> : <Lock className="h-2.5 w-2.5" />}
                    {currentNote.visibility === "public" ? "Community" : "Private"}
                </span>
            )}
        </div>
    );

    const headerIconTools = (
        <div className="flex items-center gap-1">
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
        </div>
    );

    return (
        <BaseDrawer
            onClose={onClose}
            position={position}
            defaultWidth="720px"
            defaultHeight="580px"
            headerLeft={headerLeft}
            headerIconTools={headerIconTools}
            backdropClass="bg-black/20 backdrop-blur-sm"
        >
            <div className="p-6">
                <div className="space-y-5">
                    {/* Top Section: Author Showcase & In-Situ Moderation Bar */}
                    <div className="flex items-center justify-between gap-3 flex-wrap pb-3.5 border-b border-border/40">
                        <AuthorCard
                            username={currentNote.authorUsername || "Anonymous"}
                            role={currentNote.authorRole || "user"}
                            date={currentNote.createdAt}
                            size="md"
                        />

                        <ModerationBar
                            itemId={currentNote.id}
                            itemType="notes"
                            isPinned={!!currentNote.isPinned}
                            isCurated={!!currentNote.isCurated}
                            visibility={currentNote.visibility || "private"}
                            authorId={currentNote.authorId}
                            currentUserId={user?._id}
                            currentUserRole={user?.role}
                            canPin={canPin}
                            canCurate={canCurate}
                            canChangeVisibility={canChangeVisibility(currentNote.authorId)}
                            canRequestChanges={canRequestChanges}
                            canEdit={canEdit(currentNote.authorId)}
                            canDelete={canDelete(currentNote.authorId)}
                            onTogglePin={handleTogglePin}
                            onToggleCurated={handleToggleCurated}
                            onToggleVisibility={handleToggleVisibility}
                            onRequestChangesClick={() => setShowRequestForm((prev) => !prev)}
                            onEditClick={() => setIsEditing(true)}
                            onDeleteClick={handleDelete}
                        />
                    </div>

                    {/* Change Requests Section (Pending revisions, resolve button, mod request form) */}
                    <ChangeRequestBanner
                        changeRequests={currentNote.changeRequests || []}
                        itemId={currentNote.id}
                        itemType="notes"
                        isAuthor={isAuthor}
                        isModerator={isModerator}
                        isAdmin={isAdmin}
                        showRequestForm={showRequestForm}
                        onCloseForm={() => setShowRequestForm(false)}
                        onRequestsUpdated={handleRequestsUpdated}
                    />

                    {/* Title & Tags */}
                    <div className="space-y-2.5">
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">
                            {currentNote.title}
                        </h2>

                        {currentNote.tags && currentNote.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                {currentNote.tags.map((tag: string) => (
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

                    {/* Note Content */}
                    <div className="rounded-xl border border-border/50 bg-muted/15 p-5">
                        <div className="text-sm text-foreground/90 whitespace-pre-wrap font-sans leading-relaxed select-text">
                            {currentNote.content}
                        </div>
                    </div>

                    {/* Footer Timestamps */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground/60 pt-2 border-t border-border/30">
                        <span className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            Created {currentNote.createdAt}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            Updated {currentNote.updatedAt}
                        </span>
                    </div>
                </div>
            </div>
        </BaseDrawer>
    );
}
