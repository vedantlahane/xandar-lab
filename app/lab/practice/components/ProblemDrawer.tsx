"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Maximize2, Minimize2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DSAProblem } from "../data/sheet";
import { cn } from "@/lib/utils";

export function ProblemDrawer({
    problem,
    onClose,
    position,
}: {
    problem: DSAProblem;
    onClose: () => void;
    position: { x: number; y: number };
}) {
    const [isMaximized, setIsMaximized] = useState(false);

    // Calculate initial position to keep window on screen
    // Default to click position, but adjust if it would go off screen
    // We'll use a simple heuristic: if click is on right half, open to left. If bottom half, open upwards.
    const initialX = position.x > window.innerWidth / 2 ? position.x - 600 : position.x;
    const initialY = position.y > window.innerHeight / 2 ? position.y - 600 : position.y;

    // Clamp values to be safe
    const safeX = Math.max(20, Math.min(initialX, window.innerWidth - 620));
    const safeY = Math.max(20, Math.min(initialY, window.innerHeight - 620));

    return (
        <div className="fixed inset-0 z-50">
            {/* Transparent Backdrop for click-outside */}
            <div 
                onClick={onClose}
                className="absolute inset-0 bg-transparent pointer-events-auto"
            />

            {/* Window */}
            <motion.div
                layout
                initial={{ 
                    opacity: 0, 
                    scale: 0.5, 
                    x: position.x, 
                    y: position.y 
                }}
                animate={{ 
                    opacity: 1, 
                    scale: 1, 
                    x: isMaximized ? 0 : safeX,
                    y: isMaximized ? 0 : safeY,
                    width: isMaximized ? "100%" : "600px",
                    height: isMaximized ? "100%" : "600px",
                }}
                exit={{ 
                    opacity: 0, 
                    scale: 0.5, 
                    x: position.x, 
                    y: position.y 
                }}
                transition={{ 
                    type: "spring", 
                    damping: 25, 
                    stiffness: 300,
                    mass: 0.8
                }}
                className={cn(
                    "pointer-events-auto absolute flex flex-col bg-card shadow-2xl border border-border overflow-hidden",
                    isMaximized ? "rounded-none" : "rounded-xl"
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border/40 px-4 py-3 bg-muted/30 select-none" onDoubleClick={() => setIsMaximized(!isMaximized)}>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-muted-foreground/70">Problem Details</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => setIsMaximized(!isMaximized)}
                        >
                            {isMaximized ? (
                                <Minimize2 className="h-3.5 w-3.5" />
                            ) : (
                                <Maximize2 className="h-3.5 w-3.5" />
                            )}
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 hover:bg-destructive/10 hover:text-destructive"
                            onClick={onClose}
                        >
                            <X className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-8">
                        <div className="space-y-3">
                            <h2 className="text-2xl font-bold tracking-tight">{problem.title}</h2>
                            <div className="flex flex-wrap gap-2">
                                <Badge>{problem.platform}</Badge>
                                {problem.tags?.map((tag) => (
                                    <Badge key={tag} subtle>
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="rounded-lg border border-border/50 bg-muted/20 p-4">
                                <h3 className="text-sm font-medium mb-2">Description</h3>
                                <p className="text-sm text-muted-foreground">
                                    Solve this problem on {problem.platform}. Click the button below to open the problem statement.
                                </p>
                            </div>

                            <Button className="w-full sm:w-auto" asChild>
                                <a href={problem.url} target="_blank" rel="noopener noreferrer">
                                    Solve on {problem.platform}
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="space-y-2">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                {title}
            </div>
            {children}
        </div>
    );
}

function Badge({
    children,
    subtle,
}: {
    children: React.ReactNode;
    subtle?: boolean;
}) {
    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                subtle
                    ? "border border-border bg-muted text-muted-foreground"
                    : "bg-primary text-primary-foreground"
            }`}
        >
            {children}
        </span>
    );
}
