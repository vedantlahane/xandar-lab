import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { getSession, hashPassword, verifyPassword } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// PUT /api/auth/password - Change user password
export async function PUT(req: Request) {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { currentPassword, newPassword } = body;

        if (!newPassword || newPassword.length < 6) {
            return NextResponse.json({ error: 'New password must be at least 6 characters' }, { status: 400 });
        }

        await connectDB();

        const user = await User.findById(session.userId);

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // If user has an existing password, verify the current one
        if (user.password) {
            if (!currentPassword) {
                return NextResponse.json({ error: 'Current password is required' }, { status: 400 });
            }

            const isValidPassword = await verifyPassword(currentPassword, user.password);
            if (!isValidPassword) {
                return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });
            }
        }

        // Hash and save the new password
        user.password = await hashPassword(newPassword);
        await user.save();

        return NextResponse.json({
            success: true,
            message: user.password ? 'Password updated successfully' : 'Password set successfully'
        });
    } catch (error: any) {
        console.error("Password change error:", error);
        return NextResponse.json({ error: 'Failed to change password' }, { status: 500 });
    }
}
