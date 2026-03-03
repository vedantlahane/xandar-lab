// app/lab/hackathons/layout.tsx
export default function HackathonsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen text-foreground">{children}</div>
    )
}
