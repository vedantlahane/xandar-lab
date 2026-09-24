import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'
import { useState, useEffect } from 'react'
import { Github, Star, GitFork, AlertCircle, Check, Pencil, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

function GithubNodeView({ node, updateAttributes, editor }: any) {
    const url = node.attrs.url || ''
    const [inputVal, setInputVal] = useState(url)
    const [isEditing, setIsEditing] = useState(!url)
    
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    
    const isEditable = editor.isEditable

    useEffect(() => {
        if (!url || isEditing) return
        
        let isMounted = true
        const fetchData = async () => {
            setLoading(true)
            setError(null)
            
            try {
                // Parse github URL
                // https://github.com/owner/repo
                const repoMatch = url.match(/github\.com\/([^\/]+)\/([^\/]+)(?:\/?$)/i)
                if (repoMatch) {
                    const [, owner, repo] = repoMatch
                    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`)
                    if (!res.ok) throw new Error("Repository not found or rate limited")
                    const json = await res.json()
                    if (isMounted) {
                        setData({ type: 'repo', ...json })
                    }
                    return
                }

                setError("Only GitHub repository URLs are currently supported.")
            } catch (err: any) {
                if (isMounted) setError(err.message)
            } finally {
                if (isMounted) setLoading(false)
            }
        }
        
        fetchData()
        return () => { isMounted = false }
    }, [url, isEditing])

    return (
        <NodeViewWrapper className="my-4 relative group" data-drag-handle="false">
            <div className="border border-border/50 rounded-xl overflow-hidden bg-background shadow-sm max-w-2xl">
                
                {/* Editor */}
                {isEditing && isEditable ? (
                    <div className="p-4 flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
                            <Github className="w-4 h-4" /> GitHub Embed (Repo URL)
                        </div>
                        <div className="flex gap-2">
                            <input
                                autoFocus
                                type="url"
                                placeholder="https://github.com/owner/repo"
                                value={inputVal}
                                onChange={(e) => setInputVal(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        updateAttributes({ url: inputVal })
                                        setIsEditing(false)
                                    }
                                }}
                                className="flex-1 h-9 px-3 text-sm bg-muted/30 border border-border/50 rounded-md outline-none focus:border-primary font-mono"
                            />
                            <button
                                onClick={() => {
                                    updateAttributes({ url: inputVal })
                                    setIsEditing(false)
                                }}
                                disabled={!inputVal}
                                className="px-4 h-9 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center gap-2"
                            >
                                <Check className="w-4 h-4" /> Save
                            </button>
                        </div>
                    </div>
                ) : (
                    /* View */
                    <div className="relative p-4 md:p-5 flex flex-col gap-3">
                        {isEditable && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="absolute top-3 right-3 p-1.5 bg-background border border-border shadow-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground z-10"
                                title="Edit URL"
                            >
                                <Pencil className="w-4 h-4" />
                            </button>
                        )}
                        
                        {loading ? (
                            <div className="flex items-center gap-3 text-muted-foreground h-16">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span className="text-sm font-medium">Fetching GitHub data...</span>
                            </div>
                        ) : error ? (
                            <div className="flex items-center gap-3 text-red-500 h-16">
                                <AlertCircle className="w-5 h-5" />
                                <span className="text-sm font-medium">{error}</span>
                            </div>
                        ) : data?.type === 'repo' ? (
                            <a href={data.html_url} target="_blank" rel="noopener noreferrer" className="block text-foreground hover:no-underline group/card">
                                <div className="flex items-start gap-4">
                                    <img src={data.owner.avatar_url} alt={data.owner.login} className="w-12 h-12 rounded-lg border border-border/50 shadow-sm shrink-0 bg-muted" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <Github className="w-4 h-4 text-muted-foreground" />
                                            <span className="font-semibold text-base group-hover/card:text-blue-500 transition-colors truncate">
                                                {data.full_name}
                                            </span>
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium border border-border/50">
                                                {data.private ? 'Private' : 'Public'}
                                            </span>
                                        </div>
                                        {data.description && (
                                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
                                                {data.description}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground flex-wrap">
                                            {data.language && (
                                                <div className="flex items-center gap-1.5">
                                                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                                                    {data.language}
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4" />
                                                {data.stargazers_count.toLocaleString()}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <GitFork className="w-4 h-4" />
                                                {data.forks_count.toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        ) : (
                            <div className="text-sm text-muted-foreground italic h-16 flex items-center">
                                Invalid or unsupported GitHub link.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </NodeViewWrapper>
    )
}

export const GithubExtension = Node.create({
    name: 'githubEmbed',
    group: 'block',
    atom: true,

    addAttributes() {
        return {
            url: { default: '' },
        }
    },

    parseHTML() {
        return [{ tag: 'github-embed' }]
    },

    renderHTML({ HTMLAttributes }) {
        return ['github-embed', mergeAttributes(HTMLAttributes)]
    },

    addNodeView() {
        return ReactNodeViewRenderer(GithubNodeView)
    },
})
