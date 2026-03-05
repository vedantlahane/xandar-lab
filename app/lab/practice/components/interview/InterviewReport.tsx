// app/lab/practice/components/interview/InterviewReport.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Check, X, AlertCircle, ArrowRight, BarChart2, Save, Eye, Loader2,
  Trophy, TrendingUp, Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePracticeContext } from "../../context/PracticeContext";
import { cn } from "@/lib/utils";
import type { InterviewConfig } from "./InterviewManager";

// ── Types ──────────────────────────────────────────────────────────────────

interface Metric {
  name: string;
  score: number;
}

interface ReportData {
  overallScore: number;
  metrics: Metric[];
  strengths: string[];
  improvements: string[];
  suggestedProblemIds: string[];
}

interface SessionData {
  _id: string;
  config: { style: string; difficulty: number; topic?: string };
  problemId?: string;
  duration?: number;
  report?: ReportData;
  hintsUsed?: number;
  messages?: { sender: string; text: string }[];
}

// ── Props ──────────────────────────────────────────────────────────────────

interface InterviewReportProps {
  config: InterviewConfig | null;
  sessionId: string | null;
  onClose: () => void;
}

// ── Helpers ────────────────────────────────────────────────────────────────

function scoreToVerdict(score: number): { label: string; color: string; icon: typeof Trophy } {
  if (score >= 8) return { label: "Strong Hire", color: "green", icon: Trophy };
  if (score >= 6) return { label: "Lean Hire", color: "blue", icon: TrendingUp };
  if (score >= 4) return { label: "Borderline", color: "yellow", icon: Target };
  return { label: "Below Bar", color: "red", icon: AlertCircle };
}

function performanceToStatus(score: number): "resolved" | "solved_with_help" | "gave_up" {
  if (score >= 8) return "resolved";
  if (score >= 5) return "solved_with_help";
  return "gave_up";
}

function metricBarColor(score: number): string {
  if (score >= 8) return "bg-green-500";
  if (score >= 6) return "bg-blue-500";
  if (score >= 4) return "bg-yellow-500";
  return "bg-red-500";
}

// ── Component ──────────────────────────────────────────────────────────────

export function InterviewReport({ config, sessionId, onClose }: InterviewReportProps) {
  const router = useRouter();
  const { openDrawer } = usePracticeContext();
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(!!sessionId);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Fetch real session data from API
  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    fetch(`/api/interviews/${sessionId}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.session) {
          setSession(data.session);
        }
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, [sessionId]);

  // ── Save to Attempts ───────────────────────────────────────────────────
  const handleSaveToAttempts = async () => {
    if (!session?.problemId || !session?.report) return;

    setSaving(true);
    try {
      const res = await fetch("/api/attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          problemId: session.problemId,
          content: `Interview session (${session.config.style} style, Level ${session.config.difficulty}).\n\nStrengths: ${session.report.strengths.join(", ")}.\n\nAreas to improve: ${session.report.improvements.join(", ")}.`,
          feltDifficulty: session.config.difficulty,
          duration: session.duration ?? 0,
          status: performanceToStatus(session.report.overallScore),
          source: "interview",
          interviewSessionId: session._id,
          solveMethod: session.config.style === "guided" ? "With hints" : "Independently",
          keyInsight: session.report.strengths[0] || "",
        }),
      });

      if (res.ok) {
        setSaved(true);
      }
    } catch {
      // silently fail
    } finally {
      setSaving(false);
    }
  };

  // ── Derive display data ────────────────────────────────────────────────
  const report = session?.report;
  const overallScore = report?.overallScore ?? 0;
  const metrics = report?.metrics ?? [];
  const strengths = report?.strengths ?? [];
  const improvements = report?.improvements ?? [];
  const verdict = scoreToVerdict(overallScore);
  const VerdictIcon = verdict.icon;

  const sessionLabel = config
    ? `${config.style.charAt(0).toUpperCase() + config.style.slice(1)} · Level ${typeof config.difficulty === "number" ? config.difficulty : "Auto"}`
    : session
      ? `${session.config.style} · Level ${session.config.difficulty}`
      : "Mock Interview";

  // ── Loading state ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="h-full overflow-y-auto w-full max-w-4xl mx-auto p-8 relative thin-scrollbar">
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="absolute top-8 right-8 text-muted-foreground hover:bg-muted/50 rounded-full"
      >
        <X className="h-5 w-5" />
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Session Complete
        </h1>
        <p className="text-muted-foreground">Mock Interview · {sessionLabel}</p>

        {/* Overall Score Banner */}
        {report && (
          <div className="mt-8 p-6 rounded-xl border border-white/40 dark:border-white/5 bg-linear-to-br from-white/60 to-white/30 dark:from-zinc-900/40 dark:to-zinc-900/10 backdrop-blur-md shadow-xl shadow-black/5">
            <div className="flex flex-wrap gap-8 items-center justify-between">
              <div className="flex items-center gap-5">
                <div className={cn(
                  "h-16 w-16 rounded-2xl flex items-center justify-center",
                  verdict.color === "green" && "bg-green-500/10",
                  verdict.color === "blue" && "bg-blue-500/10",
                  verdict.color === "yellow" && "bg-yellow-500/10",
                  verdict.color === "red" && "bg-red-500/10",
                )}>
                  <VerdictIcon className={cn(
                    "h-8 w-8",
                    verdict.color === "green" && "text-green-500",
                    verdict.color === "blue" && "text-blue-500",
                    verdict.color === "yellow" && "text-yellow-500",
                    verdict.color === "red" && "text-red-500",
                  )} />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground/60 mb-1">
                    Overall Assessment
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-4xl font-bold tabular-nums tracking-tighter">
                      {overallScore}
                    </span>
                    <span className="text-xl text-muted-foreground">/ 10</span>
                    <div
                      className={cn(
                        "ml-2 px-3 py-1 rounded-lg text-sm font-medium border",
                        verdict.color === "green" && "bg-green-500/10 text-green-500 border-green-500/20",
                        verdict.color === "blue" && "bg-blue-500/10 text-blue-500 border-blue-500/20",
                        verdict.color === "yellow" && "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
                        verdict.color === "red" && "bg-red-500/10 text-red-500 border-red-500/20",
                      )}
                    >
                      {verdict.label}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics */}
            {metrics.length > 0 && (
              <div className="mt-6 pt-6 border-t border-border/30 space-y-3">
                {metrics.map((m) => (
                  <div key={m.name} className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground w-32 shrink-0 truncate">
                      {m.name}
                    </span>
                    <div className="flex-1 h-2 bg-muted/30 rounded-full overflow-hidden">
                      <motion.div
                        className={cn("h-full rounded-full", metricBarColor(m.score))}
                        initial={{ width: 0 }}
                        animate={{ width: `${(m.score / 10) * 100}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                    <span className="text-sm font-mono font-medium w-8 text-right tabular-nums">
                      {m.score}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* No report state */}
        {!report && (
          <div className="mt-8 p-6 rounded-xl border border-border/40 text-center space-y-2">
            <div className="mx-auto h-12 w-12 rounded-xl bg-muted/50 flex items-center justify-center">
              <BarChart2 className="h-6 w-6 text-muted-foreground/50" />
            </div>
            <p className="text-muted-foreground">Report data unavailable for this session.</p>
          </div>
        )}

        {/* Feedback Section */}
        {(strengths.length > 0 || improvements.length > 0) && (
          <div className="mt-10 grid md:grid-cols-2 gap-6">
            {/* Strengths */}
            {strengths.length > 0 && (
              <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-5 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <Check className="h-4 w-4 text-green-500" />
                  </div>
                  <h3 className="text-sm font-semibold uppercase tracking-widest text-green-600 dark:text-green-400">
                    Strengths
                  </h3>
                </div>
                <ul className="space-y-2.5">
                  {strengths.map((text, i) => (
                    <li
                      key={i}
                      className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
                      {text}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Areas to Improve */}
            {improvements.length > 0 && (
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                  </div>
                  <h3 className="text-sm font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                    Areas to Improve
                  </h3>
                </div>
                <ul className="space-y-2.5">
                  {improvements.map((text, i) => (
                    <li
                      key={i}
                      className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                      {text}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-12 mb-16 flex flex-wrap gap-3 justify-center">
          {/* Save to Attempts */}
          {session?.problemId && report && (
            <Button
              onClick={handleSaveToAttempts}
              disabled={saving || saved}
              variant={saved ? "secondary" : "default"}
              className="gap-2 px-6 h-11"
            >
              {saving ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
              ) : saved ? (
                <><Check className="h-4 w-4" /> Saved to Attempts</>
              ) : (
                <><Save className="h-4 w-4" /> Save to Attempts</>
              )}
            </Button>
          )}

          {/* Open in Browse drawer */}
          {session?.problemId && (
            <Button
              onClick={() => openDrawer(session.problemId!)}
              variant="outline"
              className="gap-2 px-6 h-11"
            >
              <Eye className="h-4 w-4" /> Open in Browse
            </Button>
          )}

          <Button
            onClick={() => router.push("/lab/practice/analyze")}
            variant="outline"
            className="gap-2 px-6 h-11"
          >
            <BarChart2 className="h-4 w-4" /> View Analytics
          </Button>

          <Button
            onClick={onClose}
            variant="outline"
            className="gap-2 px-6 h-11"
          >
            New Session <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
