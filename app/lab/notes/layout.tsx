// app/lab/notes/layout.tsx
export default function NotesLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen text-foreground">{children}</div>
    )
}
