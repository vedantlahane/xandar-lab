"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useDragControls, useMotionValue } from "framer-motion";
import { Maximize2, Minimize2, X, GripHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface BaseDrawerProps {
    onClose: () => void;
    position?: { x: number; y: number };
    defaultWidth?: number | string;
    defaultHeight?: number | string;
    headerLeft?: React.ReactNode;
    headerIconTools?: React.ReactNode;
    headerRight?: React.ReactNode;
    backdropClass?: string;
    windowClass?: string;
    children: React.ReactNode;
}

function calculateSafePos(
    pos?: { x: number; y: number },
    defaultWidth: number | string = "700px",
    defaultHeight: number | string = "600px"
) {
    if (typeof window === "undefined") {
        return { x: 50, y: 50 };
    }

    const widthNum = typeof defaultWidth === "number" ? defaultWidth : parseInt(defaultWidth as string, 10) || 700;
    const heightNum = typeof defaultHeight === "number" ? defaultHeight : parseInt(defaultHeight as string, 10) || 600;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const margin = 20;

    const effectiveWidth = Math.min(widthNum, vw - margin * 2);
    const effectiveHeight = Math.min(heightNum, vh - margin * 2);

    if (pos && typeof pos.x === "number" && typeof pos.y === "number") {
        // Center the window horizontally on the click point, clamped to screen bounds
        let targetX = pos.x - effectiveWidth / 2;
        // Position top of window near click position, slightly above the cursor
        let targetY = pos.y - 40;

        const safeX = Math.max(margin, Math.min(targetX, vw - effectiveWidth - margin));
        const safeY = Math.max(margin, Math.min(targetY, vh - effectiveHeight - margin));

        return { x: Math.round(safeX), y: Math.round(safeY) };
    }

    // Default: Center in viewport
    const safeX = Math.max(margin, Math.round((vw - effectiveWidth) / 2));
    const safeY = Math.max(margin, Math.round((vh - effectiveHeight) / 2));

    return { x: safeX, y: safeY };
}

export function BaseDrawer({
    onClose,
    position,
    defaultWidth = "700px",
    defaultHeight = "600px",
    headerLeft,
    headerIconTools,
    headerRight,
    backdropClass = "bg-black/40 backdrop-blur-sm",
    windowClass,
    children,
}: BaseDrawerProps) {
    const [isMaximized, setIsMaximized] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const dragControls = useDragControls();

    useEffect(() => {
        const updateIsMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        updateIsMobile();
        window.addEventListener("resize", updateIsMobile);
        return () => window.removeEventListener("resize", updateIsMobile);
    }, []);

    const [initialPos] = useState(() => calculateSafePos(position, defaultWidth, defaultHeight));
    const x = useMotionValue(initialPos.x);
    const y = useMotionValue(initialPos.y);
    const [prevPos, setPrevPos] = useState(initialPos);

    // Keep window in bounds on viewport resize (desktop only)
    useEffect(() => {
        const handleResize = () => {
            if (isMaximized || isMobile) return;
            const widthNum = typeof defaultWidth === "number" ? defaultWidth : parseInt(defaultWidth as string, 10) || 700;
            const heightNum = typeof defaultHeight === "number" ? defaultHeight : parseInt(defaultHeight as string, 10) || 600;
            const maxX = Math.max(16, window.innerWidth - widthNum - 16);
            const maxY = Math.max(16, window.innerHeight - heightNum - 16);
            if (x.get() > maxX) x.set(maxX);
            if (y.get() > maxY) y.set(maxY);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [isMaximized, isMobile, defaultWidth, defaultHeight, x, y]);

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    const toggleMaximize = () => {
        if (!isMaximized) {
            setPrevPos({ x: x.get(), y: y.get() });
            x.set(0);
            y.set(0);
            setIsMaximized(true);
        } else {
            x.set(prevPos.x);
            y.set(prevPos.y);
            setIsMaximized(false);
        }
    };

    const handlePointerDown = (e: React.PointerEvent) => {
        if (isMaximized || isMobile) return;
        const target = e.target as HTMLElement;
        if (target.closest("button, a, input, select, textarea, [role='button'], [data-no-drag]")) {
            return;
        }
        dragControls.start(e);
    };

    return (
        <div ref={containerRef} className="fixed inset-0 z-50 pointer-events-none">
            {/* Backdrop */}
            <div
                onClick={onClose}
                className={cn("absolute inset-0 pointer-events-auto", backdropClass)}
            />

            {/* Window / Bottom Sheet */}
            <motion.div
                drag={isMobile ? "y" : !isMaximized}
                dragControls={isMobile ? undefined : dragControls}
                dragListener={isMobile ? false : false}
                dragConstraints={isMobile ? { top: 0, bottom: 0 } : containerRef}
                dragElastic={isMobile ? { top: 0, bottom: 0.5 } : 0}
                dragMomentum={false}
                onDragEnd={isMobile ? (e, info) => {
                    if (info.offset.y > 100 || info.velocity.y > 300) {
                        onClose();
                    }
                } : undefined}
                initial={isMobile ? { opacity: 0, y: "100%" } : { opacity: 0, scale: 0.95 }}
                animate={isMobile ? { opacity: 1, y: 0 } : {
                    opacity: 1,
                    scale: 1,
                    width: isMaximized ? "100vw" : defaultWidth,
                    height: isMaximized ? "100vh" : defaultHeight,
                }}
                exit={isMobile ? { opacity: 0, y: "100%" } : { opacity: 0, scale: 0.95 }}
                transition={{
                    type: "spring",
                    damping: 30,
                    stiffness: 400,
                    mass: 0.8,
                }}
                style={isMobile ? {
                    width: "100vw",
                    maxWidth: "100vw",
                    height: isMaximized ? "100vh" : "88vh",
                    maxHeight: "92vh",
                } : {
                    x,
                    y,
                    width: isMaximized ? "100vw" : defaultWidth,
                    height: isMaximized ? "100vh" : defaultHeight,
                    maxWidth: isMaximized ? "100vw" : "calc(100vw - 32px)",
                    maxHeight: isMaximized ? "100vh" : "calc(100vh - 32px)",
                }}
                className={cn(
                    "pointer-events-auto absolute flex flex-col bg-card shadow-2xl border border-border overflow-hidden",
                    isMobile
                        ? "bottom-0 left-0 right-0 top-auto rounded-t-2xl rounded-b-none border-x-0 border-b-0"
                        : cn("top-0 left-0", isMaximized ? "rounded-none" : "rounded-xl"),
                    windowClass
                )}
            >
                {/* Mobile Drag Indicator Handle */}
                {isMobile && (
                    <div className="flex justify-center pt-2.5 pb-1 bg-muted/30 cursor-grab active:cursor-grabbing border-b border-border/20">
                        <div className="h-1.5 w-12 rounded-full bg-muted-foreground/30" />
                    </div>
                )}

                {/* Header / Draggable Title Bar */}
                <div
                    className={cn(
                        "flex items-center justify-between border-b border-border/40 px-4 py-3 bg-muted/30 select-none",
                        !isMaximized && !isMobile && "cursor-grab active:cursor-grabbing"
                    )}
                    onPointerDown={handlePointerDown}
                    onDoubleClick={toggleMaximize}
                >
                    <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar py-0.5">
                        {!isMobile && (
                            <GripHorizontal className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
                        )}
                        {headerLeft}
                    </div>
                    <div className="flex items-center gap-1 shrink-0 ml-2">
                        {headerIconTools || headerRight}
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn(isMobile ? "h-8 w-8" : "h-6 w-6")}
                            onClick={toggleMaximize}
                            title={isMaximized ? "Restore down" : "Maximize"}
                        >
                            {isMaximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                                "hover:bg-destructive/10 hover:text-destructive",
                                isMobile ? "h-8 w-8" : "h-6 w-6"
                            )}
                            onClick={onClose}
                            title="Close"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto thin-scrollbar">
                    {children}
                </div>
            </motion.div>
        </div>
    );
}
