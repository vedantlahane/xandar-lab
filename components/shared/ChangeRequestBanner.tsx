// components/shared/ChangeRequestBanner.tsx
"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, MessageSquare, Send, ChevronDown, ChevronUp, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RoleBadge } from "./RoleBadge";
import { cn } from "@/lib/utils";

interface ChangeRequest {
    _id?: string;
    requestedBy: string;
    requestedById?: string;
    requestedByRole: string;
    message: string;
    status: "pending" | "resolved";
    createdAt: string | Date;
    resolvedAt?: string | Date;
}

interface ChangeRequestBannerProps {
    changeRequests?: ChangeRequest[];
    itemId: string;
    itemType: "notes" | "experiments";
    isAuthor: boolean;
    isModerator: boolean;
    isAdmin: boolean;
    onRequestsUpdated?: (requests: ChangeRequest[]) => void;
    showRequestForm?: boolean;
    onCloseForm?: () => void;
}

export function ChangeRequestBanner({
    changeRequests = [],
    itemId,
    itemType,
    isAuthor,
    isModerator,
    isAdmin,
    onRequestsUpdated,
    showRequestForm = false,
    onCloseForm,
}: ChangeRequestBannerProps) {
    const [submitting, setSubmitting] = useState(false);
    const [resolvingId, setResolvingId] = useState<string | null>(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [showResolved, setShowResolved] = useState(false);

    const pendingRequests = changeRequests.filter((r) => r.status === "pending");
    const resolvedRequests = changeRequests.filter((r) => r.status === "resolved");

    const canRequest = isAdmin || isModerator;
    const canResolve = isAuthor || isAdmin || isModerator;

    const handleSubmitRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        setSubmitting(true);
        setError(null);

        try {
            const res = await fetch(`/api/${itemType}/${itemId}/change-request`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: message.trim() }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to submit request");

            setMessage("");
            if (onRequestsUpdated) onRequestsUpdated(data.changeRequests);
            if (onCloseForm) onCloseForm();
        } catch (err: any) {
            setError(err.message || "Failed to submit request");
        } finally {
            setSubmitting(false);
        }
    };

    const handleResolve = async (requestId?: string) => {
        setResolvingId(requestId || "latest");
        setError(null);

        try {
            const res = await fetch(`/api/${itemType}/${itemId}/change-request`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ requestId }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to resolve request");

            if (onRequestsUpdated) onRequestsUpdated(data.changeRequests);
        } catch (err: any) {
            setError(err.message || "Failed to resolve request");
        } finally {
            setResolvingId(null);
        }
    };

    return (
        <div className="space-y-3">
            {/* Active Pending Change Requests */}
            {pendingRequests.map((req, idx) => (
                <div
                    key={req._id || idx}
                    className="rounded-xl border border-amber-500/30 bg-amber-500/10 dark:bg-amber-500/5 p-3.5 sm:p-4 text-xs space-y-2.5 transition-all shadow-xs"
                >
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider text-[10px]">
                                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                Revision Requested
                            </span>
                            <span className="text-muted-foreground">•</span>
                            <span className="font-semibold text-foreground">
                                @{req.requestedBy}
                            </span>
                            <RoleBadge role={req.requestedByRole} size="sm" showMember={true} />
                            <span className="text-[10px] text-muted-foreground/70">
                                {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : "Recently"}
                            </span>
                        </div>

                        {canResolve && (
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleResolve(req._id)}
                                disabled={resolvingId === (req._id || "latest")}
                                className="h-7 px-2.5 text-xs font-semibold gap-1 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10 shrink-0"
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

                    <p className="text-foreground/90 font-medium leading-relaxed pl-5 border-l-2 border-amber-500/40">
                        "{req.message}"
                    </p>

                    {isAuthor && (
                        <p className="text-[11px] text-muted-foreground/80 pl-5 italic">
                            Tip: Edit this item to address the feedback above, then click "Mark Resolved".
                        </p>
                    )}
                </div>
            ))}

            {/* Resolved Requests Accordion */}
            {resolvedRequests.length > 0 && (
                <div className="rounded-xl border border-border/40 bg-muted/20 p-2.5 text-xs">
                    <button
                        type="button"
                        onClick={() => setShowResolved(!showResolved)}
                        className="flex items-center justify-between w-full text-muted-foreground hover:text-foreground font-medium px-1.5"
                    >
                        <span className="flex items-center gap-1.5 text-[11px]">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                            {resolvedRequests.length} Resolved {resolvedRequests.length === 1 ? "Revision" : "Revisions"}
                        </span>
                        {showResolved ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </button>

                    {showResolved && (
                        <div className="mt-2.5 space-y-2 pt-2 border-t border-border/30">
                            {resolvedRequests.map((req, i) => (
                                <div key={req._id || i} className="p-2 rounded-lg bg-background/50 border border-border/40 space-y-1">
                                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                                        <span className="font-semibold text-foreground">@{req.requestedBy}</span>
                                        <RoleBadge role={req.requestedByRole} size="sm" showMember={true} />
                                        <span>• Resolved on {req.resolvedAt ? new Date(req.resolvedAt).toLocaleDateString() : "Recently"}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground pl-2 border-l border-emerald-500/40">
                                        "{req.message}"
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Change Request Input Form (Admin / Moderator) */}
            {showRequestForm && canRequest && (
                <form
                    onSubmit={handleSubmitRequest}
                    className="rounded-xl border border-primary/30 bg-primary/5 p-3.5 sm:p-4 space-y-3"
                >
                    <div className="flex items-center justify-between">
                        <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                            <MessageSquare className="h-3.5 w-3.5 text-primary" />
                            Request Changes from Author
                        </h4>
                        {onCloseForm && (
                            <button
                                type="button"
                                onClick={onCloseForm}
                                className="text-xs text-muted-foreground hover:text-foreground"
                            >
                                Cancel
                            </button>
                        )}
                    </div>

                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Explain what needs to be improved or corrected (e.g. 'Please provide code reproduction steps and fix typo in line 12')..."
                        rows={3}
                        required
                        className="w-full text-xs p-2.5 rounded-lg border border-border/60 bg-background focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed resize-none"
                    />

                    {error && (
                        <p className="text-xs text-destructive font-medium flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {error}
                        </p>
                    )}

                    <div className="flex items-center justify-end gap-2">
                        {onCloseForm && (
                            <Button type="button" variant="ghost" size="sm" onClick={onCloseForm} className="h-7 text-xs">
                                Cancel
                            </Button>
                        )}
                        <Button
                            type="submit"
                            size="sm"
                            disabled={submitting || !message.trim()}
                            className="h-7 px-3 text-xs font-semibold gap-1.5"
                        >
                            {submitting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                            Send Request
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
}
