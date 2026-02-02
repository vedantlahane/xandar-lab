import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import JobNote from '@/models/JobNote';
import { getSession } from '@/lib/auth';

// Get notes for a job
export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const jobId = searchParams.get('jobId');

        if (!jobId) {
            return NextResponse.json(
                { error: 'jobId is required' },
                { status: 400 }
            );
        }

        // Get username from session
        const session = await getSession();

        if (!session) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        const { username } = session;

        const notes = await JobNote.find({ jobId, username })
            .sort({ timestamp: -1 });

        return NextResponse.json({ notes });
    } catch (error) {
        console.error('Get notes error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch notes' },
            { status: 500 }
        );
    }
}

// Create a new note
export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const { jobId, content } = await request.json();

        if (!jobId || !content) {
            return NextResponse.json(
                { error: 'jobId and content are required' },
                { status: 400 }
            );
        }

        // Get username from session
        const session = await getSession();

        if (!session) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        const { username } = session;

        const note = await JobNote.create({
            jobId,
            username,
            content,
            timestamp: new Date(),
        });

        return NextResponse.json({ note });
    } catch (error) {
        console.error('Create note error:', error);
        return NextResponse.json(
            { error: 'Failed to create note' },
            { status: 500 }
        );
    }
}

// Delete a note
export async function DELETE(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const noteId = searchParams.get('noteId');

        if (!noteId) {
            return NextResponse.json(
                { error: 'noteId is required' },
                { status: 400 }
            );
        }

        // Get username from session
        const session = await getSession();

        if (!session) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        const { username } = session;

        const note = await JobNote.findOneAndDelete({ _id: noteId, username });

        if (!note) {
            return NextResponse.json(
                { error: 'Note not found or unauthorized' },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: 'Note deleted' });
    } catch (error) {
        console.error('Delete note error:', error);
        return NextResponse.json(
            { error: 'Failed to delete note' },
            { status: 500 }
        );
    }
}
