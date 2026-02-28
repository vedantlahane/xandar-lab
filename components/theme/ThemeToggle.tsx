// components/theme/ThemeToggle.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useState } from "react";

const smoothSpring = {
    type: "spring" as const,
    stiffness: 320,
    damping: 28,
    mass: 0.6,
};

export function ThemeToggle() {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [isExpanded, setIsExpanded] = useState(false);

    const themes = [
        { id: "light" as const, icon: Sun, label: "Light" },
        { id: "dark" as const, icon: Moon, label: "Dark" },
        { id: "system" as const, icon: Monitor, label: "System" },
    ];

    const currentTheme = themes.find((t) => t.id === theme) || themes[2];
    const CurrentIcon = currentTheme.icon;

    return (
        <motion.div
            className="relative"
            onHoverStart={() => setIsExpanded(true)}
            onHoverEnd={() => setIsExpanded(false)}
        >
            <motion.div
                layout
                transition={smoothSpring}
                className="flex items-center gap-1 rounded-full bg-zinc-100 dark:bg-zinc-800/80 p-1"
            >
                <AnimatePresence mode="wait">
                    {isExpanded ? (
                        <motion.div
                            key="expanded"
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={smoothSpring}
                            className="flex items-center gap-0.5 overflow-hidden"
                        >
                            {themes.map((t) => {
                                const Icon = t.icon;
                                const isActive = theme === t.id;
                                return (
                                    <motion.button
                                        key={t.id}
                                        onClick={() => setTheme(t.id)}
                                        className={`relative flex h-7 w-7 items-center justify-center rounded-full transition-colors ${isActive
                                                ? "text-zinc-900 dark:text-zinc-100"
                                                : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300"
                                            }`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="themeIndicator"
                                                className="absolute inset-0 rounded-full bg-white dark:bg-zinc-700 shadow-sm"
                                                transition={smoothSpring}
                                            />
                                        )}
                                        <Icon className="relative z-10 h-3.5 w-3.5" />
                                    </motion.button>
                                );
                            })}
                        </motion.div>
                    ) : (
                        <motion.button
                            key="collapsed"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="flex h-7 w-7 items-center justify-center rounded-full text-zinc-600 dark:text-zinc-300"
                        >
                            <CurrentIcon className="h-3.5 w-3.5" />
                        </motion.button>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
}
