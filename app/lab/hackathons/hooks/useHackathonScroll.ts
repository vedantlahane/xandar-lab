"use client"
import { useEffect, useState } from "react";

export function useHackathonScroll() {
    const [activeMonth, setActiveMonth] = useState<string | null>(null);

    useEffect(() => {
        const container = document.getElementById("hackathons-scroll-container");
        if (!container) return;

        const sections = Array.from(
            container.querySelectorAll<HTMLElement>("[data-month]")
        );

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveMonth(entry.target.id);
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

    return { activeMonth };
}
