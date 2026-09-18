// components/shared/ModerationBar.tsx
"use client";

import { useState } from "react";
import { Pin, Globe, Lock, Sparkles, MessageSquare, Edit3, Trash2, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ModerationBarProps {
    itemId: string;
    itemType: "notes" | "experiments";
    isPinned?: boolean;
    isCurated?: boolean;
    visibility?: "public" | "private";
    authorId?: string;
    currentUserId?: string;
    currentUserRole?: string;
    canPin: boolean;
    canCurate: boolean;
    canChangeVisibility: boolean;
    canRequestChanges: boolean;
    canEdit: boolean;
    canDelete: boolean;
    onTogglePin?: (newPinned: boolean) => Promise<void> | void;
    onToggleCurated?: (newCurated: boolean) => Promise<void> | void;
    onToggleVisibility?: (newVisibility: "public" | "private") => Promise<void> | void;
    onRequestChangesClick?: () => void;
    onEditClick?: () => void;
    onDeleteClick?: () => void;
    className?: string;
}

export function ModerationBar({
    itemId,
    itemType,
    isPinned = false,
    isCurated = false,
    visibility = "private",
    authorId,
    currentUserId,
    currentUserRole,
    canPin,
    canCurate,
    canChangeVisibility,
    canRequestChanges,
    canEdit,
    canDelete,
    onTogglePin,
    onToggleCurated,
    onToggleVisibility,
    onRequestChangesClick,
    onEditClick,
    onDeleteClick,
    className,
}: ModerationBarProps) {
    const [loadingAction, setLoadingAction] = useState<string | null>(null);

    const handlePin = async () => {
        if (!onTogglePin) return;
        setLoadingAction("pin");
        try {
            await onTogglePin(!isPinned);
        } finally {
            setLoadingAction(null);
        }
    };

    const handleCurate = async () => {
        if (!onToggleCurated) return;
        setLoadingAction("curate");
        try {
            await onToggleCurated(!isCurated);
        } finally {
            setLoadingAction(null);
        }
    };

    const handleVisibility = async () => {
        if (!onToggleVisibility) return;
        setLoadingAction("visibility");
        try {
            await onToggleVisibility(visibility === "public" ? "private" : "public");
        } finally {
            setLoadingAction(null);
        }
    };

    return (
        <div className={cn(
            "flex items-center gap-1.5 p-1.5 rounded-xl border border-border/60 bg-card/40 backdrop-blur-md overflow-x-auto no-scrollbar",
            className
        )}>
            <div className="flex items-center gap-1 shrink-0">
                {/* 1. Curate / Official Feature (Admin Only) */}
                {canCurate && (
                    <Button
                        type="button"
                        variant={isCurated ? "default" : "outline"}
                        size="sm"
                        onClick={handleCurate}
                        disabled={loadingAction === "curate"}
                        className={cn(
                            "h-7 px-2.5 text-xs font-semibold gap-1 transition-all",
                            isCurated
                                ? "bg-purple-600 hover:bg-purple-700 text-white shadow-xs"
                                : "text-purple-500 border-purple-500/30 hover:bg-purple-500/10"
                        )}
                        title={isCurated ? "Certified Curated (Click to unmark)" : "Mark as Official Curated Content"}
                    >
                        {loadingAction === "curate" ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                            <Sparkles className="h-3 w-3" />
                        )}
                        <span>{isCurated ? "Curated" : "Curate"}</span>
                    </Button>
                )}

                {/* 2. Pin / Unpin (Mod & Admin) */}
                {canPin && (
                    <Button
                        type="button"
                        variant={isPinned ? "default" : "ghost"}
                        size="sm"
                        onClick={handlePin}
                        disabled={loadingAction === "pin"}
                        className={cn(
                            "h-7 px-2.5 text-xs font-medium gap-1",
                            isPinned
                                ? "bg-amber-500 hover:bg-amber-600 text-white shadow-xs"
                                : "text-muted-foreground hover:text-amber-500"
                        )}
                        title={isPinned ? "Pinned to Top (Click to unpin)" : "Pin to Top"}
                    >
                        {loadingAction === "pin" ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                            <Pin className={cn("h-3 w-3", isPinned && "fill-current")} />
                        )}
                        <span>{isPinned ? "Pinned" : "Pin"}</span>
                    </Button>
                )}

                {/* 3. Visibility Toggle (Author, Mod, Admin) */}
                {canChangeVisibility && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleVisibility}
                        disabled={loadingAction === "visibility"}
                        className={cn(
                            "h-7 px-2.5 text-xs font-medium gap-1 text-muted-foreground hover:text-foreground",
                            visibility === "public" && "text-emerald-500 hover:text-emerald-600"
                        )}
                        title={`Currently ${visibility}. Click to switch to ${visibility === "public" ? "private" : "public"}.`}
                    >
                        {loadingAction === "visibility" ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                        ) : visibility === "public" ? (
                            <Globe className="h-3 w-3 text-emerald-500" />
                        ) : (
                            <Lock className="h-3 w-3" />
                        )}
                        <span className="capitalize">{visibility}</span>
                    </Button>
                )}

                {/* 4. Request Changes from Author (Mod & Admin) */}
                {canRequestChanges && onRequestChangesClick && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={onRequestChangesClick}
                        className="h-7 px-2.5 text-xs font-medium gap-1 text-amber-500 hover:text-amber-600 hover:bg-amber-500/10"
                        title="Request Revision from Author"
                    >
                        <MessageSquare className="h-3 w-3" />
                        <span>Request Changes</span>
                    </Button>
                )}
            </div>

            <div className="h-4 w-px bg-border/60 mx-0.5" />

            {/* 5. Primary Edit & Delete Actions */}
            <div className="flex items-center gap-1 shrink-0 ml-auto">
                {canEdit && onEditClick && (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={onEditClick}
                        className="h-7 px-2.5 text-xs font-semibold gap-1 hover:bg-muted"
                        title="Edit Content"
                    >
                        <Edit3 className="h-3 w-3" />
                        <span>Edit</span>
                    </Button>
                )}

                {canDelete && onDeleteClick && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={onDeleteClick}
                        className="h-7 px-2 text-xs font-medium gap-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        title="Delete Item"
                    >
                        <Trash2 className="h-3 w-3" />
                    </Button>
                )}
            </div>
        </div>
    );
}
