import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const { username, jobId, status } = await request.json();

        if (!username || !jobId || !status) {
            return NextResponse.json(
                { error: 'Username, jobId, and status are required' },
                { status: 400 }
            );
        }

        const validStatuses = [
            'bookmarked', 'applied', 'phone-screen',
            'technical-interview', 'onsite', 'offer',
            'rejected', 'withdrawn'
        ];

        if (!validStatuses.includes(status)) {
            return NextResponse.json(
                { error: 'Invalid status' },
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

        // Initialize jobApplications if it doesn't exist
        if (!user.jobApplications) {
            user.jobApplications = {};
        }

        // Update the job status
        user.jobApplications.set(jobId, status);
        user.markModified('jobApplications');
        await user.save();

        // Convert Map to object for response
        const jobApplicationsObj: Record<string, string> = {};
        user.jobApplications.forEach((value: string, key: string) => {
            jobApplicationsObj[key] = value;
        });

        return NextResponse.json({
            jobApplications: jobApplicationsObj,
            message: 'Status updated'
        });
    } catch (error) {
        console.error('Update status error:', error);
        return NextResponse.json(
            { error: 'Failed to update status' },
            { status: 500 }
        );
    }
}
