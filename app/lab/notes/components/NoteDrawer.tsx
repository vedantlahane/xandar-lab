// app/lab/notes/components/NoteDrawer.tsx
"use client";

import { useState, useEffect } from "react";
import {
    Copy, Check, Pin, Calendar, Clock, Edit3, Globe, Lock,
    Star, MessageSquare, Trash2, AlertCircle, CheckCircle2, Loader2, Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Note, NoteColor } from "../data/notes";
import { cn } from "@/lib/utils";
import { BaseDrawer } from "@/app/lab/components/shared/BaseDrawer";
import { useAuth } from "@/components/auth/AuthContext";
import { usePermissions } from "@/components/auth/hooks/usePermissions";
import { RoleBadge } from "@/components/shared/RoleBadge";
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
        setCurrentNote(note);
    }, [note]);

    const isAuthor = !!(
        user?._id &&
        currentNote?.authorId &&
        user._id.toString() === currentNote.authorId.toString()
    );

    const canResolve = isAuthor || isAdmin || isModerator;

    const handleCopy = async () => {
        await navigator.clipboard.writeText(currentNote.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleTogglePin = async () => {
        const newPinned = !currentNote.isPinned;
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

    const handleToggleCurated = async () => {
        const newCurated = !currentNote.isCurated;
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

    const handleToggleVisibility = async () => {
        const newVisibility = currentNote.visibility === "public" ? "private" : "public";
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

    const handleSubmitChangeRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!requestMessage.trim()) return;

        setSubmittingRequest(true);
        try {
            const res = await fetch(`/api/notes/${currentNote.id}/change-request`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: requestMessage.trim() }),
            });
            const data = await res.json();
            if (res.ok && data.changeRequests) {
                const updated = { ...currentNote, changeRequests: data.changeRequests };
                setCurrentNote(updated);
                if (onNoteUpdated) onNoteUpdated(updated);
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
            const res = await fetch(`/api/notes/${currentNote.id}/change-request`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ requestId }),
            });
            const data = await res.json();
            if (res.ok && data.changeRequests) {
                const updated = { ...currentNote, changeRequests: data.changeRequests };
                setCurrentNote(updated);
                if (onNoteUpdated) onNoteUpdated(updated);
            }
        } catch (err) {
            console.error("Failed to resolve change request", err);
        } finally {
            setResolvingId(null);
        }
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

    const pendingRequests = (currentNote.changeRequests || []).filter((r: any) => r.status === "pending");

    const headerLeft = (
        <div className="flex items-center gap-2 sm:gap-2.5">
            <span className="text-xs font-medium text-muted-foreground/70">
                Notes
            </span>
            <div className="h-3.5 w-px bg-border/60" />
            <div className="flex items-center gap-1.5">
                <span className={cn("h-2 w-2 rounded-full shrink-0", getColorDot(currentNote.color))} />
                <span className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-semibold border",
                    getCategoryColor(currentNote.category)
                )}>
                    {currentNote.category}
                </span>
            </div>
            {currentNote.isCurated && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-500 border border-amber-500/25">
                    <Star className="h-2.5 w-2.5" />
                    Curated
                </span>
            )}
            {currentNote.isPinned && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-500 border border-amber-500/25">
                    <Pin className="h-2.5 w-2.5 fill-current" />
                    Pinned
                </span>
            )}
            {currentNote.visibility && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted/60 text-muted-foreground border border-border/40">
                    {currentNote.visibility === "public" ? <Globe className="h-2.5 w-2.5 text-emerald-500" /> : <Lock className="h-2.5 w-2.5" />}
                    {currentNote.visibility === "public" ? "Community" : "Private"}
                </span>
            )}
        </div>
    );

    const headerIconTools = (
        <div className="flex items-center gap-0.5">
            {/* Curate Content (Admin Only) */}
            {canCurate && (
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                        "h-6 w-6 rounded-md transition-colors",
                        currentNote.isCurated
                            ? "text-amber-500 bg-amber-500/15 hover:bg-amber-500/25"
                            : "text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10"
                    )}
                    onClick={handleToggleCurated}
                    title={currentNote.isCurated ? "Certified Curated (Click to uncurate)" : "Mark as Official Curated Content"}
                >
                    <Star className={cn("h-3.5 w-3.5", currentNote.isCurated && "fill-current")} />
                </Button>
            )}

            {/* Pin Content (Mod & Admin) */}
            {canPin && (
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                        "h-6 w-6 rounded-md transition-colors",
                        currentNote.isPinned
                            ? "text-amber-500 bg-amber-500/15 hover:bg-amber-500/25"
                            : "text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10"
                    )}
                    onClick={handleTogglePin}
                    title={currentNote.isPinned ? "Pinned to Top (Click to unpin)" : "Pin Note to Top"}
                >
                    <Pin className={cn("h-3.5 w-3.5", currentNote.isPinned && "fill-current")} />
                </Button>
            )}

            {/* Visibility Toggle (Author / Mod / Admin) */}
            {canChangeVisibility(currentNote.authorId) && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-md text-muted-foreground hover:text-foreground"
                    onClick={handleToggleVisibility}
                    title={`Currently ${currentNote.visibility || "private"}. Click to switch.`}
                >
                    {currentNote.visibility === "public" ? (
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

            {/* Edit Note (Author / Mod / Admin) */}
            {canEdit(currentNote.authorId) && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-md text-muted-foreground hover:text-foreground"
                    onClick={() => setIsEditing(true)}
                    title="Edit Note"
                >
                    <Edit3 className="h-3.5 w-3.5" />
                </Button>
            )}

            {/* Copy */}
            <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-md text-muted-foreground hover:text-foreground"
                onClick={handleCopy}
                title={copied ? "Copied!" : "Copy note content"}
            >
                {copied ? (
                    <Check className="h-3.5 w-3.5 text-green-500" />
                ) : (
                    <Copy className="h-3.5 w-3.5" />
                )}
            </Button>

            {/* Delete Note (Author / Admin) */}
            {canDelete(currentNote.authorId) && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={handleDelete}
                    title="Delete Note"
                >
                    <Trash2 className="h-3.5 w-3.5" />
                </Button>
            )}
        </div>
    );

    return (
        <BaseDrawer
            onClose={onClose}
            position={position}
            defaultWidth="720px"
            defaultHeight="560px"
            headerLeft={headerLeft}
            headerIconTools={headerIconTools}
            backdropClass="bg-black/20 backdrop-blur-sm"
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
                                placeholder="Specify what should be improved or corrected before approval..."
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

                    {/* Pending Change Requests Banner (Subtle & clean) */}
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

                    {/* Title & Author header */}
                    <div className="space-y-2">
                        <div className="flex items-baseline justify-between gap-3 flex-wrap">
                            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                                {currentNote.title}
                            </h2>
                            {currentNote.authorUsername && (
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
                                    <span>by <strong className="text-foreground font-medium">@{currentNote.authorUsername}</strong></span>
                                    {currentNote.authorRole && currentNote.authorRole !== "user" && String(currentNote.authorId) !== String(user?._id) && (
                                        <RoleBadge role={currentNote.authorRole} size="sm" />
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Tags */}
                        {currentNote.tags && currentNote.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                {currentNote.tags.map((tag: string) => (
                                    <span
                                        key={tag}
                                        className="inline-flex items-center rounded px-2 py-0.5 text-[11px] font-medium border border-border/50 bg-muted/30 text-muted-foreground"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Note Content */}
                    <div className="rounded-lg border border-border/50 bg-muted/20 p-4 sm:p-5">
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
