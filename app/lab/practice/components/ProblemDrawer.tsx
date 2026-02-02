"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Maximize2,
  Minimize2,
  X,
  Plus,
  Check,
  Clock,
  MessageSquare,
  Send,
  Trash2,
  ChevronDown,
  ChevronUp,
  Loader2,
  BookOpen,
  Lightbulb,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DSAProblem } from "../data/sheet";
import { cn } from "@/lib/utils";

interface Attempt {
  _id: string;
  problemId: string;
  content: string;
  status: "attempting" | "resolved";
  notes?: string;
  timestamp: string;
  resolvedAt?: string;
}

interface Discussion {
  _id: string;
  attemptId: string;
  username: string;
  content: string;
  timestamp: string;
}

export function ProblemDrawer({
  problem,
  onClose,
  position,
}: {
  problem: DSAProblem;
  onClose: () => void;
  position: { x: number; y: number };
}) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "attempts">("details");

  // Attempt state
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loadingAttempts, setLoadingAttempts] = useState(true);
  const [expandedAttempt, setExpandedAttempt] = useState<string | null>(null);

  // New attempt form
  const [showNewAttempt, setShowNewAttempt] = useState(false);
  const [newAttemptContent, setNewAttemptContent] = useState("");
  const [newAttemptNotes, setNewAttemptNotes] = useState("");
  const [submittingAttempt, setSubmittingAttempt] = useState(false);

  // Discussion state
  const [discussions, setDiscussions] = useState<Record<string, Discussion[]>>(
    {},
  );
  const [loadingDiscussions, setLoadingDiscussions] = useState<
    Record<string, boolean>
  >({});
  const [newComment, setNewComment] = useState<Record<string, string>>({});
  const [submittingComment, setSubmittingComment] = useState<
    Record<string, boolean>
  >({});

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Calculate initial position
  const initialX =
    position.x > window.innerWidth / 2 ? position.x - 700 : position.x;
  const initialY =
    position.y > window.innerHeight / 2 ? position.y - 600 : position.y;
  const safeX = Math.max(20, Math.min(initialX, window.innerWidth - 720));
  const safeY = Math.max(20, Math.min(initialY, window.innerHeight - 620));

  // Fetch attempts
  useEffect(() => {
    async function fetchAttempts() {
      try {
        const res = await fetch(`/api/attempts?problemId=${problem.id}`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setAttempts(data.attempts || []);
        }
      } catch (error) {
        console.error("Failed to fetch attempts:", error);
      } finally {
        setLoadingAttempts(false);
      }
    }
    fetchAttempts();
  }, [problem.id]);

  // Fetch discussions for an attempt
  const fetchDiscussions = async (attemptId: string) => {
    if (discussions[attemptId]) return;

    setLoadingDiscussions((prev) => ({ ...prev, [attemptId]: true }));
    try {
      const res = await fetch(
        `/api/attempts/discussions?attemptId=${attemptId}`,
        {
          credentials: "include",
        },
      );
      if (res.ok) {
        const data = await res.json();
        setDiscussions((prev) => ({
          ...prev,
          [attemptId]: data.discussions || [],
        }));
      }
    } catch (error) {
      console.error("Failed to fetch discussions:", error);
    } finally {
      setLoadingDiscussions((prev) => ({ ...prev, [attemptId]: false }));
    }
  };

  // Create new attempt
  const handleCreateAttempt = async () => {
    if (!newAttemptContent.trim()) return;

    setSubmittingAttempt(true);
    try {
      const res = await fetch("/api/attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          problemId: problem.id,
          content: newAttemptContent,
          notes: newAttemptNotes || undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAttempts((prev) => [data.attempt, ...prev]);
        setNewAttemptContent("");
        setNewAttemptNotes("");
        setShowNewAttempt(false);
      }
    } catch (error) {
      console.error("Failed to create attempt:", error);
    } finally {
      setSubmittingAttempt(false);
    }
  };

  // Resolve attempt
  const handleResolveAttempt = async (attemptId: string) => {
    try {
      const res = await fetch("/api/attempts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ attemptId, status: "resolved" }),
      });

      if (res.ok) {
        const data = await res.json();
        setAttempts((prev) =>
          prev.map((a) => (a._id === attemptId ? data.attempt : a)),
        );
      }
    } catch (error) {
      console.error("Failed to resolve attempt:", error);
    }
  };

  // Delete attempt
  const handleDeleteAttempt = async (attemptId: string) => {
    try {
      const res = await fetch(`/api/attempts?attemptId=${attemptId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        setAttempts((prev) => prev.filter((a) => a._id !== attemptId));
      }
    } catch (error) {
      console.error("Failed to delete attempt:", error);
    }
  };

  // Add discussion comment
  const handleAddComment = async (attemptId: string) => {
    const content = newComment[attemptId]?.trim();
    if (!content) return;

    setSubmittingComment((prev) => ({ ...prev, [attemptId]: true }));
    try {
      const res = await fetch("/api/attempts/discussions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ attemptId, content }),
      });

      if (res.ok) {
        const data = await res.json();
        setDiscussions((prev) => ({
          ...prev,
          [attemptId]: [...(prev[attemptId] || []), data.discussion],
        }));
        setNewComment((prev) => ({ ...prev, [attemptId]: "" }));
      }
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setSubmittingComment((prev) => ({ ...prev, [attemptId]: false }));
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

  // Load problem in VS Code (create markdown file)
  const handleLoadInVSCode = async (problem: DSAProblem) => {
    const content = `# ${problem.title}

**Platform:** ${problem.platform}  
**URL:** ${problem.url}

## Description
${problem.description}

## Tags
${problem.tags?.map((tag) => `- ${tag}`).join("\n") || "No tags available"}

## Solution Approach
*Write your solution approach here...*

## Code
\`\`\`javascript
// Write your solution here
\`\`\`

## Notes
*Add any additional notes here...*
`;

    // Create a blob and download it
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${problem.id}-${problem.title.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
              {problem.platform}
            </span>
            <div className="h-4 w-px bg-border" />
            <div className="flex gap-1">
              {["details", "attempts"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as "details" | "attempts")}
                  className={cn(
                    "px-2.5 py-1 text-xs font-medium rounded-md transition-colors",
                    activeTab === tab
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  )}
                >
                  {tab === "details"
                    ? "Details"
                    : `Attempts (${attempts.length})`}
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
                <div className="space-y-3">
                  <h2 className="text-2xl font-bold tracking-tight">
                    {problem.title}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    <Badge>{problem.platform}</Badge>
                    {problem.tags?.map((tag) => (
                      <Badge key={tag} subtle>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border border-border/50 bg-muted/20 p-4">
                  <h3 className="text-sm font-medium mb-2">Description</h3>
                  <p className="text-sm text-muted-foreground">
                    {problem.description}
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button className="flex-1" asChild>
                    <a href={problem.url} rel="noopener noreferrer">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Solve on {problem.platform}
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleLoadInVSCode(problem)}
                    title="Load problem details in VS Code"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Load in VS Code
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setActiveTab("attempts");
                      setShowNewAttempt(true);
                    }}
                  >
                    <Lightbulb className="h-4 w-4 mr-2" />
                    New Attempt
                  </Button>
                </div>

                {attempts.length > 0 && (
                  <div className="pt-4 border-t border-border/50">
                    <p className="text-xs text-muted-foreground">
                      You have {attempts.length} attempt
                      {attempts.length !== 1 ? "s" : ""} on this problem.
                      <button
                        onClick={() => setActiveTab("attempts")}
                        className="ml-1 text-primary hover:underline"
                      >
                        View history →
                      </button>
                    </p>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="attempts"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="p-6 space-y-4"
              >
                {/* New Attempt Button/Form */}
                <AnimatePresence mode="wait">
                  {showNewAttempt ? (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="rounded-lg border border-primary/30 bg-primary/5 p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold flex items-center gap-2">
                          <Lightbulb className="h-4 w-4 text-primary" />
                          New Attempt
                        </h3>
                        <button
                          onClick={() => setShowNewAttempt(false)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <textarea
                        ref={textareaRef}
                        placeholder="Share your intuition, approach, or pseudocode..."
                        value={newAttemptContent}
                        onChange={(e) => setNewAttemptContent(e.target.value)}
                        className="w-full h-32 px-3 py-2 text-sm rounded-md border border-border bg-background resize-none focus:outline-none focus:border-primary/50"
                      />

                      <textarea
                        placeholder="Private notes (optional)..."
                        value={newAttemptNotes}
                        onChange={(e) => setNewAttemptNotes(e.target.value)}
                        className="w-full h-16 px-3 py-2 text-sm rounded-md border border-border bg-background resize-none focus:outline-none focus:border-primary/50"
                      />

                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowNewAttempt(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleCreateAttempt}
                          disabled={
                            !newAttemptContent.trim() || submittingAttempt
                          }
                        >
                          {submittingAttempt ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Plus className="h-4 w-4 mr-1" />
                              Create Attempt
                            </>
                          )}
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={() => setShowNewAttempt(true)}
                      className="w-full p-3 rounded-lg border border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-colors flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary"
                    >
                      <Plus className="h-4 w-4" />
                      New Attempt
                    </motion.button>
                  )}
                </AnimatePresence>

                {/* Attempts List */}
                {loadingAttempts ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : attempts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No attempts yet</p>
                    <p className="text-xs">
                      Start your first attempt to track your understanding
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {attempts.map((attempt, index) => (
                      <motion.div
                        key={attempt._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={cn(
                          "rounded-lg border p-4 space-y-3 transition-colors",
                          attempt.status === "resolved"
                            ? "border-green-500/30 bg-green-500/5"
                            : "border-border bg-card",
                        )}
                      >
                        {/* Attempt Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            {attempt.status === "resolved" ? (
                              <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center">
                                <Check className="h-3 w-3 text-green-500" />
                              </div>
                            ) : (
                              <div className="h-5 w-5 rounded-full bg-amber-500/20 flex items-center justify-center">
                                <Clock className="h-3 w-3 text-amber-500" />
                              </div>
                            )}
                            <span className="text-xs font-medium">
                              {attempt.status === "resolved"
                                ? "Resolved"
                                : "Attempting"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatRelativeTime(attempt.timestamp)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            {attempt.status === "attempting" && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-green-500 hover:text-green-600 hover:bg-green-500/10"
                                onClick={() =>
                                  handleResolveAttempt(attempt._id)
                                }
                                title="Mark as Resolved"
                              >
                                <Check className="h-3.5 w-3.5" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleDeleteAttempt(attempt._id)}
                              title="Delete Attempt"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>

                        {/* Content */}
                        <p className="text-sm whitespace-pre-wrap">
                          {attempt.content}
                        </p>

                        {attempt.notes && (
                          <div className="text-xs text-muted-foreground bg-muted/50 rounded p-2 italic">
                            {attempt.notes}
                          </div>
                        )}

                        {/* Discussion Toggle */}
                        <button
                          onClick={() => {
                            if (expandedAttempt === attempt._id) {
                              setExpandedAttempt(null);
                            } else {
                              setExpandedAttempt(attempt._id);
                              fetchDiscussions(attempt._id);
                            }
                          }}
                          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <MessageSquare className="h-3.5 w-3.5" />
                          Discussion
                          {expandedAttempt === attempt._id ? (
                            <ChevronUp className="h-3 w-3" />
                          ) : (
                            <ChevronDown className="h-3 w-3" />
                          )}
                        </button>

                        {/* Discussion Section */}
                        <AnimatePresence>
                          {expandedAttempt === attempt._id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="border-t border-border/50 pt-3 space-y-3"
                            >
                              {loadingDiscussions[attempt._id] ? (
                                <div className="flex justify-center py-2">
                                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                </div>
                              ) : (
                                <>
                                  {discussions[attempt._id]?.map((d) => (
                                    <div
                                      key={d._id}
                                      className="flex gap-2 text-xs"
                                    >
                                      <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-semibold uppercase shrink-0">
                                        {d.username.charAt(0)}
                                      </div>
                                      <div className="flex-1">
                                        <div className="flex items-baseline gap-2">
                                          <span className="font-medium">
                                            {d.username}
                                          </span>
                                          <span className="text-muted-foreground text-[10px]">
                                            {formatRelativeTime(d.timestamp)}
                                          </span>
                                        </div>
                                        <p className="mt-0.5 text-muted-foreground">
                                          {d.content}
                                        </p>
                                      </div>
                                    </div>
                                  ))}

                                  {/* Add Comment */}
                                  <div className="flex gap-2">
                                    <input
                                      type="text"
                                      placeholder="Add a note or reflection..."
                                      value={newComment[attempt._id] || ""}
                                      onChange={(e) =>
                                        setNewComment((prev) => ({
                                          ...prev,
                                          [attempt._id]: e.target.value,
                                        }))
                                      }
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                          e.preventDefault();
                                          handleAddComment(attempt._id);
                                        }
                                      }}
                                      className="flex-1 px-2 py-1 text-xs rounded border border-border bg-background focus:outline-none focus:border-primary/50"
                                    />
                                    <Button
                                      size="icon"
                                      className="h-6 w-6"
                                      onClick={() =>
                                        handleAddComment(attempt._id)
                                      }
                                      disabled={
                                        !newComment[attempt._id]?.trim() ||
                                        submittingComment[attempt._id]
                                      }
                                    >
                                      {submittingComment[attempt._id] ? (
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                      ) : (
                                        <Send className="h-3 w-3" />
                                      )}
                                    </Button>
                                  </div>
                                </>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                )}
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
