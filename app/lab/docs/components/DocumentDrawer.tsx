// app/lab/docs/components/DocumentDrawer.tsx
"use client";

import { useState } from "react";
import { Copy, Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Document } from "../data/documents";
import { cn } from "@/lib/utils";
import MLRoadmap from "./roadmap/MLRoadmap";
import { BaseDrawer } from "@/app/lab/components/shared/BaseDrawer";

export function DocumentDrawer({
    document,
    onClose,
    position,
}: {
    document: Document;
    onClose: () => void;
    position: { x: number; y: number };
}) {
    const [copied, setCopied] = useState(false);

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

    const headerLeft = (
        <>
            <span className={cn(
                "px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                getCategoryColor(document.category)
            )}>
                {document.category}
            </span>
            <span className="text-xs text-muted-foreground/70">
                {document.technology}
            </span>
        </>
    );

    const headerIconTools = (
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
    );

    return (
        <BaseDrawer
            onClose={onClose}
            position={position}
            defaultWidth="700px"
            defaultHeight="500px"
            headerLeft={headerLeft}
            headerIconTools={headerIconTools}
            backdropClass="bg-black/20 backdrop-blur-sm"
        >
            <div className="p-6">
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

                        {document.customComponent === "MLRoadmap" ? (
                            <div className="mt-4">
                                <MLRoadmap />
                            </div>
                        ) : (
                            <div className="rounded-lg border border-border/50 bg-muted/20 p-4">
                                <pre className="text-sm text-foreground whitespace-pre-wrap font-mono leading-relaxed">
                                    {document.content}
                                </pre>
                            </div>
                        )}

                        <div className="flex items-center justify-between text-xs text-muted-foreground/60">
                            <span>Created: {document.createdAt}</span>
                            <span>Updated: {document.updatedAt}</span>
                        </div>
                    </div>
            </div>
        </BaseDrawer>
    );
}
