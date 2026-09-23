'use client'

import { useEditor, EditorContent, useEditorState } from '@tiptap/react'
import { BubbleMenu } from '@tiptap/react/menus'
import Placeholder from '@tiptap/extension-placeholder'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import ImageResize from 'tiptap-extension-resize-image'
import Link from '@tiptap/extension-link'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
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
import { common, createLowlight } from 'lowlight'
import { useEffect, useRef, useState, useCallback } from 'react'
import {
    Image as ImageIcon, Loader2, Bold, Italic, Strikethrough, Link as LinkIcon,
    Underline as UnderlineIcon, Highlighter, AlignLeft, AlignCenter, AlignRight, Quote,
    Superscript as SuperscriptIcon, Subscript as SubscriptIcon, Code, Undo, Redo, Palette, Smile,
    Table as TableIcon, Heading1, Heading2, Heading3, List, ListOrdered, CheckSquare, Eraser, Type,
    Sigma, SquareTerminal
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

export function BlockEditor({ content, onChange, readOnly = false, onTocUpdate }: BlockEditorProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)

    const slashSuggestionItems = useCallback(({ query }: { query: string }) => {
        const items = getSuggestionItems({ query })
        if ('image'.startsWith(query.toLowerCase())) {
            items.push({
                title: 'Image',
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
                heading: { levels: [1, 2, 3] },
                codeBlock: false,
            }),
            CodeBlockLowlight.configure({ lowlight }),
            Table.configure({ resizable: true }),
            TableRow,
            TableHeader,
            TableCell,
            Underline,
            Highlight.configure({ multicolor: false }),
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

    const setLink = () => {
        const prev = editor?.getAttributes('link').href
        const url = window.prompt('URL', prev)
        if (url === null) return
        if (url === '') {
            editor?.chain().focus().extendMarkRange('link').unsetLink().run()
        } else {
            editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
        }
    }

    // Expose word/char count
    const wordCount = editor ? editor.storage.characterCount?.words() ?? 0 : 0
    const charCount = editor ? editor.storage.characterCount?.characters() ?? 0 : 0

    if (!editor) return null

    return (
        <div className="w-full relative flex flex-col" data-block-editor>
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />

            {isUploading && (
                <div className="absolute top-2 right-2 z-10 flex items-center gap-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded-md backdrop-blur-md">
                    <Loader2 className="w-3 h-3 animate-spin" /> Uploading...
                </div>
            )}

            {/* Static Toolbar (Advanced) */}
            <div className="sticky top-0 z-20 flex items-center p-1.5 mb-6 bg-background/95 backdrop-blur-md border border-border/50 shadow-sm rounded-lg flex-wrap gap-y-1.5 gap-x-1">
                {/* History & Clear */}
                <div className="flex items-center gap-0.5 pr-2 border-r border-border/50">
                    <button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo (Ctrl+Z)"
                        className="p-1.5 rounded-md transition-colors text-muted-foreground hover:bg-muted/50 hover:text-foreground disabled:opacity-50">
                        <Undo className="w-4 h-4" />
                    </button>
                    <button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo (Ctrl+Y)"
                        className="p-1.5 rounded-md transition-colors text-muted-foreground hover:bg-muted/50 hover:text-foreground disabled:opacity-50">
                        <Redo className="w-4 h-4" />
                    </button>
                    <button onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} title="Clear Formatting"
                        className="p-1.5 rounded-md transition-colors text-muted-foreground hover:bg-muted/50 hover:text-foreground ml-1">
                        <Eraser className="w-4 h-4" />
                    </button>
                </div>

                {/* Block Type Dropdown */}
                <div className="flex items-center pr-2 border-r border-border/50">
                    <select
                        className="h-8 pl-2 pr-6 py-1 text-xs bg-transparent hover:bg-muted/50 border-none rounded-md focus:ring-0 text-foreground cursor-pointer outline-none appearance-none font-medium"
                        value={
                            editor.isActive('heading', { level: 1 }) ? 'h1' :
                            editor.isActive('heading', { level: 2 }) ? 'h2' :
                            editor.isActive('heading', { level: 3 }) ? 'h3' :
                            editor.isActive('bulletList') ? 'bullet' :
                            editor.isActive('orderedList') ? 'ordered' :
                            editor.isActive('taskList') ? 'task' :
                            'p'
                        }
                        onChange={(e) => {
                            const v = e.target.value;
                            if (v === 'p') editor.chain().focus().setParagraph().run();
                            if (v === 'h1') editor.chain().focus().toggleHeading({ level: 1 }).run();
                            if (v === 'h2') editor.chain().focus().toggleHeading({ level: 2 }).run();
                            if (v === 'h3') editor.chain().focus().toggleHeading({ level: 3 }).run();
                            if (v === 'bullet') editor.chain().focus().toggleBulletList().run();
                            if (v === 'ordered') editor.chain().focus().toggleOrderedList().run();
                            if (v === 'task') editor.chain().focus().toggleTaskList().run();
                        }}
                    >
                        <option value="p">Normal Text</option>
                        <option value="h1">Heading 1</option>
                        <option value="h2">Heading 2</option>
                        <option value="h3">Heading 3</option>
                        <option value="bullet">Bullet List</option>
                        <option value="ordered">Numbered List</option>
                        <option value="task">Task List</option>
                    </select>
                </div>

                {/* Font Size */}
                <div className="flex items-center gap-0.5 pr-2 border-r border-border/50">
                    <button onClick={() => editor.chain().focus().setFontSize('0.875em').run()} title="Small Text"
                        className={cn('px-2 py-1 rounded text-[10px] font-medium transition-colors', editor.isActive('textStyle', { fontSize: '0.875em' }) ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground')}>
                        S
                    </button>
                    <button onClick={() => editor.chain().focus().unsetFontSize().run()} title="Normal Text"
                        className={cn('px-2 py-1 rounded text-xs font-medium transition-colors', !editor.isActive('textStyle', { fontSize: '0.875em' }) && !editor.isActive('textStyle', { fontSize: '1.25em' }) ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground')}>
                        M
                    </button>
                    <button onClick={() => editor.chain().focus().setFontSize('1.25em').run()} title="Large Text"
                        className={cn('px-2 py-1 rounded text-sm font-medium transition-colors', editor.isActive('textStyle', { fontSize: '1.25em' }) ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground')}>
                        L
                    </button>
                </div>

                {/* Text Styles */}
                <div className="flex items-center gap-0.5 pr-2 border-r border-border/50">
                    {[
                        { icon: Bold, action: () => editor.chain().focus().toggleBold().run(), active: 'bold', title: 'Bold (Ctrl+B)' },
                        { icon: Italic, action: () => editor.chain().focus().toggleItalic().run(), active: 'italic', title: 'Italic (Ctrl+I)' },
                        { icon: UnderlineIcon, action: () => editor.chain().focus().toggleUnderline().run(), active: 'underline', title: 'Underline (Ctrl+U)' },
                        { icon: Strikethrough, action: () => editor.chain().focus().toggleStrike().run(), active: 'strike', title: 'Strikethrough' },
                        { icon: Highlighter, action: () => editor.chain().focus().toggleHighlight().run(), active: 'highlight', title: 'Highlight' },
                        { icon: Code, action: () => editor.chain().focus().toggleCode().run(), active: 'code', title: 'Inline Code' },
                        { icon: SubscriptIcon, action: () => editor.chain().focus().toggleSubscript().run(), active: 'subscript', title: 'Subscript' },
                        { icon: SuperscriptIcon, action: () => editor.chain().focus().toggleSuperscript().run(), active: 'superscript', title: 'Superscript' },
                    ].map(({ icon: Icon, action, active, title }) => (
                        <button key={active} onClick={action} title={title}
                            className={`p-1.5 rounded-md transition-colors ${editor.isActive(active) ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}>
                            <Icon className="w-4 h-4" />
                        </button>
                    ))}
                </div>

                {/* Color picker */}
                <div className="flex items-center gap-0.5 pr-2 border-r border-border/50">
                    {['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', 'inherit'].map((c) => (
                        <button key={c} onClick={() => c === 'inherit' ? editor.chain().focus().unsetColor().run() : editor.chain().focus().setColor(c).run()}
                            className={cn('w-4 h-4 rounded-full transition-transform hover:scale-110', editor.isActive('textStyle', { color: c }) && 'ring-2 ring-primary ring-offset-1')}
                            style={{ backgroundColor: c === 'inherit' ? 'transparent' : c }}
                            title={c === 'inherit' ? 'Default Color' : c}
                        >
                            {c === 'inherit' && <span className="text-[10px] flex items-center justify-center h-full w-full">↺</span>}
                        </button>
                    ))}
                </div>

                {/* Alignment */}
                <div className="flex items-center gap-0.5 pr-2 border-r border-border/50">
                    {[
                        { icon: AlignLeft, action: () => editor.chain().focus().setTextAlign('left').run(), active: { textAlign: 'left' }, title: 'Align Left' },
                        { icon: AlignCenter, action: () => editor.chain().focus().setTextAlign('center').run(), active: { textAlign: 'center' }, title: 'Align Center' },
                        { icon: AlignRight, action: () => editor.chain().focus().setTextAlign('right').run(), active: { textAlign: 'right' }, title: 'Align Right' },
                    ].map(({ icon: Icon, action, active, title }, i) => (
                        <button key={i} onClick={action} title={title}
                            className={`p-1.5 rounded-md transition-colors ${editor.isActive(active) ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}>
                            <Icon className="w-4 h-4" />
                        </button>
                    ))}
                </div>

                {/* Insert Menu */}
                <div className="flex items-center gap-0.5">
                    <button onClick={setLink} title="Link (Ctrl+K)"
                        className={`p-1.5 rounded-md transition-colors ${editor.isActive('link') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}>
                        <LinkIcon className="w-4 h-4" />
                    </button>
                    <button onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Blockquote"
                        className={`p-1.5 rounded-md transition-colors ${editor.isActive('blockquote') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}>
                        <Quote className="w-4 h-4" />
                    </button>
                    <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} title="Code Block"
                        className={`p-1.5 rounded-md transition-colors ${editor.isActive('codeBlock') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}>
                        <SquareTerminal className="w-4 h-4" />
                    </button>
                    <button onClick={() => editor.chain().focus().insertContent({ type: 'displayMath' }).run()} title="Math Equation"
                        className="p-1.5 rounded-md transition-colors text-muted-foreground hover:bg-muted/50 hover:text-foreground">
                        <Sigma className="w-4 h-4" />
                    </button>
                    <button onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} title="Insert Table"
                        className="p-1.5 rounded-md transition-colors text-muted-foreground hover:bg-muted/50 hover:text-foreground">
                        <TableIcon className="w-4 h-4" />
                    </button>
                    <button onClick={() => fileInputRef.current?.click()} title="Insert Image"
                        className="p-1.5 rounded-md transition-colors text-muted-foreground hover:bg-muted/50 hover:text-foreground">
                        <ImageIcon className="w-4 h-4" />
                    </button>
                    <div className="relative">
                        <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} title="Emoji"
                            className={`p-1.5 rounded-md transition-colors ${showEmojiPicker ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}>
                            <Smile className="w-4 h-4" />
                        </button>
                        {showEmojiPicker && (
                            <div className="absolute top-full right-0 sm:left-1/2 sm:-translate-x-1/2 mt-2 z-50 shadow-2xl rounded-xl overflow-hidden border border-border/50">
                                <div className="fixed inset-0 z-40" onClick={() => setShowEmojiPicker(false)} />
                                <div className="relative z-50 bg-zinc-950">
                                    <Picker data={data} onEmojiSelect={(emoji: any) => {
                                        editor.chain().focus().insertContent(emoji.native).run()
                                        setShowEmojiPicker(false)
                                    }} theme="auto" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Contextual Hover Menu (Notion Style) */}
            <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }} className="flex items-center gap-0.5 p-1 bg-background border border-border/50 shadow-xl rounded-lg backdrop-blur-md">
                {[
                    { icon: Bold, action: () => editor.chain().focus().toggleBold().run(), active: 'bold', title: 'Bold' },
                    { icon: Italic, action: () => editor.chain().focus().toggleItalic().run(), active: 'italic', title: 'Italic' },
                    { icon: UnderlineIcon, action: () => editor.chain().focus().toggleUnderline().run(), active: 'underline', title: 'Underline' },
                    { icon: Strikethrough, action: () => editor.chain().focus().toggleStrike().run(), active: 'strike', title: 'Strikethrough' },
                    { icon: Highlighter, action: () => editor.chain().focus().toggleHighlight().run(), active: 'highlight', title: 'Highlight' },
                    { icon: Code, action: () => editor.chain().focus().toggleCode().run(), active: 'code', title: 'Inline Code' },
                ].map(({ icon: Icon, action, active, title }) => (
                    <button key={active} onClick={action} title={title}
                        className={`p-1.5 rounded-md transition-colors ${editor.isActive(active) ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}>
                        <Icon className="w-3.5 h-3.5" />
                    </button>
                ))}
                <div className="w-px h-4 bg-border/50 mx-0.5" />
                <button onClick={setLink} title="Link"
                    className={`p-1.5 rounded-md transition-colors ${editor.isActive('link') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}>
                    <LinkIcon className="w-3.5 h-3.5" />
                </button>
            </BubbleMenu>

            <EditorContent editor={editor} className="flex-1 w-full outline-none" />

            {/* Status bar */}
            {!readOnly && (
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-border/20 text-[11px] text-muted-foreground/50">
                    <div className="flex items-center gap-4">
                        <span>{wordCount} words</span>
                        <span>{charCount} characters</span>
                        <span>~{Math.max(1, Math.ceil(wordCount / 200))} min read</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}
                            className="p-1 hover:text-foreground disabled:opacity-30 transition-colors" title="Undo">
                            <Undo className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}
                            className="p-1 hover:text-foreground disabled:opacity-30 transition-colors" title="Redo">
                            <Redo className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
