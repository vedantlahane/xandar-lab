import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const { username, jobId } = await request.json();

        if (!username || !jobId) {
            return NextResponse.json(
                { error: 'Username and jobId are required' },
                { status: 400 }
            );
        }

        const user = await User.findOne({ username });
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Initialize savedJobs if it doesn't exist
        if (!user.savedJobs) {
            user.savedJobs = [];
        }

        // Toggle save status
        const index = user.savedJobs.indexOf(jobId);
        if (index > -1) {
            user.savedJobs.splice(index, 1);
        } else {
            user.savedJobs.push(jobId);
        }

        await user.save();

        return NextResponse.json({
            savedJobs: user.savedJobs,
            message: index > -1 ? 'Job removed from saved' : 'Job saved'
        });
    } catch (error) {
        console.error('Save job error:', error);
        return NextResponse.json(
            { error: 'Failed to save job' },
            { status: 500 }
        );
    }
}
