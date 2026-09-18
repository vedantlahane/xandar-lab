// app/lab/notes/components/NoteCanvas.tsx
"use client";

import { useState, useMemo } from "react";
import { NOTES as DEFAULT_STATIC_NOTES, NoteCategory } from "../data/notes";
import {
    StickyNote, Pin, Calendar, Tag,
    Layers, BookOpen, Lightbulb, ListTodo, BookMarked, User, Briefcase,
    Plus, Lock, Globe, Users, AlertCircle, Star
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/app/lab/practice/components/browse/SearchBar";
import { BaseCanvas } from "@/app/lab/components/shared/BaseCanvas";
import { LabItemRow } from "@/app/lab/components/shared/LabItemRow";
import { CanvasSortSelect } from "@/app/lab/components/shared/CanvasSortSelect";
import { CanvasStatsCard } from "@/app/lab/components/shared/CanvasStatsCard";
import { useAuth } from "@/components/auth/AuthContext";
import { RoleBadge } from "@/components/shared/RoleBadge";

interface NoteCanvasProps {
    notes?: any[];
    activeTab?: "all" | "my" | "community";
    onTabChange?: (tab: "all" | "my" | "community") => void;
    onNewNote?: () => void;
    activeNoteId: string | null;
    onNoteSelect: (id: string, event: React.MouseEvent) => void;
}

type FilterCategory = "All" | NoteCategory;
type FilterPinned = "All" | "Pinned";
type SortOption = "Updated" | "Created" | "Title";

// ── Category filter config ──────────────────────────────────────────────
const CATEGORY_ITEMS: { value: FilterCategory; label: string; icon: typeof Layers; dotColor: string }[] = [
    { value: "All", label: "All Categories", icon: Layers, dotColor: "bg-muted-foreground" },
    { value: "Learning", label: "Learning", icon: BookOpen, dotColor: "bg-blue-500" },
    { value: "Ideas", label: "Ideas", icon: Lightbulb, dotColor: "bg-pink-500" },
    { value: "Todo", label: "Todo", icon: ListTodo, dotColor: "bg-orange-500" },
    { value: "Reference", label: "Reference", icon: BookMarked, dotColor: "bg-green-500" },
    { value: "Personal", label: "Personal", icon: User, dotColor: "bg-purple-500" },
    { value: "Work", label: "Work", icon: Briefcase, dotColor: "bg-cyan-500" },
];

// ── Sort config ─────────────────────────────────────────────────────────
const SORT_ITEMS: { value: SortOption; label: string }[] = [
    { value: "Updated", label: "Updated" },
    { value: "Created", label: "Created" },
    { value: "Title", label: "Title" },
];

const CATEGORY_ORDER: NoteCategory[] = [
    "Learning", "Ideas", "Todo", "Reference", "Personal", "Work"
];

export default function NoteCanvas({
    notes: propNotes,
    activeTab = "all",
    onTabChange,
    onNewNote,
    activeNoteId,
    onNoteSelect,
}: NoteCanvasProps) {
    const { isAuthenticated, openLoginModal } = useAuth();
    const [categoryFilter, setCategoryFilter] = useState<FilterCategory>("All");
    const [pinnedFilter, setPinnedFilter] = useState<FilterPinned>("All");
    const [tagFilter, setTagFilter] = useState<string>("All");
    const [sortOption, setSortOption] = useState<SortOption>("Updated");
    const [sortDesc, setSortDesc] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Fallback if propNotes not provided
    const sourceNotes = useMemo(() => {
        if (propNotes && propNotes.length > 0) return propNotes;
        return DEFAULT_STATIC_NOTES.flatMap((g) => g.notes);
    }, [propNotes]);

    // Extract unique tags from current notes
    const allTags = useMemo(() => {
        return Array.from(
            new Set(sourceNotes.flatMap((n: any) => n.tags || []))
        ).sort();
    }, [sourceNotes]);

    // Dynamic grouping
    const noteGroups = useMemo(() => {
        const groups: { groupName: string; notes: any[] }[] = [];

        // Pinned notes
        const pinned = sourceNotes.filter((n: any) => n.isPinned);
        if (pinned.length > 0) {
            groups.push({
                groupName: "Pinned",
                notes: pinned,
            });
        }

        // Category notes (exclude pinned to avoid exact duplicate headers)
        for (const cat of CATEGORY_ORDER) {
            const catNotes = sourceNotes.filter((n: any) => n.category === cat && !n.isPinned);
            if (catNotes.length > 0) {
                groups.push({
                    groupName: cat,
                    notes: catNotes,
                });
            }
        }

        // Any notes outside standard categories
        const unassigned = sourceNotes.filter(
            (n: any) => !n.isPinned && !CATEGORY_ORDER.includes(n.category)
        );
        if (unassigned.length > 0) {
            groups.push({
                groupName: "Other",
                notes: unassigned,
            });
        }

        return groups;
    }, [sourceNotes]);

    const filteredNotes = useMemo(() => {
        return noteGroups.map((group) => {
            const filteredItems = group.notes.filter((note: any) => {
                if (searchQuery) {
                    const q = searchQuery.toLowerCase();
                    if (
                        !note.title.toLowerCase().includes(q) &&
                        !note.content.toLowerCase().includes(q) &&
                        !note.tags?.some((t: string) => t.toLowerCase().includes(q))
                    ) return false;
                }
                if (categoryFilter !== "All" && note.category !== categoryFilter) return false;
                if (pinnedFilter === "Pinned" && !note.isPinned) return false;
                if (tagFilter !== "All" && !note.tags?.includes(tagFilter)) return false;
                return true;
            });

            const sorted = [...filteredItems].sort((a: any, b: any) => {
                let cmp = 0;
                if (sortOption === "Updated") {
                    cmp = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
                } else if (sortOption === "Created") {
                    cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                } else if (sortOption === "Title") {
                    cmp = a.title.localeCompare(b.title);
                }
                return sortDesc ? -cmp : cmp;
            });

            return { ...group, notes: sorted };
        }).filter((group) => group.notes.length > 0);
    }, [noteGroups, categoryFilter, pinnedFilter, tagFilter, searchQuery, sortOption, sortDesc]);

    // Stats
    const totalCount = sourceNotes.length;
    const pinnedCount = sourceNotes.filter((n: any) => n.isPinned).length;
    const categoryCount = new Set(sourceNotes.map((n: any) => n.category)).size;

    const handleCreateClick = () => {
        if (!isAuthenticated) {
            openLoginModal();
            return;
        }
        if (onNewNote) onNewNote();
    };

    const getCategoryColor = (cat: string) => {
        switch (cat) {
            case "Learning": return "text-blue-500";
            case "Ideas": return "text-pink-500";
            case "Todo": return "text-orange-500";
            case "Reference": return "text-emerald-500";
            case "Personal": return "text-purple-500";
            case "Work": return "text-cyan-500";
            default: return "text-muted-foreground";
        }
    };

    return (
        <BaseCanvas
            scrollId="notes-scroll-container"
            sidebarContent={
                <>
                    {/* Stats card */}
                    <CanvasStatsCard
                        icon={StickyNote}
                        iconColor="text-violet-500"
                        stats={[
                            { label: "Total", value: totalCount },
                            { label: "Pinned", value: pinnedCount, color: "text-amber-500" },
                            { label: "Categories", value: categoryCount, color: "text-violet-500" },
                        ]}
                    />

                    {/* Feed Selector (All / My / Community) */}
                    <div className="space-y-1.5">
                        <h3 className="text-[10px] uppercase font-semibold text-muted-foreground/60 tracking-widest px-2 mb-1 flex items-center justify-between">
                            <span>Feed</span>
                        </h3>
                        <div className="grid grid-cols-3 p-1 bg-muted/40 rounded-lg border border-border/40 gap-1 text-xs">
                            <button
                                onClick={() => onTabChange?.("all")}
                                className={cn(
                                    "py-1 rounded-md font-medium transition-all text-center flex items-center justify-center gap-1",
                                    activeTab === "all"
                                        ? "bg-background text-foreground shadow-sm font-semibold"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <Globe className="h-3 w-3" />
                                All
                            </button>
                            <button
                                onClick={() => {
                                    if (!isAuthenticated) {
                                        openLoginModal();
                                        return;
                                    }
                                    onTabChange?.("my");
                                }}
                                className={cn(
                                    "py-1 rounded-md font-medium transition-all text-center flex items-center justify-center gap-1",
                                    activeTab === "my"
                                        ? "bg-background text-foreground shadow-sm font-semibold"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <User className="h-3 w-3" />
                                Mine
                            </button>
                            <button
                                onClick={() => onTabChange?.("community")}
                                className={cn(
                                    "py-1 rounded-md font-medium transition-all text-center flex items-center justify-center gap-1",
                                    activeTab === "community"
                                        ? "bg-background text-foreground shadow-sm font-semibold"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <Users className="h-3 w-3" />
                                Public
                            </button>
                        </div>
                    </div>

                    {/* Quick filter: Pinned */}
                    <button
                        onClick={() => setPinnedFilter(pinnedFilter === "Pinned" ? "All" : "Pinned")}
                        className={cn(
                            "flex items-center gap-2 w-full px-2.5 py-1.5 rounded-lg text-sm transition-all",
                            pinnedFilter === "Pinned"
                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/30",
                        )}
                    >
                        <Pin className={cn("h-3.5 w-3.5", pinnedFilter === "Pinned" ? "text-amber-500" : "text-muted-foreground/50")} />
                        Pinned Only
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

                    {/* ── Tags ── */}
                    {allTags.length > 0 && (
                        <div className="space-y-1">
                            <h3 className="text-[10px] uppercase font-semibold text-muted-foreground/60 tracking-widest px-2 mb-1.5 flex items-center gap-1.5">
                                <Tag className="h-3 w-3" />
                                Tags
                            </h3>
                            <div className="flex gap-1 flex-wrap">
                                {allTags.slice(0, 14).map((tag) => {
                                    const isActive = tagFilter === tag;
                                    return (
                                        <button
                                            key={tag}
                                            onClick={() => setTagFilter(isActive ? "All" : tag)}
                                            className={cn(
                                                "px-2 py-0.5 rounded-md text-[11px] font-medium border transition-all",
                                                isActive
                                                    ? "bg-primary/10 text-primary border-primary/30"
                                                    : "border-transparent text-muted-foreground/70 hover:bg-muted/30 hover:text-foreground",
                                            )}
                                        >
                                            {tag}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* ── Sort ── */}
                    <CanvasSortSelect
                        items={SORT_ITEMS}
                        currentSort={sortOption}
                        sortDesc={sortDesc}
                        onSortChange={setSortOption}
                        onSortDescChange={setSortDesc}
                    />
                </>
            }
        >
            {/* Sticky search bar + New Note button */}
            <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm py-2.5 sm:py-4 flex items-center gap-2.5">
                <div className="flex-1">
                    <SearchBar
                        query={searchQuery}
                        onQueryChange={setSearchQuery}
                        placeholder="Search notes, tags..."
                    />
                </div>
                <Button
                    onClick={handleCreateClick}
                    className="shrink-0 h-10 px-3.5 gap-1.5 rounded-xl bg-primary text-primary-foreground font-medium shadow-sm hover:opacity-95 transition-all text-xs sm:text-sm"
                >
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">New Note</span>
                </Button>
            </div>

            {filteredNotes.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                    <StickyNote className="h-12 w-12 mx-auto mb-3 opacity-40" />
                    <p className="text-lg font-medium text-foreground">No notes found</p>
                    <p className="text-sm mt-1 mb-5">
                        {activeTab === "my"
                            ? "You haven't created any notes yet. Click below to add one!"
                            : "Try adjusting your filters to see more notes."}
                    </p>
                    {activeTab === "my" && (
                        <Button onClick={handleCreateClick} size="sm" className="gap-1.5">
                            <Plus className="h-4 w-4" /> Create First Note
                        </Button>
                    )}
                </div>
            ) : (
                filteredNotes.map((group) => (
                    <section
                        key={group.groupName}
                        id={group.groupName}
                        data-category
                        data-category-title={group.groupName}
                        className="space-y-5"
                    >
                        <div className="sticky top-16 z-10 bg-background/95 py-4 backdrop-blur flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold">{group.groupName}</h2>
                                <p className="text-xs text-muted-foreground">
                                    {group.notes.length} {group.notes.length === 1 ? "note" : "notes"}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-0">
                            {group.notes.map((note: any) => {
                                const isActive = activeNoteId === note.id;
                                const hasPendingChanges = note.changeRequests?.some((r: any) => r.status === "pending");
                                return (
                                    <LabItemRow
                                        key={note.id}
                                        id={note.id}
                                        isActive={isActive}
                                        onClick={onNoteSelect}
                                        title={note.title}
                                        titleIcon={
                                            <>
                                                <StickyNote className={cn("h-3.5 w-3.5 shrink-0", getCategoryColor(note.category))} />
                                                {note.isPinned && <Pin className="h-3 w-3 text-amber-500 fill-current" />}
                                                {note.isCurated && <Star className="h-3 w-3 text-amber-400 fill-current" />}
                                            </>
                                        }
                                        subtitle={`${note.content.replace(/[#\-\[\]`*]/g, "").substring(0, 100)}...`}
                                        tags={
                                            <>
                                                <span className={getCategoryColor(note.category)}>
                                                    {note.category}
                                                </span>
                                                {hasPendingChanges && (
                                                    <span className="text-amber-500 font-medium">
                                                        • Revision needed
                                                    </span>
                                                )}
                                                {note.authorUsername && activeTab !== "my" && (
                                                    <span className="inline-flex items-center gap-1 text-muted-foreground/60">
                                                        • @{note.authorUsername}
                                                    </span>
                                                )}
                                                {note.visibility === "private" && (
                                                    <span className="inline-flex items-center gap-0.5 text-muted-foreground/60">
                                                        • <Lock className="h-2.5 w-2.5" /> Private
                                                    </span>
                                                )}
                                                {note.tags?.slice(0, 3).map((tag: string) => (
                                                    <span key={tag} className="text-muted-foreground/40">
                                                        • #{tag}
                                                    </span>
                                                ))}
                                            </>
                                        }
                                        hoverContent={
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground/50">
                                                <Calendar className="h-3 w-3" />
                                                {note.updatedAt}
                                            </div>
                                        }
                                    />
                                );
                            })}
                        </div>
                    </section>
                ))
            )}
        </BaseCanvas>
    );
}
