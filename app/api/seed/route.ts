import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Problem from '@/models/Problem';
import { SHEET } from '@/app/lab/practice/data/sheet';

export async function POST() {
  try {
    await connectDB();
    
    let count = 0;
    for (const topic of SHEET) {
      for (const problem of topic.problems) {
        await Problem.findOneAndUpdate(
          { id: problem.id },
          { 
            ...problem,
            topicName: topic.topicName 
          },
          { upsert: true, new: true }
        );
        count++;
      }
    }

    return NextResponse.json({ message: `Seeded ${count} problems successfully` });
  } catch (error) {
    console.error("Seeding error:", error);
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
  }
}
