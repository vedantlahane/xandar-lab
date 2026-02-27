// app/lab/docs/components/DocumentDrawer.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Maximize2, Minimize2, X, Copy, Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Document } from "../data/documents";
import { cn } from "@/lib/utils";

export function DocumentDrawer({
    document,
    onClose,
    position,
}: {
    document: Document;
    onClose: () => void;
    position: { x: number; y: number };
}) {
    const [isMaximized, setIsMaximized] = useState(false);
    const [copied, setCopied] = useState(false);

    const initialX = position.x > window.innerWidth / 2 ? position.x - 700 : position.x;
    const initialY = position.y > window.innerHeight / 2 ? position.y - 500 : position.y;

    const safeX = Math.max(20, Math.min(initialX, window.innerWidth - 720));
    const safeY = Math.max(20, Math.min(initialY, window.innerHeight - 520));

    const handleCopy = async () => {
        await navigator.clipboard.writeText(document.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'Cheatsheet': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'Guide': return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'Reference': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
            case 'Tutorial': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
            case 'Notes': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            default: return 'bg-muted text-muted-foreground';
        }
    };

    return (
        <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <div
                onClick={onClose}
                className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-auto"
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
                    width: isMaximized ? "100%" : "700px",
                    height: isMaximized ? "100%" : "500px",
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
                <div
                    className="flex items-center justify-between border-b border-border/40 px-4 py-3 bg-muted/30 select-none"
                    onDoubleClick={() => setIsMaximized(!isMaximized)}
                >
                    <div className="flex items-center gap-3">
                        <span className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                            getCategoryColor(document.category)
                        )}>
                            {document.category}
                        </span>
                        <span className="text-xs text-muted-foreground/70">
                            {document.technology}
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={handleCopy}
                        >
                            {copied ? (
                                <Check className="h-3.5 w-3.5 text-green-500" />
                            ) : (
                                <Copy className="h-3.5 w-3.5" />
                            )}
                        </Button>
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
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <h2 className="text-2xl font-bold tracking-tight">{document.title}</h2>
                            <p className="text-sm text-muted-foreground">{document.description}</p>
                            <div className="flex flex-wrap gap-2">
                                {document.tags?.map((tag) => (
                                    <span
                                        key={tag}
                                        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold border border-border bg-muted text-muted-foreground"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-lg border border-border/50 bg-muted/20 p-4">
                            <pre className="text-sm text-foreground whitespace-pre-wrap font-mono leading-relaxed">
                                {document.content}
                            </pre>
                        </div>

                        <div className="flex items-center justify-between text-xs text-muted-foreground/60">
                            <span>Created: {document.createdAt}</span>
                            <span>Updated: {document.updatedAt}</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
