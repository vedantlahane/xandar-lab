import { useEditor, EditorContent } from '@tiptap/react'
import { BubbleMenu, FloatingMenu } from '@tiptap/react/menus'
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
    Link as LinkIcon, Heading1, Heading2, List, CheckSquare, Code 
} from 'lucide-react'

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

            {/* Floating Menu for Slash Commands (empty line) */}
            {editor && (
                <FloatingMenu 
                    editor={editor}
                    className="flex flex-col gap-1 p-1.5 bg-background border border-border/50 shadow-xl rounded-xl w-48 backdrop-blur-md z-50"
                >
                    <div className="px-2 pb-1.5 pt-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                        Insert
                    </div>
                    <button
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        className="flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm text-foreground/80 hover:bg-muted/30 hover:text-foreground transition-colors text-left"
                    >
                        <div className="flex items-center justify-center w-6 h-6 rounded bg-muted/40 text-muted-foreground">
                            <Heading1 className="w-3.5 h-3.5" />
                        </div>
                        Heading 1
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        className="flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm text-foreground/80 hover:bg-muted/30 hover:text-foreground transition-colors text-left"
                    >
                        <div className="flex items-center justify-center w-6 h-6 rounded bg-muted/40 text-muted-foreground">
                            <Heading2 className="w-3.5 h-3.5" />
                        </div>
                        Heading 2
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className="flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm text-foreground/80 hover:bg-muted/30 hover:text-foreground transition-colors text-left"
                    >
                        <div className="flex items-center justify-center w-6 h-6 rounded bg-muted/40 text-muted-foreground">
                            <List className="w-3.5 h-3.5" />
                        </div>
                        Bullet List
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleTaskList().run()}
                        className="flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm text-foreground/80 hover:bg-muted/30 hover:text-foreground transition-colors text-left"
                    >
                        <div className="flex items-center justify-center w-6 h-6 rounded bg-muted/40 text-muted-foreground">
                            <CheckSquare className="w-3.5 h-3.5" />
                        </div>
                        Task List
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        className="flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm text-foreground/80 hover:bg-muted/30 hover:text-foreground transition-colors text-left"
                    >
                        <div className="flex items-center justify-center w-6 h-6 rounded bg-muted/40 text-muted-foreground">
                            <Code className="w-3.5 h-3.5" />
                        </div>
                        Code Block
                    </button>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm text-foreground/80 hover:bg-muted/30 hover:text-foreground transition-colors text-left"
                    >
                        <div className="flex items-center justify-center w-6 h-6 rounded bg-muted/40 text-muted-foreground">
                            {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ImageIcon className="w-3.5 h-3.5" />}
                        </div>
                        Image
                    </button>
                </FloatingMenu>
            )}

            <EditorContent editor={editor} className="flex-1 w-full min-h-[350px] outline-none" />
        </div>
    )
}
