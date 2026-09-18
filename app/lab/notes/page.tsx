// app/lab/notes/page.tsx
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import GroupSidebar from "./components/GroupSidebar";
import NoteCanvas from "./components/NoteCanvas";
import { NoteDrawer } from "./components/NoteDrawer";
import { NoteEditorDrawer } from "./components/NoteEditorDrawer";
import { NOTES as STATIC_NOTES } from "./data/notes";
import { LabPageLayout } from "../components/shared/LabPageLayout";
import { useAuth } from "@/components/auth/AuthContext";

export default function NotesPage() {
    const { isAuthenticated } = useAuth();
    const [notes, setNotes] = useState<any[]>(() =>
        STATIC_NOTES.flatMap((group) =>
            group.notes.map((n) => ({
                ...n,
                isCurated: true,
                visibility: "public" as const,
                authorUsername: "Xandar Curated",
                authorRole: "admin",
            }))
        )
    );
    const [activeTab, setActiveTab] = useState<"all" | "my" | "community" | "trash">("all");
    const [isCreating, setIsCreating] = useState(false);

    // Fetch notes whenever tab changes or auth changes
    const fetchNotes = useCallback(async () => {
        try {
            const res = await fetch(`/api/notes?tab=${activeTab}`);
            if (res.ok) {
                const data = await res.json();
                if (data.notes) {
                    setNotes(data.notes);
                }
            }
        } catch (err) {
            console.error("Failed to load dynamic notes:", err);
        }
    }, [activeTab]);

    useEffect(() => {
        fetchNotes();
    }, [fetchNotes, isAuthenticated]);

    const handleNoteUpdated = (updated: any) => {
        setNotes((prev) =>
            prev.map((n) => (n.id === updated.id ? { ...n, ...updated } : n))
        );
    };

    const handleNoteDeleted = (id: string) => {
        setNotes((prev) => prev.filter((n) => n.id !== id));
    };

    const handleNoteCreated = (newNote: any) => {
        setIsCreating(false);
        setNotes((prev) => [newNote, ...prev]);
    };

    return (
        <>
            <LabPageLayout<any>
                items={notes}
                getItemId={(note) => note.id}
                renderCanvas={({ activeId, onSelect }) => (
                    <NoteCanvas
                        notes={notes}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        onNewNote={() => setIsCreating(true)}
                        activeNoteId={activeId}
                        onNoteSelect={onSelect}
                    />
                )}
                renderSidebar={() => <GroupSidebar />}
                renderDrawer={({ item, position, onClose }) => (
                    <NoteDrawer
                        key={item.id}
                        note={item}
                        position={position}
                        onClose={onClose}
                        onNoteUpdated={handleNoteUpdated}
                        onNoteDeleted={handleNoteDeleted}
                    />
                )}
            />

            {/* Note Creation Drawer */}
            {isCreating && (
                <div className="fixed inset-0 pointer-events-none z-50">
                    <div className="pointer-events-auto h-full w-full">
                        <NoteEditorDrawer
                            onClose={() => setIsCreating(false)}
                            onSaved={handleNoteCreated}
                        />
                    </div>
                </div>
            )}
        </>
    );
}
