// app/lab/practice/components/analyze/AnalyzeDashboard.tsx

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Clock,
  Target,
  AlertTriangle,
  TrendingUp,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePracticeContext } from "../../context/PracticeContext";

interface AnalyticsData {
  summary: {
    totalSolved: number;
    weekDelta: number;
    avgResolutionMinutes: number;
    resolutionDeltaMinutes: number;
    firstTryRate: number;
    firstTryGoal: number;
    topBarrier: { topic: string; failureRate: number };
  };
  proficiency: { topic: string; score: number }[];
  pitfalls: { reason: string; count: number; focus: string }[];
  timePerDifficulty: { level: string; time: string; target: string; status: string }[];
  recentStruggles: { name: string; problemId: string; attempts: number }[];
}

interface AnalyzeDashboardProps {
  timeRange: string;
}

export function AnalyzeDashboard({ timeRange }: AnalyzeDashboardProps) {
  const { openDrawer } = usePracticeContext();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/analytics?range=${timeRange}`, { credentials: "include" })
      .then(res => res.json())
      .then(d => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [timeRange]);

  const proficiencyColor = (score: number) => {
    if (score >= 70) return "bg-green-500";
    if (score >= 50) return "bg-yellow-500";
    if (score >= 30) return "bg-orange-500";
    return "bg-destructive";
  };

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

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : !data ? (
          <div className="text-center py-24 text-muted-foreground">
            No analytics data available yet. Solve some problems first!
          </div>
        ) : (
          <>
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
                {data.summary.totalSolved}
              </div>
              <p className="text-xs text-muted-foreground mt-1 text-green-500 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> +{data.summary.weekDelta} this week
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
                {data.summary.avgResolutionMinutes}m
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {data.summary.resolutionDeltaMinutes <= 0 ? "" : "+"}{data.summary.resolutionDeltaMinutes}m vs last month
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
                {data.summary.firstTryRate}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">Goal: {data.summary.firstTryGoal}%</p>
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
                {data.summary.topBarrier?.topic || "None"}
              </div>
              <p className="text-xs text-muted-foreground mt-1 text-destructive/80">
                {data.summary.topBarrier?.failureRate ?? 0}% failure rate
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
                  {data.proficiency.map((item) => (
                    <div key={item.topic}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium">{item.topic}</span>
                        <span className="text-muted-foreground font-mono">
                          {item.score}%
                        </span>
                      </div>
                      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full ${proficiencyColor(item.score)}`}
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
                  {data.pitfalls.map((pattern, i) => (
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
                  {data.timePerDifficulty.map((d) => (
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
                  {data.recentStruggles.map((prob) => (
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
          </>
        )}

      </div>
    </div>
  );
}