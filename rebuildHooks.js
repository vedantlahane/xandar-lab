const fs = require('fs');

function rewriteHook(path, id, activeVar, attr = 'data-category', titleAttr = 'data-category-title') {
    const code = `"use client"
import { useEffect, useState } from "react";

export function ` + path.split('/').pop().replace('.ts', '') + ` () {
    const [` + activeVar + `, set` + activeVar.charAt(0).toUpperCase() + activeVar.slice(1) + `] = useState<string | null>(null);
    const [categories, setCategories] = useState<{ id: string, title: string }[]>([]);

    useEffect(() => {
        const container = document.getElementById("` + id + `");
        if (!container) return;

        let observer: IntersectionObserver | null = null;

        const setupObservers = () => {
            const sections = Array.from(
                container.querySelectorAll<HTMLElement>("[` + attr + `]")
            );
            
            setCategories(sections.map(s => ({
                id: s.id,
                title: s.getAttribute("` + titleAttr + `") || s.id
            })));

            if (observer) observer.disconnect();
            
            observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            set` + activeVar.charAt(0).toUpperCase() + activeVar.slice(1) + `(entry.target.id);
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

    return { ` + activeVar + `, categories };
}`;
    fs.writeFileSync(path, code);
}

rewriteHook('c:/Users/Admin/Desktop/xandar-lab/app/lab/docs/hooks/useDocScroll.ts', 'docs-scroll-container', 'activeSection');
rewriteHook('c:/Users/Admin/Desktop/xandar-lab/app/lab/experiments/hooks/useExperimentScroll.ts', 'experiments-scroll-container', 'activeCategory');
rewriteHook('c:/Users/Admin/Desktop/xandar-lab/app/lab/hackathons/hooks/useHackathonScroll.ts', 'hackathons-scroll-container', 'activeMonth');
rewriteHook('c:/Users/Admin/Desktop/xandar-lab/app/lab/notes/hooks/useNoteScroll.ts', 'notes-scroll-container', 'activeGroup');
rewriteHook('c:/Users/Admin/Desktop/xandar-lab/app/lab/jobs/hooks/useJobScroll.ts', 'jobs-scroll-container', 'activeCategory');
rewriteHook('c:/Users/Admin/Desktop/xandar-lab/app/lab/jobs/hooks/usePortalScroll.ts', 'portal-scroll-container', 'activeCategory');
rewriteHook('c:/Users/Admin/Desktop/xandar-lab/app/lab/practice/hooks/useScrollSync.ts', 'problem-scroll-container', 'activeTopic', 'data-topic', 'data-topic-title');
console.log('Hooks rebuilt!');
