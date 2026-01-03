"use client";

import { useState, useMemo } from "react";
import { NOTES, NoteCategory, NoteColor } from "../data/notes";
import { StickyNote, Pin, Calendar } from "lucide-react";

interface NoteCanvasProps {
    activeNoteId: string | null;
    onNoteSelect: (id: string, event: React.MouseEvent) => void;
}

type FilterCategory = "All" | NoteCategory;
type FilterColor = "All" | NoteColor;

export default function NoteCanvas({
    activeNoteId,
    onNoteSelect,
}: NoteCanvasProps) {
    const [categoryFilter, setCategoryFilter] = useState<FilterCategory>("All");
    const [colorFilter, setColorFilter] = useState<FilterColor>("All");

    const categories: FilterCategory[] = ["All", "Learning", "Ideas", "Todo", "Reference", "Personal", "Work"];
    const colors: (NoteColor | "All")[] = ["All", "yellow", "green", "blue", "purple", "pink", "orange"];

    const filteredNotes = useMemo(() => {
        return NOTES.map((group) => {
            const filteredItems = group.notes.filter((note) => {
                if (categoryFilter !== "All" && note.category !== categoryFilter) return false;
                if (colorFilter !== "All" && note.color !== colorFilter) return false;
                return true;
            });

            return {
                ...group,
                notes: filteredItems,
            };
        }).filter((group) => group.notes.length > 0);
    }, [categoryFilter, colorFilter]);

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'Learning': return 'text-blue-400';
            case 'Ideas': return 'text-pink-400';
            case 'Todo': return 'text-orange-400';
            case 'Reference': return 'text-green-400';
            case 'Personal': return 'text-purple-400';
            case 'Work': return 'text-cyan-400';
            default: return 'text-muted-foreground';
        }
    };

    const getNoteColorDot = (color: NoteColor) => {
        switch (color) {
            case 'yellow': return 'bg-yellow-400';
            case 'green': return 'bg-green-400';
            case 'blue': return 'bg-blue-400';
            case 'purple': return 'bg-purple-400';
            case 'pink': return 'bg-pink-400';
            case 'orange': return 'bg-orange-400';
            default: return 'bg-muted-foreground';
        }
    };

    const getColorFilterDot = (color: NoteColor | "All") => {
        if (color === "All") return null;
        return getNoteColorDot(color);
    };

    return (
        <div className="relative h-full bg-card pt-12">
            {/* Top Fade */}
            <div className="pointer-events-none absolute top-0 left-0 right-0 h-12 bg-linear-to-b from-card to-transparent z-20" />

            <div id="notes-scroll-container" className="h-full overflow-y-auto">
                <div className="max-w-7xl mx-auto px-8 md:px-12 pb-48 pt-12">
                    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-12">
                        {/* Left Column: Filters */}
                        <div className="hidden md:block">
                            <div className="sticky top-32 text-right space-y-6">
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-foreground">Category</h3>
                                    <div className="space-y-1 text-sm text-muted-foreground">
                                        {categories.map((filter) => (
                                            <div
                                                key={filter}
                                                onClick={() => setCategoryFilter(filter)}
                                                className={`cursor-pointer transition-colors ${categoryFilter === filter ? "text-primary font-medium" : "hover:text-foreground"
                                                    }`}
                                            >
                                                {filter === "All" ? "All Categories" : filter}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="font-semibold text-foreground">Color</h3>
                                    <div className="flex justify-end gap-2 flex-wrap">
                                        {colors.map((filter) => (
                                            <button
                                                key={filter}
                                                onClick={() => setColorFilter(colorFilter === filter ? "All" : filter)}
                                                className={`w-5 h-5 rounded-full transition-all border-2 ${colorFilter === filter
                                                        ? "border-primary scale-110"
                                                        : "border-transparent hover:scale-105"
                                                    } ${filter === "All" ? "bg-gradient-to-br from-yellow-400 via-pink-400 to-blue-400" : getColorFilterDot(filter)}`}
                                                title={filter === "All" ? "All colors" : filter}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Notes */}
                        <div className="space-y-3">
                            {filteredNotes.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    No notes match your filters.
                                </div>
                            ) : (
                                filteredNotes.map((group) => (
                                    <section
                                        key={group.groupName}
                                        id={group.groupName}
                                        data-group
                                        data-group-title={group.groupName}
                                        className="space-y-5"
                                    >
                                        <div className="sticky top-0 z-10 bg-card/95 py-4 backdrop-blur">
                                            <h2 className="text-lg font-semibold">{group.groupName}</h2>
                                            <p className="text-sm text-muted-foreground">
                                                {group.notes.length} notes
                                            </p>
                                        </div>

                                        <div className="space-y-1">
                                            {group.notes.map((note) => {
                                                const isActive = activeNoteId === note.id;
                                                return (
                                                    <button
                                                        key={note.id}
                                                        onClick={(e) => onNoteSelect(note.id, e)}
                                                        className={`group relative w-full border-b border-border/40 px-4 py-3 text-left transition-all hover:bg-gradient-to-r hover:from-transparent hover:to-accent/40 ${isActive ? "bg-accent/50" : ""
                                                            }`}
                                                    >
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div className="space-y-1.5">
                                                                <div className="flex items-center gap-2">
                                                                    <div className={`w-2 h-2 rounded-full ${getNoteColorDot(note.color)}`} />
                                                                    {note.isPinned && (
                                                                        <Pin className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                                                    )}
                                                                    <div
                                                                        className={`text-sm font-medium transition-colors ${isActive
                                                                                ? "text-primary"
                                                                                : "text-foreground group-hover:text-primary"
                                                                            }`}
                                                                    >
                                                                        {note.title}
                                                                    </div>
                                                                </div>
                                                                <p className="text-xs text-muted-foreground/70 line-clamp-1 pl-4">
                                                                    {note.content.slice(0, 100)}...
                                                                </p>
                                                                <div className="flex flex-wrap gap-2 text-[11px] font-medium text-muted-foreground pl-4">
                                                                    <span className={getCategoryColor(note.category)}>
                                                                        {note.category}
                                                                    </span>
                                                                    {note.tags?.slice(0, 2).map((tag) => (
                                                                        <span
                                                                            key={tag}
                                                                            className="text-xs text-muted-foreground/50"
                                                                        >
                                                                            • #{tag}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            {/* Hover Info */}
                                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                                                                <div className="flex items-center gap-1 text-xs text-muted-foreground/50">
                                                                    <Calendar className="h-3 w-3" />
                                                                    {note.updatedAt}
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
