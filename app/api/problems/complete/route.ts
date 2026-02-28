import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import ActivityLog from '@/models/ActivityLog';

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

    // Toggle completed status
    const completedProblems = user.completedProblems || [];
    const index = completedProblems.indexOf(problemId);
    
    if (index > -1) {
      completedProblems.splice(index, 1);
    } else {
      completedProblems.push(problemId);

      // Log to ActivityLog when completing
      const today = new Date().toISOString().split('T')[0];
      await ActivityLog.findOneAndUpdate(
        { userId: user._id, date: today },
        {
          $addToSet: { problemsCompleted: problemId },
        },
        { upsert: true }
      );
    }

    user.completedProblems = completedProblems;
    await user.save();

    return NextResponse.json({ completed: index === -1, completedProblems });
  } catch (error: any) {
    console.error("Complete problem error:", error);
    return NextResponse.json({ error: error.message || 'Failed to complete problem' }, { status: 500 });
  }
}
