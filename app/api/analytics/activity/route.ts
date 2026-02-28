import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import ActivityLog from '@/models/ActivityLog';
import { getValidatedSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/analytics/activity — Weekly completion delta for Browse ProgressCard
export async function GET() {
    try {
        const session = await getValidatedSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const now = new Date();
        const thisWeekStart = new Date(now);
        thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay());
        thisWeekStart.setHours(0, 0, 0, 0);

        const lastWeekStart = new Date(thisWeekStart.getTime() - 7 * 24 * 60 * 60 * 1000);

        const thisWeekStr = thisWeekStart.toISOString().split('T')[0];
        const lastWeekStr = lastWeekStart.toISOString().split('T')[0];

        // Get this week's activity
        const thisWeekLogs = await ActivityLog.find({
            userId: session.userId,
            date: { $gte: thisWeekStr },
        }).lean();

        // Get last week's activity
        const lastWeekLogs = await ActivityLog.find({
            userId: session.userId,
            date: { $gte: lastWeekStr, $lt: thisWeekStr },
        }).lean();

        const thisWeekCount = thisWeekLogs.reduce(
            (sum, log) => sum + (log.problemsCompleted?.length || 0), 0
        );
        const lastWeekCount = lastWeekLogs.reduce(
            (sum, log) => sum + (log.problemsCompleted?.length || 0), 0
        );

        return NextResponse.json({
            weeklyDelta: thisWeekCount - lastWeekCount,
            thisWeekCount,
            lastWeekCount,
        });
    } catch (error: any) {
        console.error('Activity analytics error:', error);
        return NextResponse.json({ error: 'Failed to fetch activity' }, { status: 500 });
    }
}
