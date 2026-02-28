// app/lab/practice/components/shared/DifficultyDots.tsx

"use client";

import { cn } from "@/lib/utils";

interface DifficultyDotsProps {
  /** 0 = none selected, 1–5 = rating */
  value: number;
  onChange: (value: number) => void;
  label?: string;
  className?: string;
}

/**
 * Five-dot difficulty rating widget (●●●○○).
 * Used inside FocusCard and ProblemDrawer attempt forms.
 */
export function DifficultyDots({
  value,
  onChange,
  label = "Felt",
  className,
}: DifficultyDotsProps) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      {label && (
        <span className="text-xs text-muted-foreground mr-0.5">{label}:</span>
      )}
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i === value ? 0 : i)}
          title={`${i}/5`}
          className={cn(
            "h-2.5 w-2.5 rounded-full transition-colors",
            i <= value
              ? "bg-foreground"
              : "bg-muted-foreground/20 hover:bg-muted-foreground/50",
          )}
        />
      ))}
    </div>
  );
}
