// app/lab/experiments/hooks/useExperimentScroll.ts
"use client"
import { useEffect, useState } from "react";

export function useExperimentScroll() {
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    useEffect(() => {
        const container = document.getElementById("experiments-scroll-container");
        if (!container) return;

        const sections = Array.from(
            container.querySelectorAll<HTMLElement>("[data-category]")
        );

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveCategory(entry.target.id);
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

    return { activeCategory };
}
