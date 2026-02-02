import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'xandar-lab-secret-key-change-in-production'
);

const INVITE_CODE = process.env.INVITE_CODE || '7447';
const SESSION_DURATION_DAYS = 7;

export interface TokenPayload {
    userId: string;
    username: string;
    sessionId: string;  // Unique session identifier
    exp?: number;
}

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
}

export function verifyInviteCode(code: string): boolean {
    return code === INVITE_CODE;
}

// Generate a unique session ID
export function generateSessionId(): string {
    return uuidv4();
}

// Calculate session expiry date
export function getSessionExpiry(): Date {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + SESSION_DURATION_DAYS);
    return expiry;
}

export async function signToken(payload: { userId: string; username: string; sessionId: string }): Promise<string> {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime(`${SESSION_DURATION_DAYS}d`)
        .setIssuedAt()
        .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);

        // Validate the payload has the required fields
        if (
            typeof payload.userId === 'string' &&
            typeof payload.username === 'string'
        ) {
            return {
                userId: payload.userId,
                username: payload.username,
                // SessionId may not exist for older tokens - provide a fallback
                sessionId: typeof payload.sessionId === 'string' ? payload.sessionId : 'legacy',
                exp: payload.exp,
            };
        }
        return null;
    } catch (error) {
        return null;
    }
}

export async function getSession(): Promise<TokenPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) return null;

    return verifyToken(token);
}

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

export async function clearAuthCookie(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete('auth_token');
}

// Parse user agent to get a readable device name
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
