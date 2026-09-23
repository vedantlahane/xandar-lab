'use client'

import { useEditor, EditorContent, useEditorState } from '@tiptap/react'
import { BubbleMenu } from '@tiptap/react/menus'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { Underline } from '@tiptap/extension-underline'
import { Highlight } from '@tiptap/extension-highlight'
import { TextAlign } from '@tiptap/extension-text-align'
import CharacterCount from '@tiptap/extension-character-count'
import TableOfContentsExtension from '@tiptap/extension-table-of-contents'
import { common, createLowlight } from 'lowlight'
import { useEffect, useRef, useState, useCallback } from 'react'
import {
    Image as ImageIcon, Loader2, Bold, Italic, Strikethrough, Link as LinkIcon,
    Underline as UnderlineIcon, Highlighter, AlignLeft, AlignCenter, AlignRight, Quote
} from 'lucide-react'
import { SlashCommand, getSuggestionItems, renderItems } from './SlashCommand'
import GlobalDragHandle from 'tiptap-extension-global-drag-handle'
import { CalloutExtension } from './CalloutExtension'

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
            Image.configure({ inline: true, allowBase64: true }),
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

            {/* Bubble Menu */}
            <BubbleMenu editor={editor} className="flex items-center gap-0.5 p-1 bg-background border border-border/50 shadow-xl rounded-lg backdrop-blur-md flex-wrap max-w-xs">
                {[
                    { icon: Bold, action: () => editor.chain().focus().toggleBold().run(), active: 'bold', title: 'Bold (Ctrl+B)' },
                    { icon: Italic, action: () => editor.chain().focus().toggleItalic().run(), active: 'italic', title: 'Italic (Ctrl+I)' },
                    { icon: UnderlineIcon, action: () => editor.chain().focus().toggleUnderline().run(), active: 'underline', title: 'Underline (Ctrl+U)' },
                    { icon: Strikethrough, action: () => editor.chain().focus().toggleStrike().run(), active: 'strike', title: 'Strikethrough' },
                    { icon: Highlighter, action: () => editor.chain().focus().toggleHighlight().run(), active: 'highlight', title: 'Highlight' },
                ].map(({ icon: Icon, action, active, title }) => (
                    <button key={active} onClick={action} title={title}
                        className={`p-1.5 rounded-md transition-colors ${editor.isActive(active) ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}>
                        <Icon className="w-3.5 h-3.5" />
                    </button>
                ))}
                <div className="w-px h-4 bg-border/50 mx-0.5" />
                {[
                    { icon: AlignLeft, action: () => editor.chain().focus().setTextAlign('left').run(), active: { textAlign: 'left' } },
                    { icon: AlignCenter, action: () => editor.chain().focus().setTextAlign('center').run(), active: { textAlign: 'center' } },
                    { icon: AlignRight, action: () => editor.chain().focus().setTextAlign('right').run(), active: { textAlign: 'right' } },
                ].map(({ icon: Icon, action, active }, i) => (
                    <button key={i} onClick={action}
                        className={`p-1.5 rounded-md transition-colors ${editor.isActive(active) ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}>
                        <Icon className="w-3.5 h-3.5" />
                    </button>
                ))}
                <div className="w-px h-4 bg-border/50 mx-0.5" />
                <button onClick={setLink} title="Link (Ctrl+K)"
                    className={`p-1.5 rounded-md transition-colors ${editor.isActive('link') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}>
                    <LinkIcon className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Blockquote"
                    className={`p-1.5 rounded-md transition-colors ${editor.isActive('blockquote') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}>
                    <Quote className="w-3.5 h-3.5" />
                </button>
            </BubbleMenu>

            <EditorContent editor={editor} className="flex-1 w-full outline-none" />

            {/* Status bar */}
            {!readOnly && (
                <div className="flex items-center gap-4 pt-4 mt-4 border-t border-border/20 text-[11px] text-muted-foreground/50">
                    <span>{wordCount} words</span>
                    <span>{charCount} characters</span>
                    <span>~{Math.max(1, Math.ceil(wordCount / 200))} min read</span>
                </div>
            )}
        </div>
    )
}
