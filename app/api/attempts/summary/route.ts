import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Attempt from '@/models/Attempt';
import { getValidatedSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/attempts/summary — Per-problem summary for current user
export async function GET() {
    try {
        const session = await getValidatedSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const attempts = await Attempt.find({ userId: session.userId })
            .sort({ timestamp: -1 })
            .lean();

        // Group by problemId
        const grouped = new Map<string, typeof attempts>();
        for (const a of attempts) {
            const pid = a.problemId;
            if (!grouped.has(pid)) grouped.set(pid, []);
            grouped.get(pid)!.push(a);
        }

        const now = Date.now();
        const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

        const summaries = Array.from(grouped.entries()).map(([problemId, pAttempts]) => {
            const latest = pAttempts[0]; // already sorted desc
            const totalSubs = pAttempts.length;

            // Format duration
            let solveTime = '';
            if (latest.duration) {
                const mins = Math.floor(latest.duration / 60);
                if (mins >= 60) {
                    solveTime = `${Math.floor(mins / 60)}h ${mins % 60}m`;
                } else {
                    solveTime = `${mins}m`;
                }
            }

            // Relative time for lastAttempted
            const diffMs = now - new Date(latest.timestamp).getTime();
            const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
            let lastAttempted = '';
            if (diffDays === 0) lastAttempted = 'today';
            else if (diffDays === 1) lastAttempted = 'yesterday';
            else if (diffDays < 7) lastAttempted = `${diffDays}d ago`;
            else if (diffDays < 30) lastAttempted = `${Math.floor(diffDays / 7)}w ago`;
            else lastAttempted = `${Math.floor(diffDays / 30)}mo ago`;

            const stuck = latest.status === 'gave_up';
            const isResolved = latest.status === 'resolved' || latest.status === 'solved_with_help';
            const reviewDue = isResolved && diffMs > SEVEN_DAYS;

            return {
                problemId,
                solveTime,
                subs: totalSubs,
                lastAttempted,
                stuck,
                reviewDue,
            };
        });

        return NextResponse.json({ summaries });
    } catch (error: any) {
        console.error('Get attempt summaries error:', error);
        return NextResponse.json({ error: 'Failed to fetch summaries' }, { status: 500 });
    }
}
