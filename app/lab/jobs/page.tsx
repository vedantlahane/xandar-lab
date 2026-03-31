// app/lab/jobs/page.tsx
"use client";

import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import JobCanvas from "./components/JobCanvas";
import { JobDrawer } from "./components/JobDrawer";
import { Job, JOB_LISTINGS } from "./data/jobs";
import { useAuth } from "@/components/auth/AuthContext";
import { JobsHeader } from "./components/JobsHeader";

export default function JobsPage() {
    const [activeJobId, setActiveJobId] = useState<string | null>(null);
    const [clickPosition, setClickPosition] = useState<{ x: number; y: number } | null>(null);
    const { isAuthenticated, openLoginModal } = useAuth();

    const jobIndex = useMemo(() => {
        const map = new Map<string, Job>();
        JOB_LISTINGS.forEach((category) => {
            category.jobs.forEach((job) => map.set(job.id, job));
        });
        return map;
    }, []);

    const activeJob = activeJobId
        ? jobIndex.get(activeJobId) ?? null
        : null;

    const handleJobSelect = (id: string, event: React.MouseEvent) => {
        if (!isAuthenticated) {
            openLoginModal();
            return;
        }
        setClickPosition({ x: event.clientX, y: event.clientY });
        setActiveJobId(id);
    };

    return (
        <>
            <JobsHeader />
            {/* content area fills remaining space from layout */}
            <div className="flex-1 relative text-foreground overflow-hidden">
                <main className="h-full w-full">
                    <JobCanvas
                        activeJobId={activeJobId}
                        onJobSelect={handleJobSelect}
                    />
                </main>

                {/* Drawer - z-50 to be above everything */}
                <AnimatePresence>
                    {activeJob && clickPosition && (
                        <div className="absolute inset-0 pointer-events-none z-50">
                            <JobDrawer
                                key={activeJob.id}
                                job={activeJob}
                                position={clickPosition}
                                onClose={() => setActiveJobId(null)}
                            />
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}
