// app/lab/practice/layout.tsx

export default function PracticeLayout({
    children,
}:{
    children: React.ReactNode
}){
    return(
        <div className="min-h-screen bg-background text-foreground">{children}</div>
    )
}