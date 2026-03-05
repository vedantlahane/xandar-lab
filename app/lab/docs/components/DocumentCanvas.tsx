// app/lab/docs/components/DocumentCanvas.tsx
"use client";

import { useState, useMemo } from "react";
import { DOCUMENTS, DocCategory, DocTechnology } from "../data/documents";
import { FileText, Star, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface DocumentCanvasProps {
    activeDocId: string | null;
    onDocSelect: (id: string, event: React.MouseEvent) => void;
}

type FilterCategory = "All" | DocCategory;
type FilterTechnology = "All" | DocTechnology;

export default function DocumentCanvas({
    activeDocId,
    onDocSelect,
}: DocumentCanvasProps) {
    const [categoryFilter, setCategoryFilter] = useState<FilterCategory>("All");
    const [techFilter, setTechFilter] = useState<FilterTechnology>("All");

    const categories: FilterCategory[] = ["All", "Cheatsheet", "Guide", "Reference", "Tutorial", "Notes"];
    const technologies: FilterTechnology[] = ["All", "JavaScript", "TypeScript", "React", "Node.js", "Python", "DSA", "System Design", "Git", "Docker", "CSS"];

    const filteredDocs = useMemo(() => {
        return DOCUMENTS.map((section) => {
            const filteredDocuments = section.documents.filter((doc) => {
                if (categoryFilter !== "All" && doc.category !== categoryFilter) return false;
                if (techFilter !== "All" && doc.technology !== techFilter) return false;
                return true;
            });

            return {
                ...section,
                documents: filteredDocuments,
            };
        }).filter((section) => section.documents.length > 0);
    }, [categoryFilter, techFilter]);

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'Cheatsheet': return 'text-blue-400';
            case 'Guide': return 'text-green-400';
            case 'Reference': return 'text-purple-400';
            case 'Tutorial': return 'text-orange-400';
            case 'Notes': return 'text-yellow-400';
            default: return 'text-muted-foreground';
        }
    };

    return (
        <div className="relative h-full pt-12">
            {/* Top Fade */}
            <div className="pointer-events-none absolute top-0 left-0 right-0 h-12 bg-linear-to-b from-card to-transparent z-20" />

            <div id="docs-scroll-container" className="h-full overflow-y-auto">
                <div className="max-w-7xl mx-auto px-8 md:px-12 pb-48 pt-12">
                    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-12">
                        {/* Left Column: Filters */}
                        <div className="hidden md:block">
                            <div className="sticky top-32 space-y-4">
                                <div className="space-y-0.5">
                                    <h3 className="text-[10px] uppercase font-semibold text-muted-foreground/60 tracking-widest px-2 mb-1.5">
                                        Category
                                    </h3>
                                    {categories.map((filter) => {
                                        const isActive = categoryFilter === filter;
                                        return (
                                            <button
                                                key={filter}
                                                onClick={() => setCategoryFilter(filter)}
                                                className={cn(
                                                    "w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-sm transition-all text-left",
                                                    isActive
                                                        ? "bg-primary/10 text-primary font-medium"
                                                        : "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
                                                )}
                                            >
                                                <div className={cn(
                                                    "h-1.5 w-1.5 rounded-full shrink-0",
                                                    filter === "All" && "bg-muted-foreground",
                                                    filter === "Cheatsheet" && "bg-blue-400",
                                                    filter === "Guide" && "bg-green-400",
                                                    filter === "Reference" && "bg-purple-400",
                                                    filter === "Tutorial" && "bg-orange-400",
                                                    filter === "Notes" && "bg-yellow-400",
                                                )} />
                                                {filter === "All" ? "All Categories" : filter}
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="space-y-1">
                                    <h3 className="text-[10px] uppercase font-semibold text-muted-foreground/60 tracking-widest px-2 mb-1.5">
                                        Technology
                                    </h3>
                                    <div className="flex gap-1.5 flex-wrap px-1">
                                        {technologies.map((filter) => {
                                            const isActive = techFilter === filter;
                                            return (
                                                <button
                                                    key={filter}
                                                    onClick={() => setTechFilter(techFilter === filter ? "All" : filter)}
                                                    className={cn(
                                                        "px-2.5 py-1 rounded-lg text-xs font-medium border transition-all",
                                                        isActive
                                                            ? "bg-primary/10 text-primary border-primary/30"
                                                            : "border-border/40 text-muted-foreground hover:bg-muted/30 hover:text-foreground",
                                                    )}
                                                >
                                                    {filter}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Documents */}
                        <div className="space-y-3">
                            {filteredDocs.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    No documents match your filters.
                                </div>
                            ) : (
                                filteredDocs.map((section) => (
                                    <section
                                        key={section.sectionName}
                                        id={section.sectionName}
                                        data-section
                                        data-section-title={section.sectionName}
                                        className="space-y-5"
                                    >
                                        <div className="sticky top-0 z-10 bg-background/95 py-4 backdrop-blur">
                                            <h2 className="text-lg font-semibold">{section.sectionName}</h2>
                                            <p className="text-sm text-muted-foreground">
                                                {section.documents.length} documents
                                            </p>
                                        </div>

                                        <div className="space-y-1">
                                            {section.documents.map((doc) => {
                                                const isActive = activeDocId === doc.id;
                                                return (
                                                    <button
                                                        key={doc.id}
                                                        onClick={(e) => onDocSelect(doc.id, e)}
                                                        className={`group relative w-full rounded-xl border border-border/40 px-4 py-3 text-left transition-all backdrop-blur-md hover:bg-white/50 dark:hover:bg-zinc-900/30 hover:shadow-sm hover:border-zinc-200/60 dark:hover:border-zinc-800/60 mb-2 ${isActive ? "bg-white/50 dark:bg-zinc-900/30 border-zinc-200/60 dark:border-zinc-800/60 shadow-sm" : ""
                                                            }`}
                                                    >
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div className="space-y-1.5">
                                                                <div className="flex items-center gap-2">
                                                                    <FileText className={`h-4 w-4 ${getCategoryColor(doc.category)}`} />
                                                                    <div
                                                                        className={`text-sm font-medium transition-colors ${isActive
                                                                            ? "text-primary"
                                                                            : "text-foreground group-hover:text-primary"
                                                                            }`}
                                                                    >
                                                                        {doc.title}
                                                                    </div>
                                                                </div>
                                                                <p className="text-xs text-muted-foreground/70 line-clamp-1 pl-6">
                                                                    {doc.description}
                                                                </p>
                                                                <div className="flex flex-wrap gap-2 text-[11px] font-medium text-muted-foreground pl-6">
                                                                    <span className={`${getCategoryColor(doc.category)}`}>
                                                                        {doc.category}
                                                                    </span>
                                                                    {doc.tags?.slice(0, 2).map((tag) => (
                                                                        <span
                                                                            key={tag}
                                                                            className="text-xs text-muted-foreground/50"
                                                                        >
                                                                            • {tag}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            {/* Hover Actions */}
                                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                                                                <div
                                                                    role="button"
                                                                    className="rounded-md p-1.5 hover:bg-background hover:shadow-sm transition-colors text-muted-foreground hover:text-yellow-500"
                                                                    title="Add to favorites"
                                                                >
                                                                    <Star className="h-4 w-4" />
                                                                </div>
                                                                <div className="flex items-center gap-1 text-xs text-muted-foreground/50">
                                                                    <Clock className="h-3 w-3" />
                                                                    {doc.updatedAt}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </section>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Fade */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-card to-transparent z-20" />
        </div>
    );
}
