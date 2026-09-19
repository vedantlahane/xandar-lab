import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Image from '@tiptap/extension-image'
import { useEffect, useRef } from 'react'
import { Image as ImageIcon, Loader2 } from 'lucide-react'
import { useState } from 'react'

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
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
            Image.configure({
                inline: true,
                allowBase64: true,
            }),
            Placeholder.configure({
                placeholder: 'Write something or type / for commands...',
                emptyEditorClass: 'is-editor-empty',
            }),
        ],
        content: content,
        onUpdate: ({ editor }) => {
            if (onChange) onChange(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none dark:prose-invert max-w-none text-sm font-sans',
            },
        },
    })

    // Reset content when it changes externally (e.g. loading a new note)
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            if (content && !editor.isDestroyed) {
                // editor.commands.setContent(content)
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

    if (!editor) {
        return null
    }

    return (
        <div className={`w-full h-full min-h-[400px] rounded-lg flex flex-col ${readOnly ? '' : 'border border-border/40 bg-muted/10 p-4'}`}>
            {/* Simple Menu Bar */}
            {!readOnly && (
                <div className="flex flex-wrap items-center gap-2 mb-4 pb-2 border-b border-border/40">
                    <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={!editor.can().chain().focus().toggleBold().run()}
                    className={`px-2 py-1 rounded text-xs font-semibold ${editor.isActive('bold') ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:bg-muted/50'}`}
                    type="button"
                >
                    Bold
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={!editor.can().chain().focus().toggleItalic().run()}
                    className={`px-2 py-1 rounded text-xs font-semibold ${editor.isActive('italic') ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:bg-muted/50'}`}
                    type="button"
                >
                    Italic
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    disabled={!editor.can().chain().focus().toggleStrike().run()}
                    className={`px-2 py-1 rounded text-xs font-semibold ${editor.isActive('strike') ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:bg-muted/50'}`}
                    type="button"
                >
                    Strike
                </button>
                <div className="w-[1px] h-4 bg-border/40 mx-1" />
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={`px-2 py-1 rounded text-xs font-semibold ${editor.isActive('heading', { level: 1 }) ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:bg-muted/50'}`}
                    type="button"
                >
                    H1
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`px-2 py-1 rounded text-xs font-semibold ${editor.isActive('heading', { level: 2 }) ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:bg-muted/50'}`}
                    type="button"
                >
                    H2
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`px-2 py-1 rounded text-xs font-semibold ${editor.isActive('bulletList') ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:bg-muted/50'}`}
                    type="button"
                >
                    Bullet List
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleTaskList().run()}
                    className={`px-2 py-1 rounded text-xs font-semibold ${editor.isActive('taskList') ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:bg-muted/50'}`}
                    type="button"
                >
                    Task List
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className={`px-2 py-1 rounded text-xs font-semibold ${editor.isActive('codeBlock') ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:bg-muted/50'}`}
                    type="button"
                >
                    Code Block
                </button>
                <div className="w-[1px] h-4 bg-border/40 mx-1" />
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="px-2 py-1 rounded text-xs font-semibold text-muted-foreground hover:bg-muted/50 flex items-center gap-1.5"
                    type="button"
                >
                    {isUploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <ImageIcon className="h-3 w-3" />}
                    Image
                </button>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                    accept="image/*" 
                    className="hidden" 
                />
            </div>
            )}
            <EditorContent editor={editor} className="flex-1 min-h-[350px] overflow-y-auto outline-none" />
        </div>
    )
}
