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
import { useEffect, useRef, useState, useCallback } from 'react'
import {
    Image as ImageIcon, Loader2, Bold, Italic, Strikethrough, Link as LinkIcon,
    Underline as UnderlineIcon, Highlighter, AlignLeft, AlignCenter, AlignRight, AlignJustify, Quote,
    Superscript as SuperscriptIcon, Subscript as SubscriptIcon, Code, Undo, Redo, Smile,
    Table as TableIcon, Eraser, Sigma, SquareTerminal, Ban, Minus,
    Youtube as YoutubeIcon, Info, Maximize2, Minimize2,
    PlusSquare, Columns, Rows, Trash2, FlipVertical, FlipHorizontal, Merge, Split,
    Search, X as XIcon,
} from 'lucide-react'
import { SlashCommand, getSuggestionItems, renderItems } from './SlashCommand'
import GlobalDragHandle from 'tiptap-extension-global-drag-handle'
import { CalloutExtension } from './CalloutExtension'
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

const CALLOUT_TYPES = [
    { type: 'info',    label: 'Info',    icon: Info,          color: 'text-sky-500' },
    { type: 'warning', label: 'Warning', icon: Info,          color: 'text-amber-500' },
    { type: 'tip',     label: 'Tip',     icon: Info,          color: 'text-violet-500' },
    { type: 'danger',  label: 'Danger',  icon: Info,          color: 'text-red-500' },
    { type: 'success', label: 'Success', icon: Info,          color: 'text-emerald-500' },
] as const

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

    // Close link popover when clicking outside
    useEffect(() => {
        if (!showLinkInput) return
        const handler = (e: MouseEvent) => {
            if (linkContainerRef.current && !linkContainerRef.current.contains(e.target as Node)) {
                setShowLinkInput(false)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [showLinkInput])

    // Close youtube popover when clicking outside
    useEffect(() => {
        if (!showYoutubeInput) return
        const handler = (e: MouseEvent) => {
            if (youtubeContainerRef.current && !youtubeContainerRef.current.contains(e.target as Node)) {
                setShowYoutubeInput(false)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [showYoutubeInput])

    // Listen for YouTube insert event from slash commands
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
            GlobalDragHandle.configure({ dragHandleWidth: 20, scrollTreshold: 100 }),
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
        },
    })

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

    const wordCount = editor ? editor.storage.characterCount?.words() ?? 0 : 0
    const charCount = editor ? editor.storage.characterCount?.characters() ?? 0 : 0

    if (!editor) return null

    // Font size: only highlight if there's actual content and a known fontSize
    const hasCursor = !editor.state.selection.empty || editor.state.doc.textContent.length > 0
    const currentFontSize = hasCursor ? (editor.getAttributes('textStyle')?.fontSize ?? null) : undefined

    // Alignment: 'left' is default so isActive returns false — derive it
    const isAlignCenter  = editor.isActive({ textAlign: 'center' })
    const isAlignRight   = editor.isActive({ textAlign: 'right' })
    const isAlignJustify = editor.isActive({ textAlign: 'justify' })
    const isAlignLeft    = !isAlignCenter && !isAlignRight && !isAlignJustify

    return (
        <div className={cn('w-full relative flex flex-col', isFocusMode && 'focus-mode')} data-block-editor={isFocusMode ? 'focus-mode' : undefined}>
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />

            {isUploading && (
                <div className="absolute top-2 right-2 z-10 flex items-center gap-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded-md backdrop-blur-md">
                    <Loader2 className="w-3 h-3 animate-spin" /> Uploading...
                </div>
            )}

            {/* ── Find Bar ──────────────────────────────────────────────── */}
            {showFindBar && (
                <div className="sticky top-0 z-30 flex items-center gap-2 p-2 bg-background/95 backdrop-blur-md border border-border/50 shadow-sm rounded-lg mb-2">
                    <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                    <input
                        autoFocus
                        type="text"
                        placeholder="Find in document..."
                        value={findQuery}
                        onChange={e => setFindQuery(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === 'Escape') { setShowFindBar(false); setFindQuery('') }
                            if (e.key === 'f' && (e.ctrlKey || e.metaKey)) { e.preventDefault() }
                        }}
                        className="flex-1 text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground/40"
                    />
                    {findQuery && (
                        <span className="text-xs text-muted-foreground">
                            {(() => {
                                const text = editor.getText()
                                const matches = Array.from(text.matchAll(new RegExp(findQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')))
                                return matches.length > 0 ? `${matches.length} match${matches.length > 1 ? 'es' : ''}` : 'No matches'
                            })()}
                        </span>
                    )}
                    <button onClick={() => { setShowFindBar(false); setFindQuery('') }}
                        className="p-1 rounded hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors">
                        <XIcon className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}

            {/* ── Main Toolbar ──────────────────────────────────────────── */}
            <div className="sticky top-0 z-20 flex items-center p-1.5 mb-4 bg-background/95 backdrop-blur-md border border-border/50 shadow-sm rounded-lg overflow-x-auto scrollbar-hide flex-nowrap gap-x-0.5 shrink-0">

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
                    <button onClick={() => { setShowFindBar(v => !v); setFindQuery('') }} title="Find (Ctrl+F)"
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
                    <select
                        className="h-8 pl-2 pr-1 py-1 text-xs bg-background hover:bg-muted/50 border border-border/50 rounded-md text-foreground cursor-pointer outline-none font-medium"
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
                        onChange={(e) => {
                            const v = e.target.value
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
                        <option value="p">Normal</option>
                        <option value="h1">Heading 1</option>
                        <option value="h2">Heading 2</option>
                        <option value="h3">Heading 3</option>
                        <option value="h4">Heading 4</option>
                        <option value="h5">Heading 5</option>
                        <option value="h6">Heading 6</option>
                        <option value="bullet">• Bullet</option>
                        <option value="ordered">1. Numbered</option>
                        <option value="task">☐ Task</option>
                    </select>
                </div>

                {/* Font Family */}
                <div className="flex items-center pr-2 border-r border-border/50 shrink-0">
                    <select
                        className="h-8 pl-2 pr-1 py-1 text-xs bg-background hover:bg-muted/50 border border-border/50 rounded-md text-foreground cursor-pointer outline-none font-medium"
                        value={editor.getAttributes('textStyle').fontFamily || 'Inter'}
                        onChange={(e) => {
                            const v = e.target.value
                            if (v === 'Inter') editor.chain().focus().unsetFontFamily().run()
                            else editor.chain().focus().setFontFamily(v).run()
                        }}
                    >
                        <option value="Inter">Default</option>
                        <option value="serif">Serif</option>
                        <option value="monospace">Mono</option>
                        <option value="'Georgia', serif">Georgia</option>
                        <option value="system-ui">System</option>
                    </select>
                </div>

                {/* Font Size S/M/L */}
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

                {/* Text Color swatches */}
                <div className="flex items-center gap-0.5 pr-2 border-r border-border/50 shrink-0">
                    {['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', 'inherit'].map((c) => (
                        <button key={c}
                            onClick={() => c === 'inherit' ? editor.chain().focus().unsetColor().run() : editor.chain().focus().setColor(c).run()}
                            className={cn('w-4 h-4 rounded-full transition-transform hover:scale-125 flex items-center justify-center border border-black/10',
                                editor.isActive('textStyle', { color: c }) && 'ring-2 ring-primary ring-offset-1')}
                            style={{ backgroundColor: c === 'inherit' ? 'transparent' : c }}
                            title={c === 'inherit' ? 'Default Color' : c}
                        >
                            {c === 'inherit' && <Ban className="w-3 h-3 text-muted-foreground" />}
                        </button>
                    ))}
                </div>

                {/* Highlight Color swatches (multicolor) */}
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
                    <div className="relative" ref={linkContainerRef}>
                        <button onClick={() => {
                            if (editor.isActive('link')) {
                                editor.chain().focus().unsetLink().run()
                            } else {
                                setLinkUrl(editor.getAttributes('link').href || '')
                                setShowLinkInput(v => !v)
                            }
                        }} title="Link (Ctrl+K)"
                            className={`p-1.5 rounded-md transition-colors ${editor.isActive('link') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}>
                            <LinkIcon className="w-4 h-4" />
                        </button>
                        {showLinkInput && (
                            <div className="absolute top-full mt-2 z-50 p-2 bg-popover text-popover-foreground border border-border shadow-xl rounded-lg flex gap-2 w-72"
                                style={{ left: 'min(0px, calc(100vw - 300px))' }}>
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
                            </div>
                        )}
                    </div>

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

                    {/* Math — inserts inline math since extension only has inlineMath node */}
                    <button onClick={() => {
                        editor.chain().focus().insertContent({
                            type: 'inlineMath',
                            attrs: { latex: 'E = mc^2' }
                        }).run()
                    }} title="Math / LaTeX"
                        className="p-1.5 rounded-md transition-colors text-muted-foreground hover:bg-muted/50 hover:text-foreground">
                        <Sigma className="w-4 h-4" />
                    </button>

                    {/* Table */}
                    <button onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} title="Insert Table"
                        className="p-1.5 rounded-md transition-colors text-muted-foreground hover:bg-muted/50 hover:text-foreground">
                        <TableIcon className="w-4 h-4" />
                    </button>

                    {/* Callout dropdown */}
                    <div className="relative">
                        <button onClick={() => setShowCalloutMenu(v => !v)} title="Insert Callout"
                            className={cn('p-1.5 rounded-md transition-colors', showCalloutMenu ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground')}>
                            <Info className="w-4 h-4" />
                        </button>
                        {showCalloutMenu && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setShowCalloutMenu(false)} />
                                <div className="absolute top-full left-0 mt-2 z-50 p-1 bg-popover border border-border shadow-xl rounded-lg min-w-[160px]">
                                    {(['info', 'warning', 'tip', 'danger', 'success'] as const).map(type => (
                                        <button key={type} type="button"
                                            onClick={() => {
                                                editor.chain().focus().insertContent({
                                                    type: 'callout',
                                                    attrs: { type },
                                                    content: [{ type: 'paragraph', content: [{ type: 'text', text: '' }] }]
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
                                </div>
                            </>
                        )}
                    </div>

                    {/* YouTube embed */}
                    <div className="relative" ref={youtubeContainerRef}>
                        <button onClick={() => { setShowYoutubeInput(v => !v); setYoutubeUrl('') }} title="Embed YouTube"
                            className={cn('p-1.5 rounded-md transition-colors', showYoutubeInput ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground')}>
                            <YoutubeIcon className="w-4 h-4" />
                        </button>
                        {showYoutubeInput && (
                            <div className="absolute top-full right-0 mt-2 z-50 p-2 bg-popover border border-border shadow-xl rounded-lg flex gap-2 w-80">
                                <input autoFocus type="url" placeholder="YouTube URL..."
                                    value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter') insertYoutube(); if (e.key === 'Escape') setShowYoutubeInput(false) }}
                                    className="h-8 flex-1 text-sm bg-background px-2 rounded-md border border-border outline-none focus:border-primary" />
                                <button type="button" onClick={insertYoutube}
                                    className="px-3 py-1 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90 transition-colors whitespace-nowrap">
                                    Embed
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Image */}
                    <button onClick={() => fileInputRef.current?.click()} title="Insert Image"
                        className="p-1.5 rounded-md transition-colors text-muted-foreground hover:bg-muted/50 hover:text-foreground">
                        <ImageIcon className="w-4 h-4" />
                    </button>

                    {/* Emoji */}
                    <div className="relative">
                        <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} title="Emoji"
                            className={`p-1.5 rounded-md transition-colors ${showEmojiPicker ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}>
                            <Smile className="w-4 h-4" />
                        </button>
                        {showEmojiPicker && (
                            <>
                                {/* Backdrop */}
                                <div className="fixed inset-0 z-40" onClick={() => setShowEmojiPicker(false)} />
                                {/* Picker — no overflow-hidden so skin tone panel renders correctly */}
                                <div className="absolute top-full right-0 mt-2 z-50 shadow-2xl rounded-xl border border-border/50">
                                    <Picker data={data} onEmojiSelect={(emoji: any) => {
                                        editor.chain().focus().insertContent(emoji.native).run()
                                        setShowEmojiPicker(false)
                                    }} theme="auto" />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Table Bubble Menu ─────────────────────────────────────── */}
            <BubbleMenu editor={editor} pluginKey="tableMenu" updateDelay={0}
                shouldShow={({ editor }) => editor.isActive('table')}
                className="flex items-center gap-0.5 p-1 bg-popover border border-border/50 shadow-xl rounded-lg backdrop-blur-md">
                {/* Column ops */}
                <button onClick={() => editor.chain().focus().addColumnBefore().run()} title="Add Column Left"
                    className="p-1.5 text-[10px] hover:bg-muted/50 rounded text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                    <Columns className="w-3.5 h-3.5" /><span className="hidden sm:inline">+Col L</span>
                </button>
                <button onClick={() => editor.chain().focus().addColumnAfter().run()} title="Add Column Right"
                    className="p-1.5 text-[10px] hover:bg-muted/50 rounded text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                    <Columns className="w-3.5 h-3.5" /><span className="hidden sm:inline">+Col R</span>
                </button>
                <button onClick={() => editor.chain().focus().deleteColumn().run()} title="Delete Column"
                    className="p-1.5 hover:bg-red-500/10 rounded text-red-500 transition-colors" >
                    <Trash2 className="w-3.5 h-3.5" />
                </button>
                <div className="w-px h-4 bg-border/50 mx-0.5" />
                {/* Row ops */}
                <button onClick={() => editor.chain().focus().addRowBefore().run()} title="Add Row Above"
                    className="p-1.5 text-[10px] hover:bg-muted/50 rounded text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                    <Rows className="w-3.5 h-3.5" /><span className="hidden sm:inline">+Row ↑</span>
                </button>
                <button onClick={() => editor.chain().focus().addRowAfter().run()} title="Add Row Below"
                    className="p-1.5 text-[10px] hover:bg-muted/50 rounded text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                    <Rows className="w-3.5 h-3.5" /><span className="hidden sm:inline">+Row ↓</span>
                </button>
                <button onClick={() => editor.chain().focus().deleteRow().run()} title="Delete Row"
                    className="p-1.5 hover:bg-red-500/10 rounded text-red-500 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                </button>
                <div className="w-px h-4 bg-border/50 mx-0.5" />
                {/* Header toggles */}
                <button onClick={() => editor.chain().focus().toggleHeaderRow().run()} title="Toggle Header Row"
                    className="p-1.5 text-[10px] hover:bg-muted/50 rounded text-muted-foreground hover:text-foreground transition-colors">
                    <FlipHorizontal className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => editor.chain().focus().toggleHeaderColumn().run()} title="Toggle Header Column"
                    className="p-1.5 text-[10px] hover:bg-muted/50 rounded text-muted-foreground hover:text-foreground transition-colors">
                    <FlipVertical className="w-3.5 h-3.5" />
                </button>
                <div className="w-px h-4 bg-border/50 mx-0.5" />
                {/* Merge/Split */}
                <button onClick={() => editor.chain().focus().mergeCells().run()} title="Merge Cells"
                    className="p-1.5 hover:bg-muted/50 rounded text-muted-foreground hover:text-foreground transition-colors">
                    <Merge className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => editor.chain().focus().splitCell().run()} title="Split Cell"
                    className="p-1.5 hover:bg-muted/50 rounded text-muted-foreground hover:text-foreground transition-colors">
                    <Split className="w-3.5 h-3.5" />
                </button>
                <div className="w-px h-4 bg-border/50 mx-0.5" />
                <button onClick={() => editor.chain().focus().deleteTable().run()} title="Delete Table"
                    className="p-1.5 hover:bg-red-500/20 rounded text-red-600 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                </button>
            </BubbleMenu>

            {/* ── Text Bubble Menu ──────────────────────────────────────── */}
            <BubbleMenu editor={editor} pluginKey="textMenu"
                shouldShow={({ editor, from, to }) => {
                    if (editor.isActive('table')) return false
                    return from !== to && !editor.isActive('image')
                }}
                className="flex items-center gap-0.5 p-1 bg-popover border border-border/50 shadow-xl rounded-lg backdrop-blur-md">
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
