// app/lab/docs/components/DocumentCanvas.tsx
"use client";

import { useState } from "react";
import { FileText, Plus, Pin, Star, Lock, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchBar } from "@/app/lab/practice/components/browse/SearchBar";
import { BaseCanvas } from "@/app/lab/components/shared/BaseCanvas";
import { CanvasSortSelect } from "@/app/lab/components/shared/CanvasSortSelect";
import { CanvasStatsCard } from "@/app/lab/components/shared/CanvasStatsCard";
import { Button } from "@/components/ui/button";
import { LabItemRow } from "@/app/lab/components/shared/LabItemRow";
import { DocumentEditorDrawer } from "./DocumentEditorDrawer";

type SortOption = "Updated" | "Created" | "Title";

const SORT_ITEMS: { value: SortOption; label: string }[] = [
    { value: "Updated", label: "Updated" },
    { value: "Created", label: "Created" },
    { value: "Title", label: "Title" },
];

interface DocumentCanvasProps {
    activeDocId: string | null;
    onDocSelect: (id: string, event: React.MouseEvent) => void;
    documents: any[];
    loading: boolean;
    tab: string;
    onTabChange: (tab: string) => void;
    searchQuery: string;
    onSearchChange: (q: string) => void;
}

export default function DocumentCanvas({
    activeDocId,
    onDocSelect,
    documents,
    loading,
    tab,
    onTabChange,
    searchQuery,
    onSearchChange,
}: DocumentCanvasProps) {
    const [sortOption, setSortOption] = useState<SortOption>("Updated");
    const [sortDesc, setSortDesc] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    // Filter and Sort
    const filteredDocs = [...documents].sort((a, b) => {
        let cmp = 0;
        if (sortOption === "Updated") cmp = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        else if (sortOption === "Created") cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        else if (sortOption === "Title") cmp = a.title.localeCompare(b.title);
        return sortDesc ? -cmp : cmp;
    });

    const totalCount = documents.length;

    const sidebarContent = (
        <>
            <CanvasStatsCard
                title="Documents"
                icon={FileText}
                stats={[
                    { label: "total", value: totalCount }
                ]}
            />

            <div className="space-y-4 pt-2">
                <div className="flex flex-col gap-1">
                    <button
                        onClick={() => onTabChange("my")}
                        className={cn(
                            "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors text-left",
                            tab === "my"
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                        )}
                    >
                        My Docs
                    </button>
                    <button
                        onClick={() => onTabChange("community")}
                        className={cn(
                            "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors text-left",
                            tab === "community"
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                        )}
                    >
                        Community Docs
                    </button>
                    <button
                        onClick={() => onTabChange("trash")}
                        className={cn(
                            "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors text-left text-red-500/70 hover:text-red-500 hover:bg-red-500/10",
                            tab === "trash" && "bg-red-500/10 text-red-500"
                        )}
                    >
                        Trash
                    </button>
                </div>
            </div>

            <CanvasSortSelect
                items={SORT_ITEMS}
                currentSort={sortOption}
                sortDesc={sortDesc}
                onSortChange={setSortOption}
                onSortDescChange={setSortDesc}
            />
        </>
    );

    return (
        <BaseCanvas scrollId="docs-scroll-container" sidebarContent={sidebarContent}>
            {/* Sticky search bar + New Doc button */}
            <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm py-2.5 sm:py-4 flex items-center gap-2.5">
                <div className="flex-1">
                    <SearchBar
                        query={searchQuery}
                        onQueryChange={onSearchChange}
                        placeholder="Search docs..."
                    />
                </div>
                <Button
                    onClick={() => setIsCreating(true)}
                    className="shrink-0 h-10 px-3.5 gap-1.5 rounded-xl bg-primary text-primary-foreground font-medium shadow-sm hover:opacity-95 transition-all text-xs sm:text-sm"
                >
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">New Doc</span>
                </Button>
            </div>

            {loading ? (
                <div className="text-center py-16 text-muted-foreground">Loading...</div>
            ) : filteredDocs.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-3 opacity-40" />
                    <p className="text-lg font-medium text-foreground">No documents found</p>
                    <p className="text-sm mt-1 mb-5">
                        {tab === "my"
                            ? "You haven't created any docs yet. Click below to add one!"
                            : "Try adjusting your search to see more docs."}
                    </p>
                    {tab === "my" && (
                        <Button onClick={() => setIsCreating(true)} size="sm" className="gap-1.5">
                            <Plus className="h-4 w-4" /> Create First Doc
                        </Button>
                    )}
                </div>
            ) : (
                <div className="space-y-0 pt-4">
                    {filteredDocs.map((doc: any) => {
                        const isActive = activeDocId === doc.id;
                        return (
                            <LabItemRow
                                key={doc.id}
                                id={doc.id}
                                isActive={isActive}
                                onClick={onDocSelect}
                                title={doc.title}
                                titleIcon={
                                    <>
                                        {doc.icon ? (
                                            <span className="text-sm shrink-0 leading-none">{doc.icon}</span>
                                        ) : (
                                            <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                                        )}
                                        {doc.isCurated && <Star className="h-3 w-3 text-amber-400 fill-current" />}
                                    </>
                                }
                                subtitle={`${doc.content.replace(/<[^>]*>?/gm, '').substring(0, 100)}...`}
                                tags={
                                    <>
                                        {doc.authorUsername && tab !== "my" && (
                                            <span className="inline-flex items-center gap-1 text-muted-foreground/60">
                                                ? @{doc.authorUsername}
                                            </span>
                                        )}
                                        {doc.visibility === "private" && (
                                            <span className="inline-flex items-center gap-0.5 text-muted-foreground/60">
                                                ? <Lock className="h-2.5 w-2.5" /> Private
                                            </span>
                                        )}
                                    </>
                                }
                                hoverContent={
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground/50">
                                        <Calendar className="h-3 w-3" />
                                        {doc.updatedAt}
                                    </div>
                                }
                            />
                        );
                    })}
                </div>
            )}

            {isCreating && (
                <DocumentEditorDrawer
                    documents={documents}
                    onClose={() => setIsCreating(false)}
                    onSaved={() => {
                        setIsCreating(false);
                        onTabChange(tab); // Trigger refetch
                    }}
                />
            )}
        </BaseCanvas>
    );
}
