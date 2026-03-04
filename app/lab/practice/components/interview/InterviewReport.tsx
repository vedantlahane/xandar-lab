// app/lab/practice/components/interview/InterviewReport.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, X, AlertCircle, ArrowRight, BarChart2, Save, Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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

// ── Helper ─────────────────────────────────────────────────────────────────

function scoreToBar(score: number, max = 10): string {
  const filled = Math.round((score / max) * 10);
  return "█".repeat(filled) + "░".repeat(10 - filled);
}

function scoreToVerdict(score: number): { label: string; color: string } {
  if (score >= 8) return { label: "Strong Hire", color: "green" };
  if (score >= 6) return { label: "Lean Hire", color: "blue" };
  if (score >= 4) return { label: "Borderline", color: "yellow" };
  return { label: "Below Bar", color: "red" };
}

function performanceToStatus(score: number): "resolved" | "solved_with_help" | "gave_up" {
  if (score >= 8) return "resolved";
  if (score >= 5) return "solved_with_help";
  return "gave_up";
}

// ── Component ──────────────────────────────────────────────────────────────

export function InterviewReport({ config, sessionId, onClose }: InterviewReportProps) {
  const router = useRouter();
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(!!sessionId);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Try to get PracticeContext for openDrawer (safe — may not be available)
  let openDrawerFn: ((id: string) => void) | null = null;
  try {
    // Dynamic import to avoid hard dependency when used outside PracticeProvider
    const { usePracticeContext } = require("../../context/PracticeContext");
    const ctx = usePracticeContext();
    openDrawerFn = ctx?.openDrawer ?? null;
  } catch {
    // Not inside a PracticeProvider — no drawer available
  }

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
          <div className="mt-8 p-6 bg-linear-to-br from-zinc-100 to-zinc-50 dark:from-zinc-900/40 dark:to-zinc-900/10 rounded-xl border border-white/40 dark:border-white/5 backdrop-blur-md shadow-xl shadow-black/5 flex flex-wrap gap-8 items-center justify-between">
            <div>
              <h3 className="text-sm uppercase tracking-wider font-semibold text-muted-foreground mb-1">
                Overall Assessment
              </h3>
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold tabular-nums tracking-tighter">
                  {overallScore}
                </span>
                <span className="text-xl text-muted-foreground">/ 10</span>
                <div
                  className={`ml-4 px-3 py-1 rounded-md text-sm font-medium border ${verdict.color === "green"
                    ? "bg-green-500/10 text-green-500 border-green-500/20"
                    : verdict.color === "blue"
                      ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                      : verdict.color === "yellow"
                        ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                        : "bg-red-500/10 text-red-500 border-red-500/20"
                    }`}
                >
                  {verdict.label}
                </div>
              </div>
            </div>

            <div className="flex-1 min-w-[300px]">
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 font-mono text-sm">
                {metrics.map((m) => (
                  <div
                    key={m.name}
                    className="flex justify-between items-center group"
                  >
                    <span className="text-muted-foreground">{m.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-foreground tracking-[0.1em] text-xs">
                        {scoreToBar(m.score)}
                      </span>
                      <span className="w-8 text-right font-medium">
                        {m.score}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* No report state */}
        {!report && (
          <div className="mt-8 p-6 bg-muted/20 rounded-xl border border-border/40 text-center">
            <p className="text-muted-foreground">Report data unavailable for this session.</p>
          </div>
        )}

        {/* Feedback Section */}
        {(strengths.length > 0 || improvements.length > 0) && (
          <div className="mt-12 grid md:grid-cols-2 gap-8">
            {/* Strengths */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" /> Strengths
              </h3>
              <ul className="space-y-3">
                {strengths.map((text, i) => (
                  <li
                    key={i}
                    className="flex gap-3 text-sm leading-relaxed text-muted-foreground bg-green-500/5 p-3 rounded-lg border border-green-500/10"
                  >
                    <div className="mt-0.5">•</div>
                    {text}
                  </li>
                ))}
              </ul>
            </div>

            {/* Areas to Improve */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500" /> Areas to
                Improve
              </h3>
              <ul className="space-y-3">
                {improvements.map((text, i) => (
                  <li
                    key={i}
                    className="flex gap-3 text-sm leading-relaxed text-muted-foreground bg-amber-500/5 p-3 rounded-lg border border-amber-500/10"
                  >
                    <div className="mt-0.5">•</div>
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-12 mb-16 flex flex-wrap gap-4 justify-center">
          {/* Save to Attempts — the bridge */}
          {session?.problemId && report && (
            <Button
              onClick={handleSaveToAttempts}
              disabled={saving || saved}
              variant={saved ? "secondary" : "default"}
              className="gap-2 px-6"
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
          {session?.problemId && openDrawerFn && (
            <Button
              onClick={() => openDrawerFn!(session.problemId!)}
              variant="outline"
              className="gap-2 px-6"
            >
              <Eye className="h-4 w-4" /> Open in Browse
            </Button>
          )}

          <Button
            onClick={() => router.push("/lab/practice/analyze")}
            variant="outline"
            className="gap-2 px-6"
          >
            <BarChart2 className="h-4 w-4" /> View Analytics
          </Button>

          <Button
            onClick={onClose}
            variant="outline"
            className="gap-2 px-6"
          >
            New Session <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
