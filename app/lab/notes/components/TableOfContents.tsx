'use client'
import { cn } from '@/lib/utils'
import { Hash } from 'lucide-react'

interface TocEntry {
    id: string
    level: number
    textContent: string
    isActive?: boolean
    isScrolledOver?: boolean
}

interface TableOfContentsProps {
    items: TocEntry[]
    onItemClick?: (id: string) => void
}

export function TableOfContents({ items, onItemClick }: TableOfContentsProps) {
    if (items.length === 0) {
        return (
            <div className="px-4 py-6 text-center">
                <Hash className="w-5 h-5 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground/50">Add headings to<br />generate an outline</p>
            </div>
        )
    }

    return (
        <nav className="space-y-0.5 py-2">
            {items.map(item => (
                <button
                    key={item.id}
                    onClick={() => {
                        const el = document.getElementById(item.id)
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                        onItemClick?.(item.id)
                    }}
                    className={cn(
                        'w-full text-left text-xs py-1 px-2 rounded-md transition-colors truncate block',
                        item.level === 1 && 'pl-2 font-semibold',
                        item.level === 2 && 'pl-5 font-medium',
                        item.level === 3 && 'pl-8 font-normal',
                        item.isActive
                            ? 'text-primary bg-primary/8'
                            : item.isScrolledOver
                                ? 'text-muted-foreground/50'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/30',
                    )}
                >
                    {item.textContent || '(empty heading)'}
                </button>
            ))}
        </nav>
    )
}
