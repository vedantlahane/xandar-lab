import { ReactRenderer } from '@tiptap/react'
import tippy from 'tippy.js'
import MentionList from './MentionList'

export const MentionSuggestion = {
    items: async ({ query }: { query: string }) => {
        if (!query) return []
        try {
            const res = await fetch(`/api/notes/search?q=${encodeURIComponent(query)}`)
            if (!res.ok) return []
            const data = await res.json()
            return data.notes.slice(0, 5).map((n: any) => ({
                id: n.id || n._id,
                title: n.title,
                icon: n.icon || '📄'
            }))
        } catch (e) {
            return []
        }
    },
    render: () => {
        let component: ReactRenderer
        let popup: any

        return {
            onStart: (props: any) => {
                component = new ReactRenderer(MentionList, {
                    props,
                    editor: props.editor,
                })

                if (!props.clientRect) {
                    return
                }

                popup = tippy('body', {
                    getReferenceClientRect: props.clientRect,
                    appendTo: () => document.body,
                    content: component.element,
                    showOnCreate: true,
                    interactive: true,
                    trigger: 'manual',
                    placement: 'bottom-start',
                })
            },

            onUpdate(props: any) {
                component.updateProps(props)

                if (!props.clientRect) {
                    return
                }

                popup[0].setProps({
                    getReferenceClientRect: props.clientRect,
                })
            },

            onKeyDown(props: any) {
                if (props.event.key === 'Escape') {
                    popup[0].hide()
                    return true
                }
                return (component.ref as any)?.onKeyDown(props)
            },

            onExit() {
                popup[0].destroy()
                component.destroy()
            },
        }
    },
}
