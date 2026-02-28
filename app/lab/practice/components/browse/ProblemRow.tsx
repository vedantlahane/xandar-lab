// app/lab/practice/components/browse/ProblemRow.tsx

"use client";

import { useRouter } from "next/navigation";
import { Bookmark, Check, Target, RefreshCcw, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DSAProblem } from "../../data/sheet";
import type { ExtensionData } from "../../hooks/useProblemFilters";
import { getExtensionData } from "../../hooks/useProblemFilters";

interface ProblemRowProps {
  problem: DSAProblem;
  isActive: boolean;
  isSaved: boolean;
  isCompleted: boolean;
  onSelect: (id: string, e: React.MouseEvent) => void;
  onSave: (id: string, e: React.MouseEvent) => void;
  onComplete: (id: string, e: React.MouseEvent) => void;
}

export function ProblemRow({
  problem,
  isActive,
  isSaved,
  isCompleted,
  onSelect,
  onSave,
  onComplete,
}: ProblemRowProps) {
  const router = useRouter();

  // TODO: When extension ships, receive extensionData as a prop from BrowseView
  // (fetched once for all problems) instead of computing per-row
  const extData: ExtensionData | null = getExtensionData(problem.id, isCompleted);
  const isUnresolved = !!extData?.stuck && !isCompleted;
  const showActions = isActive || isSaved || isCompleted || isUnresolved;

  return (
    <button
      onClick={(e) => onSelect(problem.id, e)}
      className={cn(
        "group relative w-full border-b border-border/40 px-4 py-3 text-left",
        "transition-all hover:bg-linear-to-r hover:from-transparent hover:to-accent/40",
        isActive && "bg-accent/50",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left: title + tags */}
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {/* Review-due icon */}
            {extData?.reviewDue && (
              <span className="text-teal-500 shrink-0" title="Review Due">
                <RefreshCcw className="h-3.5 w-3.5" strokeWidth={2.5} />
              </span>
            )}

            <span
              className={cn(
                "text-sm font-medium transition-colors flex-1 truncate",
                isActive
                  ? "text-primary"
                  : isCompleted
                    ? "text-foreground/60 line-through decoration-green-500/30"
                    : "text-foreground group-hover:text-primary",
              )}
            >
              {problem.title}
            </span>
          </div>

          {/* Tags row */}
          <div className="flex flex-wrap gap-2 text-[11px] font-medium text-muted-foreground items-center">
            <span className="px-1.5 py-0.5 rounded bg-muted/50 border border-border/50 text-xs text-muted-foreground/70">
              {problem.platform}
            </span>
            {problem.tags?.map((tag) => {
              let color =
                "bg-muted/30 text-muted-foreground border-transparent";
              if (tag === "Easy")
                color =
                  "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20";
              if (tag === "Medium")
                color =
                  "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20";
              if (tag === "Hard")
                color =
                  "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
              return (
                <span
                  key={tag}
                  className={cn("px-1.5 py-0.5 rounded border", color)}
                >
                  {tag}
                </span>
              );
            })}
          </div>
        </div>

        {/* Right: ext metadata + action buttons */}
        <div className="flex flex-col items-end gap-1 shrink-0">
          <div className="flex items-center gap-3">
            {/* ext data: time + subs */}
            {extData && (
              <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                <span>{extData.solveTime}</span>
                <span>·</span>
                <span>{extData.subs} sub</span>
              </div>
            )}

            {/* action buttons */}
            <div
              className={cn(
                "flex items-center gap-1 transition-opacity",
                showActions ? "opacity-100" : "opacity-0 group-hover:opacity-100",
              )}
            >
              {/* Focus */}
              <div
                role="button"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/lab/practice/focus?p=${problem.id}`);
                }}
                className="rounded-md p-1.5 hover:bg-background hover:shadow-sm transition-colors cursor-pointer text-muted-foreground hover:text-foreground"
                title="Open in Focus mode"
              >
                <Target className="h-4 w-4" />
              </div>

              {/* Save */}
              <div
                role="button"
                onClick={(e) => onSave(problem.id, e)}
                className={cn(
                  "rounded-md p-1.5 hover:bg-background hover:shadow-sm transition-colors cursor-pointer",
                  isSaved
                    ? "text-yellow-500 bg-yellow-500/5"
                    : "text-muted-foreground hover:text-yellow-500 hover:bg-yellow-500/10",
                )}
                title={isSaved ? "Unsave" : "Save for later"}
              >
                <Bookmark
                  className={cn("h-4 w-4", isSaved && "fill-current")}
                />
              </div>

              {/* Complete */}
              <div
                role="button"
                onClick={(e) => onComplete(problem.id, e)}
                className={cn(
                  "rounded-md p-1.5 hover:bg-background hover:shadow-sm transition-colors cursor-pointer",
                  isCompleted
                    ? "text-green-500 bg-green-500/5"
                    : isUnresolved
                      ? "text-amber-500 bg-amber-500/5"
                      : "text-muted-foreground hover:text-green-500 hover:bg-green-500/10",
                )}
                title={isCompleted ? "Mark as incomplete" : "Mark as completed"}
              >
                {isUnresolved ? (
                  <Circle className="h-4 w-4" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
              </div>
            </div>
          </div>

          {/* ext secondary row */}
          {extData && (
            <div className="text-[10px] flex items-center justify-end gap-1.5">
              <span className="text-muted-foreground">
                {extData.lastAttempted}
              </span>
              {extData.stuck && (
                <>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-amber-500/80 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
                    stuck
                  </span>
                </>
              )}
              {extData.reviewDue && (
                <>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-teal-500/80">review due</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}