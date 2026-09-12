"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatItem {
    label: string;
    value: number | string;
    color?: string;
}

export interface CanvasStatsCardProps {
    title?: string;
    icon: LucideIcon;
    iconColor?: string;
    stats: StatItem[];
    className?: string;
}

export function CanvasStatsCard({
    title = "Overview",
    icon: Icon,
    iconColor = "text-primary",
    stats,
    className,
}: CanvasStatsCardProps) {
    return (
        <div className={cn("rounded-xl border border-border/40 bg-card/50 backdrop-blur-sm p-3.5 space-y-2", className)}>
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Icon className={cn("h-4 w-4", iconColor)} />
                {title}
            </div>
            <div className={cn("grid gap-2 text-center", stats.length === 2 ? "grid-cols-2" : "grid-cols-3")}>
                {stats.map((stat, idx) => (
                    <div key={idx}>
                        <div className={cn("text-lg font-bold", stat.color || "text-foreground")}>
                            {stat.value}
                        </div>
                        <div className="text-[10px] text-muted-foreground">{stat.label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
