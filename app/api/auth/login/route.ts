import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    const { username, inviteCode } = await req.json();

    if (inviteCode !== '7447') {
      return NextResponse.json({ error: 'Invalid invite code' }, { status: 401 });
    }

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    await connectDB();

    // Find or create user
    let user = await User.findOne({ username });
    
    if (!user) {
        user = await User.create({ username });
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json({ error: error.message || 'Authentication failed' }, { status: 500 });
  }
}
