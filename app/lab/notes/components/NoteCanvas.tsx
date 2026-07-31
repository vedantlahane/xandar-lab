// app/lab/notes/components/NoteCanvas.tsx
"use client";

import { useState, useMemo } from "react";
import { NOTES, NoteCategory } from "../data/notes";
import {
    StickyNote, Pin, Calendar, Tag,
    Layers, BookOpen, Lightbulb, ListTodo, BookMarked, User, Briefcase,
    ArrowUpDown, ChevronDown, ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchBar } from "@/app/lab/practice/components/browse/SearchBar";
import { BaseCanvas } from "@/app/lab/components/shared/BaseCanvas";
import { LabItemRow } from "@/app/lab/components/shared/LabItemRow";

interface NoteCanvasProps {
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

// Extract unique tags
const ALL_TAGS = Array.from(
    new Set(NOTES.flatMap(g => g.notes.flatMap(n => n.tags || [])))
).sort();

export default function NoteCanvas({
    activeNoteId,
    onNoteSelect,
}: NoteCanvasProps) {
    const [categoryFilter, setCategoryFilter] = useState<FilterCategory>("All");
    const [pinnedFilter, setPinnedFilter] = useState<FilterPinned>("All");
    const [tagFilter, setTagFilter] = useState<string>("All");
    const [sortOption, setSortOption] = useState<SortOption>("Updated");
    const [sortDesc, setSortDesc] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredNotes = useMemo(() => {
        return NOTES.map((group) => {
            const filteredItems = group.notes.filter((note) => {
                if (searchQuery) {
                    const q = searchQuery.toLowerCase();
                    if (
                        !note.title.toLowerCase().includes(q) &&
                        !note.content.toLowerCase().includes(q) &&
                        !note.tags?.some(t => t.toLowerCase().includes(q))
                    ) return false;
                }
                if (categoryFilter !== "All" && note.category !== categoryFilter) return false;
                if (pinnedFilter === "Pinned" && !note.isPinned) return false;
                if (tagFilter !== "All" && !note.tags?.includes(tagFilter)) return false;
                return true;
            });

            const sorted = [...filteredItems].sort((a, b) => {
                let cmp = 0;
                if (sortOption === "Updated") cmp = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
                else if (sortOption === "Created") cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                else if (sortOption === "Title") cmp = a.title.localeCompare(b.title);
                return sortDesc ? -cmp : cmp;
            });

            return { ...group, notes: sorted };
        }).filter((group) => group.notes.length > 0);
    }, [categoryFilter, pinnedFilter, tagFilter, searchQuery, sortOption, sortDesc]);

    // Stats
    const allNotes = NOTES.flatMap(g => g.notes);
    const totalCount = allNotes.length;
    const pinnedCount = allNotes.filter(n => n.isPinned).length;
    const categoryCount = new Set(allNotes.map(n => n.category)).size;



    const getCategoryColor = (cat: string) => {
        switch (cat) {
            case 'Learning': return 'text-blue-500';
            case 'Ideas': return 'text-pink-500';
            case 'Todo': return 'text-orange-500';
            case 'Reference': return 'text-green-500';
            case 'Personal': return 'text-purple-500';
            case 'Work': return 'text-cyan-500';
            default: return 'text-muted-foreground';
        }
    };

    return (
        <BaseCanvas
            scrollId="notes-scroll-container"
            sidebarContent={
                <>
                    {/* Stats card */}
                    <div className="rounded-xl border border-border/40 bg-card/50 backdrop-blur-sm p-3.5 space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                            <StickyNote className="h-4 w-4 text-violet-500" />
                            Overview
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center">
                            <div>
                                <div className="text-lg font-bold text-foreground">{totalCount}</div>
                                <div className="text-[10px] text-muted-foreground">Total</div>
                            </div>
                            <div>
                                <div className="text-lg font-bold text-amber-500">{pinnedCount}</div>
                                <div className="text-[10px] text-muted-foreground">Pinned</div>
                            </div>
                            <div>
                                <div className="text-lg font-bold text-violet-500">{categoryCount}</div>
                                <div className="text-[10px] text-muted-foreground">Categories</div>
                            </div>
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
                    <div className="space-y-1">
                        <h3 className="text-[10px] uppercase font-semibold text-muted-foreground/60 tracking-widest px-2 mb-1.5 flex items-center gap-1.5">
                            <Tag className="h-3 w-3" />
                            Tags
                        </h3>
                        <div className="flex gap-1 flex-wrap">
                            {ALL_TAGS.slice(0, 12).map((tag) => {
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
                </>
            }
        >
            {/* Sticky search bar */}
            <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm py-4">
                <SearchBar
                    query={searchQuery}
                    onQueryChange={setSearchQuery}
                    placeholder="Search notes, tags..."
                />
            </div>

            {filteredNotes.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    <StickyNote className="h-12 w-12 mx-auto mb-3 opacity-40" />
                    <p className="text-lg font-medium">No notes match your filters</p>
                    <p className="text-sm mt-1">Try adjusting your filters to see more notes</p>
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
                        <div className="sticky top-16 z-10 bg-background/95 py-4 backdrop-blur">
                            <h2 className="text-lg font-semibold">{group.groupName}</h2>
                            <p className="text-sm text-muted-foreground">
                                {group.notes.length} notes
                            </p>
                        </div>

                        <div className="space-y-0">
                            {group.notes.map((note) => {
                                const isActive = activeNoteId === note.id;
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
                                                {note.isPinned && <Pin className="h-3 w-3 text-amber-500" />}
                                            </>
                                        }
                                        subtitle={`${note.content.replace(/[#\-\[\]`*]/g, '').substring(0, 100)}...`}
                                        tags={
                                            <>
                                                <span className={getCategoryColor(note.category)}>
                                                    {note.category}
                                                </span>
                                                {note.tags?.slice(0, 3).map((tag) => (
                                                    <span key={tag} className="text-muted-foreground/50">
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

