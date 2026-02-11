import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import ClippedJob from '@/models/ClippedJob';

// ============================================================================
// CORS helpers
// ============================================================================
// The Clipper extension runs on a chrome-extension:// origin, so we need
// permissive CORS headers for both the preflight OPTIONS request and the
// actual POST request.
// ============================================================================

const CORS_HEADERS: Record<string, string> = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400', // Cache preflight for 24 hours
};

/**
 * OPTIONS /api/ingest/parse
 * Respond to CORS preflight requests from the extension.
 */
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: CORS_HEADERS,
    });
}

/**
 * POST /api/ingest/parse
 *
 * Receives rich page context from the Clipper extension and persists it
 * as a ClippedJob document in MongoDB.
 *
 * Expected body shape (matches IngestRequest from the extension):
 *   {
 *     context: { pageTitle, metaTags, jsonLd, mainHtml, plainText },
 *     sourceUrl: string,
 *     action: "capture" | "apply",
 *     timestamp: string
 *   }
 *
 * The raw context is stored as-is. A future Gemini integration will parse
 * it into structured job fields (company, role, salary, location, etc.).
 *
 * Returns IngestResponse:
 *   { success: boolean, message: string, jobId?: string }
 */
export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const { context, sourceUrl, action, timestamp } = body;

        // ── Validate required fields ────────────────────────────────────
        if (!context || !sourceUrl) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields: context and sourceUrl are required.' },
                { status: 400, headers: CORS_HEADERS }
            );
        }

        // Ensure context has at least some content
        if (!context.plainText && !context.mainHtml && !context.pageTitle) {
            return NextResponse.json(
                { success: false, message: 'Page context is empty – nothing to save.' },
                { status: 400, headers: CORS_HEADERS }
            );
        }

        // ── Validate action enum ────────────────────────────────────────
        const validActions = ['capture', 'apply'];
        const resolvedAction = validActions.includes(action) ? action : 'capture';

        // ── Persist the clipped job with full context ───────────────────
        const clippedJob = await ClippedJob.create({
            context: {
                pageTitle: context.pageTitle || '',
                metaTags: context.metaTags || {},
                jsonLd: context.jsonLd || [],
                mainHtml: context.mainHtml || '',
                plainText: context.plainText || '',
            },
            sourceUrl,
            action: resolvedAction,
            capturedAt: timestamp ? new Date(timestamp) : new Date(),
        });

        // Log a readable title for server-side debugging
        const displayTitle =
            context.metaTags?.['og:title'] ||
            context.pageTitle ||
            sourceUrl;

        console.log(
            `[Ingest] Saved clipped job: ${clippedJob._id} (${resolvedAction}) – "${displayTitle}"`
        );

        return NextResponse.json(
            {
                success: true,
                message: resolvedAction === 'apply'
                    ? 'Application tracked successfully!'
                    : 'Job captured and saved to dashboard!',
                jobId: clippedJob._id.toString(),
            },
            { status: 201, headers: CORS_HEADERS }
        );
    } catch (error) {
        console.error('[Ingest] Parse error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error while processing ingestion.' },
            { status: 500, headers: CORS_HEADERS }
        );
    }
}
