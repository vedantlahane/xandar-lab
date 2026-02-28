import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import InterviewSession from '@/models/InterviewSession';
import { getValidatedSession } from '@/lib/auth';

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

        if (!config?.style || !config?.difficulty) {
            return NextResponse.json({ error: 'Config with style and difficulty is required' }, { status: 400 });
        }

        await connectDB();

        // Generate initial AI message based on config
        const openerMessages: Record<string, string> = {
            Google: `Welcome. Let's simulate a Google-style interview at ${config.difficulty} level${config.topic ? ` focusing on ${config.topic}` : ''}. I'll present you with a problem and we'll work through it together. Ready?\n\nHere's your problem: You're given an array of meeting intervals [start, end]. Find the minimum number of conference rooms required.\n\nBefore jumping to code — can you think about what determines whether two meetings conflict?`,
            Meta: `Hey! Let's do a Meta-style coding interview — ${config.difficulty} difficulty${config.topic ? `, topic: ${config.topic}` : ''}. I'll walk you through a problem step by step.\n\nHere's what we're working with: Given an array of integers, return all unique triplets that sum to zero.\n\nFirst question — what's your initial reaction? How might you approach this?`,
            Amazon: `Let's start your Amazon-style interview. Difficulty: ${config.difficulty}${config.topic ? `, focus on ${config.topic}` : ''}.\n\nHere's the problem: Design a data structure that supports insert, delete, and getRandom, all in O(1) time.\n\nWalk me through your thought process — what data structure properties do we need?`,
            General: `Good, let's begin. This will be a ${config.difficulty}-level technical interview${config.topic ? ` on ${config.topic}` : ''}.\n\nHere's your problem: Given a binary tree, find the maximum path sum. A path can start and end at any node.\n\nStart by telling me — how do you understand this problem?`,
        };

        const initialMessage = openerMessages[config.style] || openerMessages.General;

        const interviewSession = await InterviewSession.create({
            userId: session.userId,
            config,
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
