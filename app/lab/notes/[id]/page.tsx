// app/lab/notes/[id]/page.tsx
'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthContext'
import { usePermissions } from '@/components/auth/hooks/usePermissions'
import { BlockEditor, TocEntry } from '../components/BlockEditor'
import { TableOfContents } from '../components/TableOfContents'
import { CommentsSection } from '../components/CommentsSection'
import { TemplatesGallery } from '../components/TemplatesGallery'
import { BacklinksSection } from '../components/BacklinksSection'
import {
    ArrowLeft, Globe, Lock, Star, Pin, Trash2, Tag, X,
    Check, Loader2, MoreHorizontal, AlertCircle, Maximize2, Minimize2,
    BookOpen, Download, Keyboard, Image as ImageIcon, ChevronLeft, Plus
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const CATEGORIES = ['Learning', 'Ideas', 'Todo', 'Reference', 'Personal', 'Work'] as const
type Category = typeof CATEGORIES[number]

const COLORS = [
    { id: 'default', bg: 'bg-zinc-400' },
    { id: 'yellow',  bg: 'bg-amber-400' },
    { id: 'green',   bg: 'bg-emerald-400' },
    { id: 'blue',    bg: 'bg-sky-400' },
    { id: 'purple',  bg: 'bg-purple-400' },
    { id: 'pink',    bg: 'bg-pink-400' },
    { id: 'orange',  bg: 'bg-orange-400' },
] as const

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

const SHORTCUTS = [
    { keys: 'Ctrl + B', label: 'Bold' },
    { keys: 'Ctrl + I', label: 'Italic' },
    { keys: 'Ctrl + U', label: 'Underline' },
    { keys: 'Ctrl + K', label: 'Insert Link' },
    { keys: 'Ctrl + Z', label: 'Undo' },
    { keys: 'Ctrl + Shift + Z', label: 'Redo' },
    { keys: '/', label: 'Open block menu' },
    { keys: '# Space', label: 'Heading 1' },
    { keys: '## Space', label: 'Heading 2' },
    { keys: '### Space', label: 'Heading 3' },
    { keys: '- Space', label: 'Bullet list' },
    { keys: '1. Space', label: 'Numbered list' },
    { keys: '[] Space', label: 'Task list' },
    { keys: '> Space', label: 'Blockquote' },
    { keys: '``` Enter', label: 'Code block' },
    { keys: '--- Enter', label: 'Divider' },
    { keys: 'Ctrl+Shift+C', label: 'Callout block' },
]

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
    const [coverImage, setCoverImage] = useState('')
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
    const [showToc, setShowToc] = useState(false)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [showShortcuts, setShowShortcuts] = useState(false)
    const [showTemplates, setShowTemplates] = useState(false)
    const [tocItems, setTocItems] = useState<TocEntry[]>([])
    const [isUploadingCover, setIsUploadingCover] = useState(false)

    const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
    const coverInputRef = useRef<HTMLInputElement>(null)
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
                    setCoverImage(n.coverImage || '')
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

    // Fullscreen: hide top nav
    useEffect(() => {
        const nav = document.querySelector('nav') as HTMLElement | null
        if (nav) nav.style.display = isFullscreen ? 'none' : ''
        return () => { if (nav) nav.style.display = '' }
    }, [isFullscreen])

    // Esc to exit fullscreen
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isFullscreen) setIsFullscreen(false)
        }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [isFullscreen])

    const save = useCallback(async (patch: Record<string, any>) => {
        if (!note?.id) return
        setSaveState('saving')
        try {
            const res = await fetch(`/api/notes/${note.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(patch),
            })
            setSaveState(res.ok ? 'saved' : 'error')
            if (res.ok) setTimeout(() => setSaveState('idle'), 2000)
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

    const handleTitleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
        const newTitle = e.currentTarget.innerText
        if (newTitle !== note?.title) save({ title: newTitle })
    }

    const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setIsUploadingCover(true)
        const fd = new FormData()
        fd.append('file', file)
        try {
            const res = await fetch('/api/upload', { method: 'POST', body: fd })
            if (res.ok) {
                const data = await res.json()
                setCoverImage(data.url)
                save({ coverImage: data.url })
            }
        } finally {
            setIsUploadingCover(false)
            if (coverInputRef.current) coverInputRef.current.value = ''
        }
    }

    const handleExportMarkdown = async () => {
        try {
            const TurndownService = (await import('turndown')).default
            // @ts-ignore
            const { gfm } = await import('turndown-plugin-gfm')
            
            const turndownService = new TurndownService({
                headingStyle: 'atx',
                codeBlockStyle: 'fenced',
                bulletListMarker: '-',
            })
            turndownService.use(gfm)
            
            const markdown = turndownService.turndown(content || '')
            const fullMd = `# ${title || 'Untitled'}\n\n${markdown}`
            
            const blob = new Blob([fullMd], { type: 'text/markdown' })
            const a = document.createElement('a')
            a.href = URL.createObjectURL(blob)
            a.download = `${title || 'note'}.md`
            a.click()
        } catch (e) {
            console.error('Failed to export markdown:', e)
        }
    }

    const handleExportHTML = () => {
        const fullHtml = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>${title || 'Untitled'}</title>
    <style>
        body { font-family: system-ui, sans-serif; line-height: 1.6; max-w-3xl; margin: 0 auto; padding: 2rem; }
        img { max-width: 100%; height: auto; }
        pre { background: #f4f4f4; padding: 1rem; border-radius: 4px; overflow-x: auto; }
        code { font-family: monospace; }
        blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 1rem; color: #666; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    </style>
</head>
<body>
    <h1>${title || 'Untitled'}</h1>
    ${content}
</body>
</html>`
        const blob = new Blob([fullHtml], { type: 'text/html' })
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = `${title || 'note'}.html`
        a.click()
    }

    const handleExportPDF = () => {
        // We use window.print() and CSS @media print to style it
        window.print()
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
        <div className={cn('min-h-screen bg-background flex flex-col', isFullscreen && 'fixed inset-0 z-[100]')}>
            {/* Top Bar */}
            <header className="print:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-2 border-b border-border/40 bg-background/90 backdrop-blur-md">
                <div className="flex items-center gap-3 min-w-0">
                    <Button variant="ghost" size="sm" onClick={() => router.push('/lab/notes')}
                        className="h-7 px-2 text-muted-foreground hover:text-foreground gap-1.5 shrink-0">
                        <ChevronLeft className="w-3.5 h-3.5" />
                        Notes
                    </Button>
                    {note?.parentId && (
                        <>
                            <span className="text-border/60 shrink-0">/</span>
                            <button onClick={() => router.push(`/lab/notes/${note.parentId._id}`)}
                                className="text-xs text-muted-foreground hover:text-foreground truncate max-w-[120px] transition-colors">
                                {note.parentId.title}
                            </button>
                        </>
                    )}
                    <span className="text-border/60 shrink-0">/</span>
                    <span className="text-xs text-foreground truncate max-w-[160px] hidden sm:block font-medium">{title || 'Untitled'}</span>
                </div>

                <div className="flex items-center gap-0.5">
                    {/* Save indicator */}
                    <span className={cn('text-xs transition-all mr-2',
                        saveState === 'saving' && 'text-muted-foreground',
                        saveState === 'saved'  && 'text-emerald-500',
                        saveState === 'error'  && 'text-destructive',
                        saveState === 'idle'   && 'opacity-0 pointer-events-none',
                    )}>
                        {saveState === 'saving' && 'Saving...'}
                        {saveState === 'saved'  && '✓ Saved'}
                        {saveState === 'error'  && 'Save failed'}
                    </span>

                    {/* TOC toggle */}
                    <Button variant="ghost" size="icon" className={cn('h-7 w-7', showToc ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground')}
                        onClick={() => setShowToc(p => !p)} title="Table of Contents">
                        <BookOpen className="w-3.5 h-3.5" />
                    </Button>

                    {/* Fullscreen */}
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground"
                        onClick={() => setIsFullscreen(p => !p)} title={isFullscreen ? 'Exit fullscreen (Esc)' : 'Fullscreen'}>
                        {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                    </Button>

                    {/* Export Dropdown */}
                    <div className="relative group">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" title="Export">
                            <Download className="w-3.5 h-3.5" />
                        </Button>
                        <div className="absolute right-0 top-full mt-1 hidden group-hover:flex flex-col bg-background border border-border/50 rounded-lg shadow-xl overflow-hidden z-50 min-w-[120px]">
                            <button onClick={handleExportMarkdown} className="text-xs text-left px-3 py-2 hover:bg-muted/50 text-foreground transition-colors">Markdown (.md)</button>
                            <button onClick={handleExportHTML} className="text-xs text-left px-3 py-2 hover:bg-muted/50 text-foreground transition-colors">HTML (.html)</button>
                            <button onClick={handleExportPDF} className="text-xs text-left px-3 py-2 hover:bg-muted/50 text-foreground transition-colors">PDF (Print)</button>
                        </div>
                    </div>

                    {/* Shortcuts */}
                    <Button variant="ghost" size="icon" className={cn('h-7 w-7', showShortcuts ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground')}
                        onClick={() => setShowShortcuts(p => !p)} title="Keyboard shortcuts">
                        <Keyboard className="w-3.5 h-3.5" />
                    </Button>

                    {canEditNote && (
                        <>
                            {canChangeVisibility(note.authorId) && (
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                    onClick={() => { const n = visibility === 'public' ? 'private' : 'public'; setVisibility(n); save({ visibility: n }) }}>
                                    {visibility === 'public' ? <Globe className="w-3.5 h-3.5 text-emerald-500" /> : <Lock className="w-3.5 h-3.5" />}
                                </Button>
                            )}
                            {canPin && (
                                <Button variant="ghost" size="icon" className={cn('h-7 w-7', isPinned ? 'text-amber-500' : 'text-muted-foreground hover:text-foreground')}
                                    onClick={() => { const n = !isPinned; setIsPinned(n); save({ isPinned: n }) }}>
                                    <Pin className={cn('w-3.5 h-3.5', isPinned && 'fill-current')} />
                                </Button>
                            )}
                            {canCurate && (
                                <Button variant="ghost" size="icon" className={cn('h-7 w-7', isCurated ? 'text-amber-500' : 'text-muted-foreground hover:text-foreground')}
                                    onClick={() => { const n = !isCurated; setIsCurated(n); save({ isCurated: n }) }}>
                                    <Star className={cn('w-3.5 h-3.5', isCurated && 'fill-current')} />
                                </Button>
                            )}
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary"
                                onClick={async () => {
                                    const res = await fetch('/api/notes/new', {
                                        method: 'PUT',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ title: 'New Subpage', parentId: note.id })
                                    })
                                    if (res.ok) {
                                        const data = await res.json()
                                        router.push(`/lab/notes/${data.note.id}`)
                                    }
                                }} title="Create Subpage">
                                <Plus className="w-3.5 h-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className={cn('h-7 w-7', showMeta ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground')}
                                onClick={() => setShowMeta(p => !p)} title="Properties">
                                <MoreHorizontal className="w-3.5 h-3.5" />
                            </Button>
                            {canDelete(note.authorId) && (
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                    onClick={handleDelete}>
                                    <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                            )}
                        </>
                    )}
                </div>
            </header>

            {/* Shortcut Cheatsheet Panel */}
            {showShortcuts && (
                <div className="print:hidden border-b border-border/40 bg-muted/10 px-8 py-4">
                    <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-1.5">
                        {SHORTCUTS.map(s => (
                            <div key={s.keys} className="flex items-center justify-between gap-2 text-xs">
                                <span className="text-muted-foreground">{s.label}</span>
                                <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-muted/50 border border-border/40 text-muted-foreground whitespace-nowrap">{s.keys}</kbd>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Properties Panel */}
            {showMeta && canEditNote && (
                <div className="print:hidden border-b border-border/40 bg-muted/10 px-8 py-3 flex flex-wrap items-start gap-6">
                    {/* Cover image */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground font-medium">Cover</span>
                        <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
                        <button onClick={() => coverInputRef.current?.click()}
                            className="text-xs text-primary hover:underline flex items-center gap-1">
                            {isUploadingCover ? <Loader2 className="w-3 h-3 animate-spin" /> : <ImageIcon className="w-3 h-3" />}
                            {coverImage ? 'Change' : 'Add cover'}
                        </button>
                        {coverImage && (
                            <button onClick={() => { setCoverImage(''); save({ coverImage: '' }) }} className="text-xs text-muted-foreground hover:text-destructive">
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </div>

                    {/* Category */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-muted-foreground font-medium">Category</span>
                        <div className="flex gap-1 flex-wrap">
                            {CATEGORIES.map(c => (
                                <button key={c} onClick={() => { setCategory(c); save({ category: c }) }}
                                    className={cn('text-[11px] px-2 py-0.5 rounded font-medium transition-colors border',
                                        category === c ? 'bg-primary/10 text-primary border-primary/30' : 'text-muted-foreground border-border/40 hover:bg-muted/30')}>
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Color */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground font-medium">Color</span>
                        <div className="flex gap-1">
                            {COLORS.map(c => (
                                <button key={c.id} onClick={() => { setColor(c.id); save({ color: c.id }) }}
                                    className={cn('w-4 h-4 rounded-full transition-transform', c.bg, color === c.id && 'ring-2 ring-offset-1 ring-primary scale-110')} />
                            ))}
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <Tag className="w-3.5 h-3.5 text-muted-foreground" />
                        {tags.map(tag => (
                            <span key={tag} className="inline-flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded bg-muted/40 border border-border/40 text-muted-foreground">
                                #{tag}
                                <button onClick={() => handleRemoveTag(tag)} className="hover:text-destructive"><X className="w-2.5 h-2.5" /></button>
                            </span>
                        ))}
                        <input value={tagInput} onChange={e => setTagInput(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); handleAddTag() } }}
                            placeholder="Add tag..." className="text-xs bg-transparent border-none outline-none text-muted-foreground placeholder:text-muted-foreground/40 w-20" />
                        {tagInput && <button onClick={handleAddTag} className="text-primary"><Check className="w-3 h-3" /></button>}
                    </div>

                    {/* Templates Button */}
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setShowTemplates(true)}>
                            Choose Template
                        </Button>
                    </div>
                </div>
            )}
            
            {showTemplates && (
                <TemplatesGallery 
                    onSelect={(html) => {
                        setContent(html)
                        scheduleAutoSave({ content: html })
                    }}
                    onClose={() => setShowTemplates(false)}
                />
            )}

            {/* Main content area — splits into TOC + editor */}
            <div className="flex flex-1 overflow-hidden">
                {/* TOC Sidebar */}
                {showToc && (
                    <aside className="print:hidden w-52 shrink-0 border-r border-border/40 overflow-y-auto bg-muted/5 hidden md:block">
                        <div className="sticky top-0 px-3 pt-3 pb-1">
                            <p className="text-[10px] uppercase font-semibold tracking-widest text-muted-foreground/50">Outline</p>
                        </div>
                        <TableOfContents items={tocItems} />
                    </aside>
                )}

                {/* Editor canvas */}
                <main className="flex-1 overflow-y-auto">
                    {/* Cover image */}
                    {coverImage && (
                        <div className="relative w-full h-48 sm:h-64 overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                            {canEditNote && (
                                <button onClick={() => coverInputRef.current?.click()}
                                    className="absolute bottom-3 right-3 text-xs px-2 py-1 rounded bg-background/80 backdrop-blur border border-border/40 text-muted-foreground hover:text-foreground">
                                    Change cover
                                </button>
                            )}
                        </div>
                    )}

                    <div className="max-w-4xl w-full mx-auto px-6 md:px-12 py-10">
                        {/* Icon */}
                        {canEditNote ? (
                            <input value={icon} onChange={e => { setIcon(e.target.value); scheduleAutoSave({ icon: e.target.value }) }}
                                placeholder="📄" maxLength={2}
                                className="text-5xl bg-transparent border-none outline-none mb-4 w-16 cursor-text" />
                        ) : (
                            icon && <div className="text-5xl mb-4">{icon}</div>
                        )}

                        {/* Title */}
                        {canEditNote ? (
                            <div contentEditable suppressContentEditableWarning
                                onInput={e => setTitle((e.target as HTMLDivElement).innerText)}
                                onBlur={handleTitleBlur}
                                data-placeholder="Untitled"
                                className="text-4xl font-bold text-foreground leading-tight mb-8 outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/30 break-words"
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
                            onTocUpdate={setTocItems}
                        />

                        <BacklinksSection noteId={params.id as string} />
                        <CommentsSection noteId={params.id as string} />
                    </div>
                </main>
            </div>
        </div>
    )
}
