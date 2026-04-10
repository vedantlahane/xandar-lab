import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface BaseCanvasProps {
    scrollId: string;
    sidebarContent?: ReactNode;
    children: ReactNode;
    leftColumnClass?: string;
    rightColumnClass?: string;
}

export function BaseCanvas({
    scrollId,
    sidebarContent,
    children,
    leftColumnClass,
    rightColumnClass,
}: BaseCanvasProps) {
    return (
        <div className="relative h-full">
            {/* Top Fade */}
            <div className="pointer-events-none absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-background to-transparent z-10" />

            <div id={scrollId} className="h-full overflow-y-auto thin-scrollbar overscroll-contain">
                <div className="max-w-7xl mx-auto px-8 md:px-12">
                    <div className={cn(
                        "grid gap-10 min-h-full",
                        sidebarContent ? "grid-cols-1 md:grid-cols-[240px_1fr]" : "grid-cols-1"
                    )}>
                        {/* ── Left column ── */}
                        {sidebarContent && (
                            <aside className={cn("relative sticky top-0 h-screen hidden md:flex flex-col justify-center", leftColumnClass)}>
                                <div className="space-y-4 py-6 overflow-y-auto no-scrollbar max-h-[calc(100vh-10rem)]">
                                    {sidebarContent}
                                </div>
                            </aside>
                        )}
                        
                        {/* ── Right column ── */}
                        <div className={cn("space-y-4 pb-48 pt-8", rightColumnClass)}>
                             {children}
                        </div>

                    </div>
                </div>
            </div>

            {/* Bottom Fade */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-background to-transparent z-10" />
        </div>
    );
}
