// app/lab/notes/layout.tsx
import { GlobalSearch } from './components/GlobalSearch'

export default function NotesLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen text-foreground">
            {children}
            <GlobalSearch />
        </div>
    )
}
