'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Loader2, StickyNote, Hash, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

export function GlobalSearch() {
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const inputRef = useRef<HTMLInputElement>(null)

    // Cmd+K to open
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen(true)
            }
        }
        document.addEventListener('keydown', down)
        return () => document.removeEventListener('keydown', down)
    }, [])

    useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 100)
        } else {
            setQuery('')
            setResults([])
        }
    }, [open])

    useEffect(() => {
        if (!query.trim()) {
            setResults([])
            return
        }

        const timer = setTimeout(async () => {
            setLoading(true)
            try {
                const res = await fetch(`/api/notes/search?q=${encodeURIComponent(query)}`)
                if (res.ok) {
                    const data = await res.json()
                    setResults(data.notes || [])
                }
            } finally {
                setLoading(false)
            }
        }, 300)

        return () => clearTimeout(timer)
    }, [query])

    if (!open) return null

    return (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[10vh] px-4">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setOpen(false)} />
            
            <div className="relative w-full max-w-2xl bg-background border border-border/50 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center px-4 py-3 border-b border-border/40">
                    <Search className="w-5 h-5 text-muted-foreground mr-3 shrink-0" />
                    <input
                        ref={inputRef}
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Search notes globally..."
                        className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground/50 text-lg"
                        onKeyDown={e => {
                            if (e.key === 'Escape') setOpen(false)
                        }}
                    />
                    {loading && <Loader2 className="w-4 h-4 text-muted-foreground animate-spin ml-3" />}
                    <div className="hidden sm:flex items-center gap-1 ml-4 text-[10px] font-mono text-muted-foreground/50">
                        <kbd className="px-1.5 py-0.5 rounded bg-muted">ESC</kbd> to close
                    </div>
                </div>

                <div className="max-h-[60vh] overflow-y-auto p-2">
                    {!query.trim() ? (
                        <div className="p-8 text-center text-muted-foreground/50 text-sm">
                            Type to search across all your notes, tags, and content.
                        </div>
                    ) : results.length === 0 && !loading ? (
                        <div className="p-8 text-center text-muted-foreground/50 text-sm">
                            No notes found matching "{query}"
                        </div>
                    ) : (
                        <div className="flex flex-col gap-1">
                            {results.map(note => (
                                <button
                                    key={note._id || note.id}
                                    onClick={() => {
                                        setOpen(false)
                                        router.push(`/lab/notes/${note._id || note.id}`)
                                    }}
                                    className="flex flex-col text-left px-4 py-3 rounded-lg hover:bg-primary/5 hover:text-primary transition-colors border border-transparent hover:border-primary/10 group"
                                >
                                    <div className="flex items-center justify-between w-full mb-1">
                                        <div className="flex items-center gap-2 font-medium">
                                            {note.icon ? <span>{note.icon}</span> : <StickyNote className="w-4 h-4 text-primary" />}
                                            {note.title}
                                        </div>
                                        <div className="text-xs text-muted-foreground/50 flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(note.updatedAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    {note.content && (
                                        <p className="text-xs text-muted-foreground/70 line-clamp-2 pl-6 group-hover:text-primary/70">
                                            {note.content.replace(/<[^>]*>?/gm, '').substring(0, 150)}...
                                        </p>
                                    )}
                                    {note.tags && note.tags.length > 0 && (
                                        <div className="flex items-center gap-2 pl-6 mt-2">
                                            <Hash className="w-3 h-3 text-muted-foreground/40" />
                                            <div className="flex gap-1">
                                                {note.tags.slice(0, 3).map((t: string) => (
                                                    <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{t}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
