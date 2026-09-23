// app/lab/notes/[id]/page.tsx
'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthContext'
import { usePermissions } from '@/components/auth/hooks/usePermissions'
import { BlockEditor } from '../components/BlockEditor'
import {
    ArrowLeft, Globe, Lock, Star, Pin, Trash2, Tag, X,
    Check, Loader2, MoreHorizontal, AlertCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const CATEGORIES = ['Learning', 'Ideas', 'Todo', 'Reference', 'Personal', 'Work'] as const
type Category = typeof CATEGORIES[number]

const COLORS = [
    { id: 'default', bg: 'bg-zinc-400' },
    { id: 'yellow', bg: 'bg-amber-400' },
    { id: 'green', bg: 'bg-emerald-400' },
    { id: 'blue', bg: 'bg-sky-400' },
    { id: 'purple', bg: 'bg-purple-400' },
    { id: 'pink', bg: 'bg-pink-400' },
    { id: 'orange', bg: 'bg-orange-400' },
] as const

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

export default function NoteEditorPage() {
    const params = useParams()
    const router = useRouter()
    const { user } = useAuth()
    const { canEdit, canDelete, canPin, canCurate, canChangeVisibility } = usePermissions()

    const [note, setNote] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)

    // Editable fields
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [icon, setIcon] = useState('')
    const [category, setCategory] = useState<Category>('Learning')
    const [visibility, setVisibility] = useState<'private' | 'public'>('private')
    const [color, setColor] = useState('default')
    const [tags, setTags] = useState<string[]>([])
    const [tagInput, setTagInput] = useState('')
    const [isPinned, setIsPinned] = useState(false)
    const [isCurated, setIsCurated] = useState(false)

    // UI state
    const [saveState, setSaveState] = useState<SaveState>('idle')
    const [showMeta, setShowMeta] = useState(false)
    const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
    const isAuthor = !!(user?._id && note?.authorId && user._id.toString() === note.authorId.toString())
    const canEditNote = note ? canEdit(note.authorId) : false

    // Load note
    useEffect(() => {
        const id = params.id as string
        if (!id) return

        fetch(`/api/notes/${id}`)
            .then(r => r.json())
            .then(data => {
                if (data.note) {
                    const n = data.note
                    setNote(n)
                    setTitle(n.title || '')
                    setContent(n.content || '')
                    setIcon(n.icon || '')
                    setCategory(n.category || 'Learning')
                    setVisibility(n.visibility || 'private')
                    setColor(n.color || 'default')
                    setTags(n.tags || [])
                    setIsPinned(!!n.isPinned)
                    setIsCurated(!!n.isCurated)
                } else {
                    setNotFound(true)
                }
            })
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false))
    }, [params.id])

    // Debounced auto-save
    const save = useCallback(async (patch: Record<string, any>) => {
        if (!note?.id) return
        setSaveState('saving')
        try {
            const res = await fetch(`/api/notes/${note.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(patch),
            })
            if (res.ok) {
                setSaveState('saved')
                setTimeout(() => setSaveState('idle'), 2000)
            } else {
                setSaveState('error')
            }
        } catch {
            setSaveState('error')
        }
    }, [note?.id])

    const scheduleAutoSave = useCallback((patch: Record<string, any>) => {
        if (saveTimer.current) clearTimeout(saveTimer.current)
        saveTimer.current = setTimeout(() => save(patch), 1500)
    }, [save])

    const handleContentChange = (html: string) => {
        setContent(html)
        scheduleAutoSave({ content: html })
    }

    const handleTitleBlur = () => {
        if (title !== note?.title) scheduleAutoSave({ title })
    }

    const toggleVisibility = () => {
        const next = visibility === 'public' ? 'private' : 'public'
        setVisibility(next)
        save({ visibility: next })
    }

    const togglePin = () => {
        const next = !isPinned
        setIsPinned(next)
        save({ isPinned: next })
    }

    const toggleCurate = () => {
        const next = !isCurated
        setIsCurated(next)
        save({ isCurated: next })
    }

    const handleDelete = async () => {
        if (!confirm('Move this note to trash?')) return
        const res = await fetch(`/api/notes/${note.id}`, { method: 'DELETE' })
        if (res.ok) router.push('/lab/notes')
    }

    const handleAddTag = () => {
        const t = tagInput.trim().replace(/^#/, '')
        if (t && !tags.includes(t)) {
            const next = [...tags, t]
            setTags(next)
            setTagInput('')
            save({ tags: next })
        }
    }

    const handleRemoveTag = (tag: string) => {
        const next = tags.filter(t => t !== tag)
        setTags(next)
        save({ tags: next })
    }

    const handleColorChange = (c: string) => {
        setColor(c)
        save({ color: c })
    }

    const handleCategoryChange = (c: Category) => {
        setCategory(c)
        save({ category: c })
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-background">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (notFound) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-background gap-4">
                <AlertCircle className="w-10 h-10 text-muted-foreground" />
                <p className="text-muted-foreground">Note not found or you don&apos;t have access.</p>
                <Button variant="ghost" onClick={() => router.push('/lab/notes')}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Notes
                </Button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Top Bar */}
            <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-2 border-b border-border/40 bg-background/80 backdrop-blur-md">
                {/* Left: back + breadcrumb */}
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push('/lab/notes')}
                        className="h-7 px-2 text-muted-foreground hover:text-foreground gap-1.5"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Notes
                    </Button>
                    <span className="text-border/60">·</span>
                    <span className="text-xs text-muted-foreground truncate max-w-[200px]">{title || 'Untitled'}</span>
                </div>

                {/* Right: save indicator + actions */}
                <div className="flex items-center gap-1.5">
                    {/* Auto-save indicator */}
                    <span className={cn(
                        'text-xs transition-all duration-300 mr-2',
                        saveState === 'saving' && 'text-muted-foreground',
                        saveState === 'saved' && 'text-emerald-500',
                        saveState === 'error' && 'text-destructive',
                        saveState === 'idle' && 'opacity-0',
                    )}>
                        {saveState === 'saving' && 'Saving...'}
                        {saveState === 'saved' && '✓ Saved'}
                        {saveState === 'error' && 'Failed to save'}
                    </span>

                    {canEditNote && (
                        <>
                            {/* Visibility */}
                            {canChangeVisibility(note.authorId) && (
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={toggleVisibility} title={visibility === 'public' ? 'Public' : 'Private'}>
                                    {visibility === 'public' ? <Globe className="w-3.5 h-3.5 text-emerald-500" /> : <Lock className="w-3.5 h-3.5" />}
                                </Button>
                            )}
                            {/* Pin */}
                            {canPin && (
                                <Button variant="ghost" size="icon" className={cn('h-7 w-7', isPinned ? 'text-amber-500' : 'text-muted-foreground hover:text-foreground')} onClick={togglePin}>
                                    <Pin className={cn('w-3.5 h-3.5', isPinned && 'fill-current')} />
                                </Button>
                            )}
                            {/* Curate */}
                            {canCurate && (
                                <Button variant="ghost" size="icon" className={cn('h-7 w-7', isCurated ? 'text-amber-500' : 'text-muted-foreground hover:text-foreground')} onClick={toggleCurate}>
                                    <Star className={cn('w-3.5 h-3.5', isCurated && 'fill-current')} />
                                </Button>
                            )}
                            {/* More options */}
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => setShowMeta(p => !p)}>
                                <MoreHorizontal className="w-3.5 h-3.5" />
                            </Button>
                            {/* Delete */}
                            {canDelete(note.authorId) && (
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={handleDelete}>
                                    <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                            )}
                        </>
                    )}
                </div>
            </header>

            {/* Metadata bar (toggleable) */}
            {showMeta && canEditNote && (
                <div className="border-b border-border/40 bg-muted/10 px-8 py-3 flex flex-wrap items-center gap-6">
                    {/* Category */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground font-medium">Category</span>
                        <div className="flex gap-1 flex-wrap">
                            {CATEGORIES.map(c => (
                                <button
                                    key={c}
                                    onClick={() => handleCategoryChange(c)}
                                    className={cn(
                                        'text-[11px] px-2 py-0.5 rounded font-medium transition-colors border',
                                        category === c
                                            ? 'bg-primary/10 text-primary border-primary/30'
                                            : 'text-muted-foreground border-border/40 hover:bg-muted/30'
                                    )}
                                >{c}</button>
                            ))}
                        </div>
                    </div>

                    {/* Color */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground font-medium">Color</span>
                        <div className="flex gap-1">
                            {COLORS.map(c => (
                                <button
                                    key={c.id}
                                    onClick={() => handleColorChange(c.id)}
                                    className={cn(
                                        'w-4 h-4 rounded-full transition-transform',
                                        c.bg,
                                        color === c.id && 'ring-2 ring-offset-1 ring-primary scale-110'
                                    )}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <Tag className="w-3.5 h-3.5 text-muted-foreground" />
                        {tags.map(tag => (
                            <span key={tag} className="inline-flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded bg-muted/40 border border-border/40 text-muted-foreground">
                                #{tag}
                                <button onClick={() => handleRemoveTag(tag)} className="hover:text-destructive">
                                    <X className="w-2.5 h-2.5" />
                                </button>
                            </span>
                        ))}
                        <input
                            value={tagInput}
                            onChange={e => setTagInput(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); handleAddTag() }
                            }}
                            placeholder="Add tag..."
                            className="text-xs bg-transparent border-none outline-none text-muted-foreground placeholder:text-muted-foreground/40 w-20"
                        />
                        {tagInput && (
                            <button onClick={handleAddTag} className="text-primary">
                                <Check className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Editor Canvas */}
            <main className="flex-1 max-w-4xl w-full mx-auto px-6 md:px-12 py-10">
                {/* Icon picker */}
                {canEditNote ? (
                    <input
                        value={icon}
                        onChange={e => { setIcon(e.target.value); scheduleAutoSave({ icon: e.target.value }) }}
                        placeholder="📄"
                        className="text-5xl bg-transparent border-none outline-none mb-4 w-16 cursor-text"
                        maxLength={2}
                    />
                ) : (
                    icon && <div className="text-5xl mb-4">{icon}</div>
                )}

                {/* Title */}
                {canEditNote ? (
                    <div
                        contentEditable
                        suppressContentEditableWarning
                        onInput={e => setTitle((e.target as HTMLDivElement).innerText)}
                        onBlur={handleTitleBlur}
                        data-placeholder="Untitled"
                        className={cn(
                            'text-4xl font-bold text-foreground leading-tight mb-8 outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/30',
                            'break-words'
                        )}
                        dangerouslySetInnerHTML={{ __html: title }}
                    />
                ) : (
                    <h1 className="text-4xl font-bold text-foreground leading-tight mb-8">{title || 'Untitled'}</h1>
                )}

                {/* Block Editor */}
                <BlockEditor
                    content={content}
                    onChange={canEditNote ? handleContentChange : undefined}
                    readOnly={!canEditNote}
                />
            </main>
        </div>
    )
}
