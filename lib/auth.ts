import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { auth } from '@/auth';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'xandar-lab-secret-key-change-in-production'
);

const INVITE_CODE = process.env.INVITE_CODE || '7447';
const SESSION_DURATION_DAYS = 7;

export interface TokenPayload {
    userId: string;
    username: string;
    sessionId: string;
    role?: string;
    exp?: number;
}


/**
 * Hashes a password using bcrypt with a salt round of 12.
 * @param password - The plain text password to hash.
 * @returns A promise that resolves to the hashed password.
 */
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
}

/**
 * Verifies a plain text password against a hashed password using bcrypt.
 * @param password - The plain text password to verify.
 * @param hashedPassword - The hashed password to compare against.
 * @returns A promise that resolves to true if the password matches, false otherwise.
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
}

/**
 * Verifies if the provided invite code matches the expected invite code.
 * @param code - The invite code to verify.
 * @returns True if the invite code is valid, false otherwise.
 */
export function verifyInviteCode(code: string): boolean {
    return code === INVITE_CODE;
}

/**
 * Generates a unique session ID using UUID v4.
 * @returns A string representing the generated session ID.
 */
export function generateSessionId(): string {
    return uuidv4();
}


/**
 * Calculates the session expiry date based on the defined session duration.
 * @returns A Date object representing the session expiry date.
 */
export function getSessionExpiry(): Date {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + SESSION_DURATION_DAYS);
    return expiry;
}

/**
 * Signs a JWT token with the provided payload.
 * @param payload - The payload to include in the token.
 * @returns A promise that resolves to the signed token.
 */
export async function signToken(payload: { userId: string; username: string; sessionId: string }): Promise<string> {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime(`${SESSION_DURATION_DAYS}d`)
        .setIssuedAt()
        .sign(JWT_SECRET);
}

/**
 * Verifies a JWT token.
 * @param token - The token to verify.
 * @returns A promise that resolves to the verified token payload, or null if the token is invalid.
 */
export async function verifyToken(token: string): Promise<TokenPayload | null> {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);

        // Validate the payload has the required fields
        if (
            typeof payload.userId === 'string' &&
            typeof payload.username === 'string' &&
            typeof payload.sessionId === 'string'
        ) {
            return {
                userId: payload.userId,
                username: payload.username,
                sessionId: payload.sessionId,
                exp: payload.exp,
            };
        }
        return null;
    } catch (error) {
        return null;
    }
}

/**
 * Gets the current user's session.
 * @returns A promise that resolves to the session data, or null if no session is found.
 */
export async function getSession(): Promise<TokenPayload | null> {
    const session = await auth();
    if (!session?.user) return null;

    return {
        userId: session.user.id as string,
        username: (session.user as any).username || '',
        sessionId: 'nextauth-session',
        role: session.user.role,
    } as any;
}
    
/**
 * Validates the current user's session.
 * @returns A promise that resolves to the validated session data, or null if the session is invalid.
 */
export async function getValidatedSession(): Promise<TokenPayload | null> {
    const session = await getSession();
    if (!session) return null;

    try {
        await connectDB();
        const user = await User.findById(session.userId).lean();
        if (!user) return null;

        return session;
    } catch {
        return null;
    }
}

/**
 * Sets the authentication cookie in the user's browser.
 * @param token - The JWT token to store in the cookie.
 * @returns A promise that resolves when the cookie has been set.
 */
export async function setAuthCookie(token: string): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * SESSION_DURATION_DAYS,
        path: '/',
    });
}

/**
 * Clears the authentication cookie from the user's browser.
 * This function is typically called during logout to remove the session token.
 * @returns A promise that resolves when the cookie has been deleted.
 */
export async function clearAuthCookie(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete('auth_token');
}


/**
 * Parses the user agent string to determine the device type.
 * @param userAgent The user agent string to parse.
 * @returns A string representing the device type.
 */
export function parseUserAgent(userAgent: string | null): string {
    if (!userAgent) return 'Unknown Device';

    // Check for mobile devices
    if (/iPhone/.test(userAgent)) return 'iPhone';
    if (/iPad/.test(userAgent)) return 'iPad';
    if (/Android/.test(userAgent)) {
        if (/Mobile/.test(userAgent)) return 'Android Phone';
        return 'Android Tablet';
    }

    // Check for desktop browsers
    if (/Windows/.test(userAgent)) {
        if (/Edge/.test(userAgent)) return 'Windows (Edge)';
        if (/Chrome/.test(userAgent)) return 'Windows (Chrome)';
        if (/Firefox/.test(userAgent)) return 'Windows (Firefox)';
        return 'Windows';
    }
    if (/Mac/.test(userAgent)) {
        if (/Chrome/.test(userAgent)) return 'Mac (Chrome)';
        if (/Safari/.test(userAgent)) return 'Mac (Safari)';
        if (/Firefox/.test(userAgent)) return 'Mac (Firefox)';
        return 'Mac';
    }
    if (/Linux/.test(userAgent)) {
        if (/Chrome/.test(userAgent)) return 'Linux (Chrome)';
        if (/Firefox/.test(userAgent)) return 'Linux (Firefox)';
        return 'Linux';
    }

    return 'Web Browser';
}
