"use client";

import ProtectedPage from "@/components/auth/ProtectedPage";

export default function NotesPage() {
    return (
        <ProtectedPage>
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Notes</h1>
                <p className="text-muted-foreground">Notes content goes here.</p>
            </div>
        </ProtectedPage>
    );
}
