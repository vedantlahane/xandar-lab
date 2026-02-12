import { useState, useEffect } from "react"
import "./style.css"

function Options(): JSX.Element {
    const [interval, setInterval] = useState(240) // minutes
    const [notifications, setNotifications] = useState(true)
    const [status, setStatus] = useState("")

    useEffect(() => {
        chrome.storage.sync.get(["scrapeInterval", "notifications"], (result) => {
            if (result.scrapeInterval) setInterval(result.scrapeInterval)
            if (result.notifications !== undefined) setNotifications(result.notifications)
        })
    }, [])

    const handleSave = () => {
        chrome.storage.sync.set({ scrapeInterval: interval, notifications }, () => {
            setStatus("Settings saved!")
            setTimeout(() => setStatus(""), 2000)
        })
    }

    return (
        <div className="min-h-screen bg-background text-foreground font-sans flex items-center justify-center p-8">
            <div className="w-full max-w-md bg-card border border-border rounded-xl p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-harvest/20 flex items-center justify-center text-harvest">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 12V7a5 5 0 0 0-10 0v5" />
                            <path d="M3 7a5 5 0 0 1 10 0v5" />
                            <path d="M12 22v-9" />
                            <path d="M12 13h5a3 3 0 0 1 0 6h-5" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold">Harvester Config</h1>
                        <p className="text-sm text-muted-foreground">Manage automated scraping</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Scrape Interval (Minutes)</label>
                        <input
                            type="number"
                            value={interval}
                            onChange={(e) => setInterval(Number(e.target.value))}
                            className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-harvest/50"
                        />
                        <p className="text-[11px] text-muted-foreground">
                            How often the ghost scraper runs in the background.
                        </p>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border">
                        <div className="space-y-0.5">
                            <label className="text-sm font-medium text-foreground">Desktop Notifications</label>
                            <p className="text-[11px] text-muted-foreground">
                                Notify when jobs are found
                            </p>
                        </div>
                        <button
                            onClick={() => setNotifications(!notifications)}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-harvest focus:ring-offset-2 focus:ring-offset-background ${notifications ? "bg-harvest" : "bg-muted"
                                }`}
                        >
                            <span
                                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition duration-200 ease-in-out ${notifications ? "translate-x-4.5" : "translate-x-1"
                                    }`}
                            />
                        </button>
                    </div>

                    <button
                        onClick={handleSave}
                        className="w-full mt-4 py-2 px-4 rounded-lg bg-harvest hover:bg-harvest-hover text-white font-semibold text-sm transition-colors"
                    >
                        Save Configuration
                    </button>

                    {status && (
                        <p className="text-center text-sm text-green-400 mt-2 animate-fade-in">
                            {status}
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Options
