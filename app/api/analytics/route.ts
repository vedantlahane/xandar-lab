import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Attempt from '@/models/Attempt';
import ActivityLog from '@/models/ActivityLog';
import { getValidatedSession } from '@/lib/auth';
import { SHEET } from '@/app/lab/practice/data/sheet';

export const dynamic = 'force-dynamic';

function getTopicForProblem(problemId: string): string | null {
    for (const topic of SHEET) {
        if (topic.problems.some(p => p.id === problemId)) {
            return topic.topicName;
        }
    }
    return null;
}

function getDifficultyForProblem(problemId: string): string | null {
    for (const topic of SHEET) {
        const problem = topic.problems.find(p => p.id === problemId);
        if (problem) {
            if (problem.tags?.includes('Easy')) return 'Easy';
            if (problem.tags?.includes('Medium')) return 'Medium';
            if (problem.tags?.includes('Hard')) return 'Hard';
            return null;
        }
    }
    return null;
}

function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    if (mins >= 60) {
        const hrs = Math.floor(mins / 60);
        return `${hrs}h ${mins % 60}m`;
    }
    return `${mins}m ${secs}s`;
}

// GET /api/analytics?range=7d|30d|90d|all
export async function GET(req: Request) {
    try {
        const session = await getValidatedSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const range = searchParams.get('range') || '30d';

        await connectDB();

        // Determine date range
        const now = new Date();
        let rangeStart: Date | null = null;
        if (range === '7d') rangeStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        else if (range === '30d') rangeStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        else if (range === '90d') rangeStart = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

        const attemptQuery: Record<string, any> = { userId: session.userId };
        if (rangeStart) attemptQuery.timestamp = { $gte: rangeStart };

        const attempts = await Attempt.find(attemptQuery).sort({ timestamp: 1 }).lean();

        // --- totalSolved ---
        const resolvedProblemIds = new Set<string>();
        for (const a of attempts) {
            if (a.status === 'resolved' || a.status === 'solved_with_help') {
                resolvedProblemIds.add(a.problemId);
            }
        }
        const totalSolved = resolvedProblemIds.size;

        // --- weeklyDelta ---
        const thisWeekStart = new Date(now);
        thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay());
        thisWeekStart.setHours(0, 0, 0, 0);
        const lastWeekStart = new Date(thisWeekStart.getTime() - 7 * 24 * 60 * 60 * 1000);

        const thisWeekResolved = new Set<string>();
        const lastWeekResolved = new Set<string>();
        for (const a of attempts) {
            if (a.status === 'resolved' || a.status === 'solved_with_help') {
                const ts = new Date(a.timestamp);
                if (ts >= thisWeekStart) thisWeekResolved.add(a.problemId);
                else if (ts >= lastWeekStart && ts < thisWeekStart) lastWeekResolved.add(a.problemId);
            }
        }
        const weeklyDelta = thisWeekResolved.size - lastWeekResolved.size;

        // --- avgResolutionTime ---
        const resolvedAttempts = attempts.filter(a => a.status === 'resolved' || a.status === 'solved_with_help');
        const durations = resolvedAttempts.filter(a => a.duration && a.duration > 0).map(a => a.duration!);
        const avgResolutionTime = durations.length > 0
            ? formatDuration(durations.reduce((a, b) => a + b, 0) / durations.length)
            : '0m 0s';

        // --- firstTryAcceptRate ---
        // Group by problemId, check if first attempt (earliest) is resolved
        const firstAttempts = new Map<string, any>();
        for (const a of attempts) {
            if (!firstAttempts.has(a.problemId)) {
                firstAttempts.set(a.problemId, a);
            }
        }
        const problemsWithAttempts = firstAttempts.size;
        const firstTryAccepts = Array.from(firstAttempts.values()).filter(
            a => a.status === 'resolved' || a.status === 'solved_with_help'
        ).length;
        const firstTryAcceptRate = problemsWithAttempts > 0
            ? Math.round((firstTryAccepts / problemsWithAttempts) * 100)
            : 0;

        // --- topBarrier ---
        const topicFailures = new Map<string, { total: number; gaveUp: number }>();
        for (const a of attempts) {
            const topic = getTopicForProblem(a.problemId);
            if (!topic) continue;
            if (!topicFailures.has(topic)) topicFailures.set(topic, { total: 0, gaveUp: 0 });
            const tf = topicFailures.get(topic)!;
            tf.total++;
            if (a.status === 'gave_up') tf.gaveUp++;
        }
        let topBarrier = { topic: 'N/A', failureRate: 0 };
        for (const [topic, stats] of topicFailures) {
            if (stats.total >= 2) { // need at least 2 attempts to be meaningful
                const rate = Math.round((stats.gaveUp / stats.total) * 100);
                if (rate > topBarrier.failureRate) {
                    topBarrier = { topic, failureRate: rate };
                }
            }
        }

        // --- proficiency ---
        const proficiency = SHEET.map(topic => {
            const problemIds = new Set(topic.problems.map(p => p.id));
            const topicAttempts = attempts.filter(a => problemIds.has(a.problemId));

            const resolvedIds = new Set(
                topicAttempts
                    .filter(a => a.status === 'resolved' || a.status === 'solved_with_help')
                    .map(a => a.problemId)
            );
            const gaveUpIds = new Set(
                topicAttempts.filter(a => a.status === 'gave_up').map(a => a.problemId)
            );

            const completionRate = topic.problems.length > 0
                ? resolvedIds.size / topic.problems.length
                : 0;
            const attemptedIds = new Set(topicAttempts.map(a => a.problemId));
            const gaveUpRate = attemptedIds.size > 0
                ? gaveUpIds.size / attemptedIds.size
                : 0;

            const score = Math.round(completionRate * 50 + (1 - gaveUpRate) * 50);

            return { topic: topic.topicName, score };
        }).filter(p => p.score < 100) // only show topics that aren't 100% 
            .sort((a, b) => b.score - a.score)
            .slice(0, 8); // top 8

        // --- pitfalls ---
        const reasonCounts = new Map<string, number>();
        const gaveUpAttempts = attempts.filter(a => a.status === 'gave_up' && a.failureReason);
        for (const a of gaveUpAttempts) {
            const r = a.failureReason!;
            reasonCounts.set(r, (reasonCounts.get(r) || 0) + 1);
        }
        const focusMap: Record<string, string> = {
            'Wrong approach / algorithm': 'Algorithm selection & pattern recognition',
            'Completely stuck': 'Problem decomposition strategies',
            'Off-by-one / boundary error': 'Loop bounds & indexing',
            'Right answer, wrong complexity (TLE)': 'Optimizing time complexity',
            'Memory Limit Exceeded': 'Space complexity optimization',
            'Null Pointer Exceptions': 'Edge case handling',
        };
        const pitfalls = Array.from(reasonCounts.entries())
            .sort((a, b) => b[1] - a[1])
            .map(([reason, count]) => ({
                reason,
                count,
                focus: focusMap[reason] || 'General problem solving',
            }));

        // --- timePerDifficulty ---
        const diffDurations = new Map<string, number[]>();
        for (const a of resolvedAttempts) {
            if (!a.duration) continue;
            const diff = getDifficultyForProblem(a.problemId);
            if (!diff) continue;
            if (!diffDurations.has(diff)) diffDurations.set(diff, []);
            diffDurations.get(diff)!.push(a.duration);
        }
        const targets: Record<string, number> = { Easy: 600, Medium: 1500, Hard: 2700 };
        const targetLabels: Record<string, string> = { Easy: '10m', Medium: '25m', Hard: '45m' };
        const timePerDifficulty = ['Easy', 'Medium', 'Hard'].map(level => {
            const durs = diffDurations.get(level) || [];
            const avg = durs.length > 0 ? durs.reduce((a, b) => a + b, 0) / durs.length : 0;
            const target = targets[level];
            let status: 'good' | 'warning' | 'danger' = 'good';
            if (avg > target * 1.5) status = 'danger';
            else if (avg > target) status = 'warning';
            return {
                level,
                avgTime: avg > 0 ? formatDuration(avg) : 'N/A',
                target: targetLabels[level],
                status,
            };
        });

        // --- recentStruggles ---
        const gaveUpCounts = new Map<string, number>();
        for (const a of gaveUpAttempts) {
            gaveUpCounts.set(a.problemId, (gaveUpCounts.get(a.problemId) || 0) + 1);
        }
        const allProblems = SHEET.flatMap(t => t.problems);
        const recentStruggles = Array.from(gaveUpCounts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([problemId, attempts]) => {
                const prob = allProblems.find(p => p.id === problemId);
                return {
                    problemId,
                    name: prob?.title || problemId,
                    attempts,
                };
            });

        // --- weeklyActivity ---
        const activityLogs = await ActivityLog.find({
            userId: session.userId,
            ...(rangeStart ? { date: { $gte: rangeStart.toISOString().split('T')[0] } } : {}),
        }).sort({ date: 1 }).lean();

        const weeklyActivity = activityLogs.map(log => ({
            date: log.date,
            count: (log.problemsCompleted?.length || 0) + (log.attemptsCount || 0),
        }));

        return NextResponse.json({
            summary: {
                totalSolved,
                weeklyDelta,
                avgResolutionTime,
                firstTryAcceptRate,
                topBarrier,
            },
            proficiency,
            pitfalls,
            timePerDifficulty,
            recentStruggles,
            weeklyActivity,
        });
    } catch (error: any) {
        console.error('Analytics error:', error);
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
}
