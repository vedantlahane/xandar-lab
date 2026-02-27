// app/lab/notes/layout.tsx
export default function NotesLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-background text-foreground">{children}</div>
    )
}
