// app/lab/practice/components/interview/InterviewManager.tsx

"use client";

import { useState, useEffect } from "react";
import { InterviewSetup } from "./InterviewSetup";
import { ActiveInterview } from "./ActiveInterview";
import { InterviewReport } from "./InterviewReport";

// ── Types (shared across interview components) ─────────────────────────────

export interface InterviewConfig {
  style: string;
  difficulty: string;
  topic: string;
  source: "sheet" | "ai";
}

export interface PastSession {
  company: string;
  difficulty: string;
  duration: string;
  problem: string;
  score?: string;
  status: "completed" | "in-progress";
}

// ── Component ──────────────────────────────────────────────────────────────

export function InterviewManager() {
  const [view, setView] = useState<"setup" | "active" | "report">("setup");
  const [config, setConfig] = useState<InterviewConfig | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Fetch past interview sessions
  const [pastSessions, setPastSessions] = useState<PastSession[]>([]);

  useEffect(() => {
    fetch("/api/interviews", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        if (data.sessions) {
          const mapped: PastSession[] = data.sessions.map((s: {
            config: { style: string; difficulty: string; topic: string };
            status: string;
            startedAt: string;
            endedAt?: string;
            report?: { overallScore: number };
          }) => ({
            company: s.config.style,
            difficulty: s.config.difficulty,
            duration: s.endedAt
              ? `${Math.round((new Date(s.endedAt).getTime() - new Date(s.startedAt).getTime()) / 60000)}m`
              : "–",
            problem: s.config.topic,
            score: s.report?.overallScore ? `${s.report.overallScore}%` : undefined,
            status: s.status === "completed" ? "completed" : "in-progress",
          }));
          setPastSessions(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const handleStart = async (selectedConfig: InterviewConfig) => {
    setConfig(selectedConfig);
    try {
      const res = await fetch("/api/interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(selectedConfig),
      });
      const data = await res.json();
      if (res.ok && data.session?._id) {
        setSessionId(data.session._id);
        setView("active");
      }
    } catch {
      // Fallback: start without a session ID (mock mode)
      setView("active");
    }
  };

  const handleEnd = () => {
    setView("report");
  };

  const handleCloseReport = () => {
    setConfig(null);
    setSessionId(null);
    setView("setup");
  };

  if (view === "setup") {
    return (
      <InterviewSetup
        onStartInterview={handleStart}
        pastSessions={pastSessions}
      />
    );
  }

  if (view === "active" && config) {
    return <ActiveInterview config={config} sessionId={sessionId} onEnd={handleEnd} />;
  }

  return <InterviewReport config={config} onClose={handleCloseReport} />;
}