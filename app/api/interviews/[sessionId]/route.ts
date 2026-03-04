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

        // ── Generate semi-deterministic report from session data ───────────
        const messageCount = interviewSession.messages?.length ?? 0;
        const hintsUsed = interviewSession.hintsUsed ?? 0;
        const hintBudget = interviewSession.config?.hintBudget ?? 3;
        const phasesReached = (phases ?? interviewSession.phases ?? []).length;
        const totalPhases = 4; // Understanding, Approach, Code, Review

        // Base score: scale from message engagement + phase progress
        const engagementBonus = Math.min(2, messageCount / 5);        // 0-2 from conversation depth
        const phaseBonus = (phasesReached / totalPhases) * 3;         // 0-3 from phase completion
        const hintPenalty = (hintsUsed / Math.max(1, hintBudget)) * 1.5; // 0-1.5 penalty
        const baseScore = Math.min(10, Math.max(3, 4 + engagementBonus + phaseBonus - hintPenalty));
        const overallScore = Math.round(baseScore * 10) / 10;

        // Individual metrics vary around overall score
        const vary = (base: number, min = 3, max = 10) =>
            Math.max(min, Math.min(max, Math.round(base + (Math.random() - 0.5) * 2)));

        const report = {
            overallScore,
            metrics: [
                { name: 'Problem Understanding', score: vary(baseScore + (phasesReached >= 1 ? 1 : -1)) },
                { name: 'Approach Quality', score: vary(baseScore) },
                { name: 'Code Quality', score: vary(baseScore + (phasesReached >= 3 ? 1 : -1)) },
                { name: 'Communication', score: vary(baseScore + engagementBonus * 0.5) },
                { name: 'Time Management', score: vary(baseScore - (hintsUsed > 2 ? 1 : 0)) },
            ],
            strengths: phasesReached >= 3
                ? ['Good problem decomposition', 'Progressed through all phases', 'Engaged in thorough discussion']
                : ['Attempted the problem', 'Showed initial understanding'],
            improvements: [
                ...(hintsUsed > 1 ? ['Try to rely less on hints — develop independent problem-solving'] : []),
                ...(phasesReached < 3 ? ['Work on progressing through all interview phases'] : []),
                ...(messageCount < 6 ? ['Communicate your thought process more — talk through your approach'] : []),
                'Practice time complexity analysis during explanations',
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

