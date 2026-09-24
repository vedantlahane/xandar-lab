import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'
import { useState } from 'react'
import { Play, Loader2, ChevronDown, ChevronRight, Server } from 'lucide-react'
import { cn } from '@/lib/utils'

function ApiTesterNodeView({ node, updateAttributes, editor }: any) {
    const [method, setMethod] = useState(node.attrs.method || 'GET')
    const [url, setUrl] = useState(node.attrs.url || 'https://jsonplaceholder.typicode.com/todos/1')
    const [headers, setHeaders] = useState(node.attrs.headers || '{\n  "Content-Type": "application/json"\n}')
    const [body, setBody] = useState(node.attrs.body || '')
    
    const [response, setResponse] = useState<any>(null)
    const [status, setStatus] = useState<number | null>(null)
    const [time, setTime] = useState<number | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [expanded, setExpanded] = useState(true)

    const isEditable = editor.isEditable

    const handleSend = async () => {
        if (!url) return
        setLoading(true)
        setError(null)
        setResponse(null)
        setStatus(null)
        setTime(null)
        
        const start = performance.now()
        try {
            let parsedHeaders = {}
            try {
                parsedHeaders = headers ? JSON.parse(headers) : {}
            } catch (e) {
                throw new Error("Invalid JSON in headers")
            }

            const options: RequestInit = {
                method,
                headers: parsedHeaders,
            }

            if (method !== 'GET' && method !== 'HEAD' && body) {
                options.body = body
            }

            const res = await fetch(url, options)
            setStatus(res.status)
            
            const contentType = res.headers.get('content-type')
            if (contentType && contentType.includes('application/json')) {
                const data = await res.json()
                setResponse(JSON.stringify(data, null, 2))
            } else {
                const text = await res.text()
                setResponse(text)
            }
        } catch (err: any) {
            setError(err.message || "Failed to fetch")
        } finally {
            setTime(Math.round(performance.now() - start))
            setLoading(false)
            // Persist the request data so it saves in the document
            updateAttributes({ method, url, headers, body })
        }
    }

    const methodColors: Record<string, string> = {
        GET: 'text-blue-500 bg-blue-500/10',
        POST: 'text-green-500 bg-green-500/10',
        PUT: 'text-amber-500 bg-amber-500/10',
        DELETE: 'text-red-500 bg-red-500/10',
        PATCH: 'text-purple-500 bg-purple-500/10',
    }

    return (
        <NodeViewWrapper className="my-4 relative" data-drag-handle="false">
            <div className="border border-border/60 rounded-xl overflow-hidden bg-background shadow-sm">
                {/* Header */}
                <div className="bg-muted/40 border-b border-border/50 px-3 py-2 flex items-center justify-between">
                    <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
                        {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        <Server className="w-4 h-4" />
                        API Request
                    </button>
                    {!expanded && status && (
                        <span className={cn("text-xs font-mono px-2 py-0.5 rounded", status >= 200 && status < 300 ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500")}>
                            {status}
                        </span>
                    )}
                </div>

                {expanded && (
                    <div className="p-4 space-y-4">
                        {/* URL Bar */}
                        <div className="flex gap-2">
                            <select 
                                value={method} 
                                onChange={e => setMethod(e.target.value)}
                                disabled={!isEditable}
                                className={cn("px-3 py-2 rounded-lg text-sm font-bold border border-border/50 outline-none appearance-none cursor-pointer", methodColors[method] || "text-foreground bg-muted")}
                            >
                                <option>GET</option>
                                <option>POST</option>
                                <option>PUT</option>
                                <option>PATCH</option>
                                <option>DELETE</option>
                            </select>
                            <input 
                                type="text"
                                placeholder="https://api.example.com/v1/users"
                                value={url}
                                onChange={e => setUrl(e.target.value)}
                                readOnly={!isEditable}
                                className="flex-1 px-3 py-2 rounded-lg bg-muted/20 border border-border/50 text-sm font-mono outline-none focus:border-primary transition-colors"
                            />
                            <button 
                                onClick={handleSend}
                                disabled={loading || !url}
                                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 disabled:opacity-50 transition-colors"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                                Send
                            </button>
                        </div>

                        {/* Request Body & Headers (Only show if editable or if they have content) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {(isEditable || headers !== '{}') && (
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Headers (JSON)</label>
                                    <textarea 
                                        value={headers}
                                        onChange={e => setHeaders(e.target.value)}
                                        readOnly={!isEditable}
                                        className="w-full h-24 p-2.5 text-xs font-mono bg-muted/30 border border-border/50 rounded-lg outline-none focus:border-primary resize-y"
                                        placeholder='{\n  "Authorization": "Bearer token"\n}'
                                    />
                                </div>
                            )}
                            {(isEditable || body) && (method === 'POST' || method === 'PUT' || method === 'PATCH') && (
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Body</label>
                                    <textarea 
                                        value={body}
                                        onChange={e => setBody(e.target.value)}
                                        readOnly={!isEditable}
                                        className="w-full h-24 p-2.5 text-xs font-mono bg-muted/30 border border-border/50 rounded-lg outline-none focus:border-primary resize-y"
                                        placeholder='{\n  "key": "value"\n}'
                                    />
                                </div>
                            )}
                        </div>

                        {/* Response */}
                        {(response || error || loading) && (
                            <div className="mt-4 pt-4 border-t border-border/50 space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Response</label>
                                    {status && (
                                        <div className="flex items-center gap-3 text-xs font-mono">
                                            <span className={status >= 200 && status < 300 ? "text-emerald-500" : "text-red-500"}>
                                                Status: {status}
                                            </span>
                                            {time && <span className="text-muted-foreground">Time: {time}ms</span>}
                                        </div>
                                    )}
                                </div>
                                <div className="relative rounded-lg border border-border/50 overflow-hidden bg-zinc-950 dark:bg-zinc-950">
                                    {loading ? (
                                        <div className="h-32 flex items-center justify-center">
                                            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                                        </div>
                                    ) : error ? (
                                        <div className="p-4 text-sm font-mono text-red-400 whitespace-pre-wrap">
                                            Error: {error}
                                        </div>
                                    ) : (
                                        <textarea
                                            readOnly
                                            value={response}
                                            className="w-full h-48 max-h-[400px] p-4 text-sm font-mono bg-transparent text-emerald-400 outline-none resize-y"
                                        />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </NodeViewWrapper>
    )
}

export const ApiTesterExtension = Node.create({
    name: 'apiTester',
    group: 'block',
    atom: true,

    addAttributes() {
        return {
            method: { default: 'GET' },
            url: { default: 'https://jsonplaceholder.typicode.com/todos/1' },
            headers: { default: '{\n  "Content-Type": "application/json"\n}' },
            body: { default: '' },
        }
    },

    parseHTML() {
        return [{ tag: 'api-tester' }]
    },

    renderHTML({ HTMLAttributes }) {
        return ['api-tester', mergeAttributes(HTMLAttributes)]
    },

    addNodeView() {
        return ReactNodeViewRenderer(ApiTesterNodeView)
    },
})
