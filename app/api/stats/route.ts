import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Attempt from '@/models/Attempt';
import User from '@/models/User';
import { getValidatedSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/stats - Get user statistics
export async function GET(req: Request) {
    try {
        const session = await getValidatedSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        // Get user data
        const user = await User.findById(session.userId).lean() as any;
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Get attempt statistics
        const totalAttempts = await Attempt.countDocuments({ userId: session.userId });
        const resolvedAttempts = await Attempt.countDocuments({
            userId: session.userId,
            status: 'resolved'
        });
        const attemptingCount = await Attempt.countDocuments({
            userId: session.userId,
            status: 'attempting'
        });

        // Get unique problems attempted
        const uniqueProblemsAttempted = await Attempt.distinct('problemId', {
            userId: session.userId
        });

        // Get recent activity (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentAttempts = await Attempt.find({
            userId: session.userId,
            timestamp: { $gte: sevenDaysAgo }
        }).sort({ timestamp: -1 }).lean();

        // Calculate daily activity for the last 7 days
        const dailyActivity: { date: string; count: number }[] = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            const dayStart = new Date(date);
            dayStart.setHours(0, 0, 0, 0);
            const dayEnd = new Date(date);
            dayEnd.setHours(23, 59, 59, 999);

            const count = recentAttempts.filter(a => {
                const attemptDate = new Date(a.timestamp);
                return attemptDate >= dayStart && attemptDate <= dayEnd;
            }).length;

            dailyActivity.push({ date: dateStr, count });
        }

        // Get attempts per topic (using problemId prefix patterns)
        const attemptsByTopic = await Attempt.aggregate([
            { $match: { userId: user._id } },
            {
                $group: {
                    _id: { $arrayElemAt: [{ $split: ["$problemId", "-"] }, 0] },
                    count: { $sum: 1 },
                    resolved: {
                        $sum: { $cond: [{ $eq: ["$status", "resolved"] }, 1, 0] }
                    }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        // Calculate streak (consecutive days with attempts)
        let currentStreak = 0;
        let maxStreak = 0;
        let tempStreak = 0;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < 30; i++) {
            const checkDate = new Date(today);
            checkDate.setDate(checkDate.getDate() - i);
            const nextDate = new Date(checkDate);
            nextDate.setDate(nextDate.getDate() + 1);

            const hasActivity = await Attempt.exists({
                userId: session.userId,
                timestamp: { $gte: checkDate, $lt: nextDate }
            });

            if (hasActivity) {
                tempStreak++;
                if (i === 0 || currentStreak > 0) {
                    currentStreak = tempStreak;
                }
                maxStreak = Math.max(maxStreak, tempStreak);
            } else {
                if (i === 0) {
                    currentStreak = 0;
                }
                tempStreak = 0;
            }
        }

        const stats = {
            overview: {
                totalAttempts,
                resolvedAttempts,
                attemptingCount,
                uniqueProblemsAttempted: uniqueProblemsAttempted.length,
                savedProblems: user.savedProblems?.length || 0,
                completedProblems: user.completedProblems?.length || 0,
                currentStreak,
                maxStreak,
            },
            dailyActivity,
            attemptsByTopic: attemptsByTopic.map(t => ({
                topic: t._id || 'unknown',
                total: t.count,
                resolved: t.resolved,
            })),
            recentActivity: recentAttempts.slice(0, 5).map(a => ({
                _id: (a as any)._id.toString(),
                problemId: a.problemId,
                status: a.status,
                timestamp: a.timestamp,
            })),
            memberSince: user.createdAt,
            lastActive: user.lastLoginAt || user.createdAt,
        };

        return NextResponse.json({ stats });
    } catch (error: any) {
        console.error('Get stats error:', error);
        return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 });
    }
}
