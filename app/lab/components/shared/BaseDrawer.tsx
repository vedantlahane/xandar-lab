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
    const containerRef = useRef<HTMLDivElement>(null);
    const dragControls = useDragControls();

    const [initialPos] = useState(() => calculateSafePos(position, defaultWidth, defaultHeight));
    const x = useMotionValue(initialPos.x);
    const y = useMotionValue(initialPos.y);
    const [prevPos, setPrevPos] = useState(initialPos);

    // Keep window in bounds on viewport resize
    useEffect(() => {
        const handleResize = () => {
            if (isMaximized) return;
            const widthNum = typeof defaultWidth === "number" ? defaultWidth : parseInt(defaultWidth as string, 10) || 700;
            const heightNum = typeof defaultHeight === "number" ? defaultHeight : parseInt(defaultHeight as string, 10) || 600;
            const maxX = Math.max(16, window.innerWidth - widthNum - 16);
            const maxY = Math.max(16, window.innerHeight - heightNum - 16);
            if (x.get() > maxX) x.set(maxX);
            if (y.get() > maxY) y.set(maxY);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [isMaximized, defaultWidth, defaultHeight, x, y]);

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
        if (isMaximized) return;
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

            {/* Draggable Window */}
            <motion.div
                drag={!isMaximized}
                dragControls={dragControls}
                dragListener={false}
                dragConstraints={containerRef}
                dragMomentum={false}
                dragElastic={0}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{
                    opacity: 1,
                    scale: 1,
                    width: isMaximized ? "100vw" : defaultWidth,
                    height: isMaximized ? "100vh" : defaultHeight,
                }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                    type: "spring",
                    damping: 30,
                    stiffness: 400,
                    mass: 0.8,
                }}
                style={{
                    x,
                    y,
                    width: isMaximized ? "100vw" : defaultWidth,
                    height: isMaximized ? "100vh" : defaultHeight,
                    maxWidth: isMaximized ? "100vw" : "calc(100vw - 32px)",
                    maxHeight: isMaximized ? "100vh" : "calc(100vh - 32px)",
                }}
                className={cn(
                    "pointer-events-auto absolute top-0 left-0 flex flex-col bg-card shadow-2xl border border-border overflow-hidden",
                    isMaximized ? "rounded-none" : "rounded-xl",
                    windowClass
                )}
            >
                {/* Header / Draggable Title Bar */}
                <div
                    className={cn(
                        "flex items-center justify-between border-b border-border/40 px-4 py-3 bg-muted/30 select-none",
                        !isMaximized && "cursor-grab active:cursor-grabbing"
                    )}
                    onPointerDown={handlePointerDown}
                    onDoubleClick={toggleMaximize}
                >
                    <div className="flex items-center gap-3">
                        <GripHorizontal className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
                        {headerLeft}
                    </div>
                    <div className="flex items-center gap-1">
                        {headerIconTools || headerRight}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={toggleMaximize}
                            title={isMaximized ? "Restore down" : "Maximize"}
                        >
                            {isMaximized ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 hover:bg-destructive/10 hover:text-destructive"
                            onClick={onClose}
                            title="Close"
                        >
                            <X className="h-3.5 w-3.5" />
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
