import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { getValidatedSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/auth/profile - Get current user's profile
export async function GET() {
    try {
        const session = await getValidatedSession();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const user = await User.findById(session.userId).select('-password');

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            user: {
                _id: user._id,
                username: user.username,
                email: user.email || '',
                bio: user.bio || '',
                avatarGradient: user.avatarGradient || '',
                savedProblems: user.savedProblems || [],
                completedProblems: user.completedProblems || [],
                createdAt: user.createdAt,
                lastLoginAt: user.lastLoginAt,
                hasPassword: !!user.password,
            }
        });
    } catch (error: any) {
        console.error("Profile fetch error:", error);
        return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }
}

// PUT /api/auth/profile - Update user profile
export async function PUT(req: Request) {
    try {
        const session = await getValidatedSession();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { email, bio, avatarGradient } = body;

        await connectDB();

        const user = await User.findById(session.userId);

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Validate email format if provided
        if (email && email.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
            }
            user.email = email.trim().toLowerCase();
        } else {
            user.email = undefined;
        }

        // Validate bio length
        if (bio !== undefined) {
            if (bio.length > 200) {
                return NextResponse.json({ error: 'Bio must be 200 characters or less' }, { status: 400 });
            }
            user.bio = bio;
        }

        // Update avatar gradient
        if (avatarGradient !== undefined) {
            user.avatarGradient = avatarGradient;
        }

        await user.save();

        return NextResponse.json({
            success: true,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email || '',
                bio: user.bio || '',
                avatarGradient: user.avatarGradient || '',
                savedProblems: user.savedProblems || [],
                completedProblems: user.completedProblems || [],
                createdAt: user.createdAt,
                lastLoginAt: user.lastLoginAt,
                hasPassword: !!user.password,
            }
        });
    } catch (error: any) {
        console.error("Profile update error:", error);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}
