"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Smartphone,
    Monitor,
    Tablet,
    Globe,
    Loader2,
    LogOut,
    Check,
    X,
    AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Session {
    id: string;
    device: string;
    ip: string;
    createdAt: string;
    lastActiveAt: string;
    isCurrent: boolean;
}

// Get device icon based on device name
function getDeviceIcon(device: string) {
    const deviceLower = device.toLowerCase();
    if (deviceLower.includes('iphone') || deviceLower.includes('android phone')) {
        return Smartphone;
    }
    if (deviceLower.includes('ipad') || deviceLower.includes('tablet')) {
        return Tablet;
    }
    if (deviceLower.includes('windows') || deviceLower.includes('mac') || deviceLower.includes('linux')) {
        return Monitor;
    }
    return Globe;
}

// Format relative time
function formatRelativeTime(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
}

export function SessionsManager() {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [revoking, setRevoking] = useState<string | null>(null);
    const [revokingAll, setRevokingAll] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Fetch sessions
    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            const res = await fetch('/api/auth/sessions', {
                credentials: 'include',
            });
            if (res.ok) {
                const data = await res.json();
                setSessions(data.sessions || []);
            }
        } catch (err) {
            console.error('Failed to fetch sessions:', err);
            setError('Failed to load sessions');
        } finally {
            setLoading(false);
        }
    };

    const revokeSession = async (sessionId: string) => {
        setRevoking(sessionId);
        setError("");
        setSuccess("");

        try {
            const res = await fetch(`/api/auth/sessions?sessionId=${sessionId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (res.ok) {
                const data = await res.json();
                if (data.loggedOut) {
                    // Current session was revoked, reload the page
                    window.location.href = '/lab';
                    return;
                }
                setSessions(prev => prev.filter(s => s.id !== sessionId));
                setSuccess('Session revoked successfully');
                setTimeout(() => setSuccess(""), 3000);
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to revoke session');
            }
        } catch (err) {
            setError('Failed to revoke session');
        } finally {
            setRevoking(null);
        }
    };

    const revokeAllSessions = async () => {
        setRevokingAll(true);
        setError("");
        setSuccess("");

        try {
            const res = await fetch('/api/auth/sessions?revokeAll=true', {
                method: 'DELETE',
                credentials: 'include',
            });

            if (res.ok) {
                setSessions(prev => prev.filter(s => s.isCurrent));
                setSuccess('All other sessions have been revoked');
                setTimeout(() => setSuccess(""), 3000);
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to revoke sessions');
            }
        } catch (err) {
            setError('Failed to revoke sessions');
        } finally {
            setRevokingAll(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-zinc-400" />
            </div>
        );
    }

    const otherSessions = sessions.filter(s => !s.isCurrent);

    return (
        <div className="space-y-4">
            {/* Current session info */}
            <div className="rounded-lg bg-zinc-100 dark:bg-zinc-800/50 p-4">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    You have <span className="font-medium text-zinc-900 dark:text-zinc-100">{sessions.length}</span> active {sessions.length === 1 ? 'session' : 'sessions'}.
                    {otherSessions.length > 0 && (
                        <span> You can sign out of sessions on other devices.</span>
                    )}
                </p>
            </div>

            {/* Error/Success messages */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2"
                    >
                        <p className="text-xs text-destructive font-medium flex items-center gap-1.5">
                            <X className="h-3.5 w-3.5" />
                            {error}
                        </p>
                    </motion.div>
                )}
                {success && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2"
                    >
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5">
                            <Check className="h-3.5 w-3.5" />
                            {success}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Sessions list */}
            <div className="space-y-2">
                {sessions.map((session, index) => {
                    const DeviceIcon = getDeviceIcon(session.device);
                    return (
                        <motion.div
                            key={session.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={cn(
                                "flex items-center justify-between rounded-lg border p-3 transition-colors",
                                session.isCurrent
                                    ? "border-teal-500/30 bg-teal-500/5"
                                    : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "flex items-center justify-center h-10 w-10 rounded-lg",
                                    session.isCurrent
                                        ? "bg-teal-500/10 text-teal-600 dark:text-teal-400"
                                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                                )}>
                                    <DeviceIcon className="h-5 w-5" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                            {session.device}
                                        </p>
                                        {session.isCurrent && (
                                            <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-teal-500/20 text-teal-700 dark:text-teal-300">
                                                Current
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                        {session.ip} · Active {formatRelativeTime(session.lastActiveAt)}
                                    </p>
                                </div>
                            </div>

                            {!session.isCurrent && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => revokeSession(session.id)}
                                    disabled={revoking === session.id}
                                    className="text-zinc-500 hover:text-destructive hover:bg-destructive/10"
                                >
                                    {revoking === session.id ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <LogOut className="h-4 w-4" />
                                    )}
                                </Button>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* Revoke all button */}
            {otherSessions.length > 0 && (
                <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                    <Button
                        variant="outline"
                        onClick={revokeAllSessions}
                        disabled={revokingAll}
                        className="w-full text-destructive border-destructive/30 hover:bg-destructive hover:text-destructive-foreground"
                    >
                        {revokingAll ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Revoking sessions...
                            </>
                        ) : (
                            <>
                                <AlertTriangle className="mr-2 h-4 w-4" />
                                Sign out of all other sessions
                            </>
                        )}
                    </Button>
                </div>
            )}
        </div>
    );
}
