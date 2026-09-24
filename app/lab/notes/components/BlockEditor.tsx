'use client'

import { useEditor, EditorContent, ReactNodeViewRenderer } from '@tiptap/react'
import { BubbleMenu } from '@tiptap/react/menus'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import ImageResize from 'tiptap-extension-resize-image'
import Link from '@tiptap/extension-link'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { CodeBlockComponent } from './CodeBlockComponent'
import Mention from '@tiptap/extension-mention'
import { MathExtension } from '@aarkue/tiptap-math-extension'
import 'katex/dist/katex.min.css'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { FontSize } from './extensions/FontSize'
import { MentionSuggestion } from './MentionSuggestion'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { Underline } from '@tiptap/extension-underline'
import { Highlight } from '@tiptap/extension-highlight'
import { TextAlign } from '@tiptap/extension-text-align'
import CharacterCount from '@tiptap/extension-character-count'
import TableOfContentsExtension from '@tiptap/extension-table-of-contents'
import { Color } from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import Youtube from '@tiptap/extension-youtube'
import FontFamily from '@tiptap/extension-font-family'
import { common, createLowlight } from 'lowlight'
import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import {
    Image as ImageIcon, Loader2, Bold, Italic, Strikethrough, Link as LinkIcon,
    Underline as UnderlineIcon, Highlighter, AlignLeft, AlignCenter, AlignRight, AlignJustify, Quote,
    Superscript as SuperscriptIcon, Subscript as SubscriptIcon, Code, Undo, Redo, Smile,
    Table as TableIcon, Eraser, Sigma, SquareTerminal, Ban, Minus,
    Youtube as YoutubeIcon, Info, Maximize2, Minimize2,
    Columns, Rows, Trash2, FlipVertical, FlipHorizontal, Merge, Split,
    Search, X as XIcon, ChevronUp, ChevronDown, FlaskConical, Workflow, Server
} from 'lucide-react'
import { SlashCommand, getSuggestionItems, renderItems } from './SlashCommand'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { HexColorPicker } from "react-colorful"
import { CalloutExtension } from './CalloutExtension'
import { ChemicalExtension } from './ChemicalExtension'
import { MermaidExtension } from './MermaidExtension'
import { ApiTesterExtension } from './ApiTesterExtension'
import { MediaEmbedExtension } from './MediaEmbedExtension'
import { GithubExtension } from './GithubExtension'
import { JsonViewerExtension } from './JsonViewerExtension'
import { cn } from '@/lib/utils'

const lowlight = createLowlight(common)

export interface TocEntry {
    id: string
    level: number
    textContent: string
    isActive?: boolean
    isScrolledOver?: boolean
}

export interface BlockEditorProps {
    content: string
    onChange?: (html: string) => void
    readOnly?: boolean
    onTocUpdate?: (items: TocEntry[]) => void
}

const HIGHLIGHT_COLORS = [
    { color: '#fef08a', label: 'Yellow' },
    { color: '#bbf7d0', label: 'Green' },
    { color: '#bae6fd', label: 'Blue' },
    { color: '#fecaca', label: 'Red' },
    { color: '#e9d5ff', label: 'Purple' },
    { color: '#fed7aa', label: 'Orange' },
]

export function BlockEditor({ content, onChange, readOnly = false, onTocUpdate }: BlockEditorProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const linkContainerRef = useRef<HTMLDivElement>(null)
    const youtubeContainerRef = useRef<HTMLDivElement>(null)

    const [isUploading, setIsUploading] = useState(false)
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const [showLinkInput, setShowLinkInput] = useState(false)
    const [linkUrl, setLinkUrl] = useState('')
    const [showYoutubeInput, setShowYoutubeInput] = useState(false)
    const [youtubeUrl, setYoutubeUrl] = useState('')
    const [showCalloutMenu, setShowCalloutMenu] = useState(false)
    const [isFocusMode, setIsFocusMode] = useState(false)
    const [showFindBar, setShowFindBar] = useState(false)
    const [findQuery, setFindQuery] = useState('')
    const [currentMatchIndex, setCurrentMatchIndex] = useState(0)
    
    // Theme for Emoji Picker
    const [theme, setTheme] = useState<'light' | 'dark'>('light')
    useEffect(() => {
        const checkTheme = () => {
            setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light')
        }
        checkTheme()
        const observer = new MutationObserver(checkTheme)
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
        return () => observer.disconnect()
    }, [])



    // ─── YouTube custom event from slash commands ────────────────────────
    useEffect(() => {
        const handler = () => {
            setShowYoutubeInput(true)
            setYoutubeUrl('')
        }
        document.addEventListener('editor:insert-youtube', handler)
        return () => document.removeEventListener('editor:insert-youtube', handler)
    }, [])

    const slashSuggestionItems = useCallback(({ query }: { query: string }) => {
        const items = getSuggestionItems({ query })
        if ('image'.startsWith(query.toLowerCase())) {
            items.push({
                title: 'Image',
                group: 'Media',
                icon: <ImageIcon className="w-4 h-4" />,
                command: ({ editor, range }: any) => {
                    editor.chain().focus().deleteRange(range).run()
                    fileInputRef.current?.click()
                },
            } as any)
        }
        return items
    }, [])

    const editor = useEditor({
        editable: !readOnly,
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3, 4, 5, 6] },
                codeBlock: false,
            }),
            CodeBlockLowlight.extend({
                addAttributes() {
                    return {
                        ...this.parent?.(),
                        filename: { default: '' }
                    }
                },
                addNodeView() {
                    return ReactNodeViewRenderer(CodeBlockComponent)
                },
            }).configure({ lowlight }),
            Table.configure({ resizable: true }),
            TableRow,
            TableHeader,
            TableCell,
            Underline,
            Highlight.configure({ multicolor: true }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            CharacterCount,
            TableOfContentsExtension.configure({
                onUpdate: (content: TocEntry[]) => onTocUpdate?.(content),
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline underline-offset-4 decoration-primary/50 hover:decoration-primary cursor-pointer',
                },
            }),
            TaskList,
            TaskItem.configure({ nested: true }),
            ImageResize.configure({ inline: true, allowBase64: true }),
            MathExtension.configure({ evaluation: false }),
            Mention.configure({
                HTMLAttributes: {
                    class: 'text-primary font-medium bg-primary/10 px-1 py-0.5 rounded-md cursor-pointer hover:bg-primary/20 transition-colors',
                },
                suggestion: MentionSuggestion,
            }),
            Youtube.configure({ inline: false, width: 640, height: 480 }),
            Color,
            TextStyle,
            FontSize,
            Subscript,
            Superscript,
            CalloutExtension,
            Placeholder.configure({
                placeholder: "Type '/' for commands, or start writing...",
                emptyEditorClass: 'is-editor-empty before:content-[attr(data-placeholder)] before:text-muted-foreground/40 before:float-left before:pointer-events-none before:h-0',
            }),
            SlashCommand.configure({
                suggestion: { items: slashSuggestionItems, render: renderItems }
            }),
            ChemicalExtension,
            MermaidExtension,
            ApiTesterExtension,
            MediaEmbedExtension,
            GithubExtension,
            JsonViewerExtension,
            FontFamily,
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange?.(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm dark:prose-invert focus:outline-none max-w-none text-foreground/90 leading-relaxed',
            },
            // ─── Image drag & drop ───────────────────────────────────────
            handleDrop: (view, event, _slice, moved) => {
                if (!moved && event.dataTransfer?.files?.length) {
                    const file = event.dataTransfer.files[0]
                    if (file && file.type.startsWith('image/')) {
                        event.preventDefault()
                        const formData = new FormData()
                        formData.append('file', file)
                        setIsUploading(true)
                        fetch('/api/upload', { method: 'POST', body: formData })
                            .then(res => res.ok ? res.json() : null)
                            .then(data => {
                                if (data?.url) {
                                    const { schema } = view.state
                                    const node = schema.nodes.image?.create({ src: data.url })
                                    if (node) {
                                        const pos = view.posAtCoords({ left: event.clientX, top: event.clientY })
                                        if (pos) {
                                            const tr = view.state.tr.insert(pos.pos, node)
                                            view.dispatch(tr)
                                        }
                                    }
                                }
                            })
                            .finally(() => setIsUploading(false))
                        return true
                    }
                }
                return false
            },
            handlePaste: (view, event) => {
                const items = event.clipboardData?.items
                if (items) {
                    for (let i = 0; i < items.length; i++) {
                        if (items[i].type.startsWith('image/')) {
                            const file = items[i].getAsFile()
                            if (file) {
                                event.preventDefault()
                                const formData = new FormData()
                                formData.append('file', file)
                                setIsUploading(true)
                                fetch('/api/upload', { method: 'POST', body: formData })
                                    .then(res => res.ok ? res.json() : null)
                                    .then(data => {
                                        if (data?.url) {
                                            const { tr, schema } = view.state
                                            const node = schema.nodes.image?.create({ src: data.url })
                                            if (node) {
                                                view.dispatch(tr.replaceSelectionWith(node))
                                            }
                                        }
                                    })
                                    .finally(() => setIsUploading(false))
                                return true
                            }
                        }
                    }
                }
                return false
            },
        },
    })

    // ─── Keyboard shortcuts (Ctrl+K link, Ctrl+F find) ───────────────────
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault()
                if (editor) {
                    if (editor.isActive('link')) {
                        editor.chain().focus().unsetLink().run()
                    } else {
                        setLinkUrl(editor.getAttributes('link').href || '')
                        setShowLinkInput(true)
                    }
                }
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                e.preventDefault()
                setShowFindBar(v => !v)
                setFindQuery('')
                setCurrentMatchIndex(0)
            }
        }
        document.addEventListener('keydown', handler)
        return () => document.removeEventListener('keydown', handler)
    }, [editor])

    useEffect(() => {
        if (editor && content !== editor.getHTML() && !editor.isDestroyed) {
            const sel = editor.state.selection
            editor.commands.setContent(content, { emitUpdate: false })
            editor.commands.setTextSelection(sel)
        }
    }, [content, editor])

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !editor) return
        setIsUploading(true)
        const formData = new FormData()
        formData.append('file', file)
        try {
            const res = await fetch('/api/upload', { method: 'POST', body: formData })
            if (res.ok) {
                const data = await res.json()
                editor.chain().focus().setImage({ src: data.url }).run()
            }
        } finally {
            setIsUploading(false)
            if (fileInputRef.current) fileInputRef.current.value = ''
        }
    }

    const insertYoutube = () => {
        if (!youtubeUrl.trim() || !editor) return
        editor.chain().focus().setYoutubeVideo({ src: youtubeUrl.trim() }).run()
        setShowYoutubeInput(false)
        setYoutubeUrl('')
    }

    // ─── Find: compute matches from ProseMirror doc ──────────────────────
    const findMatches = useMemo(() => {
        if (!editor || !findQuery || findQuery.length < 1) return []
        const matches: { from: number; to: number }[] = []
        const q = findQuery.toLowerCase()
        editor.state.doc.descendants((node, pos) => {
            if (node.isText && node.text) {
                const text = node.text.toLowerCase()
                let idx = 0
                while ((idx = text.indexOf(q, idx)) !== -1) {
                    matches.push({ from: pos + idx, to: pos + idx + q.length })
                    idx += q.length
                }
            }
        })
        return matches
    }, [editor, findQuery, editor?.state.doc])

    const goToMatch = useCallback((index: number) => {
        if (!editor || findMatches.length === 0) return
        const wrappedIndex = ((index % findMatches.length) + findMatches.length) % findMatches.length
        setCurrentMatchIndex(wrappedIndex)
        const match = findMatches[wrappedIndex]
        editor.chain().focus().setTextSelection(match).scrollIntoView().run()
    }, [editor, findMatches])

    const wordCount = editor ? editor.storage.characterCount?.words() ?? 0 : 0
    const charCount = editor ? editor.storage.characterCount?.characters() ?? 0 : 0

    if (!editor) return null

    // Font size active state
    const hasCursor = !editor.state.selection.empty || editor.state.doc.textContent.length > 0
    const currentFontSize = hasCursor ? (editor.getAttributes('textStyle')?.fontSize ?? null) : undefined

    // Alignment active state — 'left' is default so isActive returns false
    const isAlignCenter  = editor.isActive({ textAlign: 'center' })
    const isAlignRight   = editor.isActive({ textAlign: 'right' })
    const isAlignJustify = editor.isActive({ textAlign: 'justify' })
    const isAlignLeft    = !isAlignCenter && !isAlignRight && !isAlignJustify

    return (
        <div className={cn('w-full relative flex flex-col')} data-block-editor={isFocusMode ? 'focus-mode' : undefined}>
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />

            {isUploading && (
                <div className="absolute top-2 right-2 z-10 flex items-center gap-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded-md backdrop-blur-md">
                    <Loader2 className="w-3 h-3 animate-spin" /> Uploading...
                </div>
            )}

            {/* ── Main Toolbar ──────────────────────────────────────────── */}
            <div className="sticky top-0 z-20 flex items-center p-1.5 mb-4 bg-background/95 backdrop-blur-md border border-border/50 shadow-sm rounded-lg overflow-x-auto scrollbar-hide flex-nowrap md:flex-wrap gap-y-1 gap-x-0.5 shrink-0">

                {/* History & Utilities */}
                <div className="flex items-center gap-0.5 pr-2 border-r border-border/50 shrink-0">
                    <button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo (Ctrl+Z)"
                        className="p-1.5 rounded-md transition-colors text-muted-foreground hover:bg-muted/50 hover:text-foreground disabled:opacity-40">
                        <Undo className="w-4 h-4" />
                    </button>
                    <button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo (Ctrl+Y)"
                        className="p-1.5 rounded-md transition-colors text-muted-foreground hover:bg-muted/50 hover:text-foreground disabled:opacity-40">
                        <Redo className="w-4 h-4" />
                    </button>
                    <button onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} title="Clear Formatting"
                        className="p-1.5 rounded-md transition-colors text-muted-foreground hover:bg-muted/50 hover:text-foreground">
                        <Eraser className="w-4 h-4" />
                    </button>
                    <button onClick={() => { setShowFindBar(v => !v); setFindQuery(''); setCurrentMatchIndex(0) }} title="Find (Ctrl+F)"
                        className={cn('p-1.5 rounded-md transition-colors', showFindBar ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground')}>
                        <Search className="w-4 h-4" />
                    </button>
                    <button onClick={() => setIsFocusMode(v => !v)} title="Focus Mode"
                        className={cn('p-1.5 rounded-md transition-colors', isFocusMode ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground')}>
                        {isFocusMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </button>
                </div>

                {/* Block Type */}
                <div className="flex items-center pr-2 border-r border-border/50 shrink-0">
                    <Select
                        value={
                            editor.isActive('heading', { level: 1 }) ? 'h1' :
                            editor.isActive('heading', { level: 2 }) ? 'h2' :
                            editor.isActive('heading', { level: 3 }) ? 'h3' :
                            editor.isActive('heading', { level: 4 }) ? 'h4' :
                            editor.isActive('heading', { level: 5 }) ? 'h5' :
                            editor.isActive('heading', { level: 6 }) ? 'h6' :
                            editor.isActive('bulletList') ? 'bullet' :
                            editor.isActive('orderedList') ? 'ordered' :
                            editor.isActive('taskList') ? 'task' :
                            'p'
                        }
                        onValueChange={(v) => {
                            if (v === 'p') editor.chain().focus().setParagraph().run()
                            else if (v === 'h1') editor.chain().focus().toggleHeading({ level: 1 }).run()
                            else if (v === 'h2') editor.chain().focus().toggleHeading({ level: 2 }).run()
                            else if (v === 'h3') editor.chain().focus().toggleHeading({ level: 3 }).run()
                            else if (v === 'h4') editor.chain().focus().toggleHeading({ level: 4 }).run()
                            else if (v === 'h5') editor.chain().focus().toggleHeading({ level: 5 }).run()
                            else if (v === 'h6') editor.chain().focus().toggleHeading({ level: 6 }).run()
                            else if (v === 'bullet') editor.chain().focus().toggleBulletList().run()
                            else if (v === 'ordered') editor.chain().focus().toggleOrderedList().run()
                            else if (v === 'task') editor.chain().focus().toggleTaskList().run()
                        }}
                    >
                        <SelectTrigger className="h-8 text-xs border-border/50 bg-background hover:bg-muted/50 w-[110px]">
                            <SelectValue placeholder="Normal" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="p">Normal</SelectItem>
                            <SelectItem value="h1">Heading 1</SelectItem>
                            <SelectItem value="h2">Heading 2</SelectItem>
                            <SelectItem value="h3">Heading 3</SelectItem>
                            <SelectItem value="h4">Heading 4</SelectItem>
                            <SelectItem value="h5">Heading 5</SelectItem>
                            <SelectItem value="h6">Heading 6</SelectItem>
                            <SelectItem value="bullet">• Bullet</SelectItem>
                            <SelectItem value="ordered">1. Numbered</SelectItem>
                            <SelectItem value="task">☐ Task</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Font Family */}
                <div className="flex items-center pr-2 border-r border-border/50 shrink-0">
                    <Select
                        value={editor.getAttributes('textStyle').fontFamily || 'Inter'}
                        onValueChange={(v) => {
                            if (v === 'Inter') editor.chain().focus().unsetFontFamily().run()
                            else editor.chain().focus().setFontFamily(v).run()
                        }}
                    >
                        <SelectTrigger className="h-8 text-xs border-border/50 bg-background hover:bg-muted/50 w-[90px]">
                            <SelectValue placeholder="Default" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Inter">Default</SelectItem>
                            <SelectItem value="serif">Serif</SelectItem>
                            <SelectItem value="monospace">Mono</SelectItem>
                            <SelectItem value="Georgia, serif">Georgia</SelectItem>
                            <SelectItem value="system-ui">System</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Font Size S/M/L/XL */}
                <div className="flex items-center pr-2 border-r border-border/50 shrink-0">
                    <button onClick={() => editor.chain().focus().setFontSize('0.875em').run()} title="Small"
                        className={cn('px-2 py-1 rounded text-[10px] font-medium transition-colors', currentFontSize === '0.875em' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground')}>S</button>
                    <button onClick={() => editor.chain().focus().unsetFontSize().run()} title="Normal"
                        className={cn('px-2 py-1 rounded text-xs font-medium transition-colors', (currentFontSize === null || currentFontSize === undefined || currentFontSize === '1em') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground')}>M</button>
                    <button onClick={() => editor.chain().focus().setFontSize('1.25em').run()} title="Large"
                        className={cn('px-2 py-1 rounded text-sm font-medium transition-colors', currentFontSize === '1.25em' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground')}>L</button>
                    <button onClick={() => editor.chain().focus().setFontSize('1.5em').run()} title="X-Large"
                        className={cn('px-2 py-1 rounded text-base font-medium transition-colors', currentFontSize === '1.5em' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground')}>XL</button>
                </div>

                {/* Text Marks */}
                <div className="flex items-center gap-0.5 pr-2 border-r border-border/50 shrink-0">
                    {[
                        { icon: Bold,          action: () => editor.chain().focus().toggleBold().run(),        active: 'bold',        title: 'Bold (Ctrl+B)' },
                        { icon: Italic,        action: () => editor.chain().focus().toggleItalic().run(),      active: 'italic',      title: 'Italic (Ctrl+I)' },
                        { icon: UnderlineIcon, action: () => editor.chain().focus().toggleUnderline().run(),   active: 'underline',   title: 'Underline (Ctrl+U)' },
                        { icon: Strikethrough, action: () => editor.chain().focus().toggleStrike().run(),      active: 'strike',      title: 'Strikethrough' },
                        { icon: Code,          action: () => editor.chain().focus().toggleCode().run(),        active: 'code',        title: 'Inline Code' },
                        { icon: SubscriptIcon, action: () => editor.chain().focus().toggleSubscript().run(),   active: 'subscript',   title: 'Subscript' },
                        { icon: SuperscriptIcon, action: () => editor.chain().focus().toggleSuperscript().run(), active: 'superscript', title: 'Superscript' },
                    ].map(({ icon: Icon, action, active, title }) => (
                        <button key={active} onClick={action} title={title}
                            className={`p-1.5 rounded-md transition-colors ${editor.isActive(active) ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}>
                            <Icon className="w-4 h-4" />
                        </button>
                    ))}
                </div>

                {/* Text Color swatches + Custom Popover */}
                <div className="flex items-center gap-0.5 pr-2 border-r border-border/50 shrink-0">
                    {['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'].map((c) => (
                        <button key={c}
                            onClick={() => editor.chain().focus().setColor(c).run()}
                            className={cn('w-4 h-4 rounded-full transition-transform hover:scale-125 flex items-center justify-center border border-black/10',
                                editor.isActive('textStyle', { color: c }) && 'ring-2 ring-primary ring-offset-1')}
                            style={{ backgroundColor: c }}
                            title={c}
                        />
                    ))}
                    <Popover>
                        <PopoverTrigger asChild>
                            <button className="relative w-5 h-5 rounded-full overflow-hidden cursor-pointer border border-border/50 hover:scale-110 transition-transform flex items-center justify-center bg-gradient-to-br from-red-400 via-green-400 to-blue-400" title="Custom Color" />
                        </PopoverTrigger>
                        <PopoverContent className="p-3 w-auto flex flex-col gap-3" side="bottom" align="center" 
                            onOpenAutoFocus={e => e.preventDefault()}
                            onCloseAutoFocus={e => e.preventDefault()}
                        >
                            <HexColorPicker
                                color={editor.getAttributes('textStyle').color || '#000000'}
                                onChange={color => editor.chain().setColor(color).run()}
                            />
                            <div className="flex gap-2 items-center">
                                <span className="text-xs font-medium text-muted-foreground w-8">Hex</span>
                                <input type="text" placeholder="#000000"
                                    value={editor.getAttributes('textStyle').color || ''}
                                    onChange={e => {
                                        if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                                            editor.chain().setColor(e.target.value).run()
                                        }
                                    }}
                                    className="flex-1 h-8 px-2 text-sm border border-border rounded-md outline-none focus:border-primary" />
                            </div>
                        </PopoverContent>
                    </Popover>
                    <button
                        onClick={() => editor.chain().focus().unsetColor().run()}
                        className="w-4 h-4 rounded-full flex items-center justify-center transition-transform hover:scale-125"
                        title="Default Color"
                    >
                        <Ban className="w-3 h-3 text-muted-foreground" />
                    </button>
                </div>

                {/* Highlight Color swatches (multicolor) + Popover */}
                <div className="flex items-center gap-0.5 pr-2 border-r border-border/50 shrink-0" title="Highlight Color">
                    <Highlighter className="w-3.5 h-3.5 text-muted-foreground/60 mr-0.5" />
                    {HIGHLIGHT_COLORS.map(({ color, label }) => (
                        <button key={color}
                            onClick={() => editor.chain().focus().toggleHighlight({ color }).run()}
                            className={cn('w-4 h-4 rounded-sm transition-transform hover:scale-125 border border-black/10',
                                editor.isActive('highlight', { color }) && 'ring-2 ring-primary ring-offset-1')}
                            style={{ backgroundColor: color }}
                            title={`Highlight ${label}`}
                        />
                    ))}
                    <Popover>
                        <PopoverTrigger asChild>
                            <button className="relative w-5 h-5 rounded-sm overflow-hidden cursor-pointer border border-border/50 hover:scale-110 transition-transform flex items-center justify-center bg-gradient-to-br from-yellow-300 via-green-300 to-blue-300" title="Custom Highlight" />
                        </PopoverTrigger>
                        <PopoverContent className="p-3 w-auto flex flex-col gap-3" side="bottom" align="center" 
                            onOpenAutoFocus={e => e.preventDefault()}
                            onCloseAutoFocus={e => e.preventDefault()}
                        >
                            <HexColorPicker
                                color={editor.getAttributes('highlight').color || '#fef08a'}
                                onChange={color => editor.chain().toggleHighlight({ color }).run()}
                            />
                            <div className="flex gap-2 items-center">
                                <span className="text-xs font-medium text-muted-foreground w-8">Hex</span>
                                <input type="text" placeholder="#fef08a"
                                    value={editor.getAttributes('highlight').color || ''}
                                    onChange={e => {
                                        if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                                            editor.chain().toggleHighlight({ color: e.target.value }).run()
                                        }
                                    }}
                                    className="flex-1 h-8 px-2 text-sm border border-border rounded-md outline-none focus:border-primary" />
                            </div>
                        </PopoverContent>
                    </Popover>
                    <button onClick={() => editor.chain().focus().unsetHighlight().run()} title="Remove Highlight"
                        className="p-0.5 rounded text-muted-foreground hover:text-foreground transition-colors ml-0.5">
                        <Ban className="w-3 h-3" />
                    </button>
                </div>

                {/* Alignment */}
                <div className="flex items-center gap-0.5 pr-2 border-r border-border/50 shrink-0">
                    <button onClick={() => editor.chain().focus().setTextAlign('left').run()} title="Align Left"
                        className={`p-1.5 rounded-md transition-colors ${isAlignLeft ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}>
                        <AlignLeft className="w-4 h-4" />
                    </button>
                    <button onClick={() => editor.chain().focus().setTextAlign('center').run()} title="Align Center"
                        className={`p-1.5 rounded-md transition-colors ${isAlignCenter ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}>
                        <AlignCenter className="w-4 h-4" />
                    </button>
                    <button onClick={() => editor.chain().focus().setTextAlign('right').run()} title="Align Right"
                        className={`p-1.5 rounded-md transition-colors ${isAlignRight ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}>
                        <AlignRight className="w-4 h-4" />
                    </button>
                    <button onClick={() => editor.chain().focus().setTextAlign('justify').run()} title="Justify"
                        className={`p-1.5 rounded-md transition-colors ${isAlignJustify ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}>
                        <AlignJustify className="w-4 h-4" />
                    </button>
                </div>

                    {/* Insert section */}
                <div className="flex items-center gap-0.5 shrink-0">
                    {/* Link */}
                    <Popover open={showLinkInput} onOpenChange={setShowLinkInput}>
                        <PopoverTrigger asChild>
                            <button onClick={() => {
                                if (editor.isActive('link')) {
                                    editor.chain().focus().unsetLink().run()
                                } else {
                                    setLinkUrl(editor.getAttributes('link').href || '')
                                }
                            }} title="Link (Ctrl+K)"
                                className={`p-1.5 rounded-md transition-colors ${editor.isActive('link') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}>
                                <LinkIcon className="w-4 h-4" />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="p-2 flex gap-2 w-72" side="bottom" align="start">
                            <input autoFocus type="url" placeholder="https://"
                                value={linkUrl} onChange={e => setLinkUrl(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') { editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run(); setShowLinkInput(false) }
                                    if (e.key === 'Escape') setShowLinkInput(false)
                                }}
                                className="h-8 flex-1 text-sm bg-background px-2 rounded-md border border-border outline-none focus:border-primary" />
                            <button type="button" onClick={() => { editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run(); setShowLinkInput(false) }}
                                className="px-3 py-1 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90 transition-colors whitespace-nowrap">
                                Save
                            </button>
                        </PopoverContent>
                    </Popover>

                    <button onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Blockquote"
                        className={`p-1.5 rounded-md transition-colors ${editor.isActive('blockquote') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}>
                        <Quote className="w-4 h-4" />
                    </button>
                    <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} title="Code Block"
                        className={`p-1.5 rounded-md transition-colors ${editor.isActive('codeBlock') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}>
                        <SquareTerminal className="w-4 h-4" />
                    </button>
                    <button onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Divider"
                        className="p-1.5 rounded-md transition-colors text-muted-foreground hover:bg-muted/50 hover:text-foreground">
                        <Minus className="w-4 h-4" />
                    </button>

                    {/* Math */}
                    <button onClick={() => { editor.chain().focus().insertContent({ type: 'inlineMath', attrs: { latex: 'E = mc^2' } }).run() }} title="Math / LaTeX"
                        className="p-1.5 rounded-md transition-colors text-muted-foreground hover:bg-muted/50 hover:text-foreground">
                        <Sigma className="w-4 h-4" />
                    </button>

                    {/* Chemical */}
                    <button onClick={() => { editor.chain().focus().insertContent({ type: 'chemical', attrs: { smiles: 'C1=CC=C(C=C1)O' } }).run() }} title="Chemical Diagram"
                        className="p-1.5 rounded-md transition-colors text-muted-foreground hover:bg-muted/50 hover:text-foreground">
                        <FlaskConical className="w-4 h-4" />
                    </button>

                    {/* Mermaid */}
                    <button onClick={() => { editor.chain().focus().insertContent({ type: 'mermaid' }).run() }} title="Mermaid Diagram"
                        className="p-1.5 rounded-md transition-colors text-muted-foreground hover:bg-muted/50 hover:text-foreground">
                        <Workflow className="w-4 h-4" />
                    </button>

                    {/* API Tester */}
                    <button onClick={() => { editor.chain().focus().insertContent({ type: 'apiTester' }).run() }} title="API Request"
                        className="p-1.5 rounded-md transition-colors text-muted-foreground hover:bg-muted/50 hover:text-foreground">
                        <Server className="w-4 h-4" />
                    </button>

                    {/* Table */}
                    <button onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} title="Insert Table"
                        className="p-1.5 rounded-md transition-colors text-muted-foreground hover:bg-muted/50 hover:text-foreground">
                        <TableIcon className="w-4 h-4" />
                    </button>

                    {/* Callout */}
                    <Popover open={showCalloutMenu} onOpenChange={setShowCalloutMenu}>
                        <PopoverTrigger asChild>
                            <button title="Insert Callout"
                                className={cn('p-1.5 rounded-md transition-colors', showCalloutMenu ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground')}>
                                <Info className="w-4 h-4" />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="p-1 min-w-[160px] w-auto" side="bottom" align="center">
                            {(['info', 'warning', 'tip', 'danger', 'success'] as const).map(type => (
                                <button key={type} type="button"
                                    onClick={() => {
                                        editor.chain().focus().insertContent({
                                            type: 'callout',
                                            attrs: { type },
                                            content: [{ type: 'paragraph' }]
                                        }).run()
                                        setShowCalloutMenu(false)
                                    }}
                                    className="flex items-center gap-2 w-full px-3 py-1.5 text-sm rounded-md hover:bg-muted/50 transition-colors text-foreground capitalize">
                                    <span className={cn('w-2 h-2 rounded-full', {
                                        'bg-sky-500': type === 'info',
                                        'bg-amber-500': type === 'warning',
                                        'bg-violet-500': type === 'tip',
                                        'bg-red-500': type === 'danger',
                                        'bg-emerald-500': type === 'success',
                                    })} />
                                    {type}
                                </button>
                            ))}
                        </PopoverContent>
                    </Popover>

                    {/* YouTube embed */}
                    <Popover open={showYoutubeInput} onOpenChange={setShowYoutubeInput}>
                        <PopoverTrigger asChild>
                            <button title="Embed YouTube" onClick={() => setYoutubeUrl('')}
                                className={cn('p-1.5 rounded-md transition-colors', showYoutubeInput ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground')}>
                                <YoutubeIcon className="w-4 h-4" />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="p-2 flex gap-2 w-80" side="bottom" align="center">
                            <input autoFocus type="url" placeholder="YouTube URL..."
                                value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter') insertYoutube(); if (e.key === 'Escape') setShowYoutubeInput(false) }}
                                className="h-8 flex-1 text-sm bg-background px-2 rounded-md border border-border outline-none focus:border-primary" />
                            <button type="button" onClick={insertYoutube}
                                className="px-3 py-1 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90 transition-colors whitespace-nowrap">
                                Embed
                            </button>
                        </PopoverContent>
                    </Popover>

                    {/* Image */}
                    <button onClick={() => fileInputRef.current?.click()} title="Insert Image"
                        className="p-1.5 rounded-md transition-colors text-muted-foreground hover:bg-muted/50 hover:text-foreground">
                        <ImageIcon className="w-4 h-4" />
                    </button>

                    {/* Emoji */}
                    <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                        <PopoverTrigger asChild>
                            <button title="Emoji"
                                className={`p-1.5 rounded-md transition-colors ${showEmojiPicker ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}>
                                <Smile className="w-4 h-4" />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 border-none shadow-none w-auto" side="bottom" align="center" sideOffset={8}>
                            <Picker data={data} onEmojiSelect={(emoji: any) => {
                                editor.chain().focus().insertContent(emoji.native).run()
                                setShowEmojiPicker(false)
                            }} theme={theme} />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            {/* ── Find Bar (below toolbar, not overlapping) ─────────────── */}
            {showFindBar && (
                <div className="flex items-center gap-2 p-2 mb-3 bg-background/95 backdrop-blur-md border border-border/50 shadow-sm rounded-lg">
                    <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                    <input
                        autoFocus
                        type="text"
                        placeholder="Find in document..."
                        value={findQuery}
                        onChange={e => { setFindQuery(e.target.value); setCurrentMatchIndex(0) }}
                        onKeyDown={e => {
                            if (e.key === 'Escape') { setShowFindBar(false); setFindQuery('') }
                            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); goToMatch(currentMatchIndex + 1) }
                            if (e.key === 'Enter' && e.shiftKey) { e.preventDefault(); goToMatch(currentMatchIndex - 1) }
                        }}
                        className="flex-1 text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground/40 min-w-0"
                    />
                    {findQuery && (
                        <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
                            {findMatches.length > 0 ? `${currentMatchIndex + 1}/${findMatches.length}` : 'No matches'}
                        </span>
                    )}
                    <button onClick={() => goToMatch(currentMatchIndex - 1)} disabled={findMatches.length === 0} title="Previous (Shift+Enter)"
                        className="p-1 rounded hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30">
                        <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => goToMatch(currentMatchIndex + 1)} disabled={findMatches.length === 0} title="Next (Enter)"
                        className="p-1 rounded hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30">
                        <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => { setShowFindBar(false); setFindQuery('') }}
                        className="p-1 rounded hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors">
                        <XIcon className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}

            {/* ── Table Bubble Menu ─────────────────────────────────────── */}
            <BubbleMenu editor={editor} pluginKey="tableMenu" updateDelay={0}
                shouldShow={({ editor }) => editor.isActive('table')}
                className="flex flex-wrap items-center gap-0.5 p-1.5 bg-popover border border-border/50 shadow-xl rounded-lg backdrop-blur-md max-w-sm z-50">
                {/* Column ops */}
                <button onClick={() => editor.chain().focus().addColumnBefore().run()} title="Add Column Left"
                    className="p-1 px-1.5 text-[10px] hover:bg-muted/50 rounded text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                    <Columns className="w-3 h-3" /><span>+Col←</span>
                </button>
                <button onClick={() => editor.chain().focus().addColumnAfter().run()} title="Add Column Right"
                    className="p-1 px-1.5 text-[10px] hover:bg-muted/50 rounded text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                    <Columns className="w-3 h-3" /><span>+Col→</span>
                </button>
                <button onClick={() => editor.chain().focus().deleteColumn().run()} title="Delete Column"
                    className="p-1 px-1.5 text-[10px] hover:bg-red-500/10 rounded text-red-400 hover:text-red-500 transition-colors flex items-center gap-1">
                    <Columns className="w-3 h-3" /><span>−Col</span>
                </button>
                <div className="w-px h-4 bg-border/50 mx-0.5" />
                {/* Row ops */}
                <button onClick={() => editor.chain().focus().addRowBefore().run()} title="Add Row Above"
                    className="p-1 px-1.5 text-[10px] hover:bg-muted/50 rounded text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                    <Rows className="w-3 h-3" /><span>+Row↑</span>
                </button>
                <button onClick={() => editor.chain().focus().addRowAfter().run()} title="Add Row Below"
                    className="p-1 px-1.5 text-[10px] hover:bg-muted/50 rounded text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                    <Rows className="w-3 h-3" /><span>+Row↓</span>
                </button>
                <button onClick={() => editor.chain().focus().deleteRow().run()} title="Delete Row"
                    className="p-1 px-1.5 text-[10px] hover:bg-red-500/10 rounded text-red-400 hover:text-red-500 transition-colors flex items-center gap-1">
                    <Rows className="w-3 h-3" /><span>−Row</span>
                </button>
                <div className="w-px h-4 bg-border/50 mx-0.5" />
                {/* Header toggles */}
                <button onClick={() => editor.chain().focus().toggleHeaderRow().run()} title="Toggle Header Row"
                    className="p-1 px-1.5 text-[10px] hover:bg-muted/50 rounded text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                    <FlipHorizontal className="w-3 h-3" /><span>H-Row</span>
                </button>
                <button onClick={() => editor.chain().focus().toggleHeaderColumn().run()} title="Toggle Header Column"
                    className="p-1 px-1.5 text-[10px] hover:bg-muted/50 rounded text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                    <FlipVertical className="w-3 h-3" /><span>H-Col</span>
                </button>
                <div className="w-px h-4 bg-border/50 mx-0.5" />
                {/* Merge/Split */}
                <button onClick={() => editor.chain().focus().mergeCells().run()} title="Merge Cells"
                    className="p-1 px-1.5 text-[10px] hover:bg-muted/50 rounded text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                    <Merge className="w-3 h-3" /><span>Merge</span>
                </button>
                <button onClick={() => editor.chain().focus().splitCell().run()} title="Split Cell"
                    className="p-1 px-1.5 text-[10px] hover:bg-muted/50 rounded text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                    <Split className="w-3 h-3" /><span>Split</span>
                </button>
                <div className="w-px h-4 bg-border/50 mx-0.5" />
                {/* Cell color */}
                <Popover>
                    <PopoverTrigger asChild>
                        <button className="p-1 px-1.5 text-[10px] hover:bg-muted/50 rounded text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 cursor-pointer" title="Cell Background">
                            <span className="w-3 h-3 rounded-sm bg-gradient-to-br from-sky-300 via-emerald-300 to-amber-300 border border-black/10 shrink-0" />
                            <span>Color</span>
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="p-3 w-auto flex flex-col gap-3" side="bottom" align="center" 
                        onOpenAutoFocus={e => e.preventDefault()}
                        onCloseAutoFocus={e => e.preventDefault()}
                    >
                        <HexColorPicker
                            color={editor.getAttributes('tableCell')?.backgroundColor || '#ffffff'}
                            onChange={color => editor.chain().setCellAttribute('backgroundColor', color).run()}
                        />
                        <div className="flex gap-2 items-center">
                            <span className="text-xs font-medium text-muted-foreground w-8">Hex</span>
                            <input type="text" placeholder="#ffffff"
                                onChange={e => {
                                    if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                                        editor.chain().setCellAttribute('backgroundColor', e.target.value).run()
                                    }
                                }}
                                className="flex-1 h-8 px-2 text-sm border border-border rounded-md outline-none focus:border-primary" />
                        </div>
                    </PopoverContent>
                </Popover>
                <div className="w-px h-4 bg-border/50 mx-0.5" />
                <button onClick={() => editor.chain().focus().fixTables().run()} title="Fix Tables"
                    className="p-1 px-1.5 text-[10px] hover:bg-muted/50 rounded text-muted-foreground hover:text-foreground transition-colors">
                    Fix
                </button>
                <button onClick={() => editor.chain().focus().deleteTable().run()} title="Delete Table"
                    className="p-1 px-1.5 text-[10px] hover:bg-red-500/20 rounded text-red-500 hover:text-red-600 transition-colors flex items-center gap-1">
                    <Trash2 className="w-3 h-3" /><span>Del</span>
                </button>
            </BubbleMenu>

            {/* ── Text Bubble Menu ──────────────────────────────────────── */}
            <BubbleMenu editor={editor} pluginKey="textMenu"
                shouldShow={({ editor, from, to }) => {
                    if (editor.isActive('table')) return false
                    return from !== to && !editor.isActive('image')
                }}
                className="flex items-center gap-0.5 p-1 bg-popover border border-border/50 shadow-xl rounded-lg backdrop-blur-md z-50">
                {[
                    { icon: Bold,          action: () => editor.chain().focus().toggleBold().run(),      active: 'bold',      title: 'Bold' },
                    { icon: Italic,        action: () => editor.chain().focus().toggleItalic().run(),    active: 'italic',    title: 'Italic' },
                    { icon: UnderlineIcon, action: () => editor.chain().focus().toggleUnderline().run(), active: 'underline', title: 'Underline' },
                    { icon: Strikethrough, action: () => editor.chain().focus().toggleStrike().run(),    active: 'strike',    title: 'Strikethrough' },
                    { icon: Highlighter,   action: () => editor.chain().focus().toggleHighlight().run(), active: 'highlight', title: 'Highlight' },
                    { icon: Code,          action: () => editor.chain().focus().toggleCode().run(),      active: 'code',      title: 'Inline Code' },
                ].map(({ icon: Icon, action, active, title }) => (
                    <button key={active} onClick={action} title={title}
                        className={`p-1.5 rounded-md transition-colors ${editor.isActive(active) ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}>
                        <Icon className="w-3.5 h-3.5" />
                    </button>
                ))}
                <div className="w-px h-4 bg-border/50 mx-0.5" />
                <button onClick={() => { setLinkUrl(editor.getAttributes('link').href || ''); setShowLinkInput(true) }}
                    title="Add Link"
                    className={`p-1.5 rounded-md transition-colors ${editor.isActive('link') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}>
                    <LinkIcon className="w-3.5 h-3.5" />
                </button>
            </BubbleMenu>

            {/* ── Editor Content ────────────────────────────────────────── */}
            <EditorContent editor={editor} className="flex-1 w-full outline-none" />

            {/* ── Status Bar ───────────────────────────────────────────── */}
            {!readOnly && (
                <div className="flex items-center justify-between pt-3 mt-4 border-t border-border/20 text-[11px] text-muted-foreground/50">
                    <div className="flex items-center gap-4">
                        <span>{wordCount} words</span>
                        <span>{charCount} chars</span>
                        <span>~{Math.max(1, Math.ceil(wordCount / 200))} min read</span>
                    </div>
                    {isFocusMode && (
                        <span className="text-primary/60 text-[10px] font-medium tracking-wide uppercase">Focus Mode</span>
                    )}
                </div>
            )}
        </div>
    )
}
