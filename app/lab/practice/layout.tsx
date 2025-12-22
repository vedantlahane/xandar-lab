export default function PracticeLayout({
    children,
}:{
    children: React.ReactNode
}){
    return(
        <div className="h-screen grid grid-cols-[auto_1fr_auto]">{children}</div>
    )
}