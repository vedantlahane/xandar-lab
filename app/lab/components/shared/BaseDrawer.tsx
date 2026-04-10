"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Maximize2, Minimize2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface BaseDrawerProps {
    onClose: () => void;
    position?: { x: number; y: number };
    defaultWidth?: number | string;
    defaultHeight?: number | string;
    headerLeft?: React.ReactNode;
    headerIconTools?: React.ReactNode;
    backdropClass?: string;
    children: React.ReactNode;
}

export function BaseDrawer({
    onClose,
    position,
    defaultWidth = "800px",
    defaultHeight = "80vh",
    headerLeft,
    headerIconTools,
    backdropClass = "bg-black/40 backdrop-blur-sm",
    children,
}: BaseDrawerProps) {
    const [isMaximized, setIsMaximized] = useState(false);

    let safeX = 0;
    let safeY = 0;

    const isClient = typeof window !== "undefined";

    if (position && isClient) {
        const widthNum = typeof defaultWidth === "number" ? defaultWidth : parseInt(defaultWidth as string) || 700;
        const heightNum = typeof defaultHeight === "number" ? defaultHeight : parseInt(defaultHeight as string) || 600;
        
        const initialX = position.x > window.innerWidth / 2 ? position.x - widthNum : position.x;
        const initialY = position.y > window.innerHeight / 2 ? position.y - heightNum : position.y;
        
        safeX = Math.max(20, Math.min(initialX, window.innerWidth - widthNum - 20));
        safeY = Math.max(20, Math.min(initialY, window.innerHeight - heightNum - 20));
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                onClick={onClose}
                className={cn("absolute inset-0 pointer-events-auto", backdropClass)}
            />

            {/* Window */}
            <motion.div
                layout
                initial={
                    position
                        ? { opacity: 0, scale: 0.5, x: position.x, y: position.y }
                        : { opacity: 0, scale: 0.95, y: 10 }
                }
                animate={
                    position
                        ? {
                              opacity: 1,
                              scale: 1,
                              x: isMaximized ? 0 : safeX,
                              y: isMaximized ? 0 : safeY,
                              width: isMaximized ? "100%" : defaultWidth,
                              height: isMaximized ? "100%" : defaultHeight,
                          }
                        : {
                              opacity: 1,
                              scale: 1,
                              y: 0,
                              width: isMaximized ? "100%" : defaultWidth,
                              height: isMaximized ? "100%" : defaultHeight,
                              maxWidth: "100vw",
                              maxHeight: "100vh"
                          }
                }
                exit={
                    position
                        ? { opacity: 0, scale: 0.5, x: position.x, y: position.y }
                        : { opacity: 0, scale: 0.95, y: 10 }
                }
                transition={
                    position
                        ? { type: "spring", damping: 25, stiffness: 300, mass: 0.8 }
                        : { type: "spring", damping: 25, stiffness: 300 }
                }
                className={cn(
                    "pointer-events-auto absolute flex flex-col bg-card shadow-2xl border border-border overflow-hidden",
                    !position && "relative", // relative when centered natively without position
                    isMaximized ? "rounded-none" : "rounded-xl"
                )}
            >
                {/* Header */}
                <div
                    className="flex items-center justify-between border-b border-border/40 px-4 py-3 bg-muted/30 select-none"
                    onDoubleClick={() => setIsMaximized(!isMaximized)}
                >
                    <div className="flex items-center gap-3">
                        {headerLeft}
                    </div>
                    <div className="flex items-center gap-1">
                        {headerIconTools}
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsMaximized(!isMaximized)}>
                            {isMaximized ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-destructive/10 hover:text-destructive" onClick={onClose}>
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
