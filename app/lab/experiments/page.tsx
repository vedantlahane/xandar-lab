// app/lab/experiments/page.tsx
"use client";

import { useMemo, useState } from "react";
import CategorySidebar from "./components/CategorySidebar";
import ExperimentCanvas from "./components/ExperimentCanvas";
import { ExperimentDrawer } from "./components/ExperimentDrawer";
import { Experiment, EXPERIMENTS } from "./data/experiments";
import { LabPageLayout } from "../components/shared/LabPageLayout";

export default function ExperimentsPage() {
    const allExperiments = useMemo(() => {
        return EXPERIMENTS.flatMap(cat => cat.experiments);
    }, []);

    return (
        <LabPageLayout<Experiment>
            items={allExperiments}
            getItemId={(exp) => exp.id}
            renderCanvas={({ activeId, onSelect }) => (
                <ExperimentCanvas
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
                />
            )}
        />
    );
}
