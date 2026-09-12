"use client";

import { useState, useEffect, useRef } from "react";
import type { Transition } from "framer-motion";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

const smoothSpring = {
    type: "spring",
    stiffness: 320,
    damping: 28,
    mass: 0.6,
} satisfies Transition;

export interface SidebarCategory {
    id: string;
    title: string;
}

export interface BaseSidebarProps {
    activeId: string | null;
    categories: SidebarCategory[];
}

export function BaseSidebar({ activeId, categories }: BaseSidebarProps) {
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

    const handleTouchStart = (e: React.TouchEvent) => {
        if ((e.target as HTMLElement).closest("button")) return;
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

    const handleTouchEnd = (e: React.TouchEvent) => {
        if ((e.target as HTMLElement).closest("button")) return;
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

    const scrollToSection = (id: string) => {
        document.getElementById(id)?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
        setIsOpen(false);
        setIsPeeking(false);
    };

    // Auto-scroll the sidebar container so the active dot is visible
    useEffect(() => {
        if (!activeId) return;
        
        const timer = setTimeout(() => {
            const btn = document.getElementById(`sidebar-item-${activeId}`);
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
    }, [activeId, isExpanded]);

    return (
        <>
            {/* Invisible Outside Tap Backdrop on Touch */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside className="hidden md:flex fixed right-0 top-0 z-40 h-full items-center pr-2 sm:pr-6 pointer-events-none">
                <AnimatePresence>
                    {categories.length > 0 && (
                        <div
                            ref={scrollRef}
                            className={cn(
                                "pointer-events-auto relative flex flex-col gap-1.5 max-h-[65vh] overflow-y-auto no-scrollbar select-none transition-all duration-200",
                                isExpanded
                                    ? "py-2.5 pr-3 pl-5 rounded-2xl nav-blur-surface-right shadow-2xl min-w-[150px]"
                                    : "py-2.5 pr-2.5 pl-3 bg-transparent"
                            )}
                            onMouseEnter={() => !isTouch && setIsHovered(true)}
                            onMouseLeave={() => !isTouch && setIsHovered(false)}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                            onTouchCancel={handleTouchCancel}
                        >
                            {categories.map((section, index) => {
                                const isActive = activeId === section.id;
                                const isBig = index % 3 === 0;

                                return (
                                    <button
                                        key={section.id}
                                        id={`sidebar-item-${section.id}`}
                                        onClick={() => scrollToSection(section.id)}
                                        className={cn(
                                            "group flex flex-row-reverse items-center gap-2.5 py-0.5 rounded-md transition-colors",
                                            isExpanded && "px-1.5 hover:bg-muted/40 active:bg-muted/60"
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                "h-1 rounded-full transition-all duration-200 shrink-0",
                                                isActive
                                                    ? "bg-primary"
                                                    : "bg-muted-foreground/30 group-hover:bg-primary/50"
                                            )}
                                            style={{
                                                width: isExpanded ? 6 : isBig ? 24 : 12,
                                                height: isExpanded ? 6 : 4,
                                                opacity: isExpanded ? 0 : 1,
                                            }}
                                        />

                                        <div className="overflow-hidden">
                                            <AnimatePresence initial={false}>
                                                {isExpanded && (
                                                    <motion.span
                                                        initial={{ opacity: 0, x: 6 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: 6 }}
                                                        transition={{ duration: 0.15, ease: "easeOut" }}
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
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </AnimatePresence>
            </aside>
        </>
    );
}
