// app/lab/docs/components/DocumentCanvas.tsx
"use client";

import { useState, useMemo } from "react";
import { DOCUMENTS, DocCategory, DocTechnology } from "../data/documents";
import {
    FileText, Star, Clock, Tag,
    Layers, BookOpen, FileCode, BookMarked, GraduationCap, Notebook,
    Code, Braces, Box, Server as ServerIcon, Binary, Ruler, GitBranch, Container, Palette, HardDrive,
    ArrowUpDown, ChevronDown, ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchBar } from "@/app/lab/practice/components/browse/SearchBar";

interface DocumentCanvasProps {
    activeDocId: string | null;
    onDocSelect: (id: string, event: React.MouseEvent) => void;
}

type FilterCategory = "All" | DocCategory;
type FilterTech = "All" | DocTechnology;
type FilterFavorite = "All" | "Favorites";
type SortOption = "Updated" | "Created" | "Title";

// ── Category filter config ──────────────────────────────────────────────
const CATEGORY_ITEMS: { value: FilterCategory; label: string; icon: typeof Layers; dotColor: string }[] = [
    { value: "All", label: "All Categories", icon: Layers, dotColor: "bg-muted-foreground" },
    { value: "Cheatsheet", label: "Cheatsheet", icon: FileCode, dotColor: "bg-blue-500" },
    { value: "Guide", label: "Guide", icon: BookOpen, dotColor: "bg-green-500" },
    { value: "Reference", label: "Reference", icon: BookMarked, dotColor: "bg-purple-500" },
    { value: "Tutorial", label: "Tutorial", icon: GraduationCap, dotColor: "bg-orange-500" },
    { value: "Notes", label: "Notes", icon: Notebook, dotColor: "bg-yellow-500" },
];

// ── Technology filter config ────────────────────────────────────────────
const TECH_ITEMS: { value: DocTechnology; label: string; dotColor: string }[] = [
    { value: "JavaScript", label: "JS", dotColor: "bg-yellow-500" },
    { value: "TypeScript", label: "TS", dotColor: "bg-blue-500" },
    { value: "React", label: "React", dotColor: "bg-cyan-500" },
    { value: "Node.js", label: "Node", dotColor: "bg-green-500" },
    { value: "Python", label: "Python", dotColor: "bg-emerald-500" },
    { value: "DSA", label: "DSA", dotColor: "bg-red-500" },
    { value: "System Design", label: "SysDes", dotColor: "bg-purple-500" },
    { value: "Git", label: "Git", dotColor: "bg-orange-500" },
    { value: "Docker", label: "Docker", dotColor: "bg-sky-500" },
    { value: "CSS", label: "CSS", dotColor: "bg-pink-500" },
];

// ── Sort config ─────────────────────────────────────────────────────────
const SORT_ITEMS: { value: SortOption; label: string }[] = [
    { value: "Updated", label: "Updated" },
    { value: "Created", label: "Created" },
    { value: "Title", label: "Title" },
];

export default function DocumentCanvas({
    activeDocId,
    onDocSelect,
}: DocumentCanvasProps) {
    const [categoryFilter, setCategoryFilter] = useState<FilterCategory>("All");
    const [techFilter, setTechFilter] = useState<FilterTech>("All");
    const [favoriteFilter, setFavoriteFilter] = useState<FilterFavorite>("All");
    const [sortOption, setSortOption] = useState<SortOption>("Updated");
    const [sortDesc, setSortDesc] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredDocuments = useMemo(() => {
        return DOCUMENTS.map((section) => {
            const filteredItems = section.documents.filter((doc) => {
                if (searchQuery) {
                    const q = searchQuery.toLowerCase();
                    if (
                        !doc.title.toLowerCase().includes(q) &&
                        !doc.description.toLowerCase().includes(q) &&
                        !doc.tags?.some(t => t.toLowerCase().includes(q))
                    ) return false;
                }
                if (categoryFilter !== "All" && doc.category !== categoryFilter) return false;
                if (techFilter !== "All" && doc.technology !== techFilter) return false;
                if (favoriteFilter === "Favorites" && !doc.isFavorite) return false;
                return true;
            });

            const sorted = [...filteredItems].sort((a, b) => {
                let cmp = 0;
                if (sortOption === "Updated") cmp = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
                else if (sortOption === "Created") cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                else if (sortOption === "Title") cmp = a.title.localeCompare(b.title);
                return sortDesc ? -cmp : cmp;
            });

            return { ...section, documents: sorted };
        }).filter((section) => section.documents.length > 0);
    }, [categoryFilter, techFilter, favoriteFilter, searchQuery, sortOption, sortDesc]);

    // Stats
    const allDocs = DOCUMENTS.flatMap(s => s.documents);
    const totalCount = allDocs.length;
    const favCount = allDocs.filter(d => d.isFavorite).length;
    const sectionCount = DOCUMENTS.length;

    const getCategoryColor = (cat: string) => {
        switch (cat) {
            case 'Cheatsheet': return 'text-blue-500';
            case 'Guide': return 'text-green-500';
            case 'Reference': return 'text-purple-500';
            case 'Tutorial': return 'text-orange-500';
            case 'Notes': return 'text-yellow-500';
            default: return 'text-muted-foreground';
        }
    };

    const getTechColor = (tech: string) => {
        const item = TECH_ITEMS.find(t => t.value === tech);
        return item ? item.dotColor.replace("bg-", "text-") : "text-muted-foreground";
    };

    return (
        <div className="relative h-full">
            {/* Top Fade */}
            <div className="pointer-events-none absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-background to-transparent z-10" />

            <div id="docs-scroll-container" className="h-full overflow-y-auto thin-scrollbar overscroll-contain">
                <div className="max-w-7xl mx-auto px-8 md:px-12">
                    <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-10 min-h-full">

                        {/* ── Left column: Filters — sticky, vertically centered ── */}
                        <aside className="relative sticky top-0 h-screen hidden md:flex flex-col justify-center">
                            <div className="space-y-4 py-6 overflow-y-auto no-scrollbar max-h-[calc(100vh-10rem)]">

                                {/* Stats card */}
                                <div className="rounded-xl border border-border/40 bg-card/50 backdrop-blur-sm p-3.5 space-y-2">
                                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                                        <FileText className="h-4 w-4 text-blue-500" />
                                        Overview
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-center">
                                        <div>
                                            <div className="text-lg font-bold text-foreground">{totalCount}</div>
                                            <div className="text-[10px] text-muted-foreground">Total</div>
                                        </div>
                                        <div>
                                            <div className="text-lg font-bold text-amber-500">{favCount}</div>
                                            <div className="text-[10px] text-muted-foreground">Favorites</div>
                                        </div>
                                        <div>
                                            <div className="text-lg font-bold text-blue-500">{sectionCount}</div>
                                            <div className="text-[10px] text-muted-foreground">Sections</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick filter: Favorites */}
                                <button
                                    onClick={() => setFavoriteFilter(favoriteFilter === "Favorites" ? "All" : "Favorites")}
                                    className={cn(
                                        "flex items-center gap-2 w-full px-2.5 py-1.5 rounded-lg text-sm transition-all",
                                        favoriteFilter === "Favorites"
                                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted/30",
                                    )}
                                >
                                    <Star className={cn("h-3.5 w-3.5", favoriteFilter === "Favorites" ? "text-amber-500 fill-amber-500" : "text-muted-foreground/50")} />
                                    Favorites Only
                                </button>

                                {/* ── Category ── */}
                                <div className="space-y-0.5">
                                    <h3 className="text-[10px] uppercase font-semibold text-muted-foreground/60 tracking-widest px-2 mb-1.5">
                                        Category
                                    </h3>
                                    {CATEGORY_ITEMS.map((item) => {
                                        const Icon = item.icon;
                                        const isActive = categoryFilter === item.value;
                                        return (
                                            <button
                                                key={item.value}
                                                onClick={() => setCategoryFilter(item.value)}
                                                className={cn(
                                                    "flex items-center gap-2.5 w-full px-2.5 py-1.5 rounded-lg text-sm transition-all",
                                                    isActive
                                                        ? "bg-primary/10 text-primary font-medium"
                                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/30",
                                                )}
                                            >
                                                <Icon
                                                    className={cn(
                                                        "h-3.5 w-3.5 shrink-0",
                                                        isActive ? "text-primary" : "text-muted-foreground/50",
                                                    )}
                                                />
                                                <span className="truncate">{item.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* ── Technology ── */}
                                <div className="space-y-1">
                                    <h3 className="text-[10px] uppercase font-semibold text-muted-foreground/60 tracking-widest px-2 mb-1.5">
                                        Technology
                                    </h3>
                                    <div className="flex gap-1.5 flex-wrap">
                                        {TECH_ITEMS.map((item) => {
                                            const isActive = techFilter === item.value;
                                            return (
                                                <button
                                                    key={item.value}
                                                    onClick={() => setTechFilter(isActive ? "All" : item.value)}
                                                    className={cn(
                                                        "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all",
                                                        isActive
                                                            ? "bg-primary/10 text-primary border-primary/30"
                                                            : "border-transparent text-muted-foreground hover:bg-muted/30 hover:text-foreground",
                                                    )}
                                                >
                                                    <div className={cn("h-1.5 w-1.5 rounded-full", item.dotColor)} />
                                                    {item.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* ── Sort ── */}
                                <div className="space-y-1">
                                    <h3 className="text-[10px] uppercase font-semibold text-muted-foreground/60 tracking-widest px-2 mb-1.5 flex items-center gap-1.5">
                                        <ArrowUpDown className="h-3 w-3" />
                                        Sort by
                                    </h3>
                                    <div className="space-y-0.5">
                                        {SORT_ITEMS.map((item) => {
                                            const isActive = sortOption === item.value;
                                            return (
                                                <button
                                                    key={item.value}
                                                    onClick={() => {
                                                        if (isActive) setSortDesc(!sortDesc);
                                                        else { setSortOption(item.value); setSortDesc(true); }
                                                    }}
                                                    className={cn(
                                                        "flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg text-sm transition-all",
                                                        isActive
                                                            ? "bg-primary/10 text-primary font-medium"
                                                            : "text-muted-foreground hover:text-foreground hover:bg-muted/30",
                                                    )}
                                                >
                                                    <span>{item.label}</span>
                                                    {isActive ? (
                                                        sortDesc ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />
                                                    ) : (
                                                        <ArrowUpDown className="h-3 w-3 opacity-30" />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* ── Right column: Search + Documents ── */}
                        <div className="space-y-4 pb-48 pt-8">
                            {/* Sticky search bar */}
                            <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm py-4">
                                <SearchBar
                                    query={searchQuery}
                                    onQueryChange={setSearchQuery}
                                    placeholder="Search docs, topics..."
                                />
                            </div>

                            {filteredDocuments.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    <FileText className="h-12 w-12 mx-auto mb-3 opacity-40" />
                                    <p className="text-lg font-medium">No documents match your filters</p>
                                    <p className="text-sm mt-1">Try adjusting your filters to see more documents</p>
                                </div>
                            ) : (
                                filteredDocuments.map((section) => (
                                    <section
                                        key={section.sectionName}
                                        id={section.sectionName}
                                        data-category
                                        data-category-title={section.sectionName}
                                        className="space-y-5"
                                    >
                                        <div className="sticky top-16 z-10 bg-background/95 py-4 backdrop-blur">
                                            <h2 className="text-lg font-semibold">{section.sectionName}</h2>
                                            <p className="text-sm text-muted-foreground">
                                                {section.documents.length} documents
                                            </p>
                                        </div>

                                        <div className="space-y-0">
                                            {section.documents.map((doc) => {
                                                const isActive = activeDocId === doc.id;
                                                return (
                                                    <button
                                                        key={doc.id}
                                                        onClick={(e) => onDocSelect(doc.id, e)}
                                                        className={cn(
                                                            "group relative w-full border-b border-border/40 px-4 py-3 text-left backdrop-blur-md",
                                                            "transition-all hover:bg-linear-to-r hover:from-white/5 hover:to-white/10 dark:hover:from-white/5 dark:hover:to-white/10",
                                                            isActive && "bg-white/10 dark:bg-white/10"
                                                        )}
                                                    >
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2">
                                                                    <FileText className={`h-4 w-4 ${getCategoryColor(doc.category)}`} />
                                                                    {doc.isFavorite && (
                                                                        <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                                                                    )}
                                                                    <span className={`text-sm font-medium transition-colors ${isActive ? "text-primary" : "text-foreground group-hover:text-primary"}`}>
                                                                        {doc.title}
                                                                    </span>
                                                                </div>
                                                                <p className="text-xs text-muted-foreground/70 line-clamp-1 pl-6">
                                                                    {doc.description}
                                                                </p>
                                                                <div className="flex flex-wrap gap-2 text-[11px] font-medium text-muted-foreground pl-6">
                                                                    <span className={getCategoryColor(doc.category)}>
                                                                        {doc.category}
                                                                    </span>
                                                                    <span className={getTechColor(doc.technology)}>
                                                                        • {doc.technology}
                                                                    </span>
                                                                    {doc.tags?.slice(0, 2).map((tag) => (
                                                                        <span key={tag} className="text-muted-foreground/50">
                                                                            • {tag}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            {/* Hover info */}
                                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3 opacity-0 transition-opacity group-hover:opacity-100">
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
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-background to-transparent z-10" />
        </div>
    );
}
