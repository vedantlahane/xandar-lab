// components/theme/ThemeToggle.tsx
"use client";

import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [isExpanded, setIsExpanded] = useState(false);

    const themes = [
        { id: "light" as const, icon: Sun, label: "Light" },
        { id: "dark" as const, icon: Moon, label: "Dark" },
        { id: "system" as const, icon: Monitor, label: "System" },
    ];

    const currentTheme = themes.find((t) => t.id === theme) || themes[2];
    const CurrentIcon = currentTheme.icon;

    return (
        <div
            className="relative select-none"
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
        >
            <div className="flex items-center rounded-full nav-blur-surface-capsule border border-border/40 p-1 shadow-sm transition-[width,padding] duration-150">
                {isExpanded ? (
                    <div className="flex items-center gap-0.5 animate-in fade-in duration-100">
                        {themes.map((t) => {
                            const Icon = t.icon;
                            const isActive = theme === t.id;
                            return (
                                <button
                                    key={t.id}
                                    type="button"
                                    aria-label={t.label}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setTheme(t.id);
                                    }}
                                    className={cn(
                                        "relative flex h-7 w-7 items-center justify-center rounded-full transition-colors duration-150 active:scale-95",
                                        isActive
                                            ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-xs"
                                            : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300"
                                    )}
                                >
                                    <Icon className="relative z-10 h-3.5 w-3.5" />
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => setIsExpanded(true)}
                        className="flex h-7 w-7 items-center justify-center rounded-full text-zinc-600 dark:text-zinc-300 hover:text-foreground transition-colors active:scale-95"
                        aria-label="Toggle theme menu"
                    >
                        <CurrentIcon className="h-3.5 w-3.5" />
                    </button>
                )}
            </div>
        </div>
    );
}

