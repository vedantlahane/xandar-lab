// ============================================================================
// Harvester Extension – Shared Type Definitions
// ============================================================================
// Types for the automated background scraping system.
// ============================================================================

/** A target URL in the scraping queue */
export interface ScrapeTarget {
    /** Unique identifier for this target */
    id: string
    /** Full URL to scrape */
    url: string
    /** Human-readable label */
    label: string
    /** Which job board this belongs to */
    board: "linkedin" | "ycombinator" | "himalayas"
    /** Whether this target is currently being scraped */
    active: boolean
}

/** Message sent FROM content script → background after scraping a page */
export interface ScrapeCompleteMessage {
    type: "SCRAPE_COMPLETE"
    payload: {
        /** URL that was scraped */
        url: string
        /** Number of job cards found */
        jobCount: number
        /** Whether the API ingestion succeeded */
        ingested: boolean
        /** ISO timestamp */
        timestamp: string
    }
}

/** Message sent FROM background → content script to trigger a scrape */
export interface ScrapeInitMessage {
    type: "INIT_SCRAPE"
    payload: {
        /** Target URL (for verification) */
        url: string
        /** Board identifier */
        board: string
    }
}

/** Request body for the Next.js ingestion API */
export interface HarvesterIngestRequest {
    /** Raw HTML or text content of the job listing area */
    content: string
    /** Source URL of the scraped page */
    sourceUrl: string
    /** Page title */
    title: string
    /** Always "harvest" to distinguish from user-initiated captures */
    action: "harvest"
    /** Board identifier for backend routing */
    board: string
    /** ISO timestamp */
    timestamp: string
}

/** API response from /api/ingest/parse */
export interface HarvesterIngestResponse {
    success: boolean
    message: string
    /** Number of jobs parsed from the content */
    jobsParsed?: number
}

/** Persistent state stored in chrome.storage.local */
export interface HarvesterState {
    /** Whether the harvester is active */
    enabled: boolean
    /** Last scrape cycle completion time (ISO) */
    lastCycleAt: string | null
    /** Total jobs ingested across all cycles */
    totalIngested: number
    /** Current index in the scrape queue */
    queueIndex: number
    /** Last error message, if any */
    lastError: string | null
}

/** Scrape cycle statistics */
export interface CycleStats {
    startedAt: string
    completedAt: string | null
    targetsProcessed: number
    totalTargets: number
    jobsIngested: number
    errors: string[]
}
