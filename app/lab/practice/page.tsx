import PracticeLayout from "./layout";  
import TopicSidebar from "./components/TopicSidebar";
import ProblemCanvas from "./components/ProblemCanvas";
import PracticeShell from "./components/PraccticeShell";


export default function PracticePage(){
    return(
        <PracticeShell
        left={<div className="p-4">☰</div>}
        center = {<ProblemCanvas />}
        right = {<TopicSidebar />}
        />
    )
}