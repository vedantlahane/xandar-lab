// app/lab/practice/analyze/page.tsx — Analyze mode

"use client";

import { useState } from "react";
import { PracticeHeader } from "../components/PracticeHeader";
import { AnalyzeDashboard } from "../components/analyze/AnalyzeDashboard";
import { cn } from "@/lib/utils";

const TIME_RANGES = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "all", label: "All time" },
] as const;

type TimeRange = (typeof TIME_RANGES)[number]["value"];

export default function PracticeAnalyzePage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");

  return (
    <>
      {/* Header: mode pills + time range selector */}
      <PracticeHeader>
        <div className="flex items-center gap-1">
          {TIME_RANGES.map((r) => (
            <button
              key={r.value}
              onClick={() => setTimeRange(r.value as TimeRange)}
              className={cn(
                "px-3 py-1 rounded-lg text-xs font-medium border transition-all",
                timeRange === r.value
                  ? "bg-primary/10 text-primary border-primary/30"
                  : "border-transparent text-muted-foreground hover:bg-muted/30 hover:text-foreground",
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </PracticeHeader>

      {/* Analyze content */}
      <div className="flex-1 overflow-hidden">
        <AnalyzeDashboard timeRange={timeRange} />
      </div>
    </>
  );
}
