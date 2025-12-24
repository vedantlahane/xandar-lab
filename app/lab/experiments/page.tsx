"use client";

import ProtectedPage from "@/components/auth/ProtectedPage";

export default function ExperimentsPage() {
    return (
        <ProtectedPage>
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Experiments</h1>
                <p className="text-muted-foreground">Experiments content goes here.</p>
            </div>
        </ProtectedPage>
    );
}
