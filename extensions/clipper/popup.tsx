import { useCallback, useEffect, useState } from "react"

import "./style.css"

import type {
  CaptureHistoryEntry,
  CaptureStatus,
  IngestRequest,
  IngestResponse,
  PageContext
} from "./types"

/** Next.js API endpoint for content ingestion */
const API_ENDPOINT = "http://localhost:3000/api/ingest/parse"

/**
 * Injected into the active tab to scrape rich context.
 *
 * This function runs in the PAGE context (via chrome.scripting.executeScript),
 * so it has full access to the DOM. It collects:
 *   1. document.title
 *   2. Relevant <meta> tags (OpenGraph, description, keywords, etc.)
 *   3. JSON-LD structured data (<script type="application/ld+json">)
 *   4. Trimmed HTML of the main content area
 *   5. Full plaintext as fallback
 */
function scrapePageContext(): PageContext {
  // ── 1. Page title ──────────────────────────────────────────────────────
  const pageTitle = document.title || ""

  // ── 2. Meta tags ───────────────────────────────────────────────────────
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

  // ── 3. JSON-LD structured data ─────────────────────────────────────────
  const jsonLd: Record<string, unknown>[] = []
  document.querySelectorAll('script[type="application/ld+json"]').forEach((script) => {
    try {
      const parsed = JSON.parse(script.textContent || "")
      // Some pages embed an array of objects, some embed a single object
      if (Array.isArray(parsed)) {
        jsonLd.push(...parsed)
      } else if (typeof parsed === "object" && parsed !== null) {
        jsonLd.push(parsed)
      }
    } catch {
      // Malformed JSON-LD – skip silently
    }
  })

  // ── 4. Main content HTML (trimmed) ─────────────────────────────────────
  // Try to find the main content area; fall back to <body>.
  // We cap the HTML at ~50KB to avoid overly large payloads.
  const mainEl =
    document.querySelector("main") ||
    document.querySelector('[role="main"]') ||
    document.querySelector("#main-content") ||
    document.querySelector(".jobs-description") ||          // LinkedIn
    document.querySelector(".job-view-layout") ||           // LinkedIn
    document.querySelector(".jobs-unified-top-card") ||     // LinkedIn
    document.querySelector("article") ||
    document.body

  let mainHtml = mainEl?.innerHTML || ""
  const MAX_HTML_LENGTH = 50_000
  if (mainHtml.length > MAX_HTML_LENGTH) {
    mainHtml = mainHtml.substring(0, MAX_HTML_LENGTH) + "\n<!-- TRUNCATED -->"
  }

  // ── 5. Plain text (fallback) ───────────────────────────────────────────
  const plainText = document.body.innerText || ""

  return { pageTitle, metaTags, jsonLd, mainHtml, plainText }
}

function ClipperPopup(): JSX.Element {
  const [status, setStatus] = useState<CaptureStatus>("idle")
  const [message, setMessage] = useState<string>("")
  const [currentTab, setCurrentTab] = useState<chrome.tabs.Tab | null>(null)
  const [history, setHistory] = useState<CaptureHistoryEntry[]>([])

  // Load the active tab info and recent capture history on mount
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) setCurrentTab(tabs[0])
    })

    chrome.storage.local.get("captureHistory", (result) => {
      const stored = result.captureHistory as CaptureHistoryEntry[] | undefined
      if (stored) setHistory(stored.slice(0, 5))
    })
  }, [])

  // Save a history entry to chrome.storage.local
  const saveHistoryEntry = useCallback(
    async (entry: CaptureHistoryEntry): Promise<void> => {
      const result = await chrome.storage.local.get("captureHistory")
      const existing = (result.captureHistory as CaptureHistoryEntry[]) || []
      const updated = [entry, ...existing].slice(0, 50)
      await chrome.storage.local.set({ captureHistory: updated })
      setHistory(updated.slice(0, 5))
    },
    []
  )

  // Main capture handler
  const handleCapture = useCallback(async (): Promise<void> => {
    if (!currentTab?.id) {
      setStatus("error")
      setMessage("No active tab found.")
      return
    }

    setStatus("loading")
    setMessage("Scraping page context…")

    try {
      // Inject the rich scraper into the active tab
      const injectionResults = await chrome.scripting.executeScript({
        target: { tabId: currentTab.id },
        func: scrapePageContext
      })

      const context: PageContext | undefined = injectionResults?.[0]?.result
      if (!context || context.plainText.trim().length < 50) {
        setStatus("error")
        setMessage("Page content is too short or empty.")
        return
      }

      setMessage("Sending to dashboard…")

      // Build the ingestion payload with full context
      const requestBody: IngestRequest = {
        context,
        sourceUrl: currentTab.url || "",
        action: "capture",
        timestamp: new Date().toISOString()
      }

      // POST to the Next.js API
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`)
      }

      const data: IngestResponse = await response.json()

      // Derive a display title from the richest available source
      const displayTitle =
        context.metaTags["og:title"] ||
        context.pageTitle ||
        currentTab.title ||
        "Untitled"

      if (data.success) {
        setStatus("success")
        setMessage(data.message || "Job saved to dashboard!")
      } else {
        setStatus("error")
        setMessage(data.message || "API rejected the data.")
      }

      // Persist to local history
      await saveHistoryEntry({
        id: data.jobId || crypto.randomUUID(),
        url: currentTab.url || "",
        title: displayTitle,
        action: "capture",
        status: data.success ? "success" : "error",
        timestamp: new Date().toISOString()
      })
    } catch (err: unknown) {
      setStatus("error")
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred"
      setMessage(`Failed: ${errorMessage}`)
    }
  }, [currentTab, saveHistoryEntry])

  // Status badge rendering
  const renderStatusBadge = (): JSX.Element | null => {
    if (status === "idle") return null

    const baseClasses = "mt-3 px-3 py-2 rounded-lg text-sm font-medium"
    const variants: Record<Exclude<CaptureStatus, "idle">, string> = {
      loading:
        "bg-accent-muted text-accent border border-accent/20 animate-pulse",
      success: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
      error: "bg-red-500/15 text-red-400 border border-red-500/20"
    }

    return (
      <div className={`${baseClasses} ${variants[status]}`}>
        {status === "loading" && (
          <span className="inline-block w-3 h-3 border-2 border-accent border-t-transparent rounded-full animate-spin mr-2 align-middle" />
        )}
        {status === "success" && <span className="mr-2">✓</span>}
        {status === "error" && <span className="mr-2">✕</span>}
        {message}
      </div>
    )
  }

  return (
    <div className="dark w-[360px] bg-surface text-white font-sans">
      {/* Header */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-semibold tracking-tight">Clipper</h1>
            <p className="text-[11px] text-muted">
              Save jobs to your dashboard
            </p>
          </div>
        </div>
      </div>

      {/* Current Page Info */}
      <div className="mx-5 mb-3 px-3 py-2.5 rounded-lg bg-surface-raised border border-white/5">
        <p className="text-xs text-muted mb-0.5">Current page</p>
        <p className="text-sm font-medium truncate">
          {currentTab?.title || "Loading…"}
        </p>
        <p className="text-[11px] text-muted truncate">
          {currentTab?.url || ""}
        </p>
      </div>

      {/* Capture Button */}
      <div className="px-5 pb-3">
        <button
          onClick={handleCapture}
          disabled={status === "loading"}
          className="w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-200
            bg-accent hover:bg-accent-hover active:scale-[0.98]
            disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
            focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-surface">
          {status === "loading" ? "Capturing…" : "⚡ Capture Job"}
        </button>

        {renderStatusBadge()}
      </div>

      {/* Recent History */}
      {history.length > 0 && (
        <div className="px-5 pb-4 border-t border-white/5 pt-3">
          <p className="text-xs text-muted mb-2 font-medium uppercase tracking-wider">
            Recent
          </p>
          <div className="space-y-1.5">
            {history.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-surface-raised/50 text-xs">
                <span
                  className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${entry.status === "success" ? "bg-emerald-400" : "bg-red-400"
                    }`}
                />
                <span className="truncate flex-1 text-white/80">
                  {entry.title}
                </span>
                <span className="text-muted text-[10px] flex-shrink-0">
                  {entry.action === "apply" ? "Applied" : "Saved"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-5 py-2.5 border-t border-white/5 flex justify-between items-center">
        <a
          href="http://localhost:3000/lab/jobs"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] text-accent hover:text-accent-hover transition-colors">
          Open Dashboard →
        </a>
        <span className="text-[10px] text-muted">v1.0.0</span>
      </div>
    </div>
  )
}

export default ClipperPopup
