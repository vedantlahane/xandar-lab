export default function PracticeShell({
    left,
    center,
    right,
}:{
    left: React.ReactNode,
    center: React.ReactNode,
    right: React.ReactNode,
}){
    return(
        <>
        <aside className="w-14 border-r bg-white">
            {left}
        </aside>
        <main className="overflow-y-auto">
            {center}
        </main>
        <aside className="w-14 border-l bg-white">
            {right}
        </aside>
        </>
    )
}