import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    console.log('=== Login Request Started ===');
    console.log('Environment check - MONGODB_URI exists:', !!process.env.MONGODB_URI);
    
    const body = await req.json();
    console.log('Request body:', body);
    
    const { username, inviteCode } = body;

    if (inviteCode !== '7447') {
      console.log('Invalid invite code provided');
      return NextResponse.json({ error: 'Invalid invite code' }, { status: 401 });
    }

    if (!username) {
      console.log('Username missing');
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    console.log('Attempting to connect to MongoDB...');
    await connectDB();
    console.log('MongoDB connected successfully');

    // Find or create user
    console.log('Looking for user:', username);
    let user = await User.findOne({ username });
    
    if (!user) {
      console.log('User not found, creating new user');
      user = await User.create({ username });
      console.log('User created:', user);
    } else {
      console.log('Existing user found:', user);
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error("=== Login error ===");
    console.error("Error type:", error.constructor.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    return NextResponse.json({ error: error.message || 'Authentication failed' }, { status: 500 });
  }
}
