import { useCallback, useEffect, useState } from "react"

import "./style.css"

import type { CycleStats, HarvesterState } from "./types"

interface StatusData {
    state: HarvesterState
    lastCycle: CycleStats | null
}

function HarvesterPopup(): JSX.Element {
    const [status, setStatus] = useState<StatusData | null>(null)
    const [triggering, setTriggering] = useState<boolean>(false)
    const [feedback, setFeedback] = useState<string>("")

    // Fetch status from background on mount
    const fetchStatus = useCallback((): void => {
        chrome.runtime.sendMessage(
            { type: "GET_STATUS" },
            (response: StatusData & { error?: string }) => {
                if (chrome.runtime.lastError || response?.error) {
                    setFeedback("Cannot reach background worker")
                    return
                }
                setStatus({
                    state: response.state,
                    lastCycle: response.lastCycle
                })
            }
        )
    }, [])

    useEffect(() => {
        fetchStatus()
        const interval = setInterval(fetchStatus, 5000)
        return () => clearInterval(interval)
    }, [fetchStatus])

    // Manually trigger a scrape cycle
    const handleManualTrigger = useCallback((): void => {
        setTriggering(true)
        setFeedback("Starting scrape cycle…")
        chrome.runtime.sendMessage(
            { type: "MANUAL_TRIGGER" },
            (response: { success?: boolean; error?: string }) => {
                setTriggering(false)
                if (response?.success) {
                    setFeedback("Cycle completed!")
                } else {
                    setFeedback(`Failed: ${response?.error || "Unknown error"}`)
                }
                fetchStatus()
            }
        )
    }, [fetchStatus])

    // Toggle enabled/disabled
    const handleToggle = useCallback((): void => {
        chrome.runtime.sendMessage(
            { type: "TOGGLE_ENABLED" },
            (response: { enabled?: boolean; error?: string }) => {
                if (response?.error) {
                    setFeedback(`Error: ${response.error}`)
                } else {
                    setFeedback(
                        response?.enabled ? "Harvester enabled" : "Harvester paused"
                    )
                    fetchStatus()
                }
            }
        )
    }, [fetchStatus])

    const formatTime = (iso: string | null): string => {
        if (!iso) return "Never"
        const d = new Date(iso)
        return d.toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        })
    }

    const isEnabled = status?.state.enabled ?? false

    return (
        <div className="dark w-[380px] bg-surface text-white font-sans">
            {/* Header */}
            <div className="px-5 pt-5 pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-harvest flex items-center justify-center">
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round">
                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                <polyline points="7.5 4.21 12 6.81 16.5 4.21" />
                                <polyline points="7.5 19.79 7.5 14.6 3 12" />
                                <polyline points="21 12 16.5 14.6 16.5 19.79" />
                                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                                <line x1="12" y1="22.08" x2="12" y2="12" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-base font-semibold tracking-tight">
                                Harvester
                            </h1>
                            <p className="text-[11px] text-muted">Admin scraper control</p>
                        </div>
                    </div>

                    <button
                        onClick={handleToggle}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${isEnabled
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : "bg-red-500/20 text-red-400 border border-red-500/30"
                            }`}>
                        {isEnabled ? "● Active" : "○ Paused"}
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="mx-5 mb-3 grid grid-cols-3 gap-2">
                <div className="px-3 py-2.5 rounded-lg bg-surface-raised border border-white/5 text-center">
                    <p className="text-lg font-bold text-harvest">
                        {status?.state.totalIngested ?? "—"}
                    </p>
                    <p className="text-[10px] text-muted uppercase tracking-wider">
                        Total Jobs
                    </p>
                </div>
                <div className="px-3 py-2.5 rounded-lg bg-surface-raised border border-white/5 text-center">
                    <p className="text-lg font-bold">
                        {status?.lastCycle?.targetsProcessed ?? "—"}
                    </p>
                    <p className="text-[10px] text-muted uppercase tracking-wider">
                        Last Targets
                    </p>
                </div>
                <div className="px-3 py-2.5 rounded-lg bg-surface-raised border border-white/5 text-center">
                    <p className="text-lg font-bold">
                        {status?.lastCycle?.errors.length ?? "—"}
                    </p>
                    <p className="text-[10px] text-muted uppercase tracking-wider">
                        Errors
                    </p>
                </div>
            </div>

            {/* Last Cycle Info */}
            <div className="mx-5 mb-3 px-3 py-2.5 rounded-lg bg-surface-raised border border-white/5">
                <div className="flex justify-between items-center mb-1">
                    <p className="text-xs text-muted">Last cycle</p>
                    <p className="text-xs text-white/70">
                        {formatTime(status?.state.lastCycleAt ?? null)}
                    </p>
                </div>
                {status?.state.lastError && (
                    <p className="text-[11px] text-red-400 mt-1 truncate">
                        ⚠ {status.state.lastError}
                    </p>
                )}
            </div>

            {/* Manual Trigger */}
            <div className="px-5 pb-3">
                <button
                    onClick={handleManualTrigger}
                    disabled={triggering || !isEnabled}
                    className="w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-200
            bg-harvest hover:bg-harvest-hover text-surface active:scale-[0.98]
            disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
            focus:outline-none focus:ring-2 focus:ring-harvest/50 focus:ring-offset-2 focus:ring-offset-surface">
                    {triggering ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="w-3 h-3 border-2 border-surface border-t-transparent rounded-full animate-spin" />
                            Scraping…
                        </span>
                    ) : (
                        "⚡ Run Cycle Now"
                    )}
                </button>

                {feedback && (
                    <p className="mt-2 text-xs text-center text-muted">{feedback}</p>
                )}
            </div>

            {/* Footer */}
            <div className="px-5 py-2.5 border-t border-white/5 flex justify-between items-center">
                <span className="text-[10px] text-muted">
                    Next sync in ~4h • Admin only
                </span>
                <span className="text-[10px] text-muted">v1.0.0</span>
            </div>
        </div>
    )
}

export default HarvesterPopup
