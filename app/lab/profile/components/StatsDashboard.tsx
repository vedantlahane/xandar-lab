"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    TrendingUp, Target, Flame, Clock,
    CheckCircle2, BookOpen, Calendar, Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsData {
    overview: {
        totalAttempts: number;
        resolvedAttempts: number;
        attemptingCount: number;
        uniqueProblemsAttempted: number;
        savedProblems: number;
        completedProblems: number;
        currentStreak: number;
        maxStreak: number;
    };
    dailyActivity: { date: string; count: number }[];
    attemptsByTopic: { topic: string; total: number; resolved: number }[];
    recentActivity: { _id: string; problemId: string; status: string; timestamp: string }[];
    memberSince: string;
    lastActive: string;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.05, delayChildren: 0.1 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export function StatsDashboard() {
    const [stats, setStats] = useState<StatsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch("/api/stats", { credentials: "include" });
                if (res.ok) {
                    const data = await res.json();
                    setStats(data.stats);
                } else {
                    setError("Failed to load statistics");
                }
            } catch (err) {
                setError("Failed to load statistics");
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (error || !stats) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                <p className="text-sm">{error || "No statistics available"}</p>
            </div>
        );
    }

    const resolutionRate = stats.overview.totalAttempts > 0
        ? Math.round((stats.overview.resolvedAttempts / stats.overview.totalAttempts) * 100)
        : 0;

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
        >
            {/* Quick Stats Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatCard
                    icon={Target}
                    label="Total Attempts"
                    value={stats.overview.totalAttempts}
                    sublabel="learning moments"
                    color="blue"
                />
                <StatCard
                    icon={CheckCircle2}
                    label="Resolved"
                    value={stats.overview.resolvedAttempts}
                    sublabel={`${resolutionRate}% rate`}
                    color="green"
                />
                <StatCard
                    icon={Flame}
                    label="Current Streak"
                    value={stats.overview.currentStreak}
                    sublabel={`max: ${stats.overview.maxStreak} days`}
                    color="orange"
                />
                <StatCard
                    icon={BookOpen}
                    label="Problems Explored"
                    value={stats.overview.uniqueProblemsAttempted}
                    sublabel={`${stats.overview.completedProblems} completed`}
                    color="purple"
                />
            </motion.div>

            {/* Activity Heatmap */}
            <motion.div variants={itemVariants} className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm p-5">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        Last 7 Days Activity
                    </h3>
                    <span className="text-xs text-muted-foreground">
                        {stats.dailyActivity.reduce((sum, d) => sum + d.count, 0)} attempts
                    </span>
                </div>

                <div className="flex gap-1.5 justify-between">
                    {stats.dailyActivity.map((day, i) => {
                        const date = new Date(day.date);
                        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                        const isToday = i === stats.dailyActivity.length - 1;

                        return (
                            <div key={day.date} className="flex-1 flex flex-col items-center gap-1.5">
                                <div
                                    className={cn(
                                        "w-full aspect-square rounded-md transition-colors relative group",
                                        getActivityColor(day.count)
                                    )}
                                >
                                    {/* Tooltip */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                        {day.count} attempt{day.count !== 1 ? 's' : ''}
                                    </div>
                                </div>
                                <span className={cn(
                                    "text-[10px]",
                                    isToday ? "font-semibold text-foreground" : "text-muted-foreground"
                                )}>
                                    {dayName}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </motion.div>

            {/* Topics Progress */}
            {stats.attemptsByTopic.length > 0 && (
                <motion.div variants={itemVariants} className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm p-5">
                    <h3 className="text-sm font-semibold flex items-center gap-2 mb-4">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        Topics Progress
                    </h3>

                    <div className="space-y-3">
                        {stats.attemptsByTopic.slice(0, 5).map((topic) => {
                            const progress = topic.total > 0
                                ? Math.round((topic.resolved / topic.total) * 100)
                                : 0;

                            return (
                                <div key={topic.topic} className="space-y-1.5">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="font-medium capitalize">{topic.topic}</span>
                                        <span className="text-muted-foreground">
                                            {topic.resolved}/{topic.total}
                                        </span>
                                    </div>
                                    <div className="h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                            transition={{ duration: 0.5, delay: 0.2 }}
                                            className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400"
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            )}

            {/* Recent Activity */}
            {stats.recentActivity.length > 0 && (
                <motion.div variants={itemVariants} className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm p-5">
                    <h3 className="text-sm font-semibold flex items-center gap-2 mb-4">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        Recent Activity
                    </h3>

                    <div className="space-y-2">
                        {stats.recentActivity.map((activity) => {
                            const date = new Date(activity.timestamp);
                            const timeStr = date.toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true
                            });
                            const dateStr = date.toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                            });

                            return (
                                <div
                                    key={activity._id}
                                    className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0"
                                >
                                    <div className={cn(
                                        "h-2 w-2 rounded-full",
                                        activity.status === 'resolved'
                                            ? "bg-green-500"
                                            : "bg-amber-500"
                                    )} />
                                    <span className="flex-1 text-sm truncate font-medium">
                                        {activity.problemId}
                                    </span>
                                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                                        {dateStr} at {timeStr}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            )}

            {/* Empty State */}
            {stats.overview.totalAttempts === 0 && (
                <motion.div
                    variants={itemVariants}
                    className="text-center py-8 text-muted-foreground"
                >
                    <Target className="h-10 w-10 mx-auto mb-3 opacity-40" />
                    <p className="text-sm font-medium">No attempts yet</p>
                    <p className="text-xs mt-1">
                        Start practicing to build your learning history
                    </p>
                </motion.div>
            )}
        </motion.div>
    );
}

function StatCard({
    icon: Icon,
    label,
    value,
    sublabel,
    color
}: {
    icon: React.ElementType;
    label: string;
    value: number;
    sublabel: string;
    color: 'blue' | 'green' | 'orange' | 'purple';
}) {
    const colorClasses = {
        blue: "bg-blue-500/10 text-blue-500 dark:bg-blue-500/20",
        green: "bg-green-500/10 text-green-500 dark:bg-green-500/20",
        orange: "bg-orange-500/10 text-orange-500 dark:bg-orange-500/20",
        purple: "bg-purple-500/10 text-purple-500 dark:bg-purple-500/20",
    };

    return (
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm p-4">
            <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center mb-3", colorClasses[color])}>
                <Icon className="h-4 w-4" />
            </div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            <p className="text-[10px] text-muted-foreground/70 mt-1">{sublabel}</p>
        </div>
    );
}

function getActivityColor(count: number): string {
    if (count === 0) return "bg-zinc-100 dark:bg-zinc-800";
    if (count <= 1) return "bg-green-200 dark:bg-green-900/50";
    if (count <= 3) return "bg-green-300 dark:bg-green-800/70";
    if (count <= 5) return "bg-green-400 dark:bg-green-700";
    return "bg-green-500 dark:bg-green-600";
}
