// app/lab/practice/components/analyze/AnalyzeDashboard.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Activity,
  Clock,
  Target,
  AlertTriangle,
  TrendingUp,
  ChevronRight,
  Swords,
  Loader2,
  Zap,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePracticeContext } from "../../context/PracticeContext";
import { cn } from "@/lib/utils";

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

// ── Stat card helper ────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  subtitle,
  icon: Icon,
  iconColor,
  variant = "default",
}: {
  label: string;
  value: string | number;
  subtitle: string;
  icon: typeof Activity;
  iconColor: string;
  variant?: "default" | "danger";
}) {
  return (
    <div
      className={cn(
        "rounded-xl border backdrop-blur-md p-5 transition-colors space-y-3",
        variant === "danger"
          ? "bg-destructive/5 dark:bg-red-500/10 border-destructive/20 hover:bg-destructive/10"
          : "bg-white/50 dark:bg-zinc-900/30 border-zinc-200/60 dark:border-zinc-800/60 shadow-sm hover:bg-white/60 dark:hover:bg-zinc-900/50",
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground/60">
          {label}
        </span>
        <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center", `${iconColor}/10`)}>
          <Icon className={cn("h-4 w-4", iconColor)} />
        </div>
      </div>
      <div>
        <div className="text-2xl font-bold font-mono tracking-tighter">{value}</div>
        <p className={cn(
          "text-xs mt-1",
          variant === "danger" ? "text-destructive/80" : "text-muted-foreground",
        )}>
          {subtitle}
        </p>
      </div>
    </div>
  );
}

// ── Section header helper ───────────────────────────────────────────────────

function SectionHeader({
  icon: Icon,
  title,
  iconColor,
}: {
  icon: typeof Activity;
  title: string;
  iconColor?: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center bg-muted/50")}>
        <Icon className={cn("h-4 w-4", iconColor || "text-foreground")} />
      </div>
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────

export function AnalyzeDashboard({ timeRange }: AnalyzeDashboardProps) {
  const { openDrawer } = usePracticeContext();
  const router = useRouter();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/analytics?range=${timeRange}`, { credentials: "include" })
      .then(res => res.json())
      .then(d => setData(d))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, [timeRange]);

  const proficiencyColor = (score: number) => {
    if (score >= 70) return "bg-green-500";
    if (score >= 50) return "bg-yellow-500";
    if (score >= 30) return "bg-orange-500";
    return "bg-destructive";
  };

  const difficultyDot = (level: string) => {
    if (level === "Easy") return "bg-green-500";
    if (level === "Medium") return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="h-full w-full overflow-y-auto px-6 py-8 md:px-12 md:py-12 bg-background thin-scrollbar">
      <div className="max-w-4xl mx-auto space-y-8">

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
          <div className="text-center py-24 space-y-3">
            <div className="mx-auto h-12 w-12 rounded-xl bg-muted/50 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-muted-foreground/50" />
            </div>
            <p className="text-muted-foreground">
              No analytics data available yet. Solve some problems first!
            </p>
          </div>
        ) : (
          <>
            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatCard
                label="Total Solved"
                value={data.summary.totalSolved}
                subtitle={`+${data.summary.weekDelta} this week`}
                icon={Activity}
                iconColor="text-primary"
              />
              <StatCard
                label="Avg Resolution"
                value={`${data.summary.avgResolutionMinutes}m`}
                subtitle={`${data.summary.resolutionDeltaMinutes <= 0 ? "" : "+"}${data.summary.resolutionDeltaMinutes}m vs last month`}
                icon={Clock}
                iconColor="text-blue-500"
              />
              <StatCard
                label="First-try Accept"
                value={`${data.summary.firstTryRate}%`}
                subtitle={`Goal: ${data.summary.firstTryGoal}%`}
                icon={Target}
                iconColor="text-green-500"
              />
              <div className="rounded-xl border bg-destructive/5 dark:bg-red-500/10 border-destructive/20 backdrop-blur-md p-5 transition-colors hover:bg-destructive/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-widest font-semibold text-destructive/60">
                    Top Barrier
                  </span>
                  <div className="h-8 w-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  </div>
                </div>
                <div>
                  <div className="text-lg font-bold truncate">
                    {data.summary.topBarrier?.topic || "None"}
                  </div>
                  <p className="text-xs text-destructive/80 mt-1">
                    {data.summary.topBarrier?.failureRate ?? 0}% failure rate
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 gap-1.5 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 px-0"
                    onClick={() => router.push(`/lab/practice/interview?topic=${encodeURIComponent(data.summary.topBarrier?.topic ?? '')}`)}
                  >
                    <Swords className="h-3.5 w-3.5" /> Interview This Topic
                  </Button>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Left Column: Weakness Map & Failure Patterns */}
              <div className="lg:col-span-2 space-y-8">
                {/* Weakness Map */}
                <div className="rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/50 dark:bg-zinc-900/30 backdrop-blur-md shadow-sm p-6">
                  <SectionHeader icon={Target} title="Topic Proficiency" />
                  <div className="space-y-5">
                    {data.proficiency.map((item) => (
                      <div key={item.topic}>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-medium">{item.topic}</span>
                          <span className="text-muted-foreground font-mono text-xs">
                            {item.score}%
                          </span>
                        </div>
                        <div className="h-2 w-full bg-muted/30 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${proficiencyColor(item.score)}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${item.score}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Failure Patterns */}
                <div className="rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/50 dark:bg-zinc-900/30 backdrop-blur-md shadow-sm p-6">
                  <SectionHeader icon={AlertTriangle} title="Common Pitfalls" iconColor="text-amber-500" />
                  <div className="grid sm:grid-cols-2 gap-3">
                    {data.pitfalls.map((pattern, i) => (
                      <div
                        key={i}
                        className="p-4 border border-border/50 rounded-xl bg-muted/10 hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-sm">{pattern.reason}</h4>
                          <Badge
                            variant="secondary"
                            className="font-mono text-xs shrink-0 ml-2"
                          >
                            {pattern.count}×
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Focus area: {pattern.focus}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Time Analysis & Recent Activity */}
              <div className="space-y-8">
                {/* Time Analysis */}
                <div className="rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/50 dark:bg-zinc-900/30 backdrop-blur-md shadow-sm p-6">
                  <SectionHeader icon={Clock} title="Time per Difficulty" />
                  <div className="space-y-3">
                    {data.timePerDifficulty.map((d) => (
                      <div
                        key={d.level}
                        className="flex items-center justify-between p-3 border border-border/40 rounded-lg hover:border-border/60 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn("h-2 w-2 rounded-full shrink-0", difficultyDot(d.level))} />
                          <div>
                            <p className="text-sm font-medium">{d.level}</p>
                            <p className="text-[11px] text-muted-foreground">
                              Target: {d.target}
                            </p>
                          </div>
                        </div>
                        <div
                          className={cn(
                            "text-sm font-mono font-medium",
                            d.status === "danger" && "text-destructive",
                            d.status === "warning" && "text-amber-500",
                            d.status !== "danger" && d.status !== "warning" && "text-green-500",
                          )}
                        >
                          {d.time}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Struggles */}
                <div className="rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/50 dark:bg-zinc-900/30 backdrop-blur-md shadow-sm p-6">
                  <SectionHeader icon={Zap} title="Recent Struggles" iconColor="text-amber-500" />
                  <div className="space-y-2">
                    {data.recentStruggles.map((prob) => (
                      <div
                        key={prob.problemId}
                        onClick={() => openDrawer(prob.problemId)}
                        className="group flex items-center justify-between cursor-pointer p-2.5 -mx-1 rounded-lg hover:bg-muted/40 transition-colors"
                      >
                        <div className="truncate pr-4">
                          <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                            {prob.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {prob.attempts} failed attempts
                          </p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2.5 text-xs text-muted-foreground hover:text-primary hover:bg-primary/10"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/lab/practice/focus?p=${prob.problemId}`);
                            }}
                          >
                            Focus
                          </Button>
                          <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-4 text-xs h-8"
                    onClick={() => router.push('/lab/practice?filter=Unresolved')}
                  >
                    Review All in Browse →
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}