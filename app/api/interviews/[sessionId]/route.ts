import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import InterviewSession from '@/models/InterviewSession';
import { getValidatedSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/interviews/[sessionId] — Get full session
export async function GET(
    req: Request,
    { params }: { params: Promise<{ sessionId: string }> }
) {
    try {
        const session = await getValidatedSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { sessionId } = await params;
        await connectDB();

        const interviewSession = await InterviewSession.findOne({
            _id: sessionId,
            userId: session.userId,
        }).lean();

        if (!interviewSession) {
            return NextResponse.json({ error: 'Session not found' }, { status: 404 });
        }

        return NextResponse.json({ session: interviewSession });
    } catch (error: any) {
        console.error('Get interview session error:', error);
        return NextResponse.json({ error: 'Failed to fetch session' }, { status: 500 });
    }
}

// PUT /api/interviews/[sessionId] — End session, generate report
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ sessionId: string }> }
) {
    try {
        const session = await getValidatedSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { sessionId } = await params;
        const body = await req.json();
        const { duration, phases } = body;

        await connectDB();

        const interviewSession = await InterviewSession.findOne({
            _id: sessionId,
            userId: session.userId,
        });

        if (!interviewSession) {
            return NextResponse.json({ error: 'Session not found' }, { status: 404 });
        }

        // Generate mock report
        const report = {
            overallScore: Math.floor(Math.random() * 3) + 6, // 6-8
            metrics: [
                { name: 'Problem Understanding', score: Math.floor(Math.random() * 3) + 7 },
                { name: 'Approach & Algorithm', score: Math.floor(Math.random() * 4) + 5 },
                { name: 'Code Quality', score: Math.floor(Math.random() * 3) + 6 },
                { name: 'Communication', score: Math.floor(Math.random() * 3) + 7 },
                { name: 'Time Management', score: Math.floor(Math.random() * 4) + 5 },
            ],
            strengths: [
                'Clear communication of thought process',
                'Good problem decomposition',
                'Considered edge cases early',
            ],
            improvements: [
                'Could optimize initial brute force faster',
                'Practice writing cleaner code under pressure',
                'Work on time complexity analysis during explanation',
            ],
            suggestedProblemIds: ['arr-5', 'dp-3', 'graph-5'],
        };

        interviewSession.status = 'completed';
        interviewSession.duration = duration;
        if (phases) interviewSession.phases = phases;
        interviewSession.report = report;
        interviewSession.endedAt = new Date();

        await interviewSession.save();

        return NextResponse.json({ session: interviewSession });
    } catch (error: any) {
        console.error('End interview error:', error);
        return NextResponse.json({ error: 'Failed to end session' }, { status: 500 });
    }
}
