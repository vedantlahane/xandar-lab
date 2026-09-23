'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth/AuthContext'
import { Button } from '@/components/ui/button'
import { Loader2, MessageSquare, Send } from 'lucide-react'

export function CommentsSection({ noteId }: { noteId: string }) {
    const { user } = useAuth()
    const [comments, setComments] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [content, setContent] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (!noteId || noteId.startsWith('note-')) {
            setLoading(false)
            return // Skip comments for static notes
        }
        fetch(`/api/notes/${noteId}/comments`)
            .then(res => res.json())
            .then(data => {
                if (data.comments) setComments(data.comments)
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [noteId])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!content.trim() || !user) return
        
        setIsSubmitting(true)
        try {
            const res = await fetch(`/api/notes/${noteId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content })
            })
            if (res.ok) {
                const { comment } = await res.json()
                setComments(prev => [...prev, comment])
                setContent('')
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    if (noteId.startsWith('note-')) return null

    return (
        <div className="mt-16 pt-8 border-t border-border/40 pb-16">
            <h3 className="text-sm font-semibold flex items-center gap-2 mb-6 text-foreground">
                <MessageSquare className="w-4 h-4" />
                Discussion ({comments.length})
            </h3>
            
            <div className="space-y-6 mb-8">
                {loading ? (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground"><Loader2 className="w-3 h-3 animate-spin"/> Loading comments...</div>
                ) : comments.length === 0 ? (
                    <p className="text-sm text-muted-foreground/50">No comments yet. Start the conversation!</p>
                ) : (
                    comments.map(c => (
                        <div key={c._id} className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-xs shrink-0">
                                {c.authorUsername.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-medium">{c.authorUsername}</span>
                                    <span className="text-xs text-muted-foreground/60">{new Date(c.createdAt).toLocaleDateString()}</span>
                                </div>
                                <p className="text-sm text-foreground/80 whitespace-pre-wrap">{c.content}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {user ? (
                <form onSubmit={handleSubmit} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-xs shrink-0">
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 flex gap-2">
                        <textarea
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            placeholder="Add a comment..."
                            className="flex-1 min-h-[40px] max-h-32 p-3 text-sm bg-muted/20 border border-border/50 rounded-xl resize-y focus:outline-none focus:ring-2 focus:ring-primary/20"
                            rows={1}
                        />
                        <Button type="submit" disabled={!content.trim() || isSubmitting} size="icon" className="h-10 w-10 shrink-0 rounded-xl">
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        </Button>
                    </div>
                </form>
            ) : (
                <div className="p-4 rounded-xl bg-muted/20 border border-border/40 text-center text-sm text-muted-foreground">
                    Please log in to leave a comment.
                </div>
            )}
        </div>
    )
}
