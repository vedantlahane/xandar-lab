// app/lab/notes/page.tsx
"use client";

import { useMemo } from "react";
import GroupSidebar from "./components/GroupSidebar";
import NoteCanvas from "./components/NoteCanvas";
import { NoteDrawer } from "./components/NoteDrawer";
import { Note, NOTES } from "./data/notes";
import { LabPageLayout } from "../components/shared/LabPageLayout";

export default function NotesPage() {
    const allNotes = useMemo(() => {
        return NOTES.flatMap(group => group.notes);
    }, []);

    return (
        <LabPageLayout<Note>
            items={allNotes}
            getItemId={(note) => note.id}
            renderCanvas={({ activeId, onSelect }) => (
                <NoteCanvas
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
                />
            )}
        />
    );
}
