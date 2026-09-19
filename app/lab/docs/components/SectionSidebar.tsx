// app/lab/docs/components/SectionSidebar.tsx
"use client";

import { BaseSidebar } from "@/app/lab/components/shared/BaseSidebar";

interface SectionSidebarProps {
    documents: any[];
    activeDocId: string | null;
}

export default function SectionSidebar({ documents, activeDocId }: SectionSidebarProps) {
    // Build a simple tree for the sidebar (Root level documents and their direct children)
    const rootDocs = documents.filter(d => !d.parentId);

    const categories = rootDocs.map(rootDoc => ({
        id: rootDoc.id,
        title: rootDoc.title,
    }));

    return (
        <BaseSidebar 
            activeId={activeDocId || ""} 
            categories={categories}
        />
    );
}