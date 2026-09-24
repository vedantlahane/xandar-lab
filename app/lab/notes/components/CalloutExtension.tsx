// Custom TipTap Callout Node — supports full block content
import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent } from '@tiptap/react'
import { useState, useEffect, useRef } from 'react'
import { Info, AlertTriangle, Lightbulb, XCircle, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export type CalloutType = 'info' | 'warning' | 'tip' | 'danger' | 'success'

const CALLOUT_STYLES: Record<CalloutType, { bg: string; border: string; text: string; icon: React.ElementType }> = {
    info:    { bg: 'bg-sky-500/10',     border: 'border-sky-500/30',    text: 'text-sky-600 dark:text-sky-400',    icon: Info },
    warning: { bg: 'bg-amber-500/10',   border: 'border-amber-500/30',  text: 'text-amber-600 dark:text-amber-400', icon: AlertTriangle },
    tip:     { bg: 'bg-violet-500/10',  border: 'border-violet-500/30', text: 'text-violet-600 dark:text-violet-400', icon: Lightbulb },
    danger:  { bg: 'bg-red-500/10',     border: 'border-red-500/30',    text: 'text-red-600 dark:text-red-400',    icon: XCircle },
    success: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30',text: 'text-emerald-600 dark:text-emerald-400', icon: CheckCircle },
}

function CalloutNodeView({ node, updateAttributes }: any) {
    const type: CalloutType = node.attrs.type || 'info'
    const style = CALLOUT_STYLES[type]
    const Icon = style.icon
    const [showPicker, setShowPicker] = useState(false)
    const pickerRef = useRef<HTMLDivElement>(null)

    // Close picker when clicking outside
    useEffect(() => {
        if (!showPicker) return
        const handler = (e: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(e.target as globalThis.Node)) {
                setShowPicker(false)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [showPicker])

    return (
        <NodeViewWrapper>
            <div className={cn('relative my-3 flex gap-3 rounded-lg border p-4 text-sm', style.bg, style.border)}>
                <div ref={pickerRef} contentEditable={false} className="relative shrink-0">
                    <button
                        onClick={() => setShowPicker(p => !p)}
                        className={cn('mt-0.5 transition-opacity hover:opacity-70', style.text)}
                        title="Change callout type"
                    >
                        <Icon className="w-4 h-4" />
                    </button>
                    {showPicker && (
                        <div className="absolute left-0 top-full mt-1 z-50 flex gap-1 p-1.5 rounded-lg border border-border/50 bg-background shadow-xl">
                            {(Object.keys(CALLOUT_STYLES) as CalloutType[]).map(t => {
                                const S = CALLOUT_STYLES[t]
                                const I = S.icon
                                return (
                                    <button
                                        key={t}
                                        onClick={() => { updateAttributes({ type: t }); setShowPicker(false) }}
                                        className={cn('p-1.5 rounded-md', S.text, 'hover:bg-muted/30')}
                                        title={t}
                                    >
                                        <I className="w-4 h-4" />
                                    </button>
                                )
                            })}
                        </div>
                    )}
                </div>
                <NodeViewContent className="flex-1 outline-none text-foreground/90 leading-relaxed min-h-[1.5em] prose prose-sm dark:prose-invert max-w-none" />
            </div>
        </NodeViewWrapper>
    )
}

export const CalloutExtension = Node.create({
    name: 'callout',
    group: 'block',
    content: 'block+',
    defining: true,

    addAttributes() {
        return {
            type: {
                default: 'info',
                parseHTML: el => el.getAttribute('data-type') as CalloutType,
                renderHTML: attrs => ({ 'data-type': attrs.type }),
            },
        }
    },

    parseHTML() {
        return [{ tag: 'div[data-callout]' }]
    },

    renderHTML({ HTMLAttributes }) {
        return ['div', mergeAttributes({ 'data-callout': '' }, HTMLAttributes), 0]
    },

    addNodeView() {
        return ReactNodeViewRenderer(CalloutNodeView)
    },

    addKeyboardShortcuts() {
        return {
            'Mod-Shift-c': () => this.editor.commands.insertContent({
                type: this.name,
                attrs: { type: 'info' },
                content: [{ type: 'paragraph' }],
            }),
        }
    },
})
