// ============================================================================
// Clipper Extension – content.ts (Automated Application Tracking)
// ============================================================================
// This content script is injected into LinkedIn and Himalayas pages.
//
// Plasmo uses the `config` export to define URL matching (replaces the
// "content_scripts" → "matches" field in the traditional manifest.json).
//
// What it does:
//   1. Listens for click events on the entire document.
//   2. When a click lands on a button/link whose text matches "Apply",
//      "Submit", "Submit Application", "Easy Apply", etc., it fires.
//   3. Collects rich page context (meta tags, JSON-LD, HTML, plain text).
//   4. Sends a message to the background service worker via
//      chrome.runtime.sendMessage() with the full context.
//   5. The background worker then POSTs to the Next.js API.
//
// Why content script → background → API?
//   Content scripts run in the page context and may face CORS restrictions
//   when calling localhost. The background service worker has full
//   host_permissions and can fetch without CORS issues.
// ============================================================================

import type { BackgroundResponse, ContentMessage, PageContext } from "./types"

// ── Plasmo Content Script Configuration ────────────────────────────────────
// This tells Plasmo which URLs to inject this script into.
// Equivalent to "matches" in a traditional manifest.json content_scripts block.
export const config = {
    matches: [
        "*://*.linkedin.com/*",
        "*://*.himalayas.app/*"
    ]
}

// ── Apply / Submit button text patterns ────────────────────────────────────
// We match against the inner text of clicked elements (case-insensitive).
const APPLY_PATTERNS: RegExp[] = [
    /\bapply\b/i,
    /\bsubmit\s*(application|your\s*application)?\b/i,
    /\beasy\s*apply\b/i,
    /\bquick\s*apply\b/i,
    /\bapply\s*now\b/i,
    /\bsend\s*application\b/i
]

/** Check if a string matches any of the "apply" patterns */
function isApplyButtonText(text: string): boolean {
    const trimmed = text.trim()
    // Ignore overly long text – real buttons are short
    if (trimmed.length > 50) return false
    return APPLY_PATTERNS.some((pattern) => pattern.test(trimmed))
}

/**
 * Walk up the DOM tree to find the closest interactive element.
 * Clicks might land on a <span> inside a <button>. We want the button.
 */
function findClosestInteractive(el: HTMLElement): HTMLElement | null {
    let current: HTMLElement | null = el
    const maxDepth = 5

    for (let i = 0; i < maxDepth && current; i++) {
        const tag = current.tagName.toLowerCase()
        if (
            tag === "button" ||
            tag === "a" ||
            current.getAttribute("role") === "button" ||
            current.getAttribute("type") === "submit"
        ) {
            return current
        }
        current = current.parentElement
    }

    return null
}

/**
 * Scrape rich context from the current page.
 * Collects meta tags, JSON-LD structured data, main HTML, and plain text.
 */
function scrapePageContext(): PageContext {
    // ── 1. Page title ────────────────────────────────────────────────────
    const pageTitle = document.title || ""

    // ── 2. Meta tags ─────────────────────────────────────────────────────
    const metaTags: Record<string, string> = {}
    const interestingMeta = [
        "og:title", "og:description", "og:site_name", "og:type", "og:url",
        "twitter:title", "twitter:description",
        "description", "keywords", "author"
    ]
    document.querySelectorAll("meta").forEach((el) => {
        const name =
            el.getAttribute("property") ||
            el.getAttribute("name") ||
            el.getAttribute("itemprop") ||
            ""
        const content = el.getAttribute("content") || ""
        if (name && content && interestingMeta.includes(name.toLowerCase())) {
            metaTags[name.toLowerCase()] = content
        }
    })

    // ── 3. JSON-LD structured data ───────────────────────────────────────
    const jsonLd: Record<string, unknown>[] = []
    document.querySelectorAll('script[type="application/ld+json"]').forEach((script) => {
        try {
            const parsed = JSON.parse(script.textContent || "")
            if (Array.isArray(parsed)) {
                jsonLd.push(...parsed)
            } else if (typeof parsed === "object" && parsed !== null) {
                jsonLd.push(parsed)
            }
        } catch {
            // Malformed JSON-LD – skip
        }
    })

    // ── 4. Main content HTML (trimmed) ───────────────────────────────────
    const mainEl =
        document.querySelector("main") ||
        document.querySelector('[role="main"]') ||
        document.querySelector("#main-content") ||
        document.querySelector(".jobs-description") ||
        document.querySelector(".job-view-layout") ||
        document.querySelector(".jobs-unified-top-card") ||
        document.querySelector("article") ||
        document.body

    let mainHtml = mainEl?.innerHTML || ""
    const MAX_HTML_LENGTH = 50_000
    if (mainHtml.length > MAX_HTML_LENGTH) {
        mainHtml = mainHtml.substring(0, MAX_HTML_LENGTH) + "\n<!-- TRUNCATED -->"
    }

    // ── 5. Plain text fallback ───────────────────────────────────────────
    const plainText = document.body.innerText || ""

    return { pageTitle, metaTags, jsonLd, mainHtml, plainText }
}

// ── Debounce flag ──────────────────────────────────────────────────────────
// Prevents firing multiple times for the same click (e.g. bubbling).
let lastSentTimestamp = 0
const DEBOUNCE_MS = 3000

// ── Main Click Listener ───────────────────────────────────────────────────
// We use event delegation on the document level. This captures clicks on
// dynamically rendered elements (React/Angular SPAs update the DOM frequently).
document.addEventListener(
    "click",
    (event: MouseEvent): void => {
        const target = event.target as HTMLElement | null
        if (!target) return

        // Find the nearest interactive ancestor
        const interactive = findClosestInteractive(target)
        if (!interactive) return

        // Check if the button text matches apply/submit patterns
        const text = interactive.innerText || interactive.textContent || ""
        if (!isApplyButtonText(text)) return

        // Debounce: don't re-send within 3 seconds
        const now = Date.now()
        if (now - lastSentTimestamp < DEBOUNCE_MS) return
        lastSentTimestamp = now

        console.log(`[Clipper CS] Application click detected: "${text.trim()}"`)

        // Collect rich context from the page
        const context = scrapePageContext()

        // Build the message for the background service worker
        const message: ContentMessage = {
            type: "APPLICATION_CLICK_DETECTED",
            payload: {
                url: window.location.href,
                context,
                buttonText: text.trim(),
                timestamp: new Date().toISOString()
            }
        }

        // Send to background worker. The worker will POST to the Next.js API.
        chrome.runtime.sendMessage(message, (response: BackgroundResponse) => {
            if (chrome.runtime.lastError) {
                console.warn(
                    "[Clipper CS] Failed to reach background:",
                    chrome.runtime.lastError.message
                )
                return
            }
            if (response?.success) {
                console.log("[Clipper CS] Application tracked successfully")
            } else {
                console.warn(
                    "[Clipper CS] Tracking failed:",
                    response?.message || "Unknown"
                )
            }
        })
    },
    true // Use capture phase to catch events before the page's own handlers
)

console.log("[Clipper CS] Content script loaded – watching for apply clicks")

export { }
