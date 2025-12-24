import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { username, problemId } = await req.json();

    if (!username || !problemId) {
      return NextResponse.json({ error: 'Username and problemId are required' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ username });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Toggle saved status
    const savedProblems = user.savedProblems || [];
    const index = savedProblems.indexOf(problemId);
    
    if (index > -1) {
      savedProblems.splice(index, 1);
    } else {
      savedProblems.push(problemId);
    }

    user.savedProblems = savedProblems;
    await user.save();

    return NextResponse.json({ saved: index === -1, savedProblems });
  } catch (error: any) {
    console.error("Save problem error:", error);
    return NextResponse.json({ error: error.message || 'Failed to save problem' }, { status: 500 });
  }
}
