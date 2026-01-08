"use client";

import { ThemeToggle } from "./ThemeToggle";

export function ThemeToggleWrapper() {
    return (
        <aside className="fixed right-0 bottom-0 z-40 flex items-end justify-end pr-4 pb-4 pointer-events-none">
            <div className="pointer-events-auto">
                <ThemeToggle />
            </div>
        </aside>
    );
}
