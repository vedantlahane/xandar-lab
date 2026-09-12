// app/lab/hackathons/page.tsx
"use client";

import { useMemo } from "react";
import MonthSidebar from "./components/MonthSidebar";
import HackathonCanvas from "./components/HackathonCanvas";
import { HackathonDrawer } from "./components/HackathonCard";
import { Hackathon, HACKATHONS } from "./data/hackathons";
import { LabPageLayout } from "../components/shared/LabPageLayout";

export default function HackathonsPage() {
    const allHackathons = useMemo(() => {
        return HACKATHONS.flatMap(monthData => monthData.hackathons);
    }, []);

    return (
        <LabPageLayout<Hackathon>
            items={allHackathons}
            getItemId={(hack) => hack.id}
            renderCanvas={({ activeId, onSelect }) => (
                <HackathonCanvas
                    activeHackId={activeId}
                    onHackSelect={onSelect}
                />
            )}
            renderSidebar={() => <MonthSidebar />}
            renderDrawer={({ item, position, onClose }) => (
                <HackathonDrawer
                    key={item.id}
                    hackathon={item}
                    position={position}
                    onClose={onClose}
                />
            )}
        />
    );
}
