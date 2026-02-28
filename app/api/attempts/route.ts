import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Attempt from '@/models/Attempt';
import User from '@/models/User';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/attempts - Get attempts for a problem or all user attempts
export async function GET(req: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const problemId = searchParams.get('problemId');
        const limit = parseInt(searchParams.get('limit') || '50');

        await connectDB();

        let query: Record<string, any> = { userId: session.userId };
        if (problemId) {
            query.problemId = problemId;
        }

        const attempts = await Attempt.find(query)
            .sort({ timestamp: -1 })
            .limit(limit)
            .lean();

        return NextResponse.json({ attempts });
    } catch (error: any) {
        console.error('Get attempts error:', error);
        return NextResponse.json({ error: 'Failed to fetch attempts' }, { status: 500 });
    }
}

// POST /api/attempts - Create a new attempt
export async function POST(req: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { 
            problemId, content, notes, status,
            code, language, timeComplexity, spaceComplexity, 
            feltDifficulty, duration, submissionCount,
            failureReason, failureNote
        } = body;

        if (!problemId || !content) {
            return NextResponse.json({ error: 'Problem ID and content are required' }, { status: 400 });
        }

        await connectDB();

        const attempt = await Attempt.create({
            problemId,
            userId: session.userId,
            content,
            notes,
            status: status || 'attempting',
            code,
            language,
            timeComplexity,
            spaceComplexity,
            feltDifficulty,
            duration,
            submissionCount,
            failureReason,
            failureNote
        });

        return NextResponse.json({
            success: true,
            attempt: {
                _id: attempt._id.toString(),
                problemId: attempt.problemId,
                content: attempt.content,
                status: attempt.status,
                notes: attempt.notes,
                code: attempt.code,
                language: attempt.language,
                timeComplexity: attempt.timeComplexity,
                spaceComplexity: attempt.spaceComplexity,
                feltDifficulty: attempt.feltDifficulty,
                duration: attempt.duration,
                submissionCount: attempt.submissionCount,
                failureReason: attempt.failureReason,
                failureNote: attempt.failureNote,
                timestamp: attempt.timestamp,
                resolvedAt: attempt.resolvedAt,
            }
        }, { status: 201 });
    } catch (error: any) {
        console.error('Create attempt error:', error);
        return NextResponse.json({ error: 'Failed to create attempt' }, { status: 500 });
    }
}

// PUT /api/attempts - Update an attempt (resolve or update content)
export async function PUT(req: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { 
            attemptId, content, notes, status,
            code, language, timeComplexity, spaceComplexity, 
            feltDifficulty, duration, submissionCount,
            failureReason, failureNote
        } = body;

        if (!attemptId) {
            return NextResponse.json({ error: 'Attempt ID is required' }, { status: 400 });
        }

        await connectDB();

        const attempt = await Attempt.findOne({
            _id: attemptId,
            userId: session.userId
        });

        if (!attempt) {
            return NextResponse.json({ error: 'Attempt not found' }, { status: 404 });
        }

        if (content !== undefined) attempt.content = content;
        if (notes !== undefined) attempt.notes = notes;
        if (code !== undefined) attempt.code = code;
        if (language !== undefined) attempt.language = language;
        if (timeComplexity !== undefined) attempt.timeComplexity = timeComplexity;
        if (spaceComplexity !== undefined) attempt.spaceComplexity = spaceComplexity;
        if (feltDifficulty !== undefined) attempt.feltDifficulty = feltDifficulty;
        if (duration !== undefined) attempt.duration = duration;
        if (submissionCount !== undefined) attempt.submissionCount = submissionCount;
        if (failureReason !== undefined) attempt.failureReason = failureReason;
        if (failureNote !== undefined) attempt.failureNote = failureNote;
        
        if (status && ['attempting', 'resolved', 'solved_with_help', 'gave_up'].includes(status)) {
            attempt.status = status;
            if ((status === 'resolved' || status === 'solved_with_help') && !attempt.resolvedAt) {
                attempt.resolvedAt = new Date();
            }
        }

        await attempt.save();

        // If resolved, add to user's completedProblems
        if (status === 'resolved' || status === 'solved_with_help') {
            await User.findByIdAndUpdate(session.userId, {
                $addToSet: { completedProblems: attempt.problemId }
            });
        }

        return NextResponse.json({
            success: true,
            attempt: {
                _id: attempt._id.toString(),
                problemId: attempt.problemId,
                content: attempt.content,
                status: attempt.status,
                notes: attempt.notes,
                code: attempt.code,
                language: attempt.language,
                timeComplexity: attempt.timeComplexity,
                spaceComplexity: attempt.spaceComplexity,
                feltDifficulty: attempt.feltDifficulty,
                duration: attempt.duration,
                submissionCount: attempt.submissionCount,
                failureReason: attempt.failureReason,
                failureNote: attempt.failureNote,
                timestamp: attempt.timestamp,
                resolvedAt: attempt.resolvedAt,
            }
        });
    } catch (error: any) {
        console.error('Update attempt error:', error);
        return NextResponse.json({ error: 'Failed to update attempt' }, { status: 500 });
    }
}

// DELETE /api/attempts - Delete an attempt
export async function DELETE(req: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const attemptId = searchParams.get('attemptId');

        if (!attemptId) {
            return NextResponse.json({ error: 'Attempt ID is required' }, { status: 400 });
        }

        await connectDB();

        const attempt = await Attempt.findOneAndDelete({
            _id: attemptId,
            userId: session.userId
        });

        if (!attempt) {
            return NextResponse.json({ error: 'Attempt not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Attempt deleted' });
    } catch (error: any) {
        console.error('Delete attempt error:', error);
        return NextResponse.json({ error: 'Failed to delete attempt' }, { status: 500 });
    }
}
