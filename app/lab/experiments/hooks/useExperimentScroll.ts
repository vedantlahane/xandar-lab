"use client"
import { useEffect, useState } from "react";

export function useExperimentScroll () {
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [categories, setCategories] = useState<{ id: string, title: string }[]>([]);

    useEffect(() => {
        const container = document.getElementById("experiments-scroll-container");
        if (!container) return;

        let observer: IntersectionObserver | null = null;

        const setupObservers = () => {
            const sections = Array.from(
                container.querySelectorAll<HTMLElement>("[data-category]")
            );
            
            setCategories(sections.map(s => ({
                id: s.id,
                title: s.getAttribute("data-category-title") || s.id
            })));

            if (observer) observer.disconnect();
            
            observer = new IntersectionObserver(
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

            sections.forEach((section) => observer?.observe(section));
        };

        setupObservers();

        const mutationObserver = new MutationObserver(() => {
            setupObservers();
        });

        mutationObserver.observe(container, { childList: true, subtree: true });

        return () => {
            mutationObserver.disconnect();
            if (observer) observer.disconnect();
        };
    }, []);

    return { activeCategory, categories };
}