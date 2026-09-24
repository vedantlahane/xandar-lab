import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'
import { useState } from 'react'
import { Link as LinkIcon, Youtube, Figma, Video, FileText, Check, Pencil } from 'lucide-react'

function getEmbedInfo(url: string) {
    if (!url) return null;
    
    // YouTube
    const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
    if (ytMatch) return { type: 'youtube', src: `https://www.youtube.com/embed/${ytMatch[1]}`, icon: Youtube, color: 'text-red-500' };
    
    // Loom
    const loomMatch = url.match(/loom\.com\/share\/([a-z0-9]+)/i);
    if (loomMatch) return { type: 'loom', src: `https://www.loom.com/embed/${loomMatch[1]}`, icon: Video, color: 'text-purple-500' };
    
    // Figma
    if (url.includes('figma.com/file/') || url.includes('figma.com/design/')) {
        return { type: 'figma', src: `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(url)}`, icon: Figma, color: 'text-pink-500' };
    }

    // PDF
    if (url.endsWith('.pdf')) {
        return { type: 'pdf', src: url, icon: FileText, color: 'text-red-400' };
    }

    return { type: 'iframe', src: url, icon: LinkIcon, color: 'text-blue-500' };
}

function MediaEmbedNodeView({ node, updateAttributes, editor }: any) {
    const url = node.attrs.url || ''
    const [inputVal, setInputVal] = useState(url)
    const [isEditing, setIsEditing] = useState(!url)
    
    const isEditable = editor.isEditable
    const embedInfo = getEmbedInfo(url)

    return (
        <NodeViewWrapper className="my-4 relative group" data-drag-handle="false">
            <div className="border border-border/50 rounded-xl overflow-hidden bg-background shadow-sm">
                {/* Embedded Content */}
                {!isEditing && embedInfo && (
                    <div className="relative w-full" style={{ aspectRatio: embedInfo.type === 'pdf' ? '1 / 1.4' : '16 / 9' }}>
                        <iframe
                            src={embedInfo.src}
                            allowFullScreen
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            className="absolute top-0 left-0 w-full h-full border-none bg-muted/10"
                        />
                        {isEditable && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="absolute top-2 right-2 p-1.5 bg-background/80 backdrop-blur border border-border shadow-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground z-10"
                                title="Edit Embed URL"
                            >
                                <Pencil className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                )}

                {/* Editor */}
                {(isEditing || !embedInfo) && isEditable && (
                    <div className="p-4 flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
                            <Video className="w-4 h-4" /> Embed Media (YouTube, Loom, Figma, PDF)
                        </div>
                        <div className="flex gap-2">
                            <input
                                autoFocus
                                type="url"
                                placeholder="Paste a link to embed..."
                                value={inputVal}
                                onChange={(e) => setInputVal(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        updateAttributes({ url: inputVal })
                                        setIsEditing(false)
                                    }
                                }}
                                className="flex-1 h-9 px-3 text-sm bg-muted/30 border border-border/50 rounded-md outline-none focus:border-primary"
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
                )}
            </div>
        </NodeViewWrapper>
    )
}

export const MediaEmbedExtension = Node.create({
    name: 'mediaEmbed',
    group: 'block',
    atom: true,

    addAttributes() {
        return {
            url: { default: '' },
        }
    },

    parseHTML() {
        return [{ tag: 'media-embed' }]
    },

    renderHTML({ HTMLAttributes }) {
        return ['media-embed', mergeAttributes(HTMLAttributes)]
    },

    addNodeView() {
        return ReactNodeViewRenderer(MediaEmbedNodeView)
    },
})
