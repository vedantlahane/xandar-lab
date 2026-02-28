// app/lab/practice/components/interview/InterviewManager.tsx

"use client";

import { useState } from "react";
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

  // TODO: Fetch from GET /api/interviews/history
  const pastSessions: PastSession[] = [];

  const handleStart = (selectedConfig: InterviewConfig) => {
    setConfig(selectedConfig);
    setView("active");
  };

  const handleEnd = () => {
    setView("report");
  };

  const handleCloseReport = () => {
    setConfig(null);
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
    return <ActiveInterview config={config} onEnd={handleEnd} />;
  }

  return <InterviewReport config={config} onClose={handleCloseReport} />;
}