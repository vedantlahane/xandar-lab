import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface LabItemRowProps {
    id: string;
    isActive: boolean;
    onClick: (id: string, e: React.MouseEvent) => void;
    title: ReactNode;
    titleIcon?: ReactNode;
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
    subtitle,
    tags,
    hoverContent
}: LabItemRowProps) {
    return (
        <button
            onClick={(e) => onClick(id, e)}
            className={cn(
                "group relative w-full border-b border-border/40 px-4 py-3 text-left backdrop-blur-md",
                "transition-all hover:bg-linear-to-r hover:from-white/5 hover:to-white/10 dark:hover:from-white/5 dark:hover:to-white/10",
                isActive && "bg-white/10 dark:bg-white/10"
            )}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        {titleIcon && titleIcon}
                        <span className={cn(
                            "text-sm font-medium transition-colors",
                            isActive ? "text-primary" : "text-foreground group-hover:text-primary"
                        )}>
                            {title}
                        </span>
                    </div>
                    {subtitle && (
                        <div className="text-xs text-muted-foreground/70 line-clamp-1 pl-6">
                            {subtitle}
                        </div>
                    )}
                    {tags && (
                        <div className="flex flex-wrap gap-2 text-[11px] font-medium text-muted-foreground pl-6">
                            {tags}
                        </div>
                    )}
                </div>

                {hoverContent && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3 opacity-0 transition-opacity group-hover:opacity-100">
                        {hoverContent}
                    </div>
                )}
            </div>
        </button>
    );
}
