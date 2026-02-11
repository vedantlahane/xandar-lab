// ============================================================================
// Harvester Extension – content.ts (The Automated Scraper)
// ============================================================================
// This content script is injected into target job board pages when the
// background service worker opens them in a background tab.
//
// Flow:
//   1. Page loads (opened by background.ts with active: false)
//   2. Content script auto-injects via Plasmo URL matching
//   3. Waits for page to settle (DOM stable for 2s)
//   4. Scrolls to bottom to trigger lazy-loading of job cards
//   5. Extracts raw HTML/text of the job listings area
//   6. POSTs the data to Next.js API at /api/ingest/parse with x-admin-key
//   7. Sends SCRAPE_COMPLETE message to background service worker
//   8. Background closes the tab and moves to the next URL
//
// Security:
//   The x-admin-key is injected at build time from the .env file via
//   Plasmo's PLASMO_PUBLIC_ environment variable system.
// ============================================================================

import type {
    HarvesterIngestRequest,
    HarvesterIngestResponse,
    ScrapeCompleteMessage
} from "./types"

// ── Plasmo Content Script Configuration ────────────────────────────────────
export const config = {
    matches: [
        "*://*.linkedin.com/jobs/*",
        "*://*.workatastartup.com/*",
        "*://*.himalayas.app/*"
    ]
}

// ── Environment Variables (injected at build time by Plasmo) ───────────────
const ADMIN_KEY: string = process.env.PLASMO_PUBLIC_ADMIN_KEY || ""
const API_ENDPOINT: string =
    process.env.PLASMO_PUBLIC_API_ENDPOINT || "http://localhost:3000/api/ingest/parse"

// ── Board Detection ────────────────────────────────────────────────────────

type BoardId = "linkedin" | "ycombinator" | "himalayas" | "unknown"

function detectBoard(): BoardId {
    const hostname = window.location.hostname
    if (hostname.includes("linkedin.com")) return "linkedin"
    if (hostname.includes("workatastartup.com")) return "ycombinator"
    if (hostname.includes("himalayas.app")) return "himalayas"
    return "unknown"
}

// ── Scroll Logic ───────────────────────────────────────────────────────────
// Many job boards lazy-load cards as the user scrolls. We simulate smooth
// scrolling to the bottom to trigger loading of all visible listings.

async function scrollToBottom(): Promise<void> {
    const SCROLL_STEP = 400 // pixels per scroll step
    const SCROLL_DELAY_MS = 300 // delay between steps
    const MAX_SCROLLS = 30 // safety limit

    let previousHeight = 0
    let scrollCount = 0

    return new Promise((resolve) => {
        const interval = setInterval(() => {
            const currentHeight = document.documentElement.scrollHeight

            // If we've reached the bottom (height no longer increasing) or hit max
            if (currentHeight === previousHeight || scrollCount >= MAX_SCROLLS) {
                clearInterval(interval)
                // Scroll back to top (clean state)
                window.scrollTo({ top: 0 })
                resolve()
                return
            }

            previousHeight = currentHeight
            scrollCount++
            window.scrollBy({ top: SCROLL_STEP, behavior: "smooth" })
        }, SCROLL_DELAY_MS)
    })
}

// ── Content Extraction ─────────────────────────────────────────────────────
// Board-specific selectors for the job listing container. Falls back to
// body.innerText if no specific container is found.

interface ExtractionResult {
    content: string
    jobCount: number
}

function extractJobContent(board: BoardId): ExtractionResult {
    /** CSS selectors for job list containers per board */
    const BOARD_SELECTORS: Record<BoardId, string[]> = {
        linkedin: [
            ".jobs-search__results-list",
            ".scaffold-layout__list",
            '[class*="jobs-search-results"]',
            ".jobs-search-results"
        ],
        ycombinator: [
            ".jobs-list",
            '[class*="JobsList"]',
            "main"
        ],
        himalayas: [
            '[data-testid="job-list"]',
            ".job-list",
            "main"
        ],
        unknown: ["main", "body"]
    }

    const selectors = BOARD_SELECTORS[board]
    let container: Element | null = null

    // Try each selector until one matches
    for (const selector of selectors) {
        container = document.querySelector(selector)
        if (container) break
    }

    // Fall back to body
    if (!container) {
        container = document.body
    }

    const content = container.innerHTML
    // Rough job card count heuristic based on common list patterns
    const cards = container.querySelectorAll(
        'li, [class*="job-card"], [class*="JobCard"], article, [data-job-id]'
    )

    return {
        content,
        jobCount: cards.length
    }
}

// ── Wait for DOM Stability ─────────────────────────────────────────────────
// Waits until the DOM has been stable (no new mutations) for `stableMs`.

function waitForDOMStable(stableMs: number = 2000): Promise<void> {
    return new Promise((resolve) => {
        let timeout: ReturnType<typeof setTimeout> | undefined

        const observer = new MutationObserver(() => {
            clearTimeout(timeout)
            timeout = setTimeout(() => {
                observer.disconnect()
                resolve()
            }, stableMs)
        })

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false
        })

        // Initial timeout – if no mutations, consider DOM stable already
        timeout = setTimeout(() => {
            observer.disconnect()
            resolve()
        }, stableMs)
    })
}

// ── Main Scraping Pipeline ─────────────────────────────────────────────────

async function runScrape(): Promise<void> {
    const board = detectBoard()
    console.log(
        `[Harvester CS] Scraping ${board} page: ${window.location.href}`
    )

    // Step 1: Wait for the DOM to stabilize (page fully loaded)
    console.log("[Harvester CS] Waiting for DOM stability…")
    await waitForDOMStable(2000)

    // Step 2: Scroll to bottom to trigger lazy-loading
    console.log("[Harvester CS] Scrolling to load lazy content…")
    await scrollToBottom()

    // Give a moment for any final renders after scrolling
    await new Promise((r) => setTimeout(r, 1500))

    // Step 3: Extract job content
    console.log("[Harvester CS] Extracting job content…")
    const { content, jobCount } = extractJobContent(board)
    console.log(`[Harvester CS] Found ~${jobCount} job cards`)

    // Step 4: POST to the Next.js API with the admin key
    let ingested = false

    try {
        const requestBody: HarvesterIngestRequest = {
            content,
            sourceUrl: window.location.href,
            title: document.title,
            action: "harvest",
            board,
            timestamp: new Date().toISOString()
        }

        console.log(
            `[Harvester CS] Sending ${(content.length / 1024).toFixed(1)}KB to API…`
        )

        const response = await fetch(API_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // Admin key from .env, authenticates this as a harvester request
                "x-admin-key": ADMIN_KEY
            },
            body: JSON.stringify(requestBody)
        })

        if (!response.ok) {
            throw new Error(`API returned ${response.status}: ${response.statusText}`)
        }

        const data: HarvesterIngestResponse = await response.json()
        ingested = data.success
        console.log(
            `[Harvester CS] API response: ${data.message} (${data.jobsParsed || 0} parsed)`
        )
    } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : "Unknown fetch error"
        console.error(`[Harvester CS] API error: ${errorMsg}`)
    }

    // Step 5: Signal the background service worker that scraping is done
    const completeMessage: ScrapeCompleteMessage = {
        type: "SCRAPE_COMPLETE",
        payload: {
            url: window.location.href,
            jobCount,
            ingested,
            timestamp: new Date().toISOString()
        }
    }

    chrome.runtime.sendMessage(completeMessage, () => {
        if (chrome.runtime.lastError) {
            console.warn(
                "[Harvester CS] Failed to notify background:",
                chrome.runtime.lastError.message
            )
        }
    })
}

// ── Entry Point ────────────────────────────────────────────────────────────
// Run the scrape pipeline when the content script is injected.
// The slight delay gives the page time to start rendering.

console.log("[Harvester CS] Content script loaded")
setTimeout(() => {
    runScrape().catch((err: Error) => {
        console.error("[Harvester CS] Scrape pipeline error:", err.message)
        // Still notify background of failure so it doesn't hang
        chrome.runtime.sendMessage({
            type: "SCRAPE_COMPLETE",
            payload: {
                url: window.location.href,
                jobCount: 0,
                ingested: false,
                timestamp: new Date().toISOString()
            }
        } satisfies ScrapeCompleteMessage)
    })
}, 3000)

export { }
