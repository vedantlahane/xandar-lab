"use client";

import { useMemo, useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import GroupSidebar from "./components/GroupSidebar";
import NoteCanvas from "./components/NoteCanvas";
import { NoteDrawer } from "./components/NoteDrawer";
import { Note, NOTES } from "./data/notes";
import { useAuth } from "@/components/auth/AuthContext";

export default function NotesPage() {
    const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
    const [clickPosition, setClickPosition] = useState<{ x: number; y: number } | null>(null);
    const { isAuthenticated, openLoginModal, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/lab?mode=login");
        }
    }, [isLoading, isAuthenticated, router]);

    const noteIndex = useMemo(() => {
        const map = new Map<string, Note>();
        NOTES.forEach((group) => {
            group.notes.forEach((note) => map.set(note.id, note));
        });
        return map;
    }, []);

    const activeNote = activeNoteId
        ? noteIndex.get(activeNoteId) ?? null
        : null;

    const handleNoteSelect = (id: string, event: React.MouseEvent) => {
        if (!isAuthenticated) {
            openLoginModal();
            return;
        }
        setClickPosition({ x: event.clientX, y: event.clientY });
        setActiveNoteId(id);
    };

    return (
        <div className="relative h-screen w-full bg-background text-foreground overflow-hidden">
            <main className="h-full w-full">
                <NoteCanvas
                    activeNoteId={activeNoteId}
                    onNoteSelect={handleNoteSelect}
                />
            </main>

            {/* Sidebar */}
            <aside className="absolute right-0 top-0 h-full pointer-events-none z-40">
                <div className="pointer-events-auto h-full">
                    <GroupSidebar />
                </div>
            </aside>

            {/* Drawer */}
            <AnimatePresence>
                {activeNote && clickPosition && (
                    <div className="absolute inset-0 pointer-events-none z-50">
                        <NoteDrawer
                            key={activeNote.id}
                            note={activeNote}
                            position={clickPosition}
                            onClose={() => setActiveNoteId(null)}
                        />
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
