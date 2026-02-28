import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { getValidatedSession, clearAuthCookie, verifyPassword } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// DELETE /api/auth/account - Delete user account
export async function DELETE(req: Request) {
    try {
        const session = await getValidatedSession();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { password, confirmUsername } = body;

        await connectDB();

        const user = await User.findById(session.userId);

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Verify username confirmation
        if (confirmUsername !== user.username) {
            return NextResponse.json({ error: 'Username confirmation does not match' }, { status: 400 });
        }

        // If user has a password, verify it
        if (user.password) {
            if (!password) {
                return NextResponse.json({ error: 'Password is required to delete account' }, { status: 400 });
            }

            const isValidPassword = await verifyPassword(password, user.password);
            if (!isValidPassword) {
                return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
            }
        }

        // Delete the user account
        await User.findByIdAndDelete(session.userId);

        // Clear the auth cookie
        await clearAuthCookie();

        return NextResponse.json({
            success: true,
            message: 'Account deleted successfully'
        });
    } catch (error: any) {
        console.error("Account deletion error:", error);
        return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
    }
}
