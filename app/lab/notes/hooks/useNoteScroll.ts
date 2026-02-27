// app/lab/notes/hooks/useNoteScroll.ts
"use client"
import { useEffect, useState } from "react";

export function useNoteScroll() {
    const [activeGroup, setActiveGroup] = useState<string | null>(null);

    useEffect(() => {
        const container = document.getElementById("notes-scroll-container");
        if (!container) return;

        const sections = Array.from(
            container.querySelectorAll<HTMLElement>("[data-group]")
        );

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveGroup(entry.target.id);
                    }
                });
            },
            {
                root: container,
                threshold: 0.4,
            }
        );

        sections.forEach((section) => observer.observe(section));

        return () => observer.disconnect();
    }, []);

    return { activeGroup };
}
