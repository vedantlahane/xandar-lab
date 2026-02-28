// app/lab/practice/components/shared/CodeBlock.tsx

"use client";

import { cn } from "@/lib/utils";

const LANGUAGES = [
  "Python",
  "JavaScript",
  "TypeScript",
  "Java",
  "C++",
  "Go",
  "Other",
] as const;

interface CodeBlockProps {
  code: string;
  language: string;
  onCodeChange: (code: string) => void;
  onLanguageChange: (language: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * Styled monospace textarea with a language selector.
 * Used in FocusCard and ProblemDrawer new-attempt form.
 */
export function CodeBlock({
  code,
  language,
  onCodeChange,
  onLanguageChange,
  placeholder = "def solution():\n    pass",
  className,
}: CodeBlockProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between">
        <label className="text-sm text-muted-foreground">{"</>"} Code</label>
        <select
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
          className={cn(
            "text-xs border border-border/40 rounded px-2 py-0.5",
            "bg-transparent text-muted-foreground",
            "hover:border-border/70 transition-colors",
          )}
        >
          {LANGUAGES.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>
      <textarea
        value={code}
        onChange={(e) => onCodeChange(e.target.value)}
        placeholder={placeholder}
        spellCheck={false}
        className={cn(
          "w-full h-52 resize-none",
          "rounded-lg border border-border/40 bg-zinc-50 dark:bg-zinc-950",
          "px-4 py-3 font-mono text-sm leading-relaxed",
          "placeholder:text-muted-foreground/40",
          "focus:outline-none focus:ring-1 focus:ring-ring/20",
        )}
      />
    </div>
  );
}
