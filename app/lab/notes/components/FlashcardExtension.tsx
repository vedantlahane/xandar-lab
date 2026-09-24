import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'
import { useState } from 'react'
import { BookOpen, Pencil, Check, RefreshCw } from 'lucide-react'
import TextareaAutosize from 'react-textarea-autosize'
import { cn } from '@/lib/utils'

function FlashcardNodeView({ node, updateAttributes, editor }: any) {
    const front = node.attrs.front || ''
    const back = node.attrs.back || ''
    const [isEditing, setIsEditing] = useState(!front)
    const [isFlipped, setIsFlipped] = useState(false)
    
    // Draft states for editing
    const [draftFront, setDraftFront] = useState(front)
    const [draftBack, setDraftBack] = useState(back)

    const isEditable = editor.isEditable

    const handleSave = () => {
        updateAttributes({ front: draftFront, back: draftBack })
        setIsEditing(false)
        setIsFlipped(false)
    }

    return (
        <NodeViewWrapper className="my-6 relative group flex justify-center" data-drag-handle="false">
            <div className="w-full max-w-md perspective-1000">
                {/* Editor */}
                {isEditing && isEditable ? (
                    <div className="border border-border/50 rounded-xl overflow-hidden bg-background shadow-lg">
                        <div className="bg-muted px-4 py-3 border-b border-border/50 flex justify-between items-center">
                            <span className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                                <BookOpen className="w-4 h-4" /> Flashcard Editor
                            </span>
                            <button
                                onClick={handleSave}
                                disabled={!draftFront || !draftBack}
                                className="flex items-center gap-1 text-xs px-3 py-1.5 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors"
                            >
                                <Check className="w-4 h-4" /> Save Card
                            </button>
                        </div>
                        <div className="p-4 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Front (Question)</label>
                                <TextareaAutosize
                                    value={draftFront}
                                    onChange={(e) => setDraftFront(e.target.value)}
                                    minRows={3}
                                    placeholder="e.g. What is the powerhouse of the cell?"
                                    className="w-full p-3 text-sm bg-muted/30 border border-border/50 rounded-lg outline-none focus:border-primary resize-none"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Back (Answer)</label>
                                <TextareaAutosize
                                    value={draftBack}
                                    onChange={(e) => setDraftBack(e.target.value)}
                                    minRows={4}
                                    placeholder="e.g. Mitochondria"
                                    className="w-full p-3 text-sm bg-muted/30 border border-border/50 rounded-lg outline-none focus:border-primary resize-none"
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    /* View - The Card */
                    <div className="relative group/card h-64 w-full cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
                        {/* Edit Button */}
                        {isEditable && (
                            <button
                                onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
                                className="absolute top-3 right-3 p-2 bg-background/80 backdrop-blur border border-border shadow-md rounded-full opacity-0 group-hover/card:opacity-100 transition-opacity text-muted-foreground hover:text-foreground z-20"
                                title="Edit Flashcard"
                            >
                                <Pencil className="w-4 h-4" />
                            </button>
                        )}
                        
                        {/* Flip Animation Container */}
                        <div className={cn(
                            "relative w-full h-full transition-all duration-500 transform-style-3d shadow-md hover:shadow-xl rounded-2xl",
                            isFlipped ? "rotate-y-180" : ""
                        )}>
                            
                            {/* Front Side */}
                            <div className="absolute inset-0 w-full h-full backface-hidden bg-gradient-to-br from-card to-muted border border-border/60 rounded-2xl flex flex-col items-center justify-center p-8 text-center">
                                <div className="absolute top-4 left-4 text-xs font-medium text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                                    <BookOpen className="w-3.5 h-3.5" /> Q
                                </div>
                                <h3 className="text-xl sm:text-2xl font-bold text-foreground balance-text">
                                    {front}
                                </h3>
                                <div className="absolute bottom-4 text-xs text-muted-foreground opacity-50 flex items-center gap-1">
                                    <RefreshCw className="w-3 h-3" /> Click to reveal
                                </div>
                            </div>

                            {/* Back Side */}
                            <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-primary border border-primary-foreground/20 rounded-2xl flex flex-col items-center justify-center p-8 text-center text-primary-foreground">
                                <div className="absolute top-4 left-4 text-xs font-medium text-primary-foreground/70 uppercase tracking-widest flex items-center gap-1.5">
                                    <Check className="w-3.5 h-3.5" /> A
                                </div>
                                <p className="text-lg sm:text-xl font-medium balance-text whitespace-pre-wrap">
                                    {back}
                                </p>
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </NodeViewWrapper>
    )
}

export const FlashcardExtension = Node.create({
    name: 'flashcard',
    group: 'block',
    atom: true,

    addAttributes() {
        return {
            front: { default: '' },
            back: { default: '' },
        }
    },

    parseHTML() {
        return [{ tag: 'flashcard-block' }]
    },

    renderHTML({ HTMLAttributes }) {
        return ['flashcard-block', mergeAttributes(HTMLAttributes)]
    },

    addNodeView() {
        return ReactNodeViewRenderer(FlashcardNodeView)
    },
})
