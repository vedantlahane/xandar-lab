import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { getValidatedSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // getValidatedSession checks both JWT validity AND that the session
        // still exists in the DB (not revoked by the user from another device).
        const session = await getValidatedSession();

        if (!session) {
            return NextResponse.json({ user: null }, { status: 200 });
        }

        await connectDB();

        // Exclude password AND sessions array (contains IPs / device info)
        const user = await User.findById(session.userId).select('-password -sessions');

        if (!user) {
            return NextResponse.json({ user: null }, { status: 200 });
        }

        return NextResponse.json({ user });
    } catch (error: any) {
        console.error("Session error:", error);
        return NextResponse.json({ error: 'Failed to fetch session' }, { status: 500 });
    }
}
