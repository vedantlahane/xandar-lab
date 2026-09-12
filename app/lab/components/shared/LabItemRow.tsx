import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface LabItemRowProps {
    id: string;
    isActive: boolean;
    onClick: (id: string, e: React.MouseEvent) => void;
    title: ReactNode;
    titleIcon?: ReactNode;
    titleBadge?: ReactNode;
    subtitle?: ReactNode;
    tags?: ReactNode;
    hoverContent?: ReactNode;
}

export function LabItemRow({
    id,
    isActive,
    onClick,
    title,
    titleIcon,
    titleBadge,
    subtitle,
    tags,
    hoverContent
}: LabItemRowProps) {
    return (
        <button
            onClick={(e) => onClick(id, e)}
            className={cn(
                "group relative w-full border-b border-border/40 px-3.5 sm:px-4 py-2.5 sm:py-3 text-left",
                "transition-colors hover:bg-white/5 dark:hover:bg-white/5",
                isActive && "bg-white/10 dark:bg-white/10"
            )}
        >
            <div className="flex items-start justify-between gap-3">
                <div className={cn("space-y-1.5 flex-1 min-w-0", hoverContent ? "pr-14 sm:pr-16" : "")}>
                    <div className="flex items-center gap-2">
                        {titleIcon && titleIcon}
                        <span className={cn(
                            "text-sm font-medium transition-colors truncate",
                            isActive ? "text-primary" : "text-foreground group-hover:text-primary"
                        )}>
                            {title}
                        </span>
                        {titleBadge && <div className="shrink-0">{titleBadge}</div>}
                    </div>
                    {subtitle && (
                        <div className={cn("text-xs text-muted-foreground/70 line-clamp-1", titleIcon ? "pl-6" : "")}>
                            {subtitle}
                        </div>
                    )}
                    {tags && (
                        <div className={cn("flex flex-wrap gap-1.5 sm:gap-2 text-[11px] font-medium text-muted-foreground", titleIcon ? "pl-6" : "")}>
                            {tags}
                        </div>
                    )}
                </div>

                {hoverContent && (
                    <div className="absolute right-3.5 sm:right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 sm:gap-3 max-md:opacity-80 opacity-0 transition-opacity group-hover:opacity-100 shrink-0">
                        {hoverContent}
                    </div>
                )}
            </div>
        </button>
    );
}
