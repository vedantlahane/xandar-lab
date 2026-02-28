import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import InterviewSession from '@/models/InterviewSession';
import { getValidatedSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const mockResponses: Record<string, string[]> = {
    message: [
        "Good thinking. Can you formalize that into an algorithm?",
        "That's on the right track. What's the time complexity of that approach?",
        "Interesting. Have you considered edge cases like empty input or single elements?",
        "Right. Now, can you think of a way to optimize the space usage?",
        "I see what you're going for. Can you walk me through a specific example?",
        "That makes sense. How would you handle the worst case scenario?",
    ],
    hint: [
        "Think about what data structure would let you efficiently track the minimum value.",
        "Consider sorting the input first — what property would that give you?",
        "A heap or priority queue might be useful here. Why?",
        "What if you used a hash map to store values you've already seen?",
        "Try thinking about this problem from the end instead of the beginning.",
    ],
    clarify: [
        "The input is guaranteed to be non-empty. Each interval is [start, end] where start < end. There are no duplicate intervals.",
        "You can assume all values fit in a 32-bit integer. The output should be a single number.",
        "Yes, negative numbers are possible. The array length is between 1 and 10^5.",
    ],
    "phase-change": [
        "Great, let's move on. Walk me through your approach step by step.",
        "Alright, go ahead and start coding. Talk through your implementation as you write.",
        "Nice work. Let's review — walk me through your code line by line.",
        "Good, let's analyze the complexity of your solution. What's the time and space?",
    ],
};

// POST /api/interviews/[sessionId]/message — Send message, get AI response
export async function POST(
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
        const { text, type = 'message' } = body;

        await connectDB();

        const interviewSession = await InterviewSession.findOne({
            _id: sessionId,
            userId: session.userId,
        });

        if (!interviewSession) {
            return NextResponse.json({ error: 'Session not found' }, { status: 404 });
        }

        if (interviewSession.status !== 'active') {
            return NextResponse.json({ error: 'Session is no longer active' }, { status: 400 });
        }

        const now = new Date();

        // Add user message
        const userMessage = {
            sender: 'user' as const,
            text: text || (type === 'hint' ? '[Requested a hint]' : type === 'clarify' ? 'Can you clarify the problem?' : ''),
            timestamp: now,
        };
        interviewSession.messages.push(userMessage);

        // Generate mock AI response
        const responsePool = mockResponses[type] || mockResponses.message;
        const aiText = responsePool[Math.floor(Math.random() * responsePool.length)];
        const aiMessage = {
            sender: 'ai' as const,
            text: type === 'hint' ? `Hint: ${aiText}` : aiText,
            timestamp: new Date(now.getTime() + 1000),
        };
        interviewSession.messages.push(aiMessage);

        // Track hints
        if (type === 'hint') {
            interviewSession.hintsUsed = (interviewSession.hintsUsed || 0) + 1;
        }

        await interviewSession.save();

        return NextResponse.json({
            userMessage,
            aiMessage,
            hintsUsed: interviewSession.hintsUsed,
        });
    } catch (error: any) {
        console.error('Interview message error:', error);
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
}
