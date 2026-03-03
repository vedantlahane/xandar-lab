import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Post from '@/models/Post';
import User from '@/models/User';
import { getValidatedSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        const session = await getValidatedSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        // Simple feed: get latest 20 public posts
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .limit(20)
            .populate({
                path: 'authorId',
                select: 'username avatarGradient reputationScore'
            })
            // If sharing an item, we'd normally populate it here based on sharedItemType
            .lean();

        return NextResponse.json(posts);
    } catch (error) {
        console.error('Error fetching feed:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
