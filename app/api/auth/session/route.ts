import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ user: null }, { status: 200 });
        }

        await connectDB();

        const user = await User.findById(session.userId).select('-password');

        if (!user) {
            return NextResponse.json({ user: null }, { status: 200 });
        }

        return NextResponse.json({ user });
    } catch (error: any) {
        console.error("Session error:", error);
        return NextResponse.json({ error: 'Failed to fetch session' }, { status: 500 });
    }
}
