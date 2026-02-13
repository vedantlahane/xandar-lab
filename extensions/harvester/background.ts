// ============================================================================
// Harvester Extension – background.ts (The Orchestrator)
// ============================================================================
// This is the brain of the harvester. It runs as a Manifest V3 service worker
// and orchestrates the entire scraping lifecycle.
//
// Architecture (Ghost Browser Pattern):
//
//   ┌──────────────────────────────────────────────────────────────┐
//   │ Background Service Worker (this file)                       │
//   │                                                              │
//   │  1. chrome.runtime.onStartup → beginCycle()                 │
//   │  2. chrome.alarms (every 4h) → beginCycle()                 │
//   │  3. beginCycle():                                            │
//   │     a. Pop next URL from queue                               │
//   │     b. chrome.tabs.create({ url, active: false })           │
//   │     c. Content script auto-injects, scrapes, POSTs to API   │
//   │     d. Content script sends SCRAPE_COMPLETE message          │
//   │     e. Background closes tab, waits random delay            │
//   │     f. Repeats (a) until queue is empty                     │
//   │  4. Persists state in chrome.storage.local                  │
//   └──────────────────────────────────────────────────────────────┘
//
// Anti-bot measures:
//   - Random delays (8–15s) between tab cycles simulate human behavior
//   - Tabs open in background (active: false) to avoid focus stealing
//   - Admin key from .env authenticates API requests
// ============================================================================

import type {
    CycleStats,
    HarvesterState,
    ScrapeCompleteMessage,
    ScrapeTarget
} from "./types"

// ── Configuration ──────────────────────────────────────────────────────────

/** Alarm name for the periodic sync */
const ALARM_NAME = "harvester-sync-cycle"

/** Interval between scrape cycles in minutes (4 hours) */
const SYNC_INTERVAL_MINUTES = 4 * 60

/** Min/max delay between tab cycles in milliseconds (human simulation) */
const MIN_DELAY_MS = 8_000
const MAX_DELAY_MS = 15_000

/** Maximum time to wait for a scrape to complete before timing out */
const SCRAPE_TIMEOUT_MS = 60_000

/**
 * Default scrape queue.
 * Each entry is a page on a job board that lists jobs.
 * The content script will handle extracting data from these pages.
 */
const DEFAULT_SCRAPE_QUEUE: ScrapeTarget[] = [
    {
        id: "linkedin-jobs",
        url: "https://www.linkedin.com/jobs/search/?keywords=software%20engineer&location=Remote",
        label: "LinkedIn – Software Engineer (Remote)",
        board: "linkedin",
        active: false
    },
    {
        id: "linkedin-internships",
        url: "https://www.linkedin.com/jobs/search/?keywords=software%20intern&location=Remote",
        label: "LinkedIn – Software Intern (Remote)",
        board: "linkedin",
        active: false
    },
    {
        id: "yc-jobs",
        url: "https://www.workatastartup.com/jobs",
        label: "YC – Work at a Startup",
        board: "ycombinator",
        active: false
    },
    {
        id: "himalayas-remote",
        url: "https://himalayas.app/jobs?query=software+engineer",
        label: "Himalayas – Software Engineer",
        board: "himalayas",
        active: false
    }
]

// ── State Management ───────────────────────────────────────────────────────

const DEFAULT_STATE: HarvesterState = {
    enabled: true,
    lastCycleAt: null,
    totalIngested: 0,
    queueIndex: 0,
    lastError: null
}

async function getState(): Promise<HarvesterState> {
    const result = await chrome.storage.local.get("harvesterState")
    return (result.harvesterState as HarvesterState) || { ...DEFAULT_STATE }
}

async function setState(
    updates: Partial<HarvesterState>
): Promise<HarvesterState> {
    const current = await getState()
    const updated = { ...current, ...updates }
    await chrome.storage.local.set({ harvesterState: updated })
    return updated
}

async function getScrapeQueue(): Promise<ScrapeTarget[]> {
    const result = await chrome.storage.local.get("scrapeQueue")
    return (result.scrapeQueue as ScrapeTarget[]) || [...DEFAULT_SCRAPE_QUEUE]
}

async function setScrapeQueue(queue: ScrapeTarget[]): Promise<void> {
    await chrome.storage.local.set({ scrapeQueue: queue })
}

// ── Random Delay Utility ───────────────────────────────────────────────────

function randomDelay(): Promise<void> {
    const ms =
        Math.floor(Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS)) + MIN_DELAY_MS
    console.log(`[Harvester BG] Waiting ${(ms / 1000).toFixed(1)}s before next tab…`)
    return new Promise((resolve) => setTimeout(resolve, ms))
}

// ── Tab Lifecycle ──────────────────────────────────────────────────────────

/**
 * Open a single target URL in a background tab and wait for the content
 * script to finish scraping. Returns once the SCRAPE_COMPLETE message
 * is received or the timeout expires.
 */
async function scrapeTarget(target: ScrapeTarget): Promise<{
    success: boolean
    jobCount: number
    error?: string
}> {
    console.log(`[Harvester BG] Opening: ${target.label} (${target.url})`)

    return new Promise(async (resolve) => {
        let tabId: number | undefined
        let timeoutId: ReturnType<typeof setTimeout> | undefined
        let resolved = false

        // Set up a one-time message listener for the SCRAPE_COMPLETE signal
        const messageListener = (
            message: ScrapeCompleteMessage,
            sender: chrome.runtime.MessageSender
        ): void => {
            if (
                message.type === "SCRAPE_COMPLETE" &&
                sender.tab?.id === tabId &&
                !resolved
            ) {
                resolved = true
                clearTimeout(timeoutId)
                chrome.runtime.onMessage.removeListener(messageListener)

                console.log(
                    `[Harvester BG] Scrape complete: ${message.payload.jobCount} jobs from ${target.label}`
                )

                // Close the background tab
                if (tabId) {
                    chrome.tabs.remove(tabId).catch(() => {
                        /* tab may already be closed */
                    })
                }

                resolve({
                    success: message.payload.ingested,
                    jobCount: message.payload.jobCount
                })
            }
        }

        chrome.runtime.onMessage.addListener(messageListener)

        // Set up timeout – if the scrape takes too long, bail out
        timeoutId = setTimeout(() => {
            if (!resolved) {
                resolved = true
                chrome.runtime.onMessage.removeListener(messageListener)
                if (tabId) {
                    chrome.tabs.remove(tabId).catch(() => { })
                }
                console.warn(`[Harvester BG] Timeout scraping: ${target.label}`)
                resolve({ success: false, jobCount: 0, error: "Scrape timed out" })
            }
        }, SCRAPE_TIMEOUT_MS)

        try {
            // Open the tab in the background (active: false).
            // The content script will auto-inject because of URL matching.
            const tab = await chrome.tabs.create({
                url: target.url,
                active: false
            })
            tabId = tab.id
        } catch (err: unknown) {
            resolved = true
            clearTimeout(timeoutId)
            chrome.runtime.onMessage.removeListener(messageListener)
            const errorMsg = err instanceof Error ? err.message : "Tab creation failed"
            resolve({ success: false, jobCount: 0, error: errorMsg })
        }
    })
}

// ── Scrape Cycle ───────────────────────────────────────────────────────────

/**
 * Run a full scrape cycle through all targets in the queue.
 * Processes one target at a time with random delays between each.
 */
async function beginCycle(): Promise<void> {
    const state = await getState()

    if (!state.enabled) {
        console.log("[Harvester BG] Harvester is disabled, skipping cycle")
        return
    }

    console.log("[Harvester BG] ═══ Starting scrape cycle ═══")

    const queue = await getScrapeQueue()
    const stats: CycleStats = {
        startedAt: new Date().toISOString(),
        completedAt: null,
        targetsProcessed: 0,
        totalTargets: queue.length,
        jobsIngested: 0,
        errors: []
    }

    for (let i = 0; i < queue.length; i++) {
        const target = queue[i]

        // Update state to reflect current progress
        await setState({ queueIndex: i })

        const result = await scrapeTarget(target)

        stats.targetsProcessed++
        if (result.success) {
            stats.jobsIngested += result.jobCount
        } else if (result.error) {
            stats.errors.push(`${target.label}: ${result.error}`)
        }

        // Wait between targets (human simulation), except after the last one
        if (i < queue.length - 1) {
            await randomDelay()
        }
    }

    // Cycle complete – update persistent state
    stats.completedAt = new Date().toISOString()
    const currentState = await getState()
    await setState({
        lastCycleAt: stats.completedAt,
        totalIngested: currentState.totalIngested + stats.jobsIngested,
        queueIndex: 0,
        lastError:
            stats.errors.length > 0 ? stats.errors.join("; ") : null
    })

    // Persist cycle stats for the popup to display
    await chrome.storage.local.set({ lastCycleStats: stats })

    console.log(
        `[Harvester BG] ═══ Cycle complete: ${stats.jobsIngested} jobs, ${stats.errors.length} errors ═══`
    )
}

// ── Event Listeners ────────────────────────────────────────────────────────

// 1. Auto-start when browser opens
//    chrome.runtime.onStartup fires when a new browser profile session starts.
chrome.runtime.onStartup.addListener((): void => {
    console.log("[Harvester BG] Browser startup detected – scheduling cycle")
    // Small delay before starting to let the browser stabilize
    setTimeout(() => {
        beginCycle().catch((err: Error) => {
            console.error("[Harvester BG] Startup cycle failed:", err.message)
        })
    }, 5_000)
})

// 2. Also trigger on extension install/update
chrome.runtime.onInstalled.addListener(
    (details: chrome.runtime.InstalledDetails): void => {
        console.log(`[Harvester BG] Extension ${details.reason}`)

        // Initialize default state and queue
        chrome.storage.local.get("harvesterState", (result) => {
            if (!result.harvesterState) {
                chrome.storage.local.set({
                    harvesterState: DEFAULT_STATE,
                    scrapeQueue: DEFAULT_SCRAPE_QUEUE
                })
            }
        })

        // Set up the recurring alarm (every 4 hours)
        chrome.alarms.create(ALARM_NAME, {
            delayInMinutes: 1, // first trigger after 1 minute
            periodInMinutes: SYNC_INTERVAL_MINUTES
        })
    }
)

// 3. Alarm handler – triggers the scrape cycle on schedule
chrome.alarms.onAlarm.addListener((alarm: chrome.alarms.Alarm): void => {
    if (alarm.name === ALARM_NAME) {
        console.log("[Harvester BG] Alarm triggered – starting scrape cycle")
        beginCycle().catch((err: Error) => {
            console.error("[Harvester BG] Alarm cycle failed:", err.message)
            setState({ lastError: err.message })
        })
    }
})

// 4. Handle messages from the popup (manual triggers, status queries)
chrome.runtime.onMessage.addListener(
    (
        message: { type: string },
        _sender: chrome.runtime.MessageSender,
        sendResponse: (response: unknown) => void
    ): boolean => {
        switch (message.type) {
            case "MANUAL_TRIGGER":
                beginCycle()
                    .then(() => sendResponse({ success: true }))
                    .catch((err: Error) =>
                        sendResponse({ success: false, error: err.message })
                    )
                return true // async response

            case "GET_STATUS":
                getState()
                    .then(async (state) => {
                        const stats = await chrome.storage.local.get("lastCycleStats")
                        sendResponse({ state, lastCycle: stats.lastCycleStats || null })
                    })
                    .catch((err: Error) =>
                        sendResponse({ error: err.message })
                    )
                return true

            case "TOGGLE_ENABLED":
                getState()
                    .then((state) => setState({ enabled: !state.enabled }))
                    .then((updated) => sendResponse({ enabled: updated.enabled }))
                    .catch((err: Error) =>
                        sendResponse({ error: err.message })
                    )
                return true

            default:
                // Don't handle unknown messages (might be from content scripts)
                return false
        }
    }
)

console.log("[Harvester BG] Service worker initialized")

export { }
