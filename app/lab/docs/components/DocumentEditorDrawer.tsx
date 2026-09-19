// app/lab/docs/components/DocumentEditorDrawer.tsx
"use client";

import { useState } from "react";
import { Loader2, Globe, Lock, Users, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BaseDrawer } from "@/app/lab/components/shared/BaseDrawer";
import { usePermissions } from "@/components/auth/hooks/usePermissions";
import { BlockEditor } from "@/app/lab/notes/components/BlockEditor";

interface DocumentEditorDrawerProps {
    document?: any | null;
    documents?: any[];
    onClose: () => void;
    position?: { x: number; y: number };
    onSaved: () => void;
}

export function DocumentEditorDrawer({
    document,
    documents = [],
    onClose,
    position,
    onSaved,
}: DocumentEditorDrawerProps) {
    const { isAdmin, isModerator } = usePermissions();
    const isEdit = !!document?.id;

    const [title, setTitle] = useState(document?.title || "");
    const [icon, setIcon] = useState(document?.icon || "");
    const [content, setContent] = useState(document?.content || "");
    const [parentId, setParentId] = useState<string>(document?.parentId || "");
    const [visibility, setVisibility] = useState<"private" | "public" | "shared">(document?.visibility || "private");

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
                icon,
                content,
                parentId: parentId || null,
                visibility,
            };

            const url = isEdit ? `/api/docs/${document.id}` : "/api/docs";
            const method = isEdit ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to save document");
            }

            onSaved();
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
            const res = await fetch(`/api/docs/${document.id}`, { method: "DELETE" });
            if (res.ok) {
                onSaved();
                onClose();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setDeleting(false);
        }
    };

    const headerLeft = (
        <div className="flex items-center gap-2.5">
            <span className="text-xs font-semibold text-foreground">
                {isEdit ? "Edit Document" : "Create New Document"}
            </span>
            <div className="h-3.5 w-px bg-border" />
            <button
                type="button"
                onClick={() => setVisibility(visibility === "private" ? "public" : visibility === "public" ? "shared" : "private")}
                className={cn(
                    "flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border transition-colors",
                    visibility === "public"
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                        : visibility === "shared"
                        ? "bg-blue-500/10 text-blue-500 border-blue-500/30"
                        : "bg-muted text-muted-foreground border-border/50"
                )}
            >
                {visibility === "public" ? (
                    <>
                        <Globe className="h-3 w-3" /> Community Public
                    </>
                ) : visibility === "shared" ? (
                    <>
                        <Users className="h-3 w-3" /> Shared
                    </>
                ) : (
                    <>
                        <Lock className="h-3 w-3" /> Private Only
                    </>
                )}
            </button>
        </div>
    );

    return (
        <BaseDrawer
            onClose={onClose}
            position={position}
            defaultWidth="800px"
            defaultHeight="700px"
            headerLeft={headerLeft}
        >
            <div className="p-4 sm:p-6 h-full flex flex-col min-h-0 bg-background/50">
                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                        {error}
                    </div>
                )}

                <div className="flex items-start gap-3 mb-6">
                    <input
                        type="text"
                        value={icon}
                        onChange={(e) => setIcon(e.target.value)}
                        placeholder="?"
                        className="w-12 h-12 text-center text-2xl bg-transparent border border-border/50 rounded-xl focus:outline-none focus:border-primary/50 focus:bg-muted/10 transition-colors"
                        maxLength={2}
                    />
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Document Title..."
                        className="flex-1 h-12 bg-transparent text-2xl font-bold placeholder:text-muted-foreground/30 border-b border-transparent focus:border-border/50 focus:outline-none transition-colors"
                        autoFocus
                    />
                </div>

                <div className="flex flex-wrap items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                        <FolderOpen className="h-4 w-4 text-muted-foreground" />
                        <select
                            value={parentId}
                            onChange={(e) => setParentId(e.target.value)}
                            className="bg-transparent text-sm font-medium focus:outline-none text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                            <option value="">No Parent (Root)</option>
                            {documents.filter(d => d.id !== document?.id).map((doc) => (
                                <option key={doc.id} value={doc.id}>
                                    {doc.title}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Content Editor */}
                <div className="flex-1 min-h-0 flex flex-col pt-4">
                    <BlockEditor 
                        content={content} 
                        onChange={(html) => setContent(html)} 
                    />
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-4 border-t border-border/40 mt-4">
                    <div>
                        {isEdit && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={handleDelete}
                                disabled={deleting || saving}
                                className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                            >
                                {deleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                Delete Document
                            </Button>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={onClose}
                            disabled={saving}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            onClick={handleSave}
                            disabled={saving || !title.trim()}
                            className="bg-primary text-primary-foreground hover:opacity-90 min-w-[100px]"
                        >
                            {saving ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                "Save Document"
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </BaseDrawer>
    );
}
