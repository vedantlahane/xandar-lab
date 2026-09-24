import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'
import { useState, useMemo } from 'react'
import { FileJson, Check, Pencil, AlertCircle } from 'lucide-react'
import JsonView from '@uiw/react-json-view'
import { cn } from '@/lib/utils'

function JsonViewerNodeView({ node, updateAttributes, editor }: any) {
    const rawJson = node.attrs.json || '{\n  "hello": "world"\n}'
    const [inputVal, setInputVal] = useState(rawJson)
    const [isEditing, setIsEditing] = useState(!node.attrs.json)
    
    const isEditable = editor.isEditable

    const { parsed, error } = useMemo(() => {
        try {
            return { parsed: JSON.parse(rawJson), error: null }
        } catch (e: any) {
            return { parsed: null, error: e.message }
        }
    }, [rawJson])

    return (
        <NodeViewWrapper className="my-4 relative group" data-drag-handle="false">
            <div className="border border-border/50 rounded-xl overflow-hidden bg-background shadow-sm">
                
                {/* Editor */}
                {isEditing && isEditable ? (
                    <div className="flex flex-col">
                        <div className="bg-muted px-3 py-2 border-b border-border/50 flex justify-between items-center">
                            <span className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                                <FileJson className="w-4 h-4" /> JSON Data
                            </span>
                            <button
                                onClick={() => {
                                    updateAttributes({ json: inputVal })
                                    setIsEditing(false)
                                }}
                                className="flex items-center gap-1 text-xs px-2 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
                            >
                                <Check className="w-3 h-3" /> Save
                            </button>
                        </div>
                        <textarea
                            autoFocus
                            value={inputVal}
                            onChange={(e) => setInputVal(e.target.value)}
                            className="w-full min-h-[200px] p-4 text-sm font-mono bg-transparent outline-none resize-y text-foreground"
                            placeholder='{\n  "key": "value"\n}'
                        />
                    </div>
                ) : (
                    /* View */
                    <div className="relative p-4 md:p-5 flex flex-col overflow-x-auto bg-zinc-950 dark:bg-zinc-950">
                        {isEditable && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="absolute top-2 right-2 p-1.5 bg-zinc-900 border border-zinc-800 shadow-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400 hover:text-zinc-100 z-10"
                                title="Edit JSON"
                            >
                                <Pencil className="w-4 h-4" />
                            </button>
                        )}
                        
                        {error ? (
                            <div className="flex items-start gap-3 text-red-400 p-4 bg-red-500/10 rounded-lg">
                                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                <div className="font-mono text-sm whitespace-pre-wrap">{error}</div>
                            </div>
                        ) : parsed ? (
                            <div className="text-sm overflow-hidden" data-color-mode="dark">
                                <JsonView 
                                    value={parsed} 
                                    displayDataTypes={false}
                                    displayObjectSize={true}
                                    enableClipboard={true}
                                    style={{ backgroundColor: 'transparent' }}
                                />
                            </div>
                        ) : null}
                    </div>
                )}
            </div>
        </NodeViewWrapper>
    )
}

export const JsonViewerExtension = Node.create({
    name: 'jsonViewer',
    group: 'block',
    atom: true,

    addAttributes() {
        return {
            json: { default: '' },
        }
    },

    parseHTML() {
        return [{ tag: 'json-viewer' }]
    },

    renderHTML({ HTMLAttributes }) {
        return ['json-viewer', mergeAttributes(HTMLAttributes)]
    },

    addNodeView() {
        return ReactNodeViewRenderer(JsonViewerNodeView)
    },
})
