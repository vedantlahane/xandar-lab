import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import InterviewSession, { INTERVIEW_STYLES, type InterviewStyle } from '@/models/InterviewSession';
import { getValidatedSession } from '@/lib/auth';
import { calculateNextDifficulty, difficultyLabel } from '@/lib/adaptiveDifficulty';

export const dynamic = 'force-dynamic';

// GET /api/interviews — List past sessions for current user
export async function GET() {
    try {
        const session = await getValidatedSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const sessions = await InterviewSession.find({ userId: session.userId })
            .sort({ startedAt: -1 })
            .lean();

        return NextResponse.json({ sessions });
    } catch (error: any) {
        console.error('Get interviews error:', error);
        return NextResponse.json({ error: 'Failed to fetch interviews' }, { status: 500 });
    }
}

// POST /api/interviews — Start a new session
export async function POST(req: Request) {
    try {
        const session = await getValidatedSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { config, problemId } = body;

        const style = (config?.style || 'realistic') as InterviewStyle;
        if (!INTERVIEW_STYLES[style]) {
            return NextResponse.json({ error: 'Invalid style. Use: guided, realistic, or pressure' }, { status: 400 });
        }

        await connectDB();

        // ── Resolve difficulty ─────────────────────────────────────────────
        let difficulty: number;
        if (config?.difficulty === 'auto' || config?.difficulty === undefined) {
            // Adaptive: calculate from past sessions
            const pastSessions = await InterviewSession.find({
                userId: session.userId,
                status: 'completed',
            }).sort({ startedAt: -1 }).limit(5).lean();
            difficulty = calculateNextDifficulty(pastSessions as any[]);
        } else {
            difficulty = Math.max(1, Math.min(5, Number(config.difficulty) || 2));
        }

        const styleConfig = INTERVIEW_STYLES[style];
        const hintBudget = styleConfig.hintBudget;
        const diffLabel = difficultyLabel(difficulty);
        const topicNote = config?.topic && config.topic !== 'Any topic'
            ? ` focusing on ${config.topic}`
            : '';

        // ── Generate style-appropriate opener ──────────────────────────────
        const openers: Record<InterviewStyle, string> = {
            guided: `Welcome! This is a guided interview session — I'm here to help you learn, not just evaluate. We'll work through a ${diffLabel}-level problem${topicNote} together.\n\nI'll give you plenty of hints along the way (you have ${hintBudget} hint tokens). Take your time, think out loud, and don't worry about getting it perfect.\n\nReady? Let's start with the problem. First, can you tell me how you'd approach the given problem?`,
            realistic: `Good, let's begin. This will be a ${diffLabel}-level technical interview${topicNote}. I'll behave like you'd expect in a real interview — friendly but I won't volunteer information.\n\nYou have ${hintBudget} hints available if you get stuck. Walk me through your thinking as you go.\n\nHere's your problem. Before jumping to code — tell me how you understand the problem and what approach comes to mind.`,
            pressure: `Let's go. ${diffLabel} difficulty${topicNote}. You have limited time and only ${hintBudget} hint. I'll challenge your assumptions and push for optimal solutions.\n\nDon't waste time on pleasantries. Start by stating your approach clearly and concisely.\n\nWhat's your initial reaction to this problem?`,
        };

        const initialMessage = openers[style];

        const interviewSession = await InterviewSession.create({
            userId: session.userId,
            config: {
                style,
                difficulty,
                hintBudget,
                topic: config?.topic,
                source: config?.source,
            },
            problemId,
            messages: [{
                sender: 'ai',
                text: initialMessage,
                timestamp: new Date(),
            }],
            phases: ['Understanding'],
            status: 'active',
        });

        return NextResponse.json({ session: interviewSession }, { status: 201 });
    } catch (error: any) {
        console.error('Create interview error:', error);
        return NextResponse.json({ error: 'Failed to create interview' }, { status: 500 });
    }
}

