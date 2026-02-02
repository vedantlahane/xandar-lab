import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { clearAuthCookie, getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST() {
    try {
        const session = await getSession();

        // If we have a valid session, remove it from the user's sessions
        if (session) {
            try {
                await connectDB();
                await User.updateOne(
                    { _id: session.userId },
                    { $pull: { sessions: { tokenId: session.sessionId } } }
                );
            } catch (dbError) {
                // Log but don't fail - we still want to clear the cookie
                console.error("Failed to remove session from database:", dbError);
            }
        }

        // Always clear the auth cookie
        await clearAuthCookie();

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Logout error:", error);
        // Still try to clear the cookie even if there's an error
        try {
            await clearAuthCookie();
        } catch { }
        return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
    }
}
