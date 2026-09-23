import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import connectDB from '@/lib/db';
import Note from '@/models/Note';

export async function GET(request: Request) {
    try {
        await connectDB();
        const session = await getSession();
        
        if (!session?.userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const q = searchParams.get('q');

        if (!q) {
            return NextResponse.json({ notes: [] });
        }

        // Text search across user's notes and public notes
        const notes = await Note.find(
            {
                $text: { $search: q },
                $or: [
                    { authorId: session.userId },
                    { visibility: 'public' },
                    { visibility: 'shared', 'sharedWith.userId': session.userId }
                ],
                isDeleted: { $ne: true }
            },
            { score: { $meta: 'textScore' } }
        )
        .sort({ score: { $meta: 'textScore' } })
        .limit(20)
        .select('title content icon tags updatedAt authorId visibility');

        return NextResponse.json({ notes });
    } catch (error: any) {
        console.error('Search notes error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
