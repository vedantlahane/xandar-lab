// app/lab/notes/components/GroupSidebar.tsx
"use client";

import { useState } from "react";
import type { Transition } from "framer-motion";
import { AnimatePresence, motion } from "framer-motion";
import { NOTES } from "../data/notes";
import { useNoteScroll } from "../hooks/useNoteScroll";
import { cn } from "@/lib/utils";

const smoothSpring = {
    type: "spring",
    stiffness: 320,
    damping: 28,
    mass: 0.6,
} satisfies Transition;

export default function GroupSidebar() {
    const { activeGroup } = useNoteScroll();
    const [isHovered, setIsHovered] = useState(false);

    const scrollToGroup = (id: string) => {
        document.getElementById(id)?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    return (
        <aside className="fixed right-0 top-0 z-40 flex h-full items-center pr-6 pointer-events-none">
            <motion.div
                layout
                transition={{ layout: smoothSpring }}
                className="pointer-events-auto relative flex flex-col gap-3 py-4"
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
            >
                {NOTES.map((group, index) => {
                    const isActive = activeGroup === group.groupName;
                    const isBig = index % 3 === 0;

                    return (
                        <motion.button
                            key={group.groupName}
                            layout="position"
                            transition={{ layout: smoothSpring }}
                            onClick={() => scrollToGroup(group.groupName)}
                            className="group flex flex-row-reverse items-center gap-4"
                        >
                            {/* Indicator */}
                            <motion.div
                                layout
                                transition={smoothSpring}
                                className={cn(
                                    "h-1 rounded-full transition-colors duration-300",
                                    isActive
                                        ? "bg-primary"
                                        : "bg-muted-foreground/30 group-hover:bg-primary/50"
                                )}
                                animate={{
                                    width: isHovered ? 6 : isBig ? 24 : 12,
                                    height: isHovered ? 6 : 4,
                                    opacity: isHovered ? 0 : 1,
                                }}
                            />

                            {/* Label */}
                            <div className="overflow-hidden">
                                <AnimatePresence initial={false}>
                                    {isHovered && (
                                        <motion.span
                                            layout={false}
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 10 }}
                                            transition={{
                                                type: "tween",
                                                duration: 0.18,
                                                ease: [0.22, 1, 0.36, 1],
                                            }}
                                            className={cn(
                                                "block whitespace-nowrap text-sm font-medium",
                                                isActive
                                                    ? "text-foreground"
                                                    : "text-muted-foreground group-hover:text-foreground"
                                            )}
                                        >
                                            {group.groupName}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.button>
                    );
                })}
            </motion.div>
        </aside>
    );
}
