// app/lab/practice/components/analyze/AnalyzeDashboard.tsx

"use client";

import { motion } from "framer-motion";
import {
  Activity,
  Clock,
  Target,
  AlertTriangle,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePracticeContext } from "../../context/PracticeContext";

// TODO: Replace ALL hardcoded data below with API calls:
// GET /api/analytics/summary?range={timeRange}       → top stats row
// GET /api/analytics/proficiency?range={timeRange}    → topic proficiency bars
// GET /api/analytics/pitfalls?range={timeRange}       → common pitfalls grid
// GET /api/analytics/time-analysis?range={timeRange}  → time per difficulty
// GET /api/analytics/struggles?range={timeRange}      → recent struggles list
//
// Every number, percentage, and label below is static mockup data.

interface AnalyzeDashboardProps {
  timeRange: string;
}

export function AnalyzeDashboard({ timeRange }: AnalyzeDashboardProps) {
  const { openDrawer } = usePracticeContext();

  // TODO: Fetch real data using timeRange
  // const { data, isLoading } = useAnalytics(timeRange);

  return (
    <div className="h-full w-full overflow-y-auto px-6 py-8 md:px-12 md:py-12 bg-background thin-scrollbar">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Performance Analytics
          </h1>
          <p className="text-muted-foreground">
            Detailed breakdown of your problem-solving patterns & weak points.
          </p>
        </div>

        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card shadow-sm border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Solved
              </CardTitle>
              <Activity className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono tracking-tighter">
                128
              </div>
              <p className="text-xs text-muted-foreground mt-1 text-green-500 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> +12 this week
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card shadow-sm border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg Resolution
              </CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono tracking-tighter">
                24m 12s
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                -2m vs last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card shadow-sm border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                First-try Accept
              </CardTitle>
              <Target className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono tracking-tighter">
                42%
              </div>
              <p className="text-xs text-muted-foreground mt-1">Goal: 60%</p>
            </CardContent>
          </Card>

          <Card className="bg-card shadow-sm border-border bg-destructive/5 border-destructive/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-destructive">
                Top Barrier
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold truncate">
                Dynamic Programming
              </div>
              <p className="text-xs text-muted-foreground mt-1 text-destructive/80">
                35% failure rate
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column: Weakness Map & Failure Patterns */}
          <div className="lg:col-span-2 space-y-8">
            {/* Weakness Map */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5" /> Topic Proficiency
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    { topic: "Arrays & Hashing", score: 85, color: "bg-green-500" },
                    { topic: "Two Pointers", score: 72, color: "bg-blue-500" },
                    { topic: "Trees", score: 60, color: "bg-yellow-500" },
                    { topic: "Graphs", score: 45, color: "bg-orange-500" },
                    { topic: "Dynamic Programming", score: 25, color: "bg-destructive" },
                  ].map((item) => (
                    <div key={item.topic}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium">{item.topic}</span>
                        <span className="text-muted-foreground font-mono">
                          {item.score}%
                        </span>
                      </div>
                      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full ${item.color}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${item.score}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Failure Patterns */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" /> Common
                  Pitfalls
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { reason: "Off-by-one errors", count: 14, focus: "Loop bounds & indexing" },
                    { reason: "Time Limit Exceeded", count: 9, focus: "Optimizing O(N²) to O(N log N)" },
                    { reason: "Null Pointer Exceptions", count: 7, focus: "Edge case handling" },
                    { reason: "Memory Limit Exceeded", count: 3, focus: "Space complexity" },
                  ].map((pattern, i) => (
                    <div
                      key={i}
                      className="p-4 border border-border rounded-xl bg-muted/20"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-sm">
                          {pattern.reason}
                        </h4>
                        <Badge
                          variant="secondary"
                          className="font-mono text-xs"
                        >
                          {pattern.count}x
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Focus area: {pattern.focus}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Time Analysis & Recent Activity */}
          <div className="space-y-8">
            {/* Time Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5" /> Time per Difficulty
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { level: "Easy", time: "12m", target: "10m", status: "good" },
                    { level: "Medium", time: "35m", target: "25m", status: "warning" },
                    { level: "Hard", time: "1h 15m", target: "45m", status: "danger" },
                  ].map((d) => (
                    <div
                      key={d.level}
                      className="flex items-center justify-between p-3 border border-border/50 rounded-lg bg-card shadow-sm hover:border-primary/30 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-semibold">{d.level}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          Target: {d.target}
                        </p>
                      </div>
                      <div
                        className={`text-sm font-mono font-medium ${
                          d.status === "danger"
                            ? "text-destructive"
                            : d.status === "warning"
                              ? "text-amber-500"
                              : "text-green-500"
                        }`}
                      >
                        {d.time}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Struggles */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Struggles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "Longest Increasing Subsequence", problemId: "dp-1", attempts: 4 },
                    { name: "Course Schedule II", problemId: "graph-5", attempts: 3 },
                    { name: "Word Search II", problemId: "backtracking-3", attempts: 5 },
                  ].map((prob) => (
                    <div
                      key={prob.problemId}
                      onClick={() => openDrawer(prob.problemId)}
                      className="group flex items-center justify-between cursor-pointer p-2 -mx-2 rounded-md hover:bg-muted/50 transition-colors"
                    >
                      <div className="truncate pr-4">
                        <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                          {prob.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {prob.attempts} failed attempts
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </div>
                  ))}
                </div>
                {/* TODO: Wire to a full history view when it exists */}
                <Button
                  variant="outline"
                  className="w-full mt-6 text-xs h-8"
                  disabled
                  title="Coming soon"
                >
                  Review All History
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </div>
  );
}