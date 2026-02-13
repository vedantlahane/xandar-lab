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

    const openOptions = () => chrome.runtime.openOptionsPage()
    const isEnabled = status?.state.enabled ?? false

    return (
        <div className="w-[380px] bg-background text-foreground font-sans overflow-hidden border border-border">
            {/* Background Effect */}
            <div className="fixed inset-0 pointer-events-none opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-harvest/20 via-transparent to-transparent" />

            {/* Header */}
            <div className="relative px-5 pt-5 pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-harvest/10 border border-harvest/20 flex items-center justify-center text-harvest shadow-[0_0_15px_-3px_rgba(var(--harvest),0.3)]">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                <polyline points="7.5 4.21 12 6.81 16.5 4.21" />
                                <polyline points="7.5 19.79 7.5 14.6 3 12" />
                                <polyline points="21 12 16.5 14.6 16.5 19.79" />
                                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                                <line x1="12" y1="22.08" x2="12" y2="12" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-sm font-bold tracking-tight">Harvester</h1>
                            <p className="text-[10px] text-muted-foreground">Admin Control</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleToggle}
                            className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${isEnabled
                                ? "bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20"
                                : "bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20"
                                }`}
                        >
                            {isEnabled ? "● Active" : "○ Paused"}
                        </button>
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
            </div>

            {/* Stats Grid */}
            <div className="relative px-5 grid grid-cols-3 gap-3 mb-4">
                <div className="p-3 rounded-lg bg-card border border-border/50 text-center shadow-sm">
                    <p className="text-xl font-bold text-harvest">
                        {status?.state.totalIngested ?? "—"}
                    </p>
                    <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold mt-1">
                        Total Jobs
                    </p>
                </div>
                <div className="p-3 rounded-lg bg-card border border-border/50 text-center shadow-sm">
                    <p className="text-xl font-bold text-foreground">
                        {status?.lastCycle?.targetsProcessed ?? "—"}
                    </p>
                    <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold mt-1">
                        Latest
                    </p>
                </div>
                <div className="p-3 rounded-lg bg-card border border-border/50 text-center shadow-sm">
                    <p className={`text-xl font-bold ${(status?.lastCycle?.errors.length ?? 0) > 0 ? "text-red-400" : "text-foreground"}`}>
                        {status?.lastCycle?.errors.length ?? "—"}
                    </p>
                    <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold mt-1">
                        Errors
                    </p>
                </div>
            </div>

            {/* Last Cycle Info */}
            <div className="px-5 mb-4">
                <div className="px-3 py-2.5 rounded-lg bg-card border border-border/50">
                    <div className="flex justify-between items-center mb-1">
                        <p className="text-xs font-medium text-muted-foreground">Last Check</p>
                        <p className="text-xs font-mono text-foreground/80">
                            {formatTime(status?.state.lastCycleAt ?? null)}
                        </p>
                    </div>
                    {status?.state.lastError && (
                        <p className="text-[10px] text-red-400 mt-2 p-2 bg-red-500/5 rounded border border-red-500/10 truncate">
                            ⚠ {status.state.lastError}
                        </p>
                    )}
                </div>
            </div>

            {/* Manual Trigger */}
            <div className="px-5 pb-4">
                <button
                    onClick={handleManualTrigger}
                    disabled={triggering || !isEnabled}
                    className="w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-200
            bg-harvest hover:bg-harvest-hover text-white shadow-lg shadow-harvest/20 active:scale-[0.98]
            disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:active:scale-100
            focus:outline-none focus:ring-2 focus:ring-harvest/50 focus:ring-offset-2 focus:ring-offset-background">
                    {triggering ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Running Cycle...
                        </span>
                    ) : (
                        "⚡ Run Trigger Now"
                    )}
                </button>

                {feedback && (
                    <p className="mt-2 text-[10px] text-center text-muted-foreground animate-fade-in">{feedback}</p>
                )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-border bg-card/30 flex justify-between items-center">
                <span className="text-[10px] text-muted-foreground">
                    Next sync in ~4h
                </span>
                <span className="text-[10px] text-muted-foreground">v1.0.0</span>
            </div>
        </div>
    )
}

export default HarvesterPopup
