import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import connectDB from '@/lib/db';
import Note from '@/models/Note';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const session = await getSession();
        
        if (!session?.userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        // Find notes that link to this note (mentioning its ID in content)
        const backlinks = await Note.find({
            content: { $regex: id },
            _id: { $ne: id },
            isDeleted: { $ne: true },
            $or: [
                { authorId: session.userId },
                { visibility: 'public' },
                { visibility: 'shared', 'sharedWith.userId': session.userId }
            ]
        })
        .select('_id id title icon category color')
        .sort({ updatedAt: -1 })
        .lean();

        return NextResponse.json({ backlinks: backlinks.map((n: any) => ({ ...n, id: n._id.toString() })) });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to fetch backlinks' }, { status: 500 });
    }
}
