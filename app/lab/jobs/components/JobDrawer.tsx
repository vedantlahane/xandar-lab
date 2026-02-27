// app/lab/jobs/components/JobDrawer.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Maximize2,
    Minimize2,
    X,
    ExternalLink,
    Building2,
    MapPin,
    Calendar,
    DollarSign,
    Clock,
    CheckCircle2,
    ChevronDown,
    Loader2,
    Briefcase,
    Plus,
    Trash2,
    Edit3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Job, STATUS_CONFIG, ApplicationStatus } from "../data/jobs";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/AuthContext";

interface ApplicationNote {
    _id: string;
    jobId: string;
    content: string;
    timestamp: string;
}

export function JobDrawer({
    job,
    onClose,
    position,
}: {
    job: Job;
    onClose: () => void;
    position: { x: number; y: number };
}) {
    const [isMaximized, setIsMaximized] = useState(false);
    const [activeTab, setActiveTab] = useState<"details" | "tracking">("details");
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const { user, updateUser } = useAuth();

    // Application notes
    const [notes, setNotes] = useState<ApplicationNote[]>([]);
    const [loadingNotes, setLoadingNotes] = useState(true);
    const [newNote, setNewNote] = useState("");
    const [submittingNote, setSubmittingNote] = useState(false);

    // Current status
    const currentStatus = (user?.jobApplications?.[job.id] || 'bookmarked') as ApplicationStatus;

    // Calculate initial position
    const initialX =
        position.x > window.innerWidth / 2 ? position.x - 700 : position.x;
    const initialY =
        position.y > window.innerHeight / 2 ? position.y - 600 : position.y;
    const safeX = Math.max(20, Math.min(initialX, window.innerWidth - 720));
    const safeY = Math.max(20, Math.min(initialY, window.innerHeight - 620));

    // Fetch notes
    useEffect(() => {
        async function fetchNotes() {
            try {
                const res = await fetch(`/api/jobs/notes?jobId=${job.id}`, {
                    credentials: "include",
                });
                if (res.ok) {
                    const data = await res.json();
                    setNotes(data.notes || []);
                }
            } catch (error) {
                console.error("Failed to fetch notes:", error);
            } finally {
                setLoadingNotes(false);
            }
        }
        fetchNotes();
    }, [job.id]);

    // Update application status
    const handleUpdateStatus = async (status: ApplicationStatus) => {
        if (!user) return;
        setShowStatusDropdown(false);

        try {
            const res = await fetch('/api/jobs/status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ username: user.username, jobId: job.id, status }),
            });

            if (res.ok) {
                const data = await res.json();
                updateUser({ jobApplications: data.jobApplications });
            }
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    // Add note
    const handleAddNote = async () => {
        if (!newNote.trim()) return;

        setSubmittingNote(true);
        try {
            const res = await fetch('/api/jobs/notes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ jobId: job.id, content: newNote }),
            });

            if (res.ok) {
                const data = await res.json();
                setNotes(prev => [data.note, ...prev]);
                setNewNote("");
            }
        } catch (error) {
            console.error('Failed to add note:', error);
        } finally {
            setSubmittingNote(false);
        }
    };

    // Delete note
    const handleDeleteNote = async (noteId: string) => {
        try {
            const res = await fetch(`/api/jobs/notes?noteId=${noteId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (res.ok) {
                setNotes(prev => prev.filter(n => n._id !== noteId));
            }
        } catch (error) {
            console.error('Failed to delete note:', error);
        }
    };

    // Format relative time
    const formatRelativeTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    const statusConfig = STATUS_CONFIG[currentStatus];

    return (
        <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <div
                onClick={onClose}
                className="absolute inset-0 bg-transparent pointer-events-auto"
            />

            {/* Window */}
            <motion.div
                layout
                initial={{ opacity: 0, scale: 0.5, x: position.x, y: position.y }}
                animate={{
                    opacity: 1,
                    scale: 1,
                    x: isMaximized ? 0 : safeX,
                    y: isMaximized ? 0 : safeY,
                    width: isMaximized ? "100%" : "700px",
                    height: isMaximized ? "100%" : "600px",
                }}
                exit={{ opacity: 0, scale: 0.5, x: position.x, y: position.y }}
                transition={{ type: "spring", damping: 25, stiffness: 300, mass: 0.8 }}
                className={cn(
                    "pointer-events-auto absolute flex flex-col bg-card shadow-2xl border border-border overflow-hidden",
                    isMaximized ? "rounded-none" : "rounded-xl",
                )}
            >
                {/* Header */}
                <div
                    className="flex items-center justify-between border-b border-border/40 px-4 py-3 bg-muted/30 select-none"
                    onDoubleClick={() => setIsMaximized(!isMaximized)}
                >
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-muted-foreground/70">
                            {job.platform}
                        </span>
                        <div className="h-4 w-px bg-border" />
                        <div className="flex gap-1">
                            {["details", "tracking"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab as "details" | "tracking")}
                                    className={cn(
                                        "px-2.5 py-1 text-xs font-medium rounded-md transition-colors",
                                        activeTab === tab
                                            ? "bg-primary text-primary-foreground"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted",
                                    )}
                                >
                                    {tab === "details" ? "Details" : "Tracking"}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => setIsMaximized(!isMaximized)}
                        >
                            {isMaximized ? (
                                <Minimize2 className="h-3.5 w-3.5" />
                            ) : (
                                <Maximize2 className="h-3.5 w-3.5" />
                            )}
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 hover:bg-destructive/10 hover:text-destructive"
                            onClick={onClose}
                        >
                            <X className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    <AnimatePresence mode="wait">
                        {activeTab === "details" ? (
                            <motion.div
                                key="details"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                transition={{ duration: 0.15 }}
                                className="p-6 space-y-6"
                            >
                                {/* Title & Company */}
                                <div className="space-y-3">
                                    <h2 className="text-2xl font-bold tracking-tight">
                                        {job.title}
                                    </h2>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1.5">
                                            <Building2 className="h-4 w-4" />
                                            {job.company}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <MapPin className="h-4 w-4" />
                                            {job.location}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <Badge>{job.type}</Badge>
                                        {job.remote && <Badge subtle>Remote</Badge>}
                                        {job.tags?.map((tag) => (
                                            <Badge key={tag} subtle>
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                {/* Quick Info */}
                                <div className="grid grid-cols-2 gap-4">
                                    {job.salary && (
                                        <div className="rounded-lg border border-border/50 bg-muted/20 p-3">
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                                                <DollarSign className="h-3.5 w-3.5" />
                                                Salary
                                            </div>
                                            <p className="text-sm font-medium">{job.salary}</p>
                                        </div>
                                    )}
                                    {job.deadline && (
                                        <div className="rounded-lg border border-border/50 bg-muted/20 p-3">
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                                                <Calendar className="h-3.5 w-3.5" />
                                                Deadline
                                            </div>
                                            <p className="text-sm font-medium">{job.deadline}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="rounded-lg border border-border/50 bg-muted/20 p-4">
                                    <h3 className="text-sm font-medium mb-2">Description</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {job.description}
                                    </p>
                                </div>

                                {/* Requirements */}
                                {job.requirements && job.requirements.length > 0 && (
                                    <div className="rounded-lg border border-border/50 bg-muted/20 p-4">
                                        <h3 className="text-sm font-medium mb-2">Requirements</h3>
                                        <ul className="space-y-1.5">
                                            {job.requirements.map((req, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                                                    {req}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-3">
                                    <Button className="flex-1" asChild>
                                        <a href={job.url} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="h-4 w-4 mr-2" />
                                            Apply on {job.platform}
                                        </a>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => setActiveTab("tracking")}
                                    >
                                        <Briefcase className="h-4 w-4 mr-2" />
                                        Track Application
                                    </Button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="tracking"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.15 }}
                                className="p-6 space-y-6"
                            >
                                {/* Status Section */}
                                <div className="space-y-3">
                                    <h3 className="text-sm font-semibold">Application Status</h3>
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                                            className={cn(
                                                "w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-colors",
                                                statusConfig.bgColor,
                                                "border-border/50 hover:border-border"
                                            )}
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className={cn("h-2 w-2 rounded-full", statusConfig.color.replace('text-', 'bg-'))} />
                                                <span className={cn("font-medium", statusConfig.color)}>
                                                    {statusConfig.label}
                                                </span>
                                            </div>
                                            <ChevronDown className={cn(
                                                "h-4 w-4 text-muted-foreground transition-transform",
                                                showStatusDropdown && "rotate-180"
                                            )} />
                                        </button>

                                        <AnimatePresence>
                                            {showStatusDropdown && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-10"
                                                >
                                                    {(Object.entries(STATUS_CONFIG) as [ApplicationStatus, typeof STATUS_CONFIG[ApplicationStatus]][]).map(([status, config]) => (
                                                        <button
                                                            key={status}
                                                            onClick={() => handleUpdateStatus(status)}
                                                            className={cn(
                                                                "w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left transition-colors hover:bg-muted",
                                                                currentStatus === status && "bg-muted"
                                                            )}
                                                        >
                                                            <div className={cn("h-2 w-2 rounded-full", config.color.replace('text-', 'bg-'))} />
                                                            <span className={cn(
                                                                currentStatus === status ? "font-medium" : ""
                                                            )}>
                                                                {config.label}
                                                            </span>
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                {/* Progress Timeline */}
                                <div className="space-y-3">
                                    <h3 className="text-sm font-semibold">Application Progress</h3>
                                    <div className="flex items-center gap-1">
                                        {['bookmarked', 'applied', 'phone-screen', 'technical-interview', 'onsite', 'offer'].map((step, i) => {
                                            const stepOrder = ['bookmarked', 'applied', 'phone-screen', 'technical-interview', 'onsite', 'offer'];
                                            const currentIndex = stepOrder.indexOf(currentStatus);
                                            const isComplete = i <= currentIndex && currentStatus !== 'rejected' && currentStatus !== 'withdrawn';
                                            const isRejected = currentStatus === 'rejected';
                                            const isWithdrawn = currentStatus === 'withdrawn';

                                            return (
                                                <div key={step} className="flex-1 flex items-center">
                                                    <div className={cn(
                                                        "h-2 w-full rounded-full transition-colors",
                                                        isComplete ? "bg-emerald-500" :
                                                            isRejected ? "bg-red-500/30" :
                                                                isWithdrawn ? "bg-zinc-400/30" :
                                                                    "bg-muted"
                                                    )} />
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="flex justify-between text-[10px] text-muted-foreground">
                                        <span>Saved</span>
                                        <span>Applied</span>
                                        <span>Phone</span>
                                        <span>Technical</span>
                                        <span>Onsite</span>
                                        <span>Offer</span>
                                    </div>
                                </div>

                                {/* Notes Section */}
                                <div className="space-y-3">
                                    <h3 className="text-sm font-semibold">Notes</h3>

                                    {/* Add Note */}
                                    <div className="flex gap-2">
                                        <textarea
                                            placeholder="Add a note about this application..."
                                            value={newNote}
                                            onChange={(e) => setNewNote(e.target.value)}
                                            className="flex-1 px-3 py-2 text-sm rounded-lg border border-border bg-background resize-none h-20 focus:outline-none focus:border-primary/50"
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <Button
                                            size="sm"
                                            onClick={handleAddNote}
                                            disabled={!newNote.trim() || submittingNote}
                                        >
                                            {submittingNote ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <>
                                                    <Plus className="h-4 w-4 mr-1" />
                                                    Add Note
                                                </>
                                            )}
                                        </Button>
                                    </div>

                                    {/* Notes List */}
                                    {loadingNotes ? (
                                        <div className="flex justify-center py-4">
                                            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                                        </div>
                                    ) : notes.length === 0 ? (
                                        <div className="text-center py-6 text-muted-foreground">
                                            <Edit3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                            <p className="text-sm">No notes yet</p>
                                            <p className="text-xs">Add notes to track your application progress</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {notes.map((note) => (
                                                <motion.div
                                                    key={note._id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="group rounded-lg border border-border/50 bg-muted/20 p-3"
                                                >
                                                    <div className="flex items-start justify-between gap-2">
                                                        <p className="text-sm whitespace-pre-wrap flex-1">{note.content}</p>
                                                        <button
                                                            onClick={() => handleDeleteNote(note._id)}
                                                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </button>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground mt-2">
                                                        {formatRelativeTime(note.timestamp)}
                                                    </p>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}

function Badge({
    children,
    subtle,
}: {
    children: React.ReactNode;
    subtle?: boolean;
}) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
                subtle
                    ? "border border-border bg-muted text-muted-foreground"
                    : "bg-primary text-primary-foreground",
            )}
        >
            {children}
        </span>
    );
}
