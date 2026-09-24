import { Extension } from '@tiptap/core'
import Suggestion from '@tiptap/suggestion'
import { ReactRenderer } from '@tiptap/react'
import tippy, { Instance as TippyInstance } from 'tippy.js'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import {
    Heading1, Heading2, Heading3, Heading4, List, ListOrdered, CheckSquare, Code,
    Quote, Minus, Table as TableIcon, Video, Sigma,
    Info, AlertTriangle, Lightbulb, XCircle, CheckCircle, FlaskConical, Workflow, Server,
    Github, Braces, Youtube, BookOpen, HelpCircle, Sparkles
} from 'lucide-react'

// ─── Grouped command items ───────────────────────────────────────────────────

type CommandItem = {
    title: string
    shortcut?: string
    icon: React.ReactNode
    group: string
    command: (props: { editor: any; range: any }) => void
}

export const getSuggestionItems = ({ query }: { query: string }): CommandItem[] => {
    const all: CommandItem[] = [
        // AI
        { group: 'AI', title: 'Ask AI', shortcut: 'ai', icon: <Sparkles className="w-4 h-4 text-indigo-500" />, command: ({ editor, range }) => editor.chain().focus().deleteRange(range).insertContent({ type: 'aiPrompt' }).run() },
        // TEXT
        { group: 'Text', title: 'Normal Text',     shortcut: '',          icon: <span className="font-medium text-xs">¶</span>,   command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setParagraph().run() },
        { group: 'Text', title: 'Heading 1',        shortcut: '#',        icon: <Heading1 className="w-4 h-4" />,                   command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run() },
        { group: 'Text', title: 'Heading 2',        shortcut: '##',       icon: <Heading2 className="w-4 h-4" />,                   command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run() },
        { group: 'Text', title: 'Heading 3',        shortcut: '###',      icon: <Heading3 className="w-4 h-4" />,                   command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run() },
        { group: 'Text', title: 'Heading 4',        shortcut: '####',     icon: <Heading4 className="w-4 h-4" />,                   command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setNode('heading', { level: 4 }).run() },
        // LISTS
        { group: 'Lists', title: 'Bullet List',    shortcut: '-',         icon: <List className="w-4 h-4" />,                       command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleBulletList().run() },
        { group: 'Lists', title: 'Numbered List',  shortcut: '1.',        icon: <ListOrdered className="w-4 h-4" />,                command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleOrderedList().run() },
        { group: 'Lists', title: 'Task List',      shortcut: '[]',        icon: <CheckSquare className="w-4 h-4" />,                command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleTaskList().run() },
        // BLOCKS
        { group: 'Blocks', title: 'Code Block',    shortcut: '```',       icon: <Code className="w-4 h-4" />,                       command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleCodeBlock().run() },
        { group: 'Blocks', title: 'Quote',         shortcut: '>',         icon: <Quote className="w-4 h-4" />,                      command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleBlockquote().run() },
        { group: 'Blocks', title: 'Divider',       shortcut: '---',       icon: <Minus className="w-4 h-4" />,                      command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setHorizontalRule().run() },
        { group: 'Blocks', title: 'Table',         shortcut: '',          icon: <TableIcon className="w-4 h-4" />,                  command: ({ editor, range }) => editor.chain().focus().deleteRange(range).insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run() },
        { group: 'Blocks', title: 'Math / LaTeX',  shortcut: '$$',        icon: <Sigma className="w-4 h-4" />,                      command: ({ editor, range }) => editor.chain().focus().deleteRange(range).insertContent({ type: 'inlineMath', attrs: { latex: '\\sum_{i=1}^{n} x_i' } }).run() },
        { group: 'Blocks', title: 'Chemical',      shortcut: 'chem',      icon: <FlaskConical className="w-4 h-4 text-emerald-500" />, command: ({ editor, range }) => editor.chain().focus().deleteRange(range).insertContent({ type: 'chemical', attrs: { smiles: 'C1=CC=C(C=C1)O' } }).run() },
        { group: 'Blocks', title: 'Mermaid Diagram', shortcut: 'mermaid', icon: <Workflow className="w-4 h-4 text-blue-500" />,     command: ({ editor, range }) => editor.chain().focus().deleteRange(range).insertContent({ type: 'mermaid' }).run() },
        { group: 'Blocks', title: 'API Tester',    shortcut: 'api',       icon: <Server className="w-4 h-4 text-orange-500" />,     command: ({ editor, range }) => editor.chain().focus().deleteRange(range).insertContent({ type: 'apiTester' }).run() },
        { group: 'Blocks', title: 'JSON Viewer',   shortcut: 'json',      icon: <Braces className="w-4 h-4 text-yellow-500" />,    command: ({ editor, range }) => editor.chain().focus().deleteRange(range).insertContent({ type: 'jsonViewer' }).run() },
        { group: 'Blocks', title: 'GitHub Embed',  shortcut: 'github',    icon: <Github className="w-4 h-4 text-zinc-500" />,      command: ({ editor, range }) => editor.chain().focus().deleteRange(range).insertContent({ type: 'githubEmbed' }).run() },
        { group: 'Blocks', title: 'Media Embed',   shortcut: 'embed',     icon: <Youtube className="w-4 h-4 text-red-500" />,      command: ({ editor, range }) => editor.chain().focus().deleteRange(range).insertContent({ type: 'mediaEmbed' }).run() },
        // LEARNING
        { group: 'Learning', title: 'Flashcard', shortcut: 'flashcard', icon: <BookOpen className="w-4 h-4 text-indigo-500" />, command: ({ editor, range }) => editor.chain().focus().deleteRange(range).insertContent({ type: 'flashcard' }).run() },
        { group: 'Learning', title: 'Quiz (MCQ)', shortcut: 'quiz', icon: <HelpCircle className="w-4 h-4 text-pink-500" />, command: ({ editor, range }) => editor.chain().focus().deleteRange(range).insertContent({ type: 'quiz' }).run() },
        // CALLOUTS
        { group: 'Callouts', title: 'Info Callout',    icon: <Info className="w-4 h-4 text-sky-500" />,        command: ({ editor, range }) => editor.chain().focus().deleteRange(range).insertContent({ type: 'callout', attrs: { type: 'info' },    content: [{ type: 'paragraph' }] }).run() },
        { group: 'Callouts', title: 'Warning Callout', icon: <AlertTriangle className="w-4 h-4 text-amber-500" />, command: ({ editor, range }) => editor.chain().focus().deleteRange(range).insertContent({ type: 'callout', attrs: { type: 'warning' }, content: [{ type: 'paragraph' }] }).run() },
        { group: 'Callouts', title: 'Tip Callout',     icon: <Lightbulb className="w-4 h-4 text-violet-500" />,  command: ({ editor, range }) => editor.chain().focus().deleteRange(range).insertContent({ type: 'callout', attrs: { type: 'tip' },     content: [{ type: 'paragraph' }] }).run() },
        { group: 'Callouts', title: 'Danger Callout',  icon: <XCircle className="w-4 h-4 text-red-500" />,       command: ({ editor, range }) => editor.chain().focus().deleteRange(range).insertContent({ type: 'callout', attrs: { type: 'danger' },  content: [{ type: 'paragraph' }] }).run() },
        { group: 'Callouts', title: 'Success Callout', icon: <CheckCircle className="w-4 h-4 text-emerald-500" />, command: ({ editor, range }) => editor.chain().focus().deleteRange(range).insertContent({ type: 'callout', attrs: { type: 'success' }, content: [{ type: 'paragraph' }] }).run() },
        // MEDIA
        { group: 'Media', title: 'YouTube Video', icon: <Video className="w-4 h-4" />, command: ({ editor, range }) => {
            // Dispatch a custom event so BlockEditor can show its YouTube dialog
            editor.chain().focus().deleteRange(range).run()
            document.dispatchEvent(new CustomEvent('editor:insert-youtube', { detail: { editor } }))
        }},
    ]

    const q = query.toLowerCase()
    return all.filter(item =>
        item.title.toLowerCase().includes(q) || item.group.toLowerCase().includes(q)
    ).slice(0, 15)
}

// ─── CommandList component ───────────────────────────────────────────────────

export const CommandList = forwardRef(({ items, command }: any, ref: any) => {
    const [selectedIndex, setSelectedIndex] = useState(0)
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    const selectItem = (index: number) => {
        const item = items[index]
        if (item) command(item)
    }

    useEffect(() => setSelectedIndex(0), [items])

    useEffect(() => {
        const container = scrollContainerRef.current
        if (!container) return
        const selected = container.querySelector('[data-selected="true"]') as HTMLElement
        if (selected) {
            selected.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
        }
    }, [selectedIndex])

    useImperativeHandle(ref, () => ({
        onKeyDown: ({ event }: { event: KeyboardEvent }) => {
            if (event.key === 'ArrowUp') { setSelectedIndex(i => (i - 1 + items.length) % items.length); return true }
            if (event.key === 'ArrowDown') { setSelectedIndex(i => (i + 1) % items.length); return true }
            if (event.key === 'Enter') { selectItem(selectedIndex); return true }
            return false
        },
    }))

    if (!items.length) return null

    // Group items
    const groups: Record<string, CommandItem[]> = {}
    items.forEach((item: CommandItem) => {
        if (!groups[item.group]) groups[item.group] = []
        groups[item.group].push(item)
    })

    let flatIndex = 0

    return (
        <div className="overflow-hidden rounded-xl border border-border/50 bg-background shadow-2xl backdrop-blur-md min-w-[240px]">
            <div ref={scrollContainerRef} className="p-1 max-h-80 overflow-y-auto">
                {Object.entries(groups).map(([groupName, groupItems]) => (
                    <div key={groupName}>
                        <p className="px-2 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">
                            {groupName}
                        </p>
                        {groupItems.map((item: CommandItem) => {
                            const currentIndex = flatIndex++
                            return (
                                <button
                                    key={item.title}
                                    data-selected={currentIndex === selectedIndex ? 'true' : undefined}
                                    onClick={() => selectItem(currentIndex)}
                                    className={`flex items-center gap-2.5 w-full text-left px-2.5 py-1.5 rounded-lg text-sm transition-colors ${currentIndex === selectedIndex ? 'bg-primary/10 text-foreground' : 'text-muted-foreground hover:bg-muted/30 hover:text-foreground'}`}
                                >
                                    <span className="w-5 h-5 flex items-center justify-center shrink-0">{item.icon}</span>
                                    <span className="font-medium flex-1">{item.title}</span>
                                    {item.shortcut && (
                                        <span className="text-[10px] font-mono text-muted-foreground/40 shrink-0">{item.shortcut}</span>
                                    )}
                                </button>
                            )
                        })}
                    </div>
                ))}
            </div>
        </div>
    )
})
CommandList.displayName = 'CommandList'

export const renderItems = () => {
    let component: ReactRenderer | null = null
    let popup: TippyInstance[] | null = null

    return {
        onStart: (props: any) => {
            component = new ReactRenderer(CommandList, { props, editor: props.editor })
            popup = tippy('body', {
                getReferenceClientRect: props.clientRect,
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: 'manual',
                placement: 'bottom-start',
                theme: 'none',
                animation: false,
            })
        },
        onUpdate: (props: any) => {
            component?.updateProps(props)
            if (popup?.[0]) popup[0].setProps({ getReferenceClientRect: props.clientRect })
        },
        onKeyDown: (props: any) => {
            if (props.event.key === 'Escape') { popup?.[0]?.hide(); return true }
            return (component?.ref as any)?.onKeyDown(props) ?? false
        },
        onExit: () => {
            popup?.[0]?.destroy()
            component?.destroy()
        },
    }
}

export const SlashCommand = Extension.create({
    name: 'slashCommand',
    addOptions() {
        return { suggestion: { char: '/', command: ({ editor, range, props }: any) => { props.command({ editor, range }) } } }
    },
    addProseMirrorPlugins() {
        return [Suggestion({ editor: this.editor, ...this.options.suggestion })]
    },
})
