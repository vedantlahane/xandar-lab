"use client"
import { useEffect, useState } from "react";

export function useDocScroll() {
    const [activeSection, setActiveSection] = useState<string | null>(null);

    useEffect(() => {
        const container = document.getElementById("docs-scroll-container");
        if (!container) return;

        const sections = Array.from(
            container.querySelectorAll<HTMLElement>("[data-section]")
        );

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
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

    return { activeSection };
}
