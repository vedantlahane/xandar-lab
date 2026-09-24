import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'
import { useState } from 'react'
import { HelpCircle, Pencil, Check, Plus, Trash2, XCircle, CheckCircle } from 'lucide-react'
import TextareaAutosize from 'react-textarea-autosize'
import { cn } from '@/lib/utils'

function QuizNodeView({ node, updateAttributes, editor }: any) {
    const defaultOptions = [
        { id: '1', text: '' },
        { id: '2', text: '' }
    ]
    const question = node.attrs.question || ''
    const options = node.attrs.options?.length ? node.attrs.options : defaultOptions
    const correctAnswerId = node.attrs.correctAnswerId || null
    
    const [isEditing, setIsEditing] = useState(!question)
    
    // Draft states
    const [draftQuestion, setDraftQuestion] = useState(question)
    const [draftOptions, setDraftOptions] = useState(options)
    const [draftCorrectId, setDraftCorrectId] = useState<string | null>(correctAnswerId)

    // View states
    const [selectedId, setSelectedId] = useState<string | null>(null)

    const isEditable = editor.isEditable

    const handleSave = () => {
        updateAttributes({ 
            question: draftQuestion, 
            options: draftOptions,
            correctAnswerId: draftCorrectId 
        })
        setIsEditing(false)
        setSelectedId(null) // Reset on edit
    }

    const addOption = () => {
        setDraftOptions([...draftOptions, { id: Math.random().toString(36).substr(2, 9), text: '' }])
    }

    const removeOption = (id: string) => {
        setDraftOptions(draftOptions.filter((o: any) => o.id !== id))
        if (draftCorrectId === id) setDraftCorrectId(null)
    }

    const updateOption = (id: string, text: string) => {
        setDraftOptions(draftOptions.map((o: any) => o.id === id ? { ...o, text } : o))
    }

    const isSavable = draftQuestion && draftOptions.every((o: any) => o.text) && draftCorrectId

    return (
        <NodeViewWrapper className="my-6 relative group max-w-2xl mx-auto" data-drag-handle="false">
            <div className="border border-border/50 rounded-xl overflow-hidden bg-background shadow-sm">
                
                {/* Editor */}
                {isEditing && isEditable ? (
                    <div className="flex flex-col">
                        <div className="bg-muted px-4 py-3 border-b border-border/50 flex justify-between items-center">
                            <span className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                                <HelpCircle className="w-4 h-4" /> Quiz Editor
                            </span>
                            <button
                                onClick={handleSave}
                                disabled={!isSavable}
                                className="flex items-center gap-1 text-xs px-3 py-1.5 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors"
                            >
                                <Check className="w-4 h-4" /> Save Quiz
                            </button>
                        </div>
                        
                        <div className="p-4 space-y-6">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Question</label>
                                <TextareaAutosize
                                    autoFocus
                                    value={draftQuestion}
                                    onChange={(e) => setDraftQuestion(e.target.value)}
                                    minRows={3}
                                    placeholder="e.g. Which design pattern is used by React hooks?"
                                    className="w-full p-3 text-sm bg-muted/30 border border-border/50 rounded-lg outline-none focus:border-primary resize-none"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Options & Correct Answer</label>
                                {draftOptions.map((opt: any, index: number) => (
                                    <div key={opt.id} className="flex items-center gap-2">
                                        <button
                                            onClick={() => setDraftCorrectId(opt.id)}
                                            className={cn(
                                                "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                                                draftCorrectId === opt.id 
                                                    ? "border-green-500 bg-green-500 text-white" 
                                                    : "border-border/60 hover:border-border text-transparent"
                                            )}
                                        >
                                            <Check className="w-3.5 h-3.5" />
                                        </button>
                                        <input
                                            type="text"
                                            value={opt.text}
                                            onChange={(e) => updateOption(opt.id, e.target.value)}
                                            placeholder={`Option ${index + 1}`}
                                            className="flex-1 h-9 px-3 text-sm bg-muted/30 border border-border/50 rounded-md outline-none focus:border-primary"
                                        />
                                        <button
                                            onClick={() => removeOption(opt.id)}
                                            disabled={draftOptions.length <= 2}
                                            className="p-2 text-muted-foreground hover:text-red-500 disabled:opacity-30 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={addOption}
                                    className="flex items-center gap-1.5 text-xs font-medium text-blue-500 hover:text-blue-600 px-8 py-1"
                                >
                                    <Plus className="w-3.5 h-3.5" /> Add Option
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* View */
                    <div className="relative p-5 md:p-6 flex flex-col gap-6">
                        {isEditable && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="absolute top-3 right-3 p-1.5 bg-background border border-border shadow-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground z-10"
                                title="Edit Quiz"
                            >
                                <Pencil className="w-4 h-4" />
                            </button>
                        )}
                        
                        <div className="flex gap-3 items-start">
                            <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 mt-1">
                                <HelpCircle className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-bold text-foreground leading-snug">
                                {question}
                            </h3>
                        </div>

                        <div className="space-y-2 ml-11">
                            {options.map((opt: any) => {
                                const isSelected = selectedId === opt.id
                                const isCorrectAnswer = correctAnswerId === opt.id
                                const showResult = selectedId !== null

                                let stateClass = "border-border/50 hover:border-primary hover:bg-muted/30"
                                let Icon = null

                                if (showResult) {
                                    if (isCorrectAnswer) {
                                        stateClass = "border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400"
                                        Icon = <CheckCircle className="w-4 h-4 text-green-500" />
                                    } else if (isSelected && !isCorrectAnswer) {
                                        stateClass = "border-red-500/50 bg-red-500/10 text-red-700 dark:text-red-400 opacity-70"
                                        Icon = <XCircle className="w-4 h-4 text-red-500" />
                                    } else {
                                        stateClass = "border-border/30 opacity-50"
                                    }
                                }

                                return (
                                    <button
                                        key={opt.id}
                                        onClick={() => !showResult && setSelectedId(opt.id)}
                                        disabled={showResult}
                                        className={cn(
                                            "w-full text-left p-3 rounded-lg border transition-all duration-200 flex items-center justify-between gap-3 text-sm font-medium",
                                            stateClass
                                        )}
                                    >
                                        <span>{opt.text}</span>
                                        {Icon}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>
        </NodeViewWrapper>
    )
}

export const QuizExtension = Node.create({
    name: 'quiz',
    group: 'block',
    atom: true,

    addAttributes() {
        return {
            question: { default: '' },
            options: { default: [] },
            correctAnswerId: { default: null },
        }
    },

    parseHTML() {
        return [{ tag: 'quiz-block' }]
    },

    renderHTML({ HTMLAttributes }) {
        return ['quiz-block', mergeAttributes(HTMLAttributes)]
    },

    addNodeView() {
        return ReactNodeViewRenderer(QuizNodeView)
    },
})
