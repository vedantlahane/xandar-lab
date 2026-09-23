'use client'

import { useState, useEffect } from 'react'
import { Link2, Loader2, StickyNote } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

export function BacklinksSection({ noteId }: { noteId: string }) {
    const router = useRouter()
    const [backlinks, setBacklinks] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!noteId || noteId.startsWith('note-')) {
            setLoading(false)
            return
        }
        fetch(`/api/notes/${noteId}/backlinks`)
            .then(res => res.json())
            .then(data => {
                if (data.backlinks) setBacklinks(data.backlinks)
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [noteId])

    if (noteId.startsWith('note-') || (backlinks.length === 0 && !loading)) {
        return null
    }

    return (
        <div className="mt-8 pt-8 border-t border-border/40 pb-8">
            <h3 className="text-sm font-semibold flex items-center gap-2 mb-4 text-foreground">
                <Link2 className="w-4 h-4 text-muted-foreground" />
                Backlinks ({backlinks.length})
            </h3>
            
            {loading ? (
                <div className="flex items-center gap-2 text-xs text-muted-foreground"><Loader2 className="w-3 h-3 animate-spin"/> Loading backlinks...</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {backlinks.map(n => (
                        <button key={n.id} onClick={() => router.push(`/lab/notes/${n.id}`)}
                            className="flex items-center gap-3 p-3 text-left rounded-xl border border-border/40 bg-muted/10 hover:bg-muted/30 hover:border-primary/30 transition-all group">
                            {n.icon ? (
                                <span className="text-xl">{n.icon}</span>
                            ) : (
                                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", 
                                    n.color === 'yellow' ? 'bg-amber-500/10 text-amber-500' :
                                    n.color === 'green' ? 'bg-emerald-500/10 text-emerald-500' :
                                    n.color === 'blue' ? 'bg-sky-500/10 text-sky-500' :
                                    n.color === 'purple' ? 'bg-purple-500/10 text-purple-500' :
                                    n.color === 'pink' ? 'bg-pink-500/10 text-pink-500' :
                                    n.color === 'orange' ? 'bg-orange-500/10 text-orange-500' :
                                    'bg-zinc-500/10 text-zinc-500'
                                )}>
                                    <StickyNote className="w-4 h-4" />
                                </div>
                            )}
                            <div className="min-w-0 flex-1">
                                <div className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">{n.title || 'Untitled'}</div>
                                <div className="text-[10px] text-muted-foreground mt-0.5">{n.category}</div>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
