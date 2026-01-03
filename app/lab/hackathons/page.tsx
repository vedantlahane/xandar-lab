"use client";

import { useMemo, useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import MonthSidebar from "./components/MonthSidebar";
import HackathonCanvas from "./components/HackathonCanvas";
import { HackathonDrawer } from "./components/HackathonCard";
import { Hackathon, HACKATHONS } from "./data/hackathons";
import { useAuth } from "@/components/auth/AuthContext";

export default function HackathonsPage() {
    const [activeHackId, setActiveHackId] = useState<string | null>(null);
    const [clickPosition, setClickPosition] = useState<{ x: number; y: number } | null>(null);
    const { isAuthenticated, openLoginModal, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/lab?mode=login");
        }
    }, [isLoading, isAuthenticated, router]);

    const hackathonIndex = useMemo(() => {
        const map = new Map<string, Hackathon>();
        HACKATHONS.forEach((monthData) => {
            monthData.hackathons.forEach((hack) => map.set(hack.id, hack));
        });
        return map;
    }, []);

    const activeHackathon = activeHackId
        ? hackathonIndex.get(activeHackId) ?? null
        : null;

    const handleHackSelect = (id: string, event: React.MouseEvent) => {
        if (!isAuthenticated) {
            openLoginModal();
            return;
        }
        setClickPosition({ x: event.clientX, y: event.clientY });
        setActiveHackId(id);
    };

    return (
        <div className="relative h-screen w-full bg-background text-foreground overflow-hidden">
            <main className="h-full w-full">
                <HackathonCanvas
                    activeHackId={activeHackId}
                    onHackSelect={handleHackSelect}
                />
            </main>

            {/* Sidebar */}
            <aside className="absolute right-0 top-0 h-full pointer-events-none z-40">
                <div className="pointer-events-auto h-full">
                    <MonthSidebar />
                </div>
            </aside>

            {/* Drawer */}
            <AnimatePresence>
                {activeHackathon && clickPosition && (
                    <div className="absolute inset-0 pointer-events-none z-50">
                        <HackathonDrawer
                            key={activeHackathon.id}
                            hackathon={activeHackathon}
                            position={clickPosition}
                            onClose={() => setActiveHackId(null)}
                        />
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
