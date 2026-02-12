import { useState, useEffect } from "react"
import "./style.css"

function Options(): JSX.Element {
    const [endpoint, setEndpoint] = useState("http://localhost:3000/api/ingest/parse")
    const [autoTag, setAutoTag] = useState(true)
    const [status, setStatus] = useState("")

    useEffect(() => {
        chrome.storage.sync.get(["apiEndpoint", "autoTag"], (result) => {
            if (result.apiEndpoint) setEndpoint(result.apiEndpoint)
            if (result.autoTag !== undefined) setAutoTag(result.autoTag)
        })
    }, [])

    const handleSave = () => {
        chrome.storage.sync.set({ apiEndpoint: endpoint, autoTag }, () => {
            setStatus("Settings saved!")
            setTimeout(() => setStatus(""), 2000)
        })
    }

    return (
        <div className="min-h-screen bg-background text-foreground font-sans flex items-center justify-center p-8">
            <div className="w-full max-w-md bg-card border border-border rounded-xl p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                            <line x1="8" y1="21" x2="16" y2="21"></line>
                            <line x1="12" y1="17" x2="12" y2="21"></line>
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold">Clipper Settings</h1>
                        <p className="text-sm text-muted-foreground">Configure your extraction preferences</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">API Endpoint</label>
                        <input
                            type="text"
                            value={endpoint}
                            onChange={(e) => setEndpoint(e.target.value)}
                            className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                            placeholder="https://..."
                        />
                        <p className="text-[11px] text-muted-foreground">
                            The URL where captured jobs will be sent.
                        </p>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border">
                        <div className="space-y-0.5">
                            <label className="text-sm font-medium text-foreground">Auto-Tagging</label>
                            <p className="text-[11px] text-muted-foreground">
                                Automatically generate tags from content
                            </p>
                        </div>
                        <button
                            onClick={() => setAutoTag(!autoTag)}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${autoTag ? "bg-primary" : "bg-muted"
                                }`}
                        >
                            <span
                                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition duration-200 ease-in-out ${autoTag ? "translate-x-4.5" : "translate-x-1"
                                    }`}
                            />
                        </button>
                    </div>

                    <button
                        onClick={handleSave}
                        className="w-full mt-4 py-2 px-4 rounded-lg bg-primary hover:bg-primary-hover text-primary-foreground font-semibold text-sm transition-colors"
                    >
                        Save Changes
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
