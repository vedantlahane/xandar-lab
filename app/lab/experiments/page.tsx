// app/lab/experiments/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import CategorySidebar from "./components/CategorySidebar";
import ExperimentCanvas from "./components/ExperimentCanvas";
import { ExperimentDrawer } from "./components/ExperimentDrawer";
import { ExperimentEditorDrawer } from "./components/ExperimentEditorDrawer";
import { EXPERIMENTS as STATIC_EXPERIMENTS } from "./data/experiments";
import { LabPageLayout } from "../components/shared/LabPageLayout";
import { useAuth } from "@/components/auth/AuthContext";

export default function ExperimentsPage() {
    const { isAuthenticated } = useAuth();
    const [experiments, setExperiments] = useState<any[]>(() =>
        STATIC_EXPERIMENTS.flatMap((cat) =>
            cat.experiments.map((e) => ({
                ...e,
                isCurated: true,
                visibility: "public" as const,
                authorUsername: "Xandar Lab",
                authorRole: "admin",
            }))
        )
    );
    const [activeTab, setActiveTab] = useState<"all" | "my" | "community">("all");
    const [isCreating, setIsCreating] = useState(false);

    const fetchExperiments = useCallback(async () => {
        try {
            const res = await fetch(`/api/experiments?tab=${activeTab}`);
            if (res.ok) {
                const data = await res.json();
                if (data.experiments) {
                    setExperiments(data.experiments);
                }
            }
        } catch (err) {
            console.error("Failed to load experiments:", err);
        }
    }, [activeTab]);

    useEffect(() => {
        fetchExperiments();
    }, [fetchExperiments, isAuthenticated]);

    const handleExperimentUpdated = (updated: any) => {
        setExperiments((prev) =>
            prev.map((e) => (e.id === updated.id ? { ...e, ...updated } : e))
        );
    };

    const handleExperimentDeleted = (id: string) => {
        setExperiments((prev) => prev.filter((e) => e.id !== id));
    };

    const handleExperimentCreated = (newExp: any) => {
        setIsCreating(false);
        setExperiments((prev) => [newExp, ...prev]);
    };

    return (
        <>
            <LabPageLayout<any>
                items={experiments}
                getItemId={(exp) => exp.id}
                renderCanvas={({ activeId, onSelect }) => (
                    <ExperimentCanvas
                        experiments={experiments}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        onNewExperiment={() => setIsCreating(true)}
                        activeExpId={activeId}
                        onExpSelect={onSelect}
                    />
                )}
                renderSidebar={() => <CategorySidebar />}
                renderDrawer={({ item, position, onClose }) => (
                    <ExperimentDrawer
                        key={item.id}
                        experiment={item}
                        position={position}
                        onClose={onClose}
                        onExperimentUpdated={handleExperimentUpdated}
                        onExperimentDeleted={handleExperimentDeleted}
                    />
                )}
            />

            {/* Experiment Creation Drawer */}
            {isCreating && (
                <div className="fixed inset-0 pointer-events-none z-50">
                    <div className="pointer-events-auto h-full w-full">
                        <ExperimentEditorDrawer
                            onClose={() => setIsCreating(false)}
                            onSaved={handleExperimentCreated}
                        />
                    </div>
                </div>
            )}
        </>
    );
}
