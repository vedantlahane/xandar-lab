import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'
import { useState, useEffect, useRef } from 'react'
import mermaid from 'mermaid'
import { Pencil, Check } from 'lucide-react'
import TextareaAutosize from 'react-textarea-autosize'

// Initialize mermaid
if (typeof document !== 'undefined') {
    mermaid.initialize({
        startOnLoad: false,
        theme: document.documentElement.classList.contains('dark') ? 'dark' : 'default',
        securityLevel: 'loose',
    })
}

function MermaidNodeView({ node, updateAttributes, editor }: any) {
    const code = node.attrs.code || 'graph TD\n  A-->B;'
    const [inputVal, setInputVal] = useState(code)
    const [isEditing, setIsEditing] = useState(!node.attrs.code)
    const [svgContent, setSvgContent] = useState<string>('')
    const [error, setError] = useState<string | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const isEditable = editor.isEditable

    useEffect(() => {
        let isMounted = true
        const renderDiagram = async () => {
            try {
                // Update theme based on document class
                const isDark = document.documentElement.classList.contains('dark')
                mermaid.initialize({ theme: isDark ? 'dark' : 'default' })
                
                const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`
                const { svg } = await mermaid.render(id, code)
                if (isMounted) {
                    setSvgContent(svg)
                    setError(null)
                }
            } catch (err: any) {
                if (isMounted) {
                    setError(err.message || 'Invalid Mermaid syntax')
                }
            }
        }
        if (code) {
            renderDiagram()
        }
        return () => { isMounted = false }
    }, [code])

    return (
        <NodeViewWrapper className="my-4 relative group" data-drag-handle="false">
            <div className="border border-border/50 rounded-lg overflow-hidden bg-background">
                {/* Rendered SVG */}
                {!isEditing && (
                    <div 
                        className="p-4 flex justify-center items-center min-h-[100px] overflow-x-auto relative bg-muted/10"
                        ref={containerRef}
                    >
                        {error ? (
                            <div className="text-red-500 text-sm font-mono p-4 bg-red-500/10 rounded-md">
                                {error}
                            </div>
                        ) : (
                            <div dangerouslySetInnerHTML={{ __html: svgContent }} />
                        )}
                        
                        {isEditable && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="absolute top-2 right-2 p-1.5 bg-background border border-border shadow-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
                                title="Edit Diagram"
                            >
                                <Pencil className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                )}

                {/* Editor */}
                {isEditing && isEditable && (
                    <div className="flex flex-col border-t border-border/50">
                        <div className="bg-muted px-3 py-1.5 border-b border-border/50 flex justify-between items-center">
                            <span className="text-xs font-medium text-muted-foreground">Mermaid Editor</span>
                            <button
                                onClick={() => {
                                    updateAttributes({ code: inputVal })
                                    setIsEditing(false)
                                }}
                                className="flex items-center gap-1 text-xs px-2 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90"
                            >
                                <Check className="w-3 h-3" /> Save
                            </button>
                        </div>
                        <TextareaAutosize
                            value={inputVal}
                            onChange={(e) => setInputVal(e.target.value)}
                            minRows={5}
                            className="w-full p-4 text-sm font-mono bg-transparent outline-none resize-none"
                            placeholder="graph TD&#10;  A-->B;"
                            autoFocus
                        />
                    </div>
                )}
            </div>
        </NodeViewWrapper>
    )
}

export const MermaidExtension = Node.create({
    name: 'mermaid',
    group: 'block',
    atom: true,

    addAttributes() {
        return {
            code: {
                default: 'graph TD\n  A[Start] --> B{Is it working?}\n  B -- Yes --> C[Great!]\n  B -- No --> D[Debug]',
            },
        }
    },

    parseHTML() {
        return [{ tag: 'mermaid-diagram' }]
    },

    renderHTML({ HTMLAttributes }) {
        return ['mermaid-diagram', mergeAttributes(HTMLAttributes)]
    },

    addNodeView() {
        return ReactNodeViewRenderer(MermaidNodeView)
    },
})
