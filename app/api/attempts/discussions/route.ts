import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Discussion } from '@/models/Attempt';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/attempts/discussions - Get discussions for an attempt
export async function GET(req: Request) {
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

        const discussions = await Discussion.find({ attemptId })
            .sort({ timestamp: 1 })
            .lean();

        return NextResponse.json({ discussions });
    } catch (error: any) {
        console.error('Get discussions error:', error);
        return NextResponse.json({ error: 'Failed to fetch discussions' }, { status: 500 });
    }
}

// POST /api/attempts/discussions - Add a discussion comment
export async function POST(req: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { attemptId, content } = body;

        if (!attemptId || !content) {
            return NextResponse.json({ error: 'Attempt ID and content are required' }, { status: 400 });
        }

        if (content.length > 1000) {
            return NextResponse.json({ error: 'Comment too long (max 1000 chars)' }, { status: 400 });
        }

        await connectDB();

        const discussion = await Discussion.create({
            attemptId,
            userId: session.userId,
            username: session.username,
            content,
        });

        return NextResponse.json({
            success: true,
            discussion: {
                _id: discussion._id.toString(),
                attemptId: discussion.attemptId,
                userId: discussion.userId,
                username: discussion.username,
                content: discussion.content,
                timestamp: discussion.timestamp,
            }
        }, { status: 201 });
    } catch (error: any) {
        console.error('Create discussion error:', error);
        return NextResponse.json({ error: 'Failed to create discussion' }, { status: 500 });
    }
}

// DELETE /api/attempts/discussions - Delete a discussion comment (only owner)
export async function DELETE(req: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const discussionId = searchParams.get('discussionId');

        if (!discussionId) {
            return NextResponse.json({ error: 'Discussion ID is required' }, { status: 400 });
        }

        await connectDB();

        const discussion = await Discussion.findOneAndDelete({
            _id: discussionId,
            userId: session.userId
        });

        if (!discussion) {
            return NextResponse.json({ error: 'Discussion not found or not authorized' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Discussion deleted' });
    } catch (error: any) {
        console.error('Delete discussion error:', error);
        return NextResponse.json({ error: 'Failed to delete discussion' }, { status: 500 });
    }
}
