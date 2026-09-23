import { Extension } from '@tiptap/core'
import Suggestion from '@tiptap/suggestion'
import { ReactRenderer } from '@tiptap/react'
import tippy, { Instance as TippyInstance } from 'tippy.js'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import {
    Heading1, Heading2, Heading3, List, ListOrdered, CheckSquare, Code,
    Image as ImageIcon, Quote, Minus, Table as TableIcon,
    Info, AlertTriangle, Lightbulb, XCircle, CheckCircle,
} from 'lucide-react'

export const getSuggestionItems = ({ query }: { query: string }) => {
    return [
        { title: 'Heading 1',      icon: <Heading1 className="w-4 h-4" />,      command: ({ editor, range }: any) => editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run() },
        { title: 'Heading 2',      icon: <Heading2 className="w-4 h-4" />,      command: ({ editor, range }: any) => editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run() },
        { title: 'Heading 3',      icon: <Heading3 className="w-4 h-4" />,      command: ({ editor, range }: any) => editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run() },
        { title: 'Bullet List',    icon: <List className="w-4 h-4" />,           command: ({ editor, range }: any) => editor.chain().focus().deleteRange(range).toggleBulletList().run() },
        { title: 'Numbered List',  icon: <ListOrdered className="w-4 h-4" />,   command: ({ editor, range }: any) => editor.chain().focus().deleteRange(range).toggleOrderedList().run() },
        { title: 'Task List',      icon: <CheckSquare className="w-4 h-4" />,   command: ({ editor, range }: any) => editor.chain().focus().deleteRange(range).toggleTaskList().run() },
        { title: 'Code Block',     icon: <Code className="w-4 h-4" />,          command: ({ editor, range }: any) => editor.chain().focus().deleteRange(range).toggleCodeBlock().run() },
        { title: 'Quote',          icon: <Quote className="w-4 h-4" />,         command: ({ editor, range }: any) => editor.chain().focus().deleteRange(range).toggleBlockquote().run() },
        { title: 'Divider',        icon: <Minus className="w-4 h-4" />,         command: ({ editor, range }: any) => editor.chain().focus().deleteRange(range).setHorizontalRule().run() },
        { title: 'Table',          icon: <TableIcon className="w-4 h-4" />,     command: ({ editor, range }: any) => editor.chain().focus().deleteRange(range).insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run() },
        { title: 'Info Callout',   icon: <Info className="w-4 h-4 text-sky-500" />,     command: ({ editor, range }: any) => editor.chain().focus().deleteRange(range).insertContent({ type: 'callout', attrs: { type: 'info' },    content: [{ type: 'text', text: '' }] }).run() },
        { title: 'Warning Callout',icon: <AlertTriangle className="w-4 h-4 text-amber-500" />, command: ({ editor, range }: any) => editor.chain().focus().deleteRange(range).insertContent({ type: 'callout', attrs: { type: 'warning' }, content: [{ type: 'text', text: '' }] }).run() },
        { title: 'Tip Callout',    icon: <Lightbulb className="w-4 h-4 text-violet-500" />, command: ({ editor, range }: any) => editor.chain().focus().deleteRange(range).insertContent({ type: 'callout', attrs: { type: 'tip' },     content: [{ type: 'text', text: '' }] }).run() },
        { title: 'Danger Callout', icon: <XCircle className="w-4 h-4 text-red-500" />,      command: ({ editor, range }: any) => editor.chain().focus().deleteRange(range).insertContent({ type: 'callout', attrs: { type: 'danger' },  content: [{ type: 'text', text: '' }] }).run() },
        { title: 'Success Callout',icon: <CheckCircle className="w-4 h-4 text-emerald-500" />, command: ({ editor, range }: any) => editor.chain().focus().deleteRange(range).insertContent({ type: 'callout', attrs: { type: 'success' }, content: [{ type: 'text', text: '' }] }).run() },
    ].filter(item => item.title.toLowerCase().includes(query.toLowerCase())).slice(0, 12)
}

// CommandList component
export const CommandList = forwardRef(({ items, command }: any, ref: any) => {
    const [selectedIndex, setSelectedIndex] = useState(0)

    const selectItem = (index: number) => {
        const item = items[index]
        if (item) command(item)
    }

    useEffect(() => setSelectedIndex(0), [items])

    useImperativeHandle(ref, () => ({
        onKeyDown: ({ event }: { event: KeyboardEvent }) => {
            if (event.key === 'ArrowUp') { setSelectedIndex(i => (i - 1 + items.length) % items.length); return true }
            if (event.key === 'ArrowDown') { setSelectedIndex(i => (i + 1) % items.length); return true }
            if (event.key === 'Enter') { selectItem(selectedIndex); return true }
            return false
        },
    }))

    if (!items.length) return null

    return (
        <div className="overflow-hidden rounded-xl border border-border/50 bg-background shadow-2xl backdrop-blur-md min-w-[220px]">
            <div className="p-1 max-h-72 overflow-y-auto">
                <p className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">Blocks</p>
                {items.map((item: any, index: number) => (
                    <button
                        key={item.title}
                        onClick={() => selectItem(index)}
                        className={`flex items-center gap-2.5 w-full text-left px-2.5 py-2 rounded-lg text-sm transition-colors ${index === selectedIndex ? 'bg-primary/8 text-foreground' : 'text-muted-foreground hover:bg-muted/30 hover:text-foreground'}`}
                    >
                        <span className="w-5 h-5 flex items-center justify-center shrink-0">{item.icon}</span>
                        <span className="font-medium">{item.title}</span>
                    </button>
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
