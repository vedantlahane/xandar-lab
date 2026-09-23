import { Extension } from '@tiptap/core'
import Suggestion from '@tiptap/suggestion'
import { ReactRenderer } from '@tiptap/react'
import tippy, { Instance as TippyInstance } from 'tippy.js'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { Heading1, Heading2, List, CheckSquare, Code, Image as ImageIcon } from 'lucide-react'

// 1. Define the items available in the slash command menu
export const getSuggestionItems = ({ query }: { query: string }) => {
    return [
        {
            title: 'Heading 1',
            icon: <Heading1 className="w-4 h-4" />,
            command: ({ editor, range }: any) => {
                editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run()
            },
        },
        {
            title: 'Heading 2',
            icon: <Heading2 className="w-4 h-4" />,
            command: ({ editor, range }: any) => {
                editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run()
            },
        },
        {
            title: 'Bullet List',
            icon: <List className="w-4 h-4" />,
            command: ({ editor, range }: any) => {
                editor.chain().focus().deleteRange(range).toggleBulletList().run()
            },
        },
        {
            title: 'Task List',
            icon: <CheckSquare className="w-4 h-4" />,
            command: ({ editor, range }: any) => {
                editor.chain().focus().deleteRange(range).toggleTaskList().run()
            },
        },
        {
            title: 'Code Block',
            icon: <Code className="w-4 h-4" />,
            command: ({ editor, range }: any) => {
                editor.chain().focus().deleteRange(range).toggleCodeBlock().run()
            },
        },
        // We will pass an external trigger for Image upload
    ].filter(item => item.title.toLowerCase().startsWith(query.toLowerCase())).slice(0, 10)
}

// 2. React component for the dropdown menu
export const CommandList = forwardRef((props: any, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0)

    const selectItem = (index: number) => {
        const item = props.items[index]
        if (item) {
            props.command(item)
        }
    }

    const upHandler = () => {
        setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length)
    }

    const downHandler = () => {
        setSelectedIndex((selectedIndex + 1) % props.items.length)
    }

    const enterHandler = () => {
        selectItem(selectedIndex)
    }

    useEffect(() => {
        setSelectedIndex(0)
    }, [props.items])

    useImperativeHandle(ref, () => ({
        onKeyDown: ({ event }: any) => {
            if (event.key === 'ArrowUp') {
                upHandler()
                return true
            }
            if (event.key === 'ArrowDown') {
                downHandler()
                return true
            }
            if (event.key === 'Enter') {
                enterHandler()
                return true
            }
            return false
        },
    }))

    if (!props.items.length) {
        return null
    }

    return (
        <div className="flex flex-col gap-1 p-1.5 bg-background border border-border/50 shadow-xl rounded-xl w-48 backdrop-blur-md z-50">
            <div className="px-2 pb-1.5 pt-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Insert
            </div>
            {props.items.map((item: any, index: number) => (
                <button
                    className={`flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm transition-colors text-left ${index === selectedIndex ? 'bg-primary/10 text-primary' : 'text-foreground/80 hover:bg-muted/30 hover:text-foreground'}`}
                    key={index}
                    onClick={() => selectItem(index)}
                >
                    <div className="flex items-center justify-center w-6 h-6 rounded bg-muted/40 shrink-0">
                        {item.icon}
                    </div>
                    {item.title}
                </button>
            ))}
        </div>
    )
})

CommandList.displayName = 'CommandList'

// 3. Create the TipTap Extension
export const SlashCommand = Extension.create({
    name: 'slashCommand',

    addOptions() {
        return {
            suggestion: {
                char: '/',
                command: ({ editor, range, props }: any) => {
                    props.command({ editor, range })
                },
            },
        }
    },

    addProseMirrorPlugins() {
        return [
            Suggestion({
                editor: this.editor,
                ...this.options.suggestion,
            }),
        ]
    },
})

// 4. Create the tippy plugin renderer
export const renderItems = () => {
    let component: ReactRenderer<any>
    let popup: TippyInstance[]

    return {
        onStart: (props: any) => {
            component = new ReactRenderer(CommandList, {
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

            return component.ref?.onKeyDown(props)
        },

        onExit() {
            popup[0].destroy()
            component.destroy()
        },
    }
}
