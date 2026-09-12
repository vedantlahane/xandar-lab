// app/lab/docs/page.tsx
"use client";

import { useMemo } from "react";
import SectionSidebar from "./components/SectionSidebar";
import DocumentCanvas from "./components/DocumentCanvas";
import { DocumentDrawer } from "./components/DocumentDrawer";
import { Document, DOCUMENTS } from "./data/documents";
import { LabPageLayout } from "../components/shared/LabPageLayout";

export default function DocsPage() {
    const allDocuments = useMemo(() => {
        return DOCUMENTS.flatMap(section => section.documents);
    }, []);

    return (
        <LabPageLayout<Document>
            items={allDocuments}
            getItemId={(doc) => doc.id}
            renderCanvas={({ activeId, onSelect }) => (
                <DocumentCanvas
                    activeDocId={activeId}
                    onDocSelect={onSelect}
                />
            )}
            renderSidebar={() => <SectionSidebar />}
            renderDrawer={({ item, position, onClose }) => (
                <DocumentDrawer
                    key={item.id}
                    document={item}
                    position={position}
                    onClose={onClose}
                />
            )}
        />
    );
}
