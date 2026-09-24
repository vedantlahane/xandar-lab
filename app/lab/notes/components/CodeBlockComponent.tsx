import { NodeViewWrapper, NodeViewContent } from '@tiptap/react'
import { Check, Copy } from 'lucide-react'
import { useState } from 'react'

export function CodeBlockComponent({ node, updateAttributes, extension }: any) {
    const [copied, setCopied] = useState(false)

    const copyToClipboard = () => {
        navigator.clipboard.writeText(node.textContent)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <NodeViewWrapper className="relative group rounded-xl overflow-hidden bg-zinc-950 border border-border/50 my-4">
            <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/50 border-b border-border/50">
                <select
                    contentEditable={false}
                    value={node.attrs.language || 'text'}
                    onChange={e => updateAttributes({ language: e.target.value })}
                    className="text-xs bg-transparent border-none text-muted-foreground outline-none cursor-pointer hover:text-foreground transition-colors"
                >
                    <option value="null">auto</option>
                    <option value="text">plaintext</option>
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                    <option value="python">Python</option>
                    <option value="bash">Bash</option>
                    <option value="html">HTML</option>
                    <option value="css">CSS</option>
                    <option value="json">JSON</option>
                    <option value="markdown">Markdown</option>
                </select>

                <button
                    contentEditable={false}
                    onClick={copyToClipboard}
                    className="p-1.5 rounded-md text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all opacity-0 group-hover:opacity-100"
                    title="Copy Code"
                >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
            </div>
            <pre className="!m-0 !bg-transparent p-4 overflow-x-auto text-sm">
                <code><NodeViewContent /></code>
            </pre>
        </NodeViewWrapper>
    )
}

