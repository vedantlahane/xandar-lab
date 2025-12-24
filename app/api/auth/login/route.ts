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
    const user = await User.findOneAndUpdate(
      { username },
      { $setOnInsert: { username } },
      { upsert: true, new: true }
    );

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
