import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { getSession, clearAuthCookie } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET - List all active sessions
export async function GET() {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        await connectDB();

        const user = await User.findById(session.userId);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Filter out expired sessions and format for response
        const now = new Date();
        const activeSessions = (user.sessions || [])
            .filter((s: any) => new Date(s.expiresAt) > now)
            .map((s: any) => ({
                id: s.tokenId,
                device: s.userAgent || 'Unknown Device',
                ip: s.ip || 'Unknown',
                createdAt: s.createdAt,
                lastActiveAt: s.lastActiveAt,
                isCurrent: s.tokenId === session.sessionId,
            }))
            .sort((a: any, b: any) =>
                new Date(b.lastActiveAt).getTime() - new Date(a.lastActiveAt).getTime()
            );

        return NextResponse.json({ sessions: activeSessions });
    } catch (error: any) {
        console.error('Sessions fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
    }
}

// DELETE - Revoke a specific session or all sessions
export async function DELETE(request: Request) {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const sessionId = searchParams.get('sessionId');
        const revokeAll = searchParams.get('revokeAll') === 'true';

        await connectDB();

        const user = await User.findById(session.userId);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (revokeAll) {
            // Revoke all sessions except the current one
            user.sessions = user.sessions.filter(
                (s: any) => s.tokenId === session.sessionId
            );
            await user.save();

            return NextResponse.json({
                message: 'All other sessions have been revoked',
                revokedCount: user.sessions.length,
            });
        }

        if (sessionId) {
            // Revoke a specific session
            const sessionToRevoke = user.sessions.find((s: any) => s.tokenId === sessionId);

            if (!sessionToRevoke) {
                return NextResponse.json({ error: 'Session not found' }, { status: 404 });
            }

            // If revoking the current session, clear the cookie
            const isCurrentSession = sessionId === session.sessionId;

            user.sessions = user.sessions.filter((s: any) => s.tokenId !== sessionId);
            await user.save();

            if (isCurrentSession) {
                await clearAuthCookie();
                return NextResponse.json({
                    message: 'Current session revoked. You have been logged out.',
                    loggedOut: true,
                });
            }

            return NextResponse.json({
                message: 'Session revoked successfully',
            });
        }

        return NextResponse.json({ error: 'No session ID provided' }, { status: 400 });
    } catch (error: any) {
        console.error('Session revoke error:', error);
        return NextResponse.json({ error: 'Failed to revoke session' }, { status: 500 });
    }
}
