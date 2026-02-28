import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'xandar-lab-secret-key-change-in-production'
);

// Protected routes that require authentication
const protectedRoutes = [
    '/lab/practice',
    '/lab/notes',
    '/lab/docs',
    '/lab/experiments',
    '/lab/hackathons',
    '/lab/profile',
];

// Protected API routes
const protectedApiRoutes = [
    '/api/problems',
];

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
    const isProtectedApi = protectedApiRoutes.some(route => pathname.startsWith(route));

    if (!isProtectedRoute && !isProtectedApi) {
        return NextResponse.next();
    }

    // Get the token from cookies
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
        if (isProtectedApi) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        // Redirect to lab home with login modal open
        return NextResponse.redirect(new URL('/lab?mode=login', request.url));
    }

    try {
        await jwtVerify(token, JWT_SECRET);
        return NextResponse.next();
    } catch {
        // Token is invalid or expired
        const response = NextResponse.redirect(new URL('/lab?mode=login', request.url));
        response.cookies.delete('auth_token');
        return response;
    }
}

export const config = {
    matcher: [
        '/lab/practice/:path*',
        '/lab/notes/:path*',
        '/lab/docs/:path*',
        '/lab/experiments/:path*',
        '/lab/hackathons/:path*',
        '/lab/profile/:path*',
        '/api/problems/:path*',
    ],
};
