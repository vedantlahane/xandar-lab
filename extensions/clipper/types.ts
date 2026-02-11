// ============================================================================
// Clipper Extension – Shared Type Definitions
// ============================================================================
// These types define the contract between the extension and the Next.js API
// at http://localhost:3000/api/ingest/parse. Every message, request body, and
// response follows these strict interfaces.
// ============================================================================

/** Status of the current capture / ingestion operation */
export type CaptureStatus = "idle" | "loading" | "success" | "error"

/** Payload sent FROM the content script → background service worker */
export interface ContentMessage {
    type: "APPLICATION_CLICK_DETECTED"
    payload: {
        /** URL of the page where the click was detected */
        url: string
        /** Title of the page (document.title) */
        title: string
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
 * The API at /api/ingest/parse receives raw page content and
 * meta-information about the source. It then uses server-side
 * logic (potentially Gemini / LLM) to extract structured job data.
 */
export interface IngestRequest {
    /** Raw text content of the page (body.innerText) */
    content: string
    /** URL from which the content was scraped */
    sourceUrl: string
    /** Page title */
    title: string
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
