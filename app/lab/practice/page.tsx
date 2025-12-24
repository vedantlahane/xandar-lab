"use client";

import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import TopicSidebar from "./components/TopicSidebar";
import ProblemCanvas from "./components/ProblemCanvas";
import { ProblemDrawer } from "./components/ProblemDrawer";
import { DSAProblem, SHEET } from "./data/sheet";

export default function PracticePage() {
    const [activeProblemId, setActiveProblemId] = useState<string | null>(null);
    const [clickPosition, setClickPosition] = useState<{ x: number; y: number } | null>(null);

    const problemIndex = useMemo(() => {
        const map = new Map<string, DSAProblem>();
        SHEET.forEach((topic) => {
            topic.problems.forEach((problem) => map.set(problem.id, problem));
        });
        return map;
    }, []);

    const activeProblem = activeProblemId
        ? problemIndex.get(activeProblemId) ?? null
        : null;

    const handleProblemSelect = (id: string, event: React.MouseEvent) => {
        setClickPosition({ x: event.clientX, y: event.clientY });
        setActiveProblemId(id);
    };

    return (
        <div className="relative h-screen w-full bg-background text-foreground overflow-hidden">
            <main className="h-full w-full">
                <ProblemCanvas 
                    activeProblemId={activeProblemId}
                    onProblemSelect={handleProblemSelect}
                />
            </main>

            {/* Sidebar - z-40 to be below drawer */}
            <aside className="absolute right-0 top-0 h-full pointer-events-none z-40">
                <div className="pointer-events-auto h-full">
                    <TopicSidebar />
                </div>
            </aside>

            {/* Drawer - z-50 to be above sidebar */}
            <AnimatePresence>
                {activeProblem && clickPosition && (
                    <div className="absolute inset-0 pointer-events-none z-50">
                        <ProblemDrawer
                            key={activeProblem.id}
                            problem={activeProblem}
                            position={clickPosition}
                            onClose={() => setActiveProblemId(null)}
                        />
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}