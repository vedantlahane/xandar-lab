import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import connectDB from '@/lib/db';
import Comment from '@/models/Comment';
import Note from '@/models/Note';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;
        const comments = await Comment.find({ noteId: id }).sort({ createdAt: 1 }).lean();
        return NextResponse.json({ comments });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
    }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const session = await getSession();
        if (!session?.userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const { content } = await request.json();

        if (!content?.trim()) {
            return NextResponse.json({ error: 'Comment cannot be empty' }, { status: 400 });
        }

        const note = await Note.findById(id);
        if (!note) {
            return NextResponse.json({ error: 'Note not found' }, { status: 404 });
        }

        const comment = await Comment.create({
            noteId: id,
            authorId: session.userId,
            authorUsername: session.username || 'User',
            content: content.trim(),
        });

        return NextResponse.json({ comment });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to post comment' }, { status: 500 });
    }
}
