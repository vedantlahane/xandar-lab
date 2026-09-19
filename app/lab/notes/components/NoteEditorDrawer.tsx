// app/lab/notes/components/NoteEditorDrawer.tsx
"use client";

import { useState } from "react";
import { BaseDrawer } from "@/app/lab/components/shared/BaseDrawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { NoteCategory, NoteColor } from "../data/notes";
import {
    Save, Trash2, Eye, Edit3, Globe, Lock,
    Tag, X, Loader2, Sparkles, Check
} from "lucide-react";
import { usePermissions } from "@/components/auth/hooks/usePermissions";
import { MarkdownContent } from "./MarkdownContent";

interface NoteEditorDrawerProps {
    note?: any | null;
    notebooks?: any[];
    onClose: () => void;
    onSaved: (note: any) => void;
    onDeleted?: (noteId: string) => void;
}

const CATEGORIES: NoteCategory[] = [
    "Learning", "Ideas", "Todo", "Reference", "Personal", "Work"
];

const COLORS: { id: NoteColor; label: string; bgClass: string }[] = [
    { id: "default", label: "Default", bgClass: "bg-zinc-400" },
    { id: "yellow", label: "Yellow", bgClass: "bg-amber-400" },
    { id: "green", label: "Green", bgClass: "bg-emerald-400" },
    { id: "blue", label: "Blue", bgClass: "bg-sky-400" },
    { id: "purple", label: "Purple", bgClass: "bg-purple-400" },
    { id: "pink", label: "Pink", bgClass: "bg-pink-400" },
    { id: "orange", label: "Orange", bgClass: "bg-orange-400" },
];

export function NoteEditorDrawer({
    note,
    notebooks = [],
    onClose,
    onSaved,
    onDeleted,
}: NoteEditorDrawerProps) {
    const { isAdmin, isModerator } = usePermissions();
    const isEdit = !!note?.id && (!note.isCurated || isAdmin || isModerator);

    const [title, setTitle] = useState(note?.title || "");
    const [icon, setIcon] = useState(note?.icon || "");
    const [content, setContent] = useState(note?.content || "");
    const [category, setCategory] = useState<NoteCategory>(note?.category || "Learning");
    const [notebookId, setNotebookId] = useState<string>(note?.notebookId || "");
    const [color, setColor] = useState<NoteColor>(note?.color || "default");
    const [visibility, setVisibility] = useState<"private" | "public">(note?.visibility || "private");
    const [tags, setTags] = useState<string[]>(note?.tags || []);
    const [tagInput, setTagInput] = useState("");
    const [activeTab, setActiveTab] = useState<"write" | "preview">("write");

    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAddTag = () => {
        const trimmed = tagInput.trim().replace(/^#/, "");
        if (trimmed && !tags.includes(trimmed)) {
            setTags([...tags, trimmed]);
            setTagInput("");
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter((t) => t !== tagToRemove));
    };

    const handleSave = async () => {
        if (!title.trim()) {
            setError("Title is required");
            return;
        }

        setSaving(true);
        setError(null);

        try {
            const endpoint = isEdit ? `/api/notes/${note.id}` : "/api/notes";
            const method = isEdit ? "PUT" : "POST";

            const res = await fetch(endpoint, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: title.trim(),
                    icon: icon.trim(),
                    content,
                    category,
                    notebookId: notebookId || undefined,
                    color,
                    tags,
                    visibility,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Failed to save note");
            }

            onSaved(data.note);
            onClose();
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!isEdit || !note?.id) return;
        if (!confirm("Are you sure you want to delete this note?")) return;

        setDeleting(true);
        setError(null);

        try {
            const res = await fetch(`/api/notes/${note.id}`, { method: "DELETE" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to delete note");

            if (onDeleted) onDeleted(note.id);
            onClose();
        } catch (err: any) {
            setError(err.message || "Failed to delete note");
        } finally {
            setDeleting(false);
        }
    };

    const headerLeft = (
        <div className="flex items-center gap-2.5">
            <span className="text-xs font-semibold text-foreground">
                {isEdit ? "Edit Note" : "Create New Note"}
            </span>
            <div className="h-3.5 w-px bg-border" />
            <button
                type="button"
                onClick={() => setVisibility(visibility === "private" ? "public" : "private")}
                className={cn(
                    "flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border transition-colors",
                    visibility === "public"
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                        : "bg-muted text-muted-foreground border-border/50"
                )}
            >
                {visibility === "public" ? (
                    <>
                        <Globe className="h-3 w-3" /> Community Public
                    </>
                ) : (
                    <>
                        <Lock className="h-3 w-3" /> Private to Me
                    </>
                )}
            </button>
        </div>
    );

    return (
        <BaseDrawer
            onClose={onClose}
            defaultWidth="760px"
            defaultHeight="620px"
            headerLeft={headerLeft}
        >
            <div className="flex flex-col h-full overflow-hidden p-5 sm:p-6 space-y-4">
                {error && (
                    <div className="p-3 text-xs rounded-lg bg-red-500/10 text-red-500 border border-red-500/20">
                        {error}
                    </div>
                )}

                {/* Title & Icon Input */}
                <div className="flex gap-2 items-end border-b border-border/40 pb-2 focus-within:border-primary transition-colors">
                    <input
                        type="text"
                        placeholder="😀"
                        value={icon}
                        onChange={(e) => setIcon(e.target.value)}
                        maxLength={2}
                        className="w-12 text-xl sm:text-2xl font-bold bg-transparent focus:outline-none text-center placeholder:text-muted-foreground/40"
                    />
                    <input
                        type="text"
                        placeholder="Note title..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="flex-1 text-xl sm:text-2xl font-bold bg-transparent focus:outline-none placeholder:text-muted-foreground/40"
                        autoFocus
                    />
                </div>

                {/* Category & Color selectors */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                    {/* Notebook pills */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                        {notebooks.length === 0 && (
                            <span className="text-muted-foreground italic text-[11px] px-1">No notebooks created</span>
                        )}
                        {notebooks.map((nb) => (
                            <button
                                key={nb.id}
                                type="button"
                                onClick={() => setNotebookId(nb.id)}
                                className={cn(
                                    "px-2.5 py-1 rounded-md font-medium text-[11px] border transition-colors flex items-center gap-1.5",
                                    notebookId === nb.id
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "bg-muted/30 text-muted-foreground border-border/40 hover:bg-muted/60"
                                )}
                            >
                                {nb.icon && <span>{nb.icon}</span>}
                                {nb.name}
                            </button>
                        ))}
                    </div>

                    {/* Color dot picker */}
                    <div className="flex items-center gap-1.5">
                        {COLORS.map((c) => (
                            <button
                                key={c.id}
                                type="button"
                                onClick={() => setColor(c.id)}
                                title={c.label}
                                className={cn(
                                    "h-4 w-4 rounded-full transition-transform",
                                    c.bgClass,
                                    color === c.id ? "scale-125 ring-2 ring-primary ring-offset-2 ring-offset-background" : "opacity-60 hover:opacity-100"
                                )}
                            />
                        ))}
                    </div>
                </div>

                {/* Tags input & list */}
                <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/20 border border-border/40 text-xs">
                        <Tag className="h-3 w-3 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Add tag + Enter"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === ",") {
                                    e.preventDefault();
                                    handleAddTag();
                                }
                            }}
                            className="bg-transparent text-xs focus:outline-none w-24 sm:w-28 text-foreground placeholder:text-muted-foreground/50"
                        />
                    </div>
                    {tags.map((tag) => (
                        <span
                            key={tag}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted/40 border border-border/50 text-[11px] text-muted-foreground"
                        >
                            #{tag}
                            <button
                                type="button"
                                onClick={() => handleRemoveTag(tag)}
                                className="hover:text-foreground"
                            >
                                <X className="h-2.5 w-2.5" />
                            </button>
                        </span>
                    ))}
                </div>

                {/* Editor / Preview Tabs */}
                <div className="flex items-center justify-between border-b border-border/40 pb-2">
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={() => setActiveTab("write")}
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors",
                                activeTab === "write"
                                    ? "bg-muted text-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Edit3 className="h-3 w-3" /> Write
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab("preview")}
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors",
                                activeTab === "preview"
                                    ? "bg-muted text-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Eye className="h-3 w-3" /> Preview
                        </button>
                    </div>

                    <span className="text-[11px] text-muted-foreground/60 hidden sm:inline">
                        Markdown & code formatting supported
                    </span>
                </div>

                {/* Editor Content Area */}
                <div className="flex-1 min-h-[220px] overflow-y-auto">
                    {activeTab === "write" ? (
                        <textarea
                            placeholder="Write your note in Markdown... You can use headings, lists, and code blocks."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full h-full min-h-[220px] p-3 rounded-lg bg-muted/10 border border-border/40 text-sm font-mono leading-relaxed focus:outline-none focus:border-primary/50 resize-none"
                        />
                    ) : (
                        <div className="p-4 rounded-lg bg-muted/10 border border-border/40 min-h-[220px]">
                            {content ? (
                                <MarkdownContent content={content} />
                            ) : (
                                <span className="text-muted-foreground italic text-sm">Nothing to preview yet.</span>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-3 border-t border-border/40">
                    <div>
                        {isEdit && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={handleDelete}
                                disabled={deleting || saving}
                                className="text-red-500 hover:text-red-600 hover:bg-red-500/10 text-xs"
                            >
                                {deleting ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : <Trash2 className="h-3.5 w-3.5 mr-1.5" />}
                                Delete Note
                            </Button>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={onClose}
                            disabled={saving || deleting}
                            className="text-xs"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            onClick={handleSave}
                            disabled={saving || deleting}
                            className="text-xs"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-3.5 w-3.5 mr-1.5" />
                                    {isEdit ? "Save Changes" : visibility === "public" ? "Publish to Community" : "Save Note"}
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </BaseDrawer>
    );
}
