import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Explanation from '@/models/Explanation';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const problemId = searchParams.get('problemId');
        if (!problemId) {
            return NextResponse.json({ error: 'Problem ID required' }, { status: 400 });
        }

        await connectDB();
        const explanation = await Explanation.findOne({ userId: session.userId, problemId });
        return NextResponse.json({ explanation });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch explanation' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { problemId, content, requestFeedback } = body;

        await connectDB();

        let feedback = undefined;
        if (requestFeedback) {
            // Mock AI feedback for now
            feedback = {
                clarity: Math.floor(Math.random() * 3) + 7, // 7-10
                completeness: Math.floor(Math.random() * 4) + 6, // 6-10
                conciseness: Math.floor(Math.random() * 2) + 8, // 8-10
                good: "Clear explanation of the main concept.",
                missing: "You could mention time and space complexity tradeoffs."
            };
        }

        const explanation = await Explanation.findOneAndUpdate(
            { problemId, userId: session.userId },
            { 
                content, 
                ...(feedback ? { feedback } : {}),
                updatedAt: new Date()
            },
            { new: true, upsert: true }
        );

        return NextResponse.json({ explanation });
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
