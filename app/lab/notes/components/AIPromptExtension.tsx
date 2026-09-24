import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'
import { useState, useRef, useEffect } from 'react'
import { Sparkles, Play, StopCircle, RefreshCw, X, Bot, User } from 'lucide-react'
import { cn } from '@/lib/utils'

function AIPromptNodeView({ node, updateAttributes, editor }: any) {
    const defaultPrompt = node.attrs.prompt || ''
    const defaultResponse = node.attrs.response || ''
    
    const [prompt, setPrompt] = useState(defaultPrompt)
    const [response, setResponse] = useState(defaultResponse)
    const [isGenerating, setIsGenerating] = useState(false)
    const [isHovered, setIsHovered] = useState(false)

    const isEditable = editor.isEditable
    const abortControllerRef = useRef<AbortController | null>(null)

    // A mock streaming function. In production, swap this with a real fetch to an SSE/OpenAI endpoint.
    const mockGenerate = async (text: string) => {
        setIsGenerating(true)
        setResponse('')
        abortControllerRef.current = new AbortController()

        const mockAnswer = `Here is a structured response to your prompt:\n\n1. **Analysis**: We've analyzed the request for "${text}".\n2. **Execution**: Generating the necessary code and structure.\n3. **Conclusion**: This demonstrates the AI block's inline streaming capability.\n\n_Note: This is a mocked streaming response. Connect your API endpoint in AIPromptExtension.tsx._`
        
        const chunks = mockAnswer.split(' ')
        let currentText = ''

        try {
            for (let i = 0; i < chunks.length; i++) {
                if (abortControllerRef.current?.signal.aborted) break
                currentText += chunks[i] + ' '
                setResponse(currentText)
                updateAttributes({ response: currentText })
                // Random delay between 20ms and 80ms for realistic typing effect
                await new Promise(r => setTimeout(r, Math.random() * 60 + 20))
            }
        } finally {
            setIsGenerating(false)
            updateAttributes({ prompt })
        }
    }

    const handleRun = () => {
        if (!prompt.trim()) return
        mockGenerate(prompt)
    }

    const handleStop = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
        }
        setIsGenerating(false)
    }

    const clearBlock = () => {
        setPrompt('')
        setResponse('')
        updateAttributes({ prompt: '', response: '' })
    }

    return (
        <NodeViewWrapper 
            className="my-6 relative max-w-3xl mx-auto font-sans" 
            data-drag-handle="false"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="border border-indigo-500/30 dark:border-indigo-500/20 rounded-xl overflow-hidden bg-background shadow-sm transition-all duration-300 hover:border-indigo-500/50 hover:shadow-md">
                
                {/* Header */}
                <div className="bg-indigo-500/5 dark:bg-indigo-500/10 px-4 py-2 border-b border-indigo-500/20 flex justify-between items-center">
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5" /> AI Assistant
                    </span>
                    {isEditable && (response || prompt) && isHovered && !isGenerating && (
                        <button 
                            onClick={clearBlock}
                            className="text-muted-foreground hover:text-red-500 transition-colors p-1 rounded-md hover:bg-muted"
                            title="Clear AI Block"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>

                {/* Prompt Area */}
                <div className="p-4 flex gap-3 items-start border-b border-border/50 bg-muted/10">
                    <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center shrink-0 border border-border/50">
                        <User className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col gap-2">
                        {isEditable ? (
                            <textarea
                                value={prompt}
                                onChange={e => setPrompt(e.target.value)}
                                placeholder="Ask AI to generate, rewrite, or explain..."
                                className="w-full min-h-[40px] text-sm bg-transparent outline-none resize-y placeholder:text-muted-foreground/50 pt-1.5"
                                onKeyDown={e => {
                                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                                        e.preventDefault()
                                        handleRun()
                                    }
                                }}
                            />
                        ) : (
                            <div className="text-sm pt-1.5">{prompt || "No prompt provided."}</div>
                        )}
                        
                        {isEditable && (
                            <div className="flex justify-end">
                                {isGenerating ? (
                                    <button 
                                        onClick={handleStop}
                                        className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 bg-red-500/10 text-red-600 dark:text-red-400 rounded-md hover:bg-red-500/20 transition-colors"
                                    >
                                        <StopCircle className="w-4 h-4" /> Stop
                                    </button>
                                ) : (
                                    <button 
                                        onClick={handleRun}
                                        disabled={!prompt.trim()}
                                        className="flex items-center gap-1.5 text-xs font-medium px-4 py-1.5 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 disabled:opacity-50 transition-colors shadow-sm"
                                    >
                                        {response ? <RefreshCw className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                                        {response ? "Regenerate" : "Generate"}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Response Area */}
                {(response || isGenerating) && (
                    <div className="p-4 flex gap-3 items-start bg-indigo-500/[0.02] dark:bg-indigo-500/[0.05]">
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border shadow-sm transition-all duration-500",
                            isGenerating ? "bg-indigo-500 border-indigo-600 text-white animate-pulse" : "bg-background border-indigo-500/30 text-indigo-500"
                        )}>
                            <Bot className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0 pt-1.5 text-sm leading-relaxed text-foreground whitespace-pre-wrap font-medium">
                            {response}
                            {isGenerating && <span className="inline-block w-1.5 h-4 ml-1 bg-indigo-500 animate-pulse align-middle" />}
                        </div>
                    </div>
                )}
            </div>
        </NodeViewWrapper>
    )
}

export const AIPromptExtension = Node.create({
    name: 'aiPrompt',
    group: 'block',
    atom: true,

    addAttributes() {
        return {
            prompt: { default: '' },
            response: { default: '' },
        }
    },

    parseHTML() {
        return [{ tag: 'ai-prompt-block' }]
    },

    renderHTML({ HTMLAttributes }) {
        return ['ai-prompt-block', mergeAttributes(HTMLAttributes)]
    },

    addNodeView() {
        return ReactNodeViewRenderer(AIPromptNodeView)
    },
})
