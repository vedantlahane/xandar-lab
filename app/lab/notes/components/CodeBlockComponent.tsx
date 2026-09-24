import { NodeViewWrapper, NodeViewContent } from '@tiptap/react'
import { Check, Copy, WrapText, Hash } from 'lucide-react'
import { useState } from 'react'

export function CodeBlockComponent({ node, updateAttributes, extension }: any) {
    const [copied, setCopied] = useState(false)
    const [wordWrap, setWordWrap] = useState(false)
    const [showLineNumbers, setShowLineNumbers] = useState(false)

    const copyToClipboard = () => {
        const text = node.textContent
        // Fallback for HTTP (non-secure) contexts
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => {
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
            }).catch(() => fallbackCopy(text))
        } else {
            fallbackCopy(text)
        }
    }

    const fallbackCopy = (text: string) => {
        const el = document.createElement('textarea')
        el.value = text
        el.style.position = 'fixed'
        el.style.left = '-9999px'
        document.body.appendChild(el)
        el.focus()
        el.select()
        try {
            document.execCommand('copy')
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } finally {
            document.body.removeChild(el)
        }
    }

    const lines = node.textContent.split('\n')

    return (
        <NodeViewWrapper className="relative group rounded-xl overflow-hidden bg-muted/30 dark:bg-zinc-950 border border-border/50 my-4">
            {/* Header bar */}
            <div className="flex items-center justify-between px-3 py-1.5 bg-muted/50 dark:bg-zinc-900/80 border-b border-border/50 gap-2">
                <select
                    contentEditable={false}
                    value={node.attrs.language || 'text'}
                    onChange={e => updateAttributes({ language: e.target.value })}
                    className="text-xs bg-transparent border-none text-muted-foreground outline-none cursor-pointer hover:text-foreground transition-colors font-mono"
                >
                    <option value="null">auto</option>
                    <option value="text">plaintext</option>
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                    <option value="jsx">JSX</option>
                    <option value="tsx">TSX</option>
                    <option value="python">Python</option>
                    <option value="bash">Bash / Shell</option>
                    <option value="html">HTML</option>
                    <option value="css">CSS</option>
                    <option value="json">JSON</option>
                    <option value="yaml">YAML</option>
                    <option value="sql">SQL</option>
                    <option value="rust">Rust</option>
                    <option value="go">Go</option>
                    <option value="java">Java</option>
                    <option value="c">C</option>
                    <option value="cpp">C++</option>
                    <option value="csharp">C#</option>
                    <option value="php">PHP</option>
                    <option value="ruby">Ruby</option>
                    <option value="markdown">Markdown</option>
                </select>

                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity" contentEditable={false}>
                    <button
                        type="button"
                        onClick={() => setShowLineNumbers(v => !v)}
                        className={`p-1.5 rounded-md transition-colors text-xs ${showLineNumbers ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}
                        title="Toggle Line Numbers"
                    >
                        <Hash className="w-3.5 h-3.5" />
                    </button>
                    <button
                        type="button"
                        onClick={() => setWordWrap(v => !v)}
                        className={`p-1.5 rounded-md transition-colors ${wordWrap ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}
                        title="Toggle Word Wrap"
                    >
                        <WrapText className="w-3.5 h-3.5" />
                    </button>
                    <button
                        type="button"
                        onClick={copyToClipboard}
                        className="p-1.5 rounded-md text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all"
                        title="Copy Code"
                    >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                </div>
            </div>

            {/* Code content */}
            <div className="flex">
                {showLineNumbers && (
                    <div
                        contentEditable={false}
                        className="select-none text-right pr-3 pl-3 py-4 text-xs text-muted-foreground/40 font-mono border-r border-border/30 leading-relaxed bg-muted/20 dark:bg-zinc-900/40 shrink-0"
                        aria-hidden="true"
                    >
                        {lines.map((_: string, i: number) => (
                            <div key={i}>{i + 1}</div>
                        ))}
                    </div>
                )}
                <pre
                    className="!m-0 !bg-transparent p-4 text-sm flex-1 min-w-0"
                    style={{ overflowX: wordWrap ? 'hidden' : 'auto', whiteSpace: wordWrap ? 'pre-wrap' : 'pre', wordBreak: wordWrap ? 'break-all' : 'normal' }}
                >
                    <code><NodeViewContent /></code>
                </pre>
            </div>
        </NodeViewWrapper>
    )
}
