"use client";

import ProtectedPage from "@/components/auth/ProtectedPage";

export default function DocsPage() {
    return (
        <ProtectedPage>
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Documentation</h1>
                <p className="text-muted-foreground">Documentation content goes here.</p>
            </div>
        </ProtectedPage>
    );
}
