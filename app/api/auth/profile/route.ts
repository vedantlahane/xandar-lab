import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Note from '@/models/Note';
import Experiment from '@/models/Experiment';
import Idea from '@/models/Idea';
import Document from '@/models/Document';
import { getValidatedSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/auth/profile - Get current user's profile with contribution stats
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

        const DEFAULT_ADMIN_USERNAMES = ['vedant', 'vedantlahane', 'val', 'admin'];
        const DEFAULT_ADMIN_EMAILS = [
            'vedantanillahane@gmail.com',
            'vedantlahane38591@gmail.com',
        ];
        const isDefaultAdmin = (user.username && DEFAULT_ADMIN_USERNAMES.includes(user.username.toLowerCase().trim())) ||
                               (user.email && DEFAULT_ADMIN_EMAILS.includes(user.email.toLowerCase().trim()));

        if (isDefaultAdmin && user.role !== 'admin') {
            user.role = 'admin';
            await user.save();
        }

        // Fetch contribution counts in parallel
        const [notesCount, experimentsCount, ideasCount, docsCount] = await Promise.all([
            Note.countDocuments({ authorId: user._id }),
            Experiment.countDocuments({ authorId: user._id }),
            Idea.countDocuments({ authorId: user._id }),
            Document.countDocuments({ authorId: user._id }),
        ]);

        const userObj = user.toObject();
        const { password: _, sessions: __, ...userWithoutSensitive } = userObj;

        return NextResponse.json({
            user: {
                ...userWithoutSensitive,
                hasPassword: !!user.password,
                contributions: {
                    notes: notesCount,
                    experiments: experimentsCount,
                    ideas: ideasCount,
                    docs: docsCount,
                },
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
        const {
            email,
            bio,
            avatarGradient,
            githubUrl,
            websiteUrl,
            twitterHandle,
            isProfilePublic,
            sharingPreferences,
        } = body;

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

        // Update developer social links
        if (githubUrl !== undefined) {
            user.githubUrl = githubUrl.trim();
        }

        if (websiteUrl !== undefined) {
            user.websiteUrl = websiteUrl.trim();
        }

        if (twitterHandle !== undefined) {
            user.twitterHandle = twitterHandle.trim().replace(/^@/, '');
        }

        // Update privacy & community preferences
        if (isProfilePublic !== undefined) {
            user.isProfilePublic = Boolean(isProfilePublic);
        }

        if (sharingPreferences !== undefined) {
            user.sharingPreferences = {
                autoShareCompletedProblems: Boolean(sharingPreferences.autoShareCompletedProblems),
                autoShareHackathonResults: Boolean(sharingPreferences.autoShareHackathonResults),
            };
        }

        await user.save();

        // Fetch refreshed contribution counts
        const [notesCount, experimentsCount, ideasCount, docsCount] = await Promise.all([
            Note.countDocuments({ authorId: user._id }),
            Experiment.countDocuments({ authorId: user._id }),
            Idea.countDocuments({ authorId: user._id }),
            Document.countDocuments({ authorId: user._id }),
        ]);

        const updatedUserObj = user.toObject();
        const { password: _, sessions: __, ...updatedUserWithoutSensitive } = updatedUserObj;

        return NextResponse.json({
            success: true,
            user: {
                ...updatedUserWithoutSensitive,
                hasPassword: !!user.password,
                contributions: {
                    notes: notesCount,
                    experiments: experimentsCount,
                    ideas: ideasCount,
                    docs: docsCount,
                },
            }
        });
    } catch (error: any) {
        console.error("Profile update error:", error);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}
