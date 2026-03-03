import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Post from '@/models/Post';
import { getValidatedSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        const session = await getValidatedSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { content, sharedItemType, sharedItemId } = body;

        if (!content && !sharedItemId) {
            return NextResponse.json({ error: 'Post must have content or a shared item' }, { status: 400 });
        }

        await connectDB();

        const post = await Post.create({
            authorId: session.userId,
            content,
            sharedItemType,
            sharedItemId,
        });

        // Populate author info for the immediate response
        await post.populate('authorId', 'username avatarGradient');

        return NextResponse.json(post, { status: 201 });
    } catch (error) {
        console.error('Error creating post:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
