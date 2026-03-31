// app/lab/docs/page.tsx
"use client";

import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import SectionSidebar from "./components/SectionSidebar";
import DocumentCanvas from "./components/DocumentCanvas";
import { DocumentDrawer } from "./components/DocumentDrawer";
import { Document, DOCUMENTS } from "./data/documents";
import { useAuth } from "@/components/auth/AuthContext";

export default function DocsPage() {
    const [activeDocId, setActiveDocId] = useState<string | null>(null);
    const [clickPosition, setClickPosition] = useState<{ x: number; y: number } | null>(null);
    const { isAuthenticated, openLoginModal } = useAuth();

    const documentIndex = useMemo(() => {
        const map = new Map<string, Document>();
        DOCUMENTS.forEach((section) => {
            section.documents.forEach((doc) => map.set(doc.id, doc));
        });
        return map;
    }, []);

    const activeDocument = activeDocId
        ? documentIndex.get(activeDocId) ?? null
        : null;

    const handleDocSelect = (id: string, event: React.MouseEvent) => {
        if (!isAuthenticated) {
            openLoginModal();
            return;
        }
        setClickPosition({ x: event.clientX, y: event.clientY });
        setActiveDocId(id);
    };

    return (
        <div className="relative h-screen w-full text-foreground overflow-hidden">
            <main className="h-full w-full">
                <DocumentCanvas
                    activeDocId={activeDocId}
                    onDocSelect={handleDocSelect}
                />
            </main>

            {/* Sidebar */}
            <aside className="absolute right-0 top-0 h-full pointer-events-none z-40">
                <div className="pointer-events-auto h-full">
                    <SectionSidebar />
                </div>
            </aside>

            {/* Drawer */}
            <AnimatePresence>
                {activeDocument && clickPosition && (
                    <div className="absolute inset-0 pointer-events-none z-50">
                        <DocumentDrawer
                            key={activeDocument.id}
                            document={activeDocument}
                            position={clickPosition}
                            onClose={() => setActiveDocId(null)}
                        />
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
