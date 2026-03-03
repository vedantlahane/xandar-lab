export default function ExperimentsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen text-foreground">{children}</div>
    )
}
