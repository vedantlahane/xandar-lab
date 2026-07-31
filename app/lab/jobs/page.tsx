// app/lab/jobs/page.tsx
"use client";

import { useMemo } from "react";
import JobCanvas from "./components/JobCanvas";
import { JobDrawer } from "./components/JobDrawer";
import { Job, JOB_LISTINGS } from "./data/jobs";
import { JobsHeader } from "./components/JobsHeader";
import { LabPageLayout } from "../components/shared/LabPageLayout";

export default function JobsPage() {
    const allJobs = useMemo(() => {
        return JOB_LISTINGS.flatMap(category => category.jobs);
    }, []);

    return (
        <LabPageLayout<Job>
            items={allJobs}
            getItemId={(job) => job.id}
            header={<JobsHeader />}
            renderCanvas={({ activeId, onSelect }) => (
                <JobCanvas
                    activeJobId={activeId}
                    onJobSelect={onSelect}
                />
            )}
            renderDrawer={({ item, position, onClose }) => (
                <JobDrawer
                    key={item.id}
                    job={item}
                    position={position}
                    onClose={onClose}
                />
            )}
        />
    );
}
