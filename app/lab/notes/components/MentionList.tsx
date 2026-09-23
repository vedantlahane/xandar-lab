'use client'

import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

export const MentionList = forwardRef((props: any, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0)

    const selectItem = (index: number) => {
        const item = props.items[index]
        if (item) {
            props.command({ id: item.id, label: item.title })
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

    useEffect(() => setSelectedIndex(0), [props.items])

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

    return (
        <div className="bg-background border border-border/40 shadow-xl rounded-lg overflow-hidden flex flex-col w-64">
            {props.items.length ? (
                props.items.map((item: any, index: number) => (
                    <button
                        className={`flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors ${
                            index === selectedIndex ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-foreground'
                        }`}
                        key={index}
                        onClick={() => selectItem(index)}
                    >
                        <span className="text-base">{item.icon}</span>
                        <span className="truncate">{item.title}</span>
                    </button>
                ))
            ) : (
                <div className="px-3 py-2 text-sm text-muted-foreground">No notes found</div>
            )}
        </div>
    )
})

MentionList.displayName = 'MentionList'
export default MentionList
