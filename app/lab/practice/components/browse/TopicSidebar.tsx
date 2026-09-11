"use client";

import { useState, useEffect, useRef } from "react";
import type { Transition } from "framer-motion";
import { AnimatePresence, motion } from "framer-motion";
import { useScrollSync } from "../../hooks/useScrollSync";
import { cn } from "@/lib/utils";

const smoothSpring = {
    type: "spring",
    stiffness: 320,
    damping: 28,
    mass: 0.6,
} satisfies Transition;

export function TopicSidebar() {
    const { activeTopic, categories } = useScrollSync();
    const [isHovered, setIsHovered] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isPeeking, setIsPeeking] = useState(false);
    const [isTouch, setIsTouch] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
    const touchMovedRef = useRef(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setIsTouch(window.matchMedia("(pointer: coarse)").matches);
        }
    }, []);

    const isExpanded = isHovered || isOpen || isPeeking;

    const handleTouchStart = () => {
        touchMovedRef.current = false;
        if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
        holdTimerRef.current = setTimeout(() => {
            if (!touchMovedRef.current) {
                setIsPeeking(true);
            }
        }, 180);
    };

    const handleTouchMove = () => {
        touchMovedRef.current = true;
    };

    const handleTouchEnd = () => {
        if (holdTimerRef.current) {
            clearTimeout(holdTimerRef.current);
            holdTimerRef.current = null;
        }
        if (isPeeking) {
            setIsPeeking(false);
        } else if (!touchMovedRef.current) {
            setIsOpen((prev) => !prev);
        }
    };

    const handleTouchCancel = () => {
        if (holdTimerRef.current) {
            clearTimeout(holdTimerRef.current);
            holdTimerRef.current = null;
        }
        setIsPeeking(false);
    };

    const scrollToTopic = (id: string) => {
        document.getElementById(id)?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
        setIsOpen(false);
        setIsPeeking(false);
    };

    useEffect(() => {
        if (!activeTopic) return;
        
        const timer = setTimeout(() => {
            const btn = document.getElementById(`topic-sidebar-item-${activeTopic}`);
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
    }, [activeTopic, isExpanded]);

    return (
        <>
            {/* Outside Tap Backdrop on Touch */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-30 bg-black/20 backdrop-blur-[2px]"
                        onClick={() => setIsOpen(false)}
                    />
                )}
            </AnimatePresence>

            <aside className="fixed right-0 top-0 z-40 flex h-full items-center pr-2 sm:pr-6 pointer-events-none">
                <AnimatePresence>
                    {categories.length > 0 && (
                        <motion.div
                            ref={scrollRef}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            layout
                            transition={{ layout: smoothSpring }}
                            className={cn(
                                "pointer-events-auto relative flex flex-col gap-3 max-h-[65vh] overflow-y-auto no-scrollbar select-none transition-all duration-300",
                                isTouch
                                    ? cn(
                                          "border shadow-lg",
                                          isExpanded
                                              ? "p-3.5 rounded-2xl bg-card/95 dark:bg-zinc-900/95 backdrop-blur-xl border-border/80 shadow-2xl ring-1 ring-black/5 dark:ring-white/10 min-w-[170px]"
                                              : "py-3.5 px-2.5 rounded-2xl bg-card/60 dark:bg-zinc-900/60 backdrop-blur-md border-border/40 shadow-sm"
                                      )
                                    : "py-6 px-3 rounded-3xl bg-background/20 backdrop-blur-sm border border-border/10"
                            )}
                            onHoverStart={() => !isTouch && setIsHovered(true)}
                            onHoverEnd={() => !isTouch && setIsHovered(false)}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                            onTouchCancel={handleTouchCancel}
                        >
                            {/* Touch capsule header */}
                            {isTouch && isExpanded && (
                                <div className="flex items-center justify-between pb-1 px-1 text-[11px] font-semibold tracking-wider text-muted-foreground/60 uppercase border-b border-border/40">
                                    <span>Topics</span>
                                    <span className="text-[9px] lowercase opacity-70">tap outside</span>
                                </div>
                            )}

                            <AnimatePresence initial={false}>
                                {categories.map((topic, index) => {
                                    const isActive = activeTopic === topic.id;
                                    const isBig = index % 4 === 0;

                                    return (
                                        <motion.button
                                            key={topic.id}
                                            id={`topic-sidebar-item-${topic.id}`}
                                            layout="position"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.1 } }}
                                            transition={{ layout: smoothSpring }}
                                            onClick={() => scrollToTopic(topic.id)}
                                            className={cn(
                                                "group flex flex-row-reverse items-center gap-3 py-0.5 rounded-lg transition-colors",
                                                isTouch && isExpanded && "px-1.5 py-1 hover:bg-muted/40 active:bg-muted/60"
                                            )}
                                        >
                                            <motion.div
                                                layout
                                                transition={smoothSpring}
                                                className={cn(
                                                    "h-1 rounded-full transition-colors duration-300 shrink-0",
                                                    isActive
                                                        ? "bg-primary"
                                                        : "bg-muted-foreground/30 group-hover:bg-primary/50"
                                                )}
                                                animate={{
                                                    width: isExpanded ? 6 : isBig ? 24 : 12,
                                                    height: isExpanded ? 6 : 4,
                                                    opacity: isExpanded ? 0 : 1,
                                                }}
                                            />

                                            <div className="overflow-hidden">
                                                <AnimatePresence initial={false}>
                                                    {isExpanded && (
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
                                                            {topic.title}
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
        </>
    );
}
