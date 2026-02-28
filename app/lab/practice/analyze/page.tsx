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
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as TimeRange)}
          className={cn(
            "text-sm border border-border/40 rounded-md px-2.5 py-1",
            "bg-transparent text-muted-foreground",
            "hover:border-border/70 hover:text-foreground transition-colors",
            "focus:outline-none",
          )}
        >
          {TIME_RANGES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </PracticeHeader>

      {/* Analyze content */}
      <div className="flex-1 overflow-hidden">
        <AnalyzeDashboard timeRange={timeRange} />
      </div>
    </>
  );
}
