import React, { useState } from "react";
import { CheckSquare, Square } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface MarkdownContentProps {
    content: string;
    onToggleCheckbox?: (index: number, checked: boolean) => void;
    className?: string;
}

export function MarkdownContent({ content, onToggleCheckbox, className }: MarkdownContentProps) {
    // Basic parser for checklists and bi-directional links
    // - [ ] Task
    // - [x] Completed task
    // [[Note Title]]

    const lines = content.split('\n');
    let checkboxIndex = 0;

    return (
        <div className={cn("text-sm text-foreground/90 font-sans leading-relaxed select-text space-y-1.5", className)}>
            {lines.map((line, lineIdx) => {
                // 1. Check for checklists
                const matchUnchecked = line.match(/^(\s*)-\s*\[\s\]\s+(.*)/);
                const matchChecked = line.match(/^(\s*)-\s*\[[xX]\]\s+(.*)/);

                if (matchUnchecked || matchChecked) {
                    const isChecked = !!matchChecked;
                    const match = matchUnchecked || matchChecked;
                    const indent = match![1];
                    const text = match![2];
                    const currentIndex = checkboxIndex++;

                    return (
                        <div key={lineIdx} className="flex items-start gap-2" style={{ paddingLeft: `${indent.length * 8}px` }}>
                            <button
                                onClick={() => onToggleCheckbox && onToggleCheckbox(currentIndex, !isChecked)}
                                disabled={!onToggleCheckbox}
                                className={cn(
                                    "mt-0.5 shrink-0 transition-colors",
                                    !onToggleCheckbox && "cursor-default opacity-70",
                                    isChecked ? "text-primary" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {isChecked ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                            </button>
                            <span className={cn(isChecked && "text-muted-foreground line-through opacity-80")}>
                                {renderInlineLinks(text)}
                            </span>
                        </div>
                    );
                }

                // 2. Normal text
                return (
                    <div key={lineIdx} className="min-h-[1.5em]">
                        {renderInlineLinks(line)}
                    </div>
                );
            })}
        </div>
    );
}

function renderInlineLinks(text: string) {
    // Regex for [[Link]]
    const parts = text.split(/(\[\[.*?\]\])/g);
    
    return parts.map((part, i) => {
        if (part.startsWith('[[') && part.endsWith(']]')) {
            const linkText = part.slice(2, -2);
            // URL encode for search
            const href = `/lab/notes?q=${encodeURIComponent(linkText)}`;
            return (
                <Link key={i} href={href} className="text-primary hover:underline font-medium bg-primary/10 px-1 rounded mx-0.5">
                    {linkText}
                </Link>
            );
        }
        
        // Handle bold **text**
        const boldParts = part.split(/(\*\*.*?\*\*)/g);
        if (boldParts.length > 1) {
             return boldParts.map((bp, bi) => {
                 if (bp.startsWith('**') && bp.endsWith('**')) {
                     return <strong key={bi} className="font-semibold">{bp.slice(2, -2)}</strong>;
                 }
                 return <React.Fragment key={bi}>{bp}</React.Fragment>;
             });
        }

        return <React.Fragment key={i}>{part}</React.Fragment>;
    });
}
