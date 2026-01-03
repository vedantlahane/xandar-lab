"use client";

import { useMemo, useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import CategorySidebar from "./components/CategorySidebar";
import ExperimentCanvas from "./components/ExperimentCanvas";
import { ExperimentDrawer } from "./components/ExperimentDrawer";
import { Experiment, EXPERIMENTS } from "./data/experiments";
import { useAuth } from "@/components/auth/AuthContext";

export default function ExperimentsPage() {
    const [activeExpId, setActiveExpId] = useState<string | null>(null);
    const [clickPosition, setClickPosition] = useState<{ x: number; y: number } | null>(null);
    const { isAuthenticated, openLoginModal, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/lab?mode=login");
        }
    }, [isLoading, isAuthenticated, router]);

    const experimentIndex = useMemo(() => {
        const map = new Map<string, Experiment>();
        EXPERIMENTS.forEach((category) => {
            category.experiments.forEach((exp) => map.set(exp.id, exp));
        });
        return map;
    }, []);

    const activeExperiment = activeExpId
        ? experimentIndex.get(activeExpId) ?? null
        : null;

    const handleExpSelect = (id: string, event: React.MouseEvent) => {
        if (!isAuthenticated) {
            openLoginModal();
            return;
        }
        setClickPosition({ x: event.clientX, y: event.clientY });
        setActiveExpId(id);
    };

    return (
        <div className="relative h-screen w-full bg-background text-foreground overflow-hidden">
            <main className="h-full w-full">
                <ExperimentCanvas
                    activeExpId={activeExpId}
                    onExpSelect={handleExpSelect}
                />
            </main>

            {/* Sidebar */}
            <aside className="absolute right-0 top-0 h-full pointer-events-none z-40">
                <div className="pointer-events-auto h-full">
                    <CategorySidebar />
                </div>
            </aside>

            {/* Drawer */}
            <AnimatePresence>
                {activeExperiment && clickPosition && (
                    <div className="absolute inset-0 pointer-events-none z-50">
                        <ExperimentDrawer
                            key={activeExperiment.id}
                            experiment={activeExperiment}
                            position={clickPosition}
                            onClose={() => setActiveExpId(null)}
                        />
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
