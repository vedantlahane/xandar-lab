import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'
import { useState, useEffect } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { FlaskConical } from 'lucide-react'

function ChemicalNodeView({ node, updateAttributes, editor }: any) {
    const smiles = node.attrs.smiles || 'C1=CC=C(C=C1)O'
    const [inputVal, setInputVal] = useState(smiles)
    const [isOpen, setIsOpen] = useState(false)

    // Sync input when smiles updates from undo/redo
    useEffect(() => { setInputVal(smiles) }, [smiles])

    const isEditable = editor.isEditable

    return (
        <NodeViewWrapper className="inline-block align-middle mx-1" data-drag-handle="false">
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <button className="relative group rounded-md border border-border/50 bg-muted/20 hover:bg-muted/40 transition-colors p-1" disabled={!isEditable}>
                        <img 
                            src={`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/smiles/${encodeURIComponent(smiles)}/PNG`} 
                            alt={smiles}
                            className="h-16 object-contain filter dark:invert"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                        />
                        <div className="hidden h-16 w-16 flex items-center justify-center text-red-500">
                            <FlaskConical className="w-6 h-6 opacity-50" />
                        </div>
                        {isEditable && (
                            <div className="absolute inset-0 ring-1 ring-primary rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        )}
                    </button>
                </PopoverTrigger>
                {isEditable && (
                    <PopoverContent className="w-72 p-2 flex gap-2" side="bottom" align="center" onOpenAutoFocus={e => e.preventDefault()}>
                        <input
                            autoFocus
                            type="text"
                            placeholder="SMILES string (e.g. C1=CC=C(C=C1)O)"
                            value={inputVal}
                            onChange={e => setInputVal(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === 'Enter') {
                                    updateAttributes({ smiles: inputVal })
                                    setIsOpen(false)
                                }
                            }}
                            className="flex-1 h-8 px-2 text-sm border border-border bg-background rounded-md outline-none focus:border-primary"
                        />
                        <button
                            onClick={() => {
                                updateAttributes({ smiles: inputVal })
                                setIsOpen(false)
                            }}
                            className="px-3 py-1 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90 transition-colors"
                        >
                            Save
                        </button>
                    </PopoverContent>
                )}
            </Popover>
        </NodeViewWrapper>
    )
}

export const ChemicalExtension = Node.create({
    name: 'chemical',
    group: 'inline',
    inline: true,
    atom: true,

    addAttributes() {
        return {
            smiles: {
                default: 'C1=CC=C(C=C1)O', // Phenol as default
            },
        }
    },

    parseHTML() {
        return [{ tag: 'chemical-diagram' }]
    },

    renderHTML({ HTMLAttributes }) {
        return ['chemical-diagram', mergeAttributes(HTMLAttributes)]
    },

    addNodeView() {
        return ReactNodeViewRenderer(ChemicalNodeView)
    },
})
