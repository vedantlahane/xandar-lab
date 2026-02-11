// ============================================================================
// Clipper Extension – background.ts (Service Worker)
// ============================================================================
// The background service worker is the central message bus for the extension.
//
// Architecture:
//   Content Script (content.ts) ──message──▶ Background (this file) ──fetch──▶ Next.js API
//
// Why a service worker?
//   - Content scripts on job boards detect "Apply" / "Submit" button clicks.
//   - They can't reliably POST to localhost:3000 due to CORS in content script
//     context, so they send a chrome.runtime message here.
//   - The background worker has host_permissions and can freely fetch any
//     allowed origin, including http://localhost:3000/*.
//   - The service worker is event-driven (Manifest V3). It wakes up on
//     incoming messages and goes back to sleep when idle.
// ============================================================================

import type {
    BackgroundResponse,
    CaptureHistoryEntry,
    ContentMessage,
    IngestRequest,
    IngestResponse
} from "./types"

/** Next.js API endpoint */
const API_ENDPOINT = "http://localhost:3000/api/ingest/parse"

// ── Listener: chrome.runtime.onMessage ─────────────────────────────────────
// This fires when a content script calls chrome.runtime.sendMessage().
// We validate the message shape, forward the data to the API, and respond.
chrome.runtime.onMessage.addListener(
    (
        message: ContentMessage,
        _sender: chrome.runtime.MessageSender,
        sendResponse: (response: BackgroundResponse) => void
    ): boolean => {
        // Only handle messages we understand
        if (message.type !== "APPLICATION_CLICK_DETECTED") {
            sendResponse({ success: false, message: "Unknown message type" })
            return false
        }

        // We must return `true` to indicate we'll call sendResponse asynchronously
        handleApplicationClick(message)
            .then((response) => sendResponse(response))
            .catch((err: Error) =>
                sendResponse({ success: false, message: err.message })
            )

        return true // keep the message channel open for async response
    }
)

// ── Handler: Forward application click data to the Next.js API ─────────────
async function handleApplicationClick(
    message: ContentMessage
): Promise<BackgroundResponse> {
    const { url, title, buttonText, timestamp } = message.payload

    console.log(
        `[Clipper BG] Application click detected: "${buttonText}" on ${url}`
    )

    // Build the request payload for the Next.js API.
    // action: "apply" tells the backend this is an auto-tracked application,
    // not a manual capture from the popup.
    const requestBody: IngestRequest = {
        content: `Application submitted via "${buttonText}" button click`,
        sourceUrl: url,
        title: title,
        action: "apply",
        timestamp: timestamp
    }

    try {
        const response = await fetch(API_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        })

        if (!response.ok) {
            throw new Error(`API responded with status ${response.status}`)
        }

        const data: IngestResponse = await response.json()

        // Persist to capture history
        await saveToHistory({
            id: data.jobId || crypto.randomUUID(),
            url,
            title,
            action: "apply",
            status: data.success ? "success" : "error",
            timestamp
        })

        return {
            success: data.success,
            message: data.message || "Application status updated"
        }
    } catch (err: unknown) {
        const errorMessage =
            err instanceof Error ? err.message : "Unknown background error"
        console.error(`[Clipper BG] Error: ${errorMessage}`)

        // Still save to history as a failed attempt
        await saveToHistory({
            id: crypto.randomUUID(),
            url,
            title,
            action: "apply",
            status: "error",
            timestamp
        })

        return { success: false, message: errorMessage }
    }
}

// ── Helper: Save entry to chrome.storage.local history ─────────────────────
async function saveToHistory(entry: CaptureHistoryEntry): Promise<void> {
    const result = await chrome.storage.local.get("captureHistory")
    const existing = (result.captureHistory as CaptureHistoryEntry[]) || []
    const updated = [entry, ...existing].slice(0, 50)
    await chrome.storage.local.set({ captureHistory: updated })
}

// ── Lifecycle: Log when the service worker activates ───────────────────────
// Manifest V3 service workers are ephemeral – they start and stop as needed.
// This log helps during development to confirm the worker is alive.
console.log("[Clipper BG] Service worker initialized")

export { }
