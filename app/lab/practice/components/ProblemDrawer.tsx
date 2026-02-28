// app/lab/practice/components/ProblemDrawer.tsx

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
  Play,
  Pause,
  AlertTriangle,
  HelpCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DSAProblem } from "../data/sheet";
import { cn } from "@/lib/utils";

interface Attempt {
  _id: string;
  problemId: string;
  content: string; // approach
  code?: string;
  language?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  feltDifficulty?: number;
  duration?: number;
  submissionCount?: number;
  status: "attempting" | "resolved" | "solved_with_help" | "gave_up";
  failureReason?: string;
  failureNote?: string;
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
  const [activeTab, setActiveTab] = useState<"details" | "attempts" | "explain">("details");

  // Attempt state
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loadingAttempts, setLoadingAttempts] = useState(true);
  const [expandedAttempt, setExpandedAttempt] = useState<string | null>(null);

  // New attempt form
  const [showNewAttempt, setShowNewAttempt] = useState(false);
  const [newAttemptContent, setNewAttemptContent] = useState("");
  const [newAttemptCode, setNewAttemptCode] = useState("");
  const [newAttemptLanguage, setNewAttemptLanguage] = useState("Python");
  const [newAttemptTime, setNewAttemptTime] = useState("");
  const [newAttemptSpace, setNewAttemptSpace] = useState("");
  const [newAttemptFelt, setNewAttemptFelt] = useState<number>(0);
  const [newAttemptNotes, setNewAttemptNotes] = useState("");
  const [submittingAttempt, setSubmittingAttempt] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Format timer
  const formatTimer = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    let interval: any;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  useEffect(() => {
    if (showNewAttempt) {
        setIsTimerRunning(true);
    } else {
        setIsTimerRunning(false);
        setTimerSeconds(0);
    }
  }, [showNewAttempt]);

  // Explain tab state
  const [explanationContent, setExplanationContent] = useState("");
  const [explanationFeedback, setExplanationFeedback] = useState<any>(null);
  const [loadingExplanation, setLoadingExplanation] = useState(false);
  const [fetchingFeedback, setFetchingFeedback] = useState(false);

  // Fetch explanation
  useEffect(() => {
    async function fetchExplanation() {
      if (activeTab !== "explain") return;
      setLoadingExplanation(true);
      try {
        const res = await fetch(`/api/explanations?problemId=${problem.id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.explanation) {
            setExplanationContent(data.explanation.content);
            setExplanationFeedback(data.explanation.feedback);
          }
        }
      } catch (err) {}
      setLoadingExplanation(false);
    }
    fetchExplanation();
  }, [activeTab, problem.id]);

  const saveExplanation = async (requestFeedback: boolean) => {
    if (requestFeedback) setFetchingFeedback(true);
    try {
      const res = await fetch("/api/explanations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemId: problem.id,
          content: explanationContent,
          requestFeedback
        })
      });
      if (res.ok) {
        const data = await res.json();
        setExplanationFeedback(data.explanation.feedback);
      }
    } catch(err) {}
    if (requestFeedback) setFetchingFeedback(false);
  };

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

  // Reflection state
  const [reflectionAttempt, setReflectionAttempt] = useState<Attempt | null>(null);
  const [reflectionType, setReflectionType] = useState<"success" | "failure" | null>(null);
  const [reflectionReason, setReflectionReason] = useState("");
  const [reflectionNote, setReflectionNote] = useState("");

  // Create new attempt
  const handleCreateAttempt = async () => {
    if (!newAttemptContent.trim() && !newAttemptCode.trim()) return;

    setSubmittingAttempt(true);
    try {
      const res = await fetch("/api/attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          problemId: problem.id,
          content: newAttemptContent,
          code: newAttemptCode,
          language: newAttemptLanguage,
          timeComplexity: newAttemptTime,
          spaceComplexity: newAttemptSpace,
          feltDifficulty: newAttemptFelt,
          duration: timerSeconds,
          notes: newAttemptNotes || undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAttempts((prev) => [data.attempt, ...prev]);
        setNewAttemptContent("");
        setNewAttemptCode("");
        setNewAttemptTime("");
        setNewAttemptSpace("");
        setNewAttemptFelt(0);
        setNewAttemptNotes("");
        setShowNewAttempt(false);
      }
    } catch (error) {
      console.error("Failed to create attempt:", error);
    } finally {
      setSubmittingAttempt(false);
    }
  };

  // Resolve attempt (opens reflection modal instead of blind resolved)
  const initiateResolve = (attempt: Attempt, isSuccess: boolean) => {
    setReflectionAttempt(attempt);
    setReflectionType(isSuccess ? "success" : "failure");
  };

  const handleSaveReflection = async () => {
    if (!reflectionAttempt || !reflectionType) return;
    
    // Status depends on user choice maybe, for now:
    const status = reflectionType === "success" ? "resolved" : "gave_up";
    
    try {
      const res = await fetch("/api/attempts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ 
          attemptId: reflectionAttempt._id, 
          status,
          failureReason: reflectionType === "failure" ? reflectionReason : undefined,
          failureNote: reflectionNote || undefined
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAttempts((prev) =>
          prev.map((a) => (a._id === reflectionAttempt._id ? data.attempt : a)),
        );
        setReflectionAttempt(null);
        setReflectionType(null);
        setReflectionReason("");
        setReflectionNote("");
      }
    } catch (error) {
      console.error("Failed to resolve:", error);
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
              {["details", "attempts", "explain"].map((tab) => {
                // Only show explain tab if there is at least one resolved attempt
                if (tab === "explain" && !attempts.some(a => a.status === "resolved" || a.status === "solved_with_help")) {
                  return null;
                }
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as "details" | "attempts" | "explain")}
                    className={cn(
                      "px-2.5 py-1 text-xs font-medium rounded-md transition-colors capitalize",
                      activeTab === tab
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted",
                    )}
                  >
                    {tab === "details" ? "Details"
                     : tab === "attempts" ? `Attempts (${attempts.length})` 
                     : "Explain"}
                  </button>
                );
              })}
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
            ) : activeTab === "attempts" ? (
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
                      className="rounded-lg border border-primary/30 bg-card p-4 space-y-4 overflow-hidden"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold flex items-center gap-2">
                          <Lightbulb className="h-4 w-4 text-primary" />
                          New Attempt
                        </h3>
                        <div className="flex items-center gap-3">
                          <div 
                            className="flex items-center gap-1.5 text-sm font-mono text-muted-foreground bg-muted px-2 py-1 rounded cursor-pointer hover:bg-muted/80"
                            onClick={() => setIsTimerRunning(!isTimerRunning)}
                          >
                            {isTimerRunning ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                            ⏱ {formatTimer(timerSeconds)}
                          </div>
                          <button
                            onClick={() => setShowNewAttempt(false)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Approach</label>
                        <textarea
                          placeholder="Explain your logic, e.g. Sort intervals by start time..."
                          value={newAttemptContent}
                          onChange={(e) => setNewAttemptContent(e.target.value)}
                          className="w-full h-24 px-3 py-2 text-sm rounded-md border border-border bg-background resize-none focus:outline-none focus:border-primary/50"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-medium text-muted-foreground">Code</label>
                          <select 
                            value={newAttemptLanguage} 
                            onChange={(e) => setNewAttemptLanguage(e.target.value)}
                            className="text-xs bg-background border border-border rounded px-2 py-1"
                          >
                            {["Python", "JavaScript", "Java", "C++", "Go", "Other"].map(l => (
                              <option key={l} value={l}>{l}</option>
                            ))}
                          </select>
                        </div>
                        <textarea
                          placeholder="Paste your code here..."
                          value={newAttemptCode}
                          onChange={(e) => setNewAttemptCode(e.target.value)}
                          className="w-full h-32 px-3 py-2 text-sm font-mono rounded-md border border-border bg-zinc-50 dark:bg-zinc-900 resize-none focus:outline-none focus:border-primary/50"
                        />
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-1 space-y-1">
                          <label className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">Time Complexity</label>
                          <input 
                            type="text" 
                            placeholder="O(?)" 
                            value={newAttemptTime}
                            onChange={(e) => setNewAttemptTime(e.target.value)}
                            className="w-full px-2 py-1.5 text-xs font-mono rounded border border-border bg-background"
                          />
                        </div>
                        <div className="flex-1 space-y-1">
                          <label className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">Space Complexity</label>
                          <input 
                            type="text" 
                            placeholder="O(?)" 
                            value={newAttemptSpace}
                            onChange={(e) => setNewAttemptSpace(e.target.value)}
                            className="w-full px-2 py-1.5 text-xs font-mono rounded border border-border bg-background"
                          />
                        </div>
                        <div className="flex-1 space-y-1">
                          <label className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">Felt Difficulty</label>
                          <div className="flex gap-1 pt-1.5">
                            {[1,2,3,4,5].map(rating => (
                              <button 
                                key={rating}
                                onClick={() => setNewAttemptFelt(rating)}
                                className={cn(
                                  "h-4 w-4 rounded-full text-[10px] leading-none flex items-center justify-center border",
                                  newAttemptFelt >= rating ? "bg-primary border-primary text-primary-foreground" : "border-border text-transparent hover:border-primary/50"
                                )}
                              >
                                ●
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Notes (optional)</label>
                        <textarea
                          placeholder="Edge cases, what you learned, bugs..."
                          value={newAttemptNotes}
                          onChange={(e) => setNewAttemptNotes(e.target.value)}
                          className="w-full h-12 px-3 py-2 text-xs rounded-md border border-border bg-background resize-none focus:outline-none focus:border-primary/50"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-2 border-t border-border/50">
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
                            (!newAttemptContent.trim() && !newAttemptCode.trim()) || submittingAttempt
                          }
                        >
                          {submittingAttempt ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Check className="h-4 w-4 mr-1" />
                              Save Attempt
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
                  <div className="space-y-4">
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
                            : attempt.status === "solved_with_help"
                            ? "border-teal-500/30 bg-teal-500/5"
                            : attempt.status === "gave_up"
                            ? "border-amber-500/30 bg-amber-500/5"
                            : "border-border bg-card",
                        )}
                      >
                        {/* Attempt Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              {attempt.status === "resolved" ? (
                                <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center">
                                  <Check className="h-3 w-3 text-green-500" />
                                </div>
                              ) : attempt.status === "solved_with_help" ? (
                                <div className="h-5 w-5 rounded-full bg-teal-500/20 flex items-center justify-center">
                                  <div className="h-2 w-2 rounded-full bg-teal-500" />
                                </div>
                              ) : attempt.status === "gave_up" ? (
                                <div className="h-5 w-5 rounded-full bg-amber-500/20 flex items-center justify-center">
                                  <XCircle className="h-3 w-3 text-amber-500" />
                                </div>
                              ) : (
                                <div className="h-5 w-5 rounded-full bg-zinc-500/20 flex items-center justify-center">
                                  <Clock className="h-3 w-3 text-zinc-500" />
                                </div>
                              )}
                              <span className="text-sm font-semibold capitalize">
                                {attempt.status.replace(/_/g, " ")}
                              </span>
                              <span className="text-xs text-muted-foreground ml-2">
                                {attempt.duration ? `${Math.floor(attempt.duration/60)}m ` : ''} 
                                {attempt.submissionCount ? `· ${attempt.submissionCount} submissions` : ''}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{formatRelativeTime(attempt.timestamp)}</span>
                              {attempt.feltDifficulty ? (
                                <>
                                  <span className="opacity-50">•</span>
                                  <span>Felt: {Array.from({length: 5}).map((_, i) => (
                                    <span key={i} className={i < attempt.feltDifficulty! ? "text-foreground" : "text-muted-foreground/30"}>●</span>
                                  ))}</span>
                                </>
                              ) : null}
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            {attempt.status === "attempting" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-xs h-7 gap-1 bg-green-500/10 hover:bg-green-500/20 text-green-600 mb-0"
                                  onClick={() => initiateResolve(attempt, true)}
                                >
                                  Solved
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-xs h-7 gap-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 mb-0"
                                  onClick={() => initiateResolve(attempt, false)}
                                >
                                  Gave up
                                </Button>
                              </>
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

                        {/* Failure reason if any */}
                        {attempt.status === "gave_up" && attempt.failureReason && (
                          <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 mt-2">
                            <p className="text-xs font-semibold text-destructive mb-1 flex items-center gap-1.5">
                              <AlertTriangle className="h-3.5 w-3.5" /> 
                              Why did this fail?
                            </p>
                            <p className="text-xs font-medium bg-background/50 border border-border/50 inline-block px-2 py-1 rounded mb-2">
                              {attempt.failureReason}
                            </p>
                            {attempt.failureNote && (
                              <p className="text-[11px] text-muted-foreground italic">"{attempt.failureNote}"</p>
                            )}
                          </div>
                        )}

                        {/* Content */}
                        {attempt.content && (
                          <div className="text-sm">
                            <span className="text-xs font-medium text-muted-foreground block mb-1">Approach</span>
                            <p className="whitespace-pre-wrap">{attempt.content}</p>
                          </div>
                        )}

                        {attempt.code && (
                          <div className="mt-3">
                            <div className="flex justify-between items-center text-xs mb-1 px-1">
                                <span className="font-medium text-muted-foreground">Code</span>
                                <span className="bg-muted px-2 py-0.5 rounded opacity-80">{attempt.language || 'Python'}</span>
                            </div>
                            <pre className="text-xs font-mono bg-zinc-950 text-zinc-50 p-3 rounded-md overflow-x-auto max-h-48 border border-border">
                              <code>{attempt.code}</code>
                            </pre>
                          </div>
                        )}
                        
                        {(attempt.timeComplexity || attempt.spaceComplexity) && (
                          <div className="flex gap-4 mt-2 mb-1">
                            {attempt.timeComplexity && <span className="text-xs"><span className="text-muted-foreground mr-1">Time:</span> <code className="bg-muted px-1.5 py-0.5 rounded">{attempt.timeComplexity}</code></span>}
                            {attempt.spaceComplexity && <span className="text-xs"><span className="text-muted-foreground mr-1">Space:</span> <code className="bg-muted px-1.5 py-0.5 rounded">{attempt.spaceComplexity}</code></span>}
                          </div>
                        )}

                        {attempt.notes && (
                          <div className="mt-2">
                            <span className="text-xs font-medium text-muted-foreground block mb-1">Notes</span>
                            <div className="text-xs text-muted-foreground bg-muted/50 rounded p-2 italic">
                              {attempt.notes}
                            </div>
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
            ) : (
              <motion.div
                key="explain"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="p-6 space-y-6 flex flex-col h-full"
              >
                <div>
                  <h3 className="text-lg font-medium">Explain "{problem.title}"</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Explain this problem as if teaching someone who knows basic programming but not this specific problem.
                  </p>
                </div>

                {loadingExplanation ? (
                  <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col gap-4">
                    <textarea
                      placeholder="Start explaining..."
                      value={explanationContent}
                      onChange={(e) => setExplanationContent(e.target.value)}
                      className="flex-1 min-h-[250px] w-full p-4 text-sm rounded-md border border-border bg-background focus:outline-none focus:border-primary/50 resize-y"
                    />

                    <div className="flex items-center justify-end gap-3">
                      <Button variant="ghost" onClick={() => saveExplanation(false)}>
                        Save explanation
                      </Button>
                      <Button onClick={() => saveExplanation(true)} disabled={fetchingFeedback || !explanationContent.trim()}>
                        {fetchingFeedback ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                        Get AI feedback →
                      </Button>
                    </div>

                    <AnimatePresence>
                      {explanationFeedback && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="rounded-lg border border-border p-4 bg-muted/10 space-y-4"
                        >
                          <h4 className="text-sm font-semibold flex items-center gap-2 text-primary">
                            <Lightbulb className="h-4 w-4" /> AI Feedback
                          </h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">Clarity</span>
                              <div className="flex items-center gap-2">
                                <div className="font-mono text-xs">{explanationFeedback.clarity}/10</div>
                                <div className="font-mono text-xs tracking-[-0.1em] text-primary">
                                  {"█".repeat(explanationFeedback.clarity)}{"░".repeat(10 - explanationFeedback.clarity)}
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">Completeness</span>
                              <div className="flex items-center gap-2">
                                <div className="font-mono text-xs">{explanationFeedback.completeness}/10</div>
                                <div className="font-mono text-xs tracking-[-0.1em] text-primary">
                                  {"█".repeat(explanationFeedback.completeness)}{"░".repeat(10 - explanationFeedback.completeness)}
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">Conciseness</span>
                              <div className="flex items-center gap-2">
                                <div className="font-mono text-xs">{explanationFeedback.conciseness}/10</div>
                                <div className="font-mono text-xs tracking-[-0.1em] text-primary">
                                  {"█".repeat(explanationFeedback.conciseness)}{"░".repeat(10 - explanationFeedback.conciseness)}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3 pt-3 border-t border-border/50 text-sm">
                            <div className="flex gap-2">
                              <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                              <p><span className="font-medium">Good:</span> <span className="text-muted-foreground">{explanationFeedback.good}</span></p>
                            </div>
                            <div className="flex gap-2">
                              <HelpCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                              <p><span className="font-medium">Missing:</span> <span className="text-muted-foreground">{explanationFeedback.missing}</span></p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Post-Solve Reflection Modal */}
      <AnimatePresence>
        {reflectionAttempt && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setReflectionAttempt(null)} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  {reflectionType === "success" ? (
                    <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Check className="h-4 w-4 text-green-500" />
                    </div>
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                      <XCircle className="h-4 w-4 text-amber-500" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-base font-semibold">
                      {reflectionType === "success" 
                        ? `Nice — ${problem.title} resolved` 
                        : `${problem.title} — not resolved`}
                    </h3>
                  </div>
                </div>

                {reflectionType === "success" ? (
                  <div className="space-y-5">
                    <div>
                      <p className="text-sm font-medium mb-2">How did you solve it?</p>
                      <div className="flex gap-2">
                        {["Independently", "With hints", "From editorial"].map(m => (
                          <Button key={m} variant="outline" size="sm" className="text-xs h-7">{m}</Button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Key insight (one line):</p>
                      <input type="text" className="w-full px-3 py-2 text-sm rounded border border-border bg-background h-10 placeholder:text-muted-foreground/50" placeholder="E.g. Sorting by start time makes overlaps adjacent..." />
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Would you solve it faster next time?</p>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input type="radio" name="faster" className="accent-primary" /> Definitely
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input type="radio" name="faster" className="accent-primary" /> Probably
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input type="radio" name="faster" className="accent-primary" /> Not sure
                        </label>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div>
                      <p className="text-sm font-medium mb-2">What went wrong?</p>
                      <div className="space-y-1">
                        {[
                          "🧠 Misunderstood the problem",
                          "📐 Wrong approach / algorithm",
                          "🔢 Off-by-one / boundary error",
                          "🏗️ Right approach, buggy code",
                          "⏰ Knew the approach, ran out of time",
                          "📊 Right answer, wrong complexity (TLE)",
                          "🫥 Completely stuck"
                        ].map(reason => {
                          const cleanReason = reason.substring(3);
                          return (
                            <div 
                              key={reason}
                              onClick={() => setReflectionReason(cleanReason)}
                              className={cn(
                                "text-sm p-2 rounded cursor-pointer transition-colors border",
                                reflectionReason === cleanReason 
                                  ? "bg-primary/5 border-primary/30 text-foreground font-medium" 
                                  : "border-transparent hover:bg-muted text-muted-foreground"
                              )}
                            >
                              {reason}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Quick note:</p>
                      <textarea 
                        value={reflectionNote}
                        onChange={(e) => setReflectionNote(e.target.value)}
                        className="w-full p-3 text-sm rounded-md border border-border bg-background focus:outline-none focus:border-primary/50 resize-none h-20" 
                        placeholder="Didn't realize this was a topological sort problem..." 
                      />
                    </div>
                  </div>
                )}

                <div className="mt-8 flex items-center justify-between border-t border-border/50 pt-4">
                  <Button variant="ghost" size="sm" onClick={() => {
                    // Just exit or skip
                    setReflectionAttempt(null);
                  }}>
                    Skip
                  </Button>
                  <Button size="sm" onClick={handleSaveReflection}>
                    Save & continue
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
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
