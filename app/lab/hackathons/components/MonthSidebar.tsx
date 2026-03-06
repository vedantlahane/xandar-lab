"use client";

import { useState, useEffect, useRef } from "react";
import type { Transition } from "framer-motion";
import { AnimatePresence, motion } from "framer-motion";
import { useHackathonScroll } from "../hooks/useHackathonScroll";
import { cn } from "@/lib/utils";

const smoothSpring = {
    type: "spring",
    stiffness: 320,
    damping: 28,
    mass: 0.6,
} satisfies Transition;

export default function MonthSidebar() {
    const { activeMonth, categories } = useHackathonScroll();
    const [isHovered, setIsHovered] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const scrollToSection = (id: string) => {
        document.getElementById(id)?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    // Auto-scroll the sidebar container so the active dot is visible
    useEffect(() => {
        if (!activeMonth) return;
        
        // slight delay to allow layout animations to settle
        const timer = setTimeout(() => {
            const btn = document.getElementById(`sidebar-item-${activeMonth}`);
            if (btn && scrollRef.current) {
                const container = scrollRef.current;
                const btnTop = btn.offsetTop;
                const btnBottom = btnTop + btn.offsetHeight;
                const containerTop = container.scrollTop;
                const containerBottom = containerTop + container.offsetHeight;
                
                if (btnTop < containerTop) {
                    container.scrollTo({ top: btnTop - 20, behavior: "smooth" });
                } else if (btnBottom > containerBottom) {
                    container.scrollTo({ top: btnBottom - container.offsetHeight + 20, behavior: "smooth" });
                }
            }
        }, 100);

        return () => clearTimeout(timer);
    }, [activeMonth, isHovered]);

    return (
        <aside className="fixed right-0 top-0 z-40 flex h-full items-center pr-6 pointer-events-none">
            <AnimatePresence>
                {categories.length > 0 && (
                    <motion.div
                        ref={scrollRef}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        layout
                        transition={{ layout: smoothSpring }}
                        className="pointer-events-auto relative flex flex-col gap-3 py-6 px-3 max-h-[60vh] overflow-y-auto no-scrollbar rounded-3xl bg-background/20 backdrop-blur-sm border border-border/10"
                        onHoverStart={() => setIsHovered(true)}
                        onHoverEnd={() => setIsHovered(false)}
                    >
                        <AnimatePresence initial={false}>
                            {categories.map((section, index) => {
                                const isActive = activeMonth === section.id;
                                const isBig = index % 3 === 0;

                                return (
                                    <motion.button
                                        key={section.id}
                                        id={`sidebar-item-${section.id}`}
                                        layout="position"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.1 } }}
                                        transition={{ layout: smoothSpring }}
                                        onClick={() => scrollToSection(section.id)}
                                        className="group flex flex-row-reverse items-center gap-4 py-0.5"
                                    >
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
                                                        {section.title}
                                                    </motion.span>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>
        </aside>
    );
}