import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Attempt from '@/models/Attempt';
import ActivityLog from '@/models/ActivityLog';
import { getValidatedSession } from '@/lib/auth';
import { SHEET } from '@/app/lab/practice/data/sheet';

export const dynamic = 'force-dynamic';

// GET /api/suggestions — Personalized daily focus suggestions
export async function GET() {
    try {
        const session = await getValidatedSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const allProblems = SHEET.flatMap(t =>
            t.problems.map(p => ({ ...p, topic: t.topicName }))
        );

        const attempts = await Attempt.find({ userId: session.userId })
            .sort({ timestamp: -1 })
            .lean();

        // Group by problemId, get latest attempt per problem
        const latestAttempt = new Map<string, any>();
        for (const a of attempts) {
            if (!latestAttempt.has(a.problemId)) {
                latestAttempt.set(a.problemId, a);
            }
        }

        const suggestions: Array<{
            type: 'review' | 'retry' | 'new';
            problemId: string;
            title: string;
            meta: string;
            reason: string;
        }> = [];

        // 1. Review suggestions — resolved problems, sorted by stalest first
        const resolvedProblems = Array.from(latestAttempt.entries())
            .filter(([, a]) => a.status === 'resolved' || a.status === 'solved_with_help')
            .sort((a, b) => new Date(a[1].timestamp).getTime() - new Date(b[1].timestamp).getTime());

        for (const [problemId, attempt] of resolvedProblems) {
            if (suggestions.length >= 2) break;
            const prob = allProblems.find(p => p.id === problemId);
            if (!prob) continue;
            const daysAgo = Math.floor(
                (Date.now() - new Date(attempt.timestamp).getTime()) / (24 * 60 * 60 * 1000)
            );
            const difficulty = prob.tags?.find((t: string) => ['Easy', 'Medium', 'Hard'].includes(t)) || '';
            suggestions.push({
                type: 'review',
                problemId,
                title: prob.title,
                meta: `${difficulty} · ${prob.topic}`,
                reason: `${daysAgo}d stale`,
            });
        }

        // 2. Retry suggestions — problems where latest attempt is gave_up
        const gaveUpProblems = Array.from(latestAttempt.entries())
            .filter(([, a]) => a.status === 'gave_up')
            .sort((a, b) => new Date(b[1].timestamp).getTime() - new Date(a[1].timestamp).getTime());

        for (const [problemId, attempt] of gaveUpProblems) {
            if (suggestions.length >= 3) break;
            const prob = allProblems.find(p => p.id === problemId);
            if (!prob) continue;
            const daysAgo = Math.floor(
                (Date.now() - new Date(attempt.timestamp).getTime()) / (24 * 60 * 60 * 1000)
            );
            const difficulty = prob.tags?.find((t: string) => ['Easy', 'Medium', 'Hard'].includes(t)) || '';
            suggestions.push({
                type: 'retry',
                problemId,
                title: prob.title,
                meta: `${difficulty} · ${prob.topic}`,
                reason: daysAgo === 0 ? 'failed today' : daysAgo === 1 ? 'failed yesterday' : `failed ${daysAgo}d ago`,
            });
        }

        // 3. Fill with new problems from weak topics
        if (suggestions.length < 3) {
            // Find topics with lowest completion
            const attemptedIds = new Set(latestAttempt.keys());
            const topicScores = SHEET.map(topic => {
                const resolved = topic.problems.filter(p => {
                    const a = latestAttempt.get(p.id);
                    return a && (a.status === 'resolved' || a.status === 'solved_with_help');
                }).length;
                return {
                    topic: topic.topicName,
                    problems: topic.problems,
                    completionRate: topic.problems.length > 0 ? resolved / topic.problems.length : 1,
                };
            }).sort((a, b) => a.completionRate - b.completionRate);

            for (const ts of topicScores) {
                if (suggestions.length >= 3) break;
                for (const p of ts.problems) {
                    if (suggestions.length >= 3) break;
                    if (attemptedIds.has(p.id)) continue;
                    if (suggestions.some(s => s.problemId === p.id)) continue;
                    const difficulty = p.tags?.find((t: string) => ['Easy', 'Medium', 'Hard'].includes(t)) || '';
                    suggestions.push({
                        type: 'new',
                        problemId: p.id,
                        title: p.title,
                        meta: `${difficulty} · ${ts.topic}`,
                        reason: 'new problem',
                    });
                }
            }
        }

        // Progress — how many of today's suggestions have been attempted today
        const today = new Date().toISOString().split('T')[0];
        const todayLog = await ActivityLog.findOne({
            userId: session.userId,
            date: today,
        }).lean();

        const todayAttempted = new Set(todayLog?.problemsAttempted || []);
        const done = suggestions.filter(s => todayAttempted.has(s.problemId)).length;

        return NextResponse.json({
            suggestions: suggestions.slice(0, 3),
            progress: { done, total: Math.min(suggestions.length, 3) },
        });
    } catch (error: any) {
        console.error('Suggestions error:', error);
        return NextResponse.json({ error: 'Failed to fetch suggestions' }, { status: 500 });
    }
}
