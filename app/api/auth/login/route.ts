import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { signToken, setAuthCookie, verifyInviteCode, hashPassword, verifyPassword } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
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
      await user.save();
    }

    // Generate JWT token
    const token = await signToken({
      userId: user._id.toString(),
      username: user.username,
    });

    // Set HTTP-only cookie
    await setAuthCookie(token);

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user.toObject();

    return NextResponse.json({
      user: userWithoutPassword,
      token, // Also return token for client-side storage fallback
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json({ error: error.message || 'Authentication failed' }, { status: 500 });
  }
}
