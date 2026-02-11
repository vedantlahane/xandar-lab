// ============================================================================
// Clipper Extension – Shared Type Definitions
// ============================================================================
// These types define the contract between the extension and the Next.js API
// at http://localhost:3000/api/ingest/parse. Every message, request body, and
// response follows these strict interfaces.
// ============================================================================

/** Status of the current capture / ingestion operation */
export type CaptureStatus = "idle" | "loading" | "success" | "error"

// ── Rich page context collected during scraping ────────────────────────────
// Instead of sending just body.innerText, we gather multiple signals from
// the page so Gemini (or any LLM) can reliably extract structured job data.

/** Key-value pairs from <meta> tags (og:title, description, etc.) */
export interface MetaTags {
    [key: string]: string
}

/** Complete context scraped from the page */
export interface PageContext {
    /** document.title — often unreliable on SPAs like LinkedIn */
    pageTitle: string
    /** Relevant <meta> tag values (og:title, og:description, description, etc.) */
    metaTags: MetaTags
    /** JSON-LD structured data blocks found on the page (e.g. JobPosting schema) */
    jsonLd: Record<string, unknown>[]
    /** Trimmed inner HTML of the main content area for DOM structure */
    mainHtml: string
    /** Full plaintext of the page (body.innerText) as fallback */
    plainText: string
}

/** Payload sent FROM the content script → background service worker */
export interface ContentMessage {
    type: "APPLICATION_CLICK_DETECTED"
    payload: {
        /** URL of the page where the click was detected */
        url: string
        /** Rich page context (replaces old flat title + content) */
        context: PageContext
        /** Text content of the element that was clicked */
        buttonText: string
        /** ISO timestamp of when the click happened */
        timestamp: string
    }
}

/** Response sent FROM the background service worker → content script */
export interface BackgroundResponse {
    success: boolean
    message: string
}

/**
 * Request body sent to the Next.js ingestion API.
 *
 * The API at /api/ingest/parse receives the full page context and
 * meta-information about the source. It stores it as-is; a future
 * Gemini integration will parse the context into structured job data.
 */
export interface IngestRequest {
    /** Rich context scraped from the page */
    context: PageContext
    /** URL from which the content was scraped */
    sourceUrl: string
    /** Operation context: "capture" for manual save, "apply" for auto-detected application */
    action: "capture" | "apply"
    /** ISO timestamp */
    timestamp: string
}

/** Shape of the API response from /api/ingest/parse */
export interface IngestResponse {
    success: boolean
    message: string
    jobId?: string
}

/** Stored history entry persisted via chrome.storage.local */
export interface CaptureHistoryEntry {
    id: string
    url: string
    title: string
    action: "capture" | "apply"
    status: "success" | "error"
    timestamp: string
}
