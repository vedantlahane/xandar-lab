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
const DEFAULT_API_ENDPOINT = "http://localhost:3000/api/ingest/parse"

/**
 * Injected into the active tab to scrape rich context.
 */
function scrapePageContext(): PageContext {
  const pageTitle = document.title || ""

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
      // Malformed JSON-LD – skip silently
    }
  })

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

  const plainText = document.body.innerText || ""

  return { pageTitle, metaTags, jsonLd, mainHtml, plainText }
}

function ClipperPopup(): JSX.Element {
  const [status, setStatus] = useState<CaptureStatus>("idle")
  const [message, setMessage] = useState<string>("")
  const [currentTab, setCurrentTab] = useState<chrome.tabs.Tab | null>(null)
  const [history, setHistory] = useState<CaptureHistoryEntry[]>([])
  const [apiEndpoint, setApiEndpoint] = useState(DEFAULT_API_ENDPOINT)

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) setCurrentTab(tabs[0])
    })

    chrome.storage.local.get("captureHistory", (result) => {
      const stored = result.captureHistory as CaptureHistoryEntry[] | undefined
      if (stored) setHistory(stored.slice(0, 5))
    })

    chrome.storage.sync.get("apiEndpoint", (result) => {
      if (result.apiEndpoint) setApiEndpoint(result.apiEndpoint)
    })
  }, [])

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

  const handleCapture = useCallback(async (): Promise<void> => {
    if (!currentTab?.id) {
      setStatus("error")
      setMessage("No active tab found.")
      return
    }

    setStatus("loading")
    setMessage("Analyzing page...")

    try {
      const injectionResults = await chrome.scripting.executeScript({
        target: { tabId: currentTab.id },
        func: scrapePageContext
      })

      const context: PageContext | undefined = injectionResults?.[0]?.result
      if (!context || context.plainText.trim().length < 50) {
        setStatus("error")
        setMessage("Content too short.")
        return
      }

      setMessage("Sending to Xandar...")

      const requestBody: IngestRequest = {
        context,
        sourceUrl: currentTab.url || "",
        action: "capture",
        timestamp: new Date().toISOString()
      }

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        throw new Error(`API ${response.status}`)
      }

      const data: IngestResponse = await response.json()

      const displayTitle =
        context.metaTags["og:title"] ||
        context.pageTitle ||
        currentTab.title ||
        "Untitled"

      if (data.success) {
        setStatus("success")
        setMessage("Saved to Dashboard")
      } else {
        setStatus("error")
        setMessage(data.message || "Failed to save")
      }

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
        err instanceof Error ? err.message : "Network Error"
      setMessage(errorMessage)
    }
  }, [currentTab, saveHistoryEntry, apiEndpoint])

  const openOptions = () => chrome.runtime.openOptionsPage()

  return (
    <div className="w-[360px] bg-background text-foreground font-sans overflow-hidden border border-border">
      {/* Dynamic Background Effect */}
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />

      {/* Header */}
      <div className="relative px-5 pt-5 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-[0_0_15px_-3px_rgba(var(--primary),0.3)]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight">Clipper</h1>
              <p className="text-[10px] text-muted-foreground">Xandar Lab</p>
            </div>
          </div>
          <button
            onClick={openOptions}
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
            title="Settings"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative px-5 space-y-4">
        {/* Page Card */}
        <div className="p-3 rounded-lg bg-card border border-border/50 shadow-sm">
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Active Page</p>
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate text-foreground/90" title={currentTab?.title}>
                {currentTab?.title || "Loading..."}
              </p>
              <p className="text-[11px] text-muted-foreground truncate font-mono mt-0.5 opacity-80">
                {currentTab?.url || ""}
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="space-y-3">
          <button
            onClick={handleCapture}
            disabled={status === "loading" || status === "success"}
            className={`
              w-full relative group overflow-hidden rounded-lg font-semibold text-sm transition-all duration-300
              ${status === "success"
                ? "bg-green-500/10 text-green-500 border border-green-500/20 py-2.5 cursor-default"
                : "bg-primary text-primary-foreground hover:bg-primary-hover shadow-lg hover:shadow-primary/20 py-3 active:scale-[0.98]"
              }
              disabled:opacity-80 disabled:cursor-not-allowed
            `}
          >
            {status === "loading" ? (
              <div className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Scanning Content...</span>
              </div>
            ) : status === "success" ? (
              <div className="flex items-center justify-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Successfully Saved</span>
              </div>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                </svg>
                Capture to Dashboard
              </span>
            )}
          </button>

          {status === "error" && (
            <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-md flex items-center gap-2 animate-fade-in">
              <span className="font-bold">Error:</span> {message}
            </div>
          )}
        </div>

        {/* History Section */}
        {history.length > 0 && (
          <div className="pt-2 pb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Recent Activity
              </p>
            </div>
            <div className="space-y-1">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="group flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50"
                >
                  <div className={`w-2 h-2 rounded-full ${entry.status === "success" ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" : "bg-red-500"}`} />
                  <span className="truncate flex-1 text-xs text-foreground/80 group-hover:text-foreground transition-colors">
                    {entry.title}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-medium">
                    {entry.action === "capture" ? "Saved" : "Applied"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-border bg-card/30 flex justify-between items-center text-[10px]">
        <span className="text-muted-foreground">v1.0.0</span>
        <a
          href="http://localhost:3000/lab/jobs"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:text-primary-hover font-medium flex items-center gap-1 transition-colors"
        >
          Open Dashboard
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
        </a>
      </div>
    </div>
  )
}

export default ClipperPopup
