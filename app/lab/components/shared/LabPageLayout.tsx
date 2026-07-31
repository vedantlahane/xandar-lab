import { useState, useMemo, ReactNode } from "react";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/auth/AuthContext";

export interface LabPageLayoutProps<T> {
    items: T[];
    getItemId: (item: T) => string;
    renderCanvas: (props: { activeId: string | null; onSelect: (id: string, event: React.MouseEvent) => void }) => ReactNode;
    renderSidebar?: () => ReactNode;
    renderDrawer: (props: { item: T; position: { x: number; y: number }; onClose: () => void }) => ReactNode;
    header?: ReactNode;
}

export function LabPageLayout<T>({
    items,
    getItemId,
    renderCanvas,
    renderSidebar,
    renderDrawer,
    header,
}: LabPageLayoutProps<T>) {
    const [activeId, setActiveId] = useState<string | null>(null);
    const [clickPosition, setClickPosition] = useState<{ x: number; y: number } | null>(null);
    const { isAuthenticated, openLoginModal } = useAuth();

    const itemIndex = useMemo(() => {
        const map = new Map<string, T>();
        items.forEach((item) => map.set(getItemId(item), item));
        return map;
    }, [items, getItemId]);

    const activeItem = activeId ? itemIndex.get(activeId) ?? null : null;

    const handleSelect = (id: string, event: React.MouseEvent) => {
        if (!isAuthenticated) {
            openLoginModal();
            return;
        }
        setClickPosition({ x: event.clientX, y: event.clientY });
        setActiveId(id);
    };

    return (
        <div className="relative h-screen flex flex-col w-full text-foreground overflow-hidden">
            {header}
            <div className="relative flex-1 w-full text-foreground overflow-hidden">
                <main className="h-full w-full">
                {renderCanvas({ activeId, onSelect: handleSelect })}
            </main>

            {/* Sidebar */}
            {renderSidebar && (
                <aside className="absolute right-0 top-0 h-full pointer-events-none z-40">
                    <div className="pointer-events-auto h-full">
                        {renderSidebar()}
                    </div>
                </aside>
            )}

            {/* Drawer Overlay */}
            <AnimatePresence>
                {activeItem && clickPosition && (
                    <div className="absolute inset-0 pointer-events-none z-50">
                        {renderDrawer({
                            item: activeItem,
                            position: clickPosition,
                            onClose: () => setActiveId(null),
                        })}
                    </div>
                )}
            </AnimatePresence>
            </div>
        </div>
    );
}
