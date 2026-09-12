"use client";

import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SortItem<T = any> {
    value: T;
    label: string;
}

export interface CanvasSortSelectProps<T = any> {
    items: readonly SortItem<any>[] | SortItem<any>[];
    currentSort: T;
    sortDesc: boolean;
    onSortChange: (value: T) => void;
    onSortDescChange: (desc: boolean) => void;
    title?: string;
    className?: string;
}

export function CanvasSortSelect<T = any>({
    items,
    currentSort,
    sortDesc,
    onSortChange,
    onSortDescChange,
    title = "Sort by",
    className,
}: CanvasSortSelectProps<T>) {
    return (
        <div className={cn("space-y-1", className)}>
            <h3 className="text-[10px] uppercase font-semibold text-muted-foreground/60 tracking-widest px-2 mb-1.5 flex items-center gap-1.5">
                <ArrowUpDown className="h-3 w-3" />
                {title}
            </h3>
            <div className="space-y-0.5">
                {items.map((item) => {
                    const isActive = currentSort === item.value;
                    return (
                        <button
                            key={item.value}
                            onClick={() => {
                                if (isActive) {
                                    onSortDescChange(!sortDesc);
                                } else {
                                    onSortChange(item.value);
                                    onSortDescChange(true);
                                }
                            }}
                            className={cn(
                                "flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg text-sm transition-all",
                                isActive
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                            )}
                        >
                            <span>{item.label}</span>
                            {isActive ? (
                                sortDesc ? (
                                    <ChevronDown className="h-3.5 w-3.5" />
                                ) : (
                                    <ChevronUp className="h-3.5 w-3.5" />
                                )
                            ) : (
                                <ArrowUpDown className="h-3 w-3 opacity-30" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
