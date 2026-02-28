"use client";

import { useState } from "react";
import { InterviewSetup } from "./InterviewSetup";
import { ActiveInterview } from "./ActiveInterview";
import { InterviewReport } from "./InterviewReport";

export function InterviewManager() {
  const [view, setView] = useState<"setup" | "active" | "report">("setup");
  const [config, setConfig] = useState<any>(null);

  const handleStart = (selectedConfig: any) => {
    setConfig(selectedConfig);
    setView("active");
  };

  const handleEnd = () => {
    setView("report");
  };

  const handleCloseReport = () => {
    setView("setup");
  };

  if (view === "setup") {
    return <InterviewSetup onStartInterview={handleStart} pastSessions={[]} />;
  }

  if (view === "active") {
    return <ActiveInterview config={config} onEnd={handleEnd} />;
  }

  return <InterviewReport onClose={handleCloseReport} />;
}