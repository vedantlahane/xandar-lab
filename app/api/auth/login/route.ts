import { NextResponse, NextRequest } from 'next/server';
import { headers } from 'next/headers';
import connectDB from '@/lib/db';
import User from '@/models/User';
import {
  signToken,
  setAuthCookie,
  verifyInviteCode,
  hashPassword,
  verifyPassword,
  generateSessionId,
  getSessionExpiry,
  parseUserAgent,
} from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, inviteCode, password, isSignUp } = body;

    // Validate invite code
    if (!verifyInviteCode(inviteCode)) {
      return NextResponse.json({ error: 'Invalid invite code' }, { status: 401 });
    }

    if (!username || username.length < 3) {
      return NextResponse.json({ error: 'Username must be at least 3 characters' }, { status: 400 });
    }

    await connectDB();

    // Get request metadata for session tracking
    const headersList = await headers();
    const userAgent = headersList.get('user-agent');
    const forwardedFor = headersList.get('x-forwarded-for');
    const ip = forwardedFor?.split(',')[0]?.trim() || 'unknown';

    let user;

    if (isSignUp) {
      // Sign up flow
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return NextResponse.json({ error: 'Username already taken' }, { status: 409 });
      }

      // Hash password if provided
      const hashedPassword = password ? await hashPassword(password) : undefined;

      user = await User.create({
        username,
        password: hashedPassword,
        lastLoginAt: new Date(),
        sessions: [], // Initialize empty sessions array
      });
    } else {
      // Login flow
      user = await User.findOne({ username });

      if (!user) {
        return NextResponse.json({ error: 'User not found. Please sign up first.' }, { status: 404 });
      }

      // Verify password if user has one set
      if (user.password && password) {
        const isValidPassword = await verifyPassword(password, user.password);
        if (!isValidPassword) {
          return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
        }
      }

      // Update last login
      user.lastLoginAt = new Date();
    }

    // Create a new session
    const sessionId = generateSessionId();
    const sessionExpiry = getSessionExpiry();

    const newSession = {
      tokenId: sessionId,
      userAgent: parseUserAgent(userAgent),
      ip,
      createdAt: new Date(),
      lastActiveAt: new Date(),
      expiresAt: sessionExpiry,
    };

    // Add session to user (limit to 10 active sessions)
    if (!user.sessions) {
      user.sessions = [];
    }

    // Remove oldest sessions if over limit
    const MAX_SESSIONS = 10;
    while (user.sessions.length >= MAX_SESSIONS) {
      // Find the oldest session by lastActiveAt
      let oldestIndex = 0;
      let oldestTime = new Date(user.sessions[0].lastActiveAt).getTime();
      for (let i = 1; i < user.sessions.length; i++) {
        const sessionTime = new Date(user.sessions[i].lastActiveAt).getTime();
        if (sessionTime < oldestTime) {
          oldestTime = sessionTime;
          oldestIndex = i;
        }
      }
      // Remove oldest session in-place
      user.sessions.splice(oldestIndex, 1);
    }

    user.sessions.push(newSession);
    await user.save();

    // Generate JWT token with session ID
    const token = await signToken({
      userId: user._id.toString(),
      username: user.username,
      sessionId,
    });

    // Set HTTP-only cookie
    await setAuthCookie(token);

    // Return user data (without password and sessions)
    const userObj = user.toObject();
    const { password: _, sessions: __, ...userWithoutSensitive } = userObj;

    return NextResponse.json({
      user: {
        ...userWithoutSensitive,
        hasPassword: !!user.password,
      },
      token, // Also return token for client-side storage fallback
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json({ error: error.message || 'Authentication failed' }, { status: 500 });
  }
}
