import { SHEET } from "../data/sheet"

export default function ProblemCanvas(){
    return(
        <div
        id="problem-scroll-container" 
        className="h-full  overflow-y-auto p-8 space-y-12">
            {SHEET.map((topic)=>(<section key={topic.id}
            id={topic.id}
            data-topic
            className="space-y-4">
                <h2 className="text-lg font-semibold sticky top-0 bg-white">{topic.title}</h2>
                <div className="space-y-2">
                    {topic.problems.map((problem) => (
                        <div key={problem.id} className="border p-3 rounded cursor-pointer hover:bg-gray-50">
                            {problem.title}
                        </div>
                    ))}
                </div>
            </section>))}
        </div>
    )
}