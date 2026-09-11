import { ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    const [showMobileSidebar, setShowMobileSidebar] = useState(false);

    return (
        <div className="relative h-full">
            {/* Top Fade */}
            <div className="pointer-events-none absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-background to-transparent z-10" />

            <div id={scrollId} className="h-full overflow-y-auto thin-scrollbar overscroll-contain">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
                    {/* Mobile Filter Trigger */}
                    {sidebarContent && (
                        <div className="md:hidden flex justify-end pt-3 -mb-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowMobileSidebar(true)}
                                className="h-8 px-2.5 flex items-center gap-1.5 rounded-xl border-border bg-card/60 backdrop-blur-sm"
                            >
                                <SlidersHorizontal className="h-3.5 w-3.5" />
                                <span className="text-xs font-medium">Filters & Options</span>
                            </Button>
                        </div>
                    )}

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

            {/* Mobile Sidebar Sheet */}
            <AnimatePresence>
                {showMobileSidebar && (
                    <div className="fixed inset-0 z-50 flex items-end justify-center md:hidden">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={() => setShowMobileSidebar(false)}
                        />
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 28, stiffness: 300 }}
                            className="relative z-10 w-full max-h-[85vh] bg-card border-t border-border rounded-t-2xl shadow-2xl flex flex-col overflow-hidden"
                        >
                            <div className="flex items-center justify-between p-4 border-b border-border/40 bg-muted/20">
                                <div className="flex items-center gap-2">
                                    <SlidersHorizontal className="h-4 w-4 text-primary" />
                                    <h3 className="font-semibold text-sm">Filters & Options</h3>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => setShowMobileSidebar(false)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="p-4 overflow-y-auto space-y-4">
                                {sidebarContent}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Bottom Fade */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-background to-transparent z-10" />
        </div>
    );
}
