// app/lab/docs/components/DocumentDrawer.tsx
"use client";

import { useState } from "react";
import { Edit3, Star, Calendar, Clock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BaseDrawer } from "@/app/lab/components/shared/BaseDrawer";
import { useAuth } from "@/components/auth/AuthContext";
import { usePermissions } from "@/components/auth/hooks/usePermissions";
import { RoleBadge } from "@/components/shared/RoleBadge";
import { BlockEditor } from "@/app/lab/notes/components/BlockEditor";
import { DocumentEditorDrawer } from "./DocumentEditorDrawer";

export function DocumentDrawer({
    document,
    documents = [],
    onClose,
    position,
    onDocUpdated,
    onDocDeleted,
}: {
    document: any;
    documents?: any[];
    onClose: () => void;
    position?: { x: number; y: number };
    onDocUpdated?: () => void;
    onDocDeleted?: () => void;
}) {
    const { user } = useAuth();
    const { isAdmin, isModerator } = usePermissions();
    const [isEditing, setIsEditing] = useState(false);

    const canEdit = (authorId: string) => {
        if (isAdmin || isModerator) return true;
        return String(authorId) === String(user?._id);
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this document?")) return;
        try {
            const res = await fetch(`/api/docs/${document.id}`, { method: 'DELETE' });
            if (res.ok) {
                onDocDeleted?.();
                onClose();
            }
        } catch (error) {
            console.error("Failed to delete", error);
        }
    };

    if (isEditing) {
        return (
            <DocumentEditorDrawer
                document={document}
                documents={documents}
                onClose={() => setIsEditing(false)}
                onSaved={() => {
                    setIsEditing(false);
                    onDocUpdated?.();
                }}
                position={position}
            />
        );
    }

    const headerLeft = (
        <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground/70 flex items-center gap-1.5">
                {document.icon && <span>{document.icon}</span>}
                {document.authorUsername && (
                    <span className="flex items-center gap-1">
                        @{document.authorUsername}
                        {String(document.authorId) !== String(user?._id) && document.authorRole && (
                            <RoleBadge role={document.authorRole} className="scale-75 origin-left" />
                        )}
                    </span>
                )}
            </span>
            {document.isCurated && (
                <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    <Star className="h-2.5 w-2.5 fill-current" /> Curated
                </span>
            )}
        </div>
    );

    const headerIconTools = (
        <>
            {canEdit(document.authorId) && (
                <>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-foreground"
                        onClick={() => setIsEditing(true)}
                    >
                        <Edit3 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-red-500/70 hover:text-red-500 hover:bg-red-500/10"
                        onClick={handleDelete}
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                </>
            )}
        </>
    );

    return (
        <BaseDrawer
            onClose={onClose}
            position={position}
            defaultWidth="800px"
            defaultHeight="700px"
            headerLeft={headerLeft}
            headerIconTools={headerIconTools}
            backdropClass="bg-black/20 backdrop-blur-sm"
        >
            <div className="p-4 sm:p-6 flex flex-col h-full overflow-y-auto">
                <div className="space-y-6 flex-1">
                    <div className="space-y-3">
                        <h2 className="text-2xl font-bold tracking-tight">{document.title}</h2>
                        {document.parentId && (
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                                Parent: {documents?.find((d: any) => d.id === document.parentId)?.title || "Unknown"}
                            </p>
                        )}
                    </div>

                    <div className="rounded-lg border border-border/50 bg-muted/20 p-4 sm:p-5">
                        <BlockEditor content={document.content} readOnly={true} />
                    </div>

                    {/* Footer Timestamps */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-muted-foreground/60 pt-2 border-t border-border/30 gap-2">
                        <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5" />
                                Created {document.createdAt}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5" />
                                Updated {document.updatedAt}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </BaseDrawer>
    );
}
