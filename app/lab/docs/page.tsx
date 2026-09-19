// app/lab/docs/page.tsx
"use client";

import { useState, useEffect } from "react";
import SectionSidebar from "./components/SectionSidebar";
import DocumentCanvas from "./components/DocumentCanvas";
import { DocumentDrawer } from "./components/DocumentDrawer";
import { LabPageLayout } from "../components/shared/LabPageLayout";

export default function DocsPage() {
    const [documents, setDocuments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState("my");
    const [searchQuery, setSearchQuery] = useState("");

    const fetchDocuments = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/docs?tab=${tab}&q=${encodeURIComponent(searchQuery)}`);
            if (res.ok) {
                const data = await res.json();
                setDocuments(data.documents || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, [tab, searchQuery]);

    return (
        <LabPageLayout<any>
            items={documents}
            getItemId={(doc) => doc.id}
            renderCanvas={({ activeId, onSelect }) => (
                <DocumentCanvas
                    activeDocId={activeId}
                    onDocSelect={onSelect}
                    documents={documents}
                    loading={loading}
                    tab={tab}
                    onTabChange={setTab}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                />
            )}
            renderSidebar={() => (
                <SectionSidebar 
                    documents={documents} 
                    activeDocId={null}
                />
            )}
            renderDrawer={({ item, position, onClose }) => (
                <DocumentDrawer
                    key={item.id}
                    document={item}
                    position={position}
                    onClose={onClose}
                    onDocUpdated={fetchDocuments}
                    onDocDeleted={fetchDocuments}
                />
            )}
        />
    );
}
