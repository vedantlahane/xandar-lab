import { useEditor, EditorContent } from '@tiptap/react'
import { BubbleMenu } from '@tiptap/react/menus'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'
import { useEffect, useRef, useState } from 'react'
import { 
    Image as ImageIcon, Loader2, Bold, Italic, Strikethrough, 
    Link as LinkIcon 
} from 'lucide-react'
import { SlashCommand, getSuggestionItems, renderItems } from './SlashCommand'

const lowlight = createLowlight(common);

export function BlockEditor({
    content,
    onChange,
    readOnly = false,
}: {
    content: string
    onChange?: (html: string) => void
    readOnly?: boolean
}) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    // Custom suggestion items that inject the fileInputRef for images
    const slashSuggestionItems = ({ query }: { query: string }) => {
        const items = getSuggestionItems({ query });
        
        // Add Image Upload command if it matches
        if ('image'.startsWith(query.toLowerCase())) {
            items.push({
                title: 'Image',
                icon: <ImageIcon className="w-4 h-4" />,
                command: ({ editor, range }: any) => {
                    editor.chain().focus().deleteRange(range).run();
                    if (fileInputRef.current) fileInputRef.current.click();
                },
            } as any);
        }
        return items;
    };

    const editor = useEditor({
        editable: !readOnly,
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
                codeBlock: false, // disable default to use lowlight
            }),
            CodeBlockLowlight.configure({
                lowlight,
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline underline-offset-4 decoration-primary/50 hover:decoration-primary cursor-pointer',
                },
            }),
            TaskList,
            TaskItem.configure({ nested: true }),
            Image.configure({ inline: true, allowBase64: true }),
            Placeholder.configure({
                placeholder: 'Type / for commands, or start writing...',
                emptyEditorClass: 'is-editor-empty before:content-[attr(data-placeholder)] before:text-muted-foreground/50 before:float-left before:pointer-events-none before:h-0',
            }),
            SlashCommand.configure({
                suggestion: {
                    items: slashSuggestionItems,
                    render: renderItems,
                }
            })
        ],
        content: content,
        onUpdate: ({ editor }) => {
            if (onChange) onChange(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none max-w-none text-sm font-sans text-foreground/90 leading-relaxed',
            },
        },
    })

    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            if (content && !editor.isDestroyed) {
                // To safely update content from outside without losing focus/cursor
                const currentSelection = editor.state.selection;
                editor.commands.setContent(content, { emitUpdate: false });
                editor.commands.setTextSelection(currentSelection);
            }
        }
    }, [content, editor])

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !editor) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            
            if (res.ok) {
                const data = await res.json();
                editor.chain().focus().setImage({ src: data.url }).run();
            } else {
                alert("Upload failed");
            }
        } catch (err) {
            console.error(err);
            alert("Upload error");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const setLink = () => {
        const previousUrl = editor?.getAttributes('link').href
        const url = window.prompt('URL', previousUrl)
        if (url === null) return
        if (url === '') {
            editor?.chain().focus().extendMarkRange('link').unsetLink().run()
            return
        }
        editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }

    if (!editor) return null

    return (
        <div className={`w-full relative min-h-[400px] flex flex-col ${readOnly ? '' : 'p-4'}`}>
            {/* Hidden file input for images */}
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*" 
                className="hidden" 
            />

            {isUploading && (
                <div className="absolute top-2 right-2 z-10 flex items-center gap-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded-md backdrop-blur-md">
                    <Loader2 className="w-3 h-3 animate-spin" /> Uploading image...
                </div>
            )}

            {/* Contextual Bubble Menu (highlight text to see) */}
            {editor && (
                <BubbleMenu 
                    editor={editor}
                    className="flex items-center gap-1 p-1 bg-background border border-border/50 shadow-xl rounded-lg backdrop-blur-md"
                >
                    <button
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={`p-1.5 rounded-md transition-colors ${editor.isActive('bold') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}
                    >
                        <Bold className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={`p-1.5 rounded-md transition-colors ${editor.isActive('italic') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}
                    >
                        <Italic className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        className={`p-1.5 rounded-md transition-colors ${editor.isActive('strike') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}
                    >
                        <Strikethrough className="w-4 h-4" />
                    </button>
                    <div className="w-[1px] h-4 bg-border/50 mx-1" />
                    <button
                        onClick={setLink}
                        className={`p-1.5 rounded-md transition-colors ${editor.isActive('link') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}
                    >
                        <LinkIcon className="w-4 h-4" />
                    </button>
                </BubbleMenu>
            )}

            <EditorContent editor={editor} className="flex-1 w-full min-h-[350px] outline-none" />
        </div>
    )
}
