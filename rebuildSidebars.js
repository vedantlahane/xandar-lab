const fs = require('fs');

function rebuildSidebar(path, hookName, activeVar) {
    const code = `"use client";

import { useState, useEffect, useRef } from "react";
import type { Transition } from "framer-motion";
import { AnimatePresence, motion } from "framer-motion";
import { ` + hookName + ` } from "../hooks/` + hookName + `";
import { cn } from "@/lib/utils";

const smoothSpring = {
    type: "spring",
    stiffness: 320,
    damping: 28,
    mass: 0.6,
} satisfies Transition;

export default function ` + path.split('/').pop().replace('.tsx', '') + `() {
    const { ` + activeVar + `, categories } = ` + hookName + `();
    const [isHovered, setIsHovered] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const scrollToSection = (id: string) => {
        document.getElementById(id)?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    // Auto-scroll the sidebar container so the active dot is visible
    useEffect(() => {
        if (!` + activeVar + `) return;
        
        // slight delay to allow layout animations to settle
        const timer = setTimeout(() => {
            const btn = document.getElementById(\`sidebar-item-\${` + activeVar + `}\`);
            if (btn && scrollRef.current) {
                const container = scrollRef.current;
                const btnTop = btn.offsetTop;
                const btnBottom = btnTop + btn.offsetHeight;
                const containerTop = container.scrollTop;
                const containerBottom = containerTop + container.offsetHeight;
                
                if (btnTop < containerTop) {
                    container.scrollTo({ top: btnTop - 20, behavior: "smooth" });
                } else if (btnBottom > containerBottom) {
                    container.scrollTo({ top: btnBottom - container.offsetHeight + 20, behavior: "smooth" });
                }
            }
        }, 100);

        return () => clearTimeout(timer);
    }, [` + activeVar + `, isHovered]);

    return (
        <aside className="fixed right-0 top-0 z-40 flex h-full items-center pr-6 pointer-events-none">
            <AnimatePresence>
                {categories.length > 0 && (
                    <motion.div
                        ref={scrollRef}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        layout
                        transition={{ layout: smoothSpring }}
                        className="pointer-events-auto relative flex flex-col gap-3 py-6 px-3 max-h-[60vh] overflow-y-auto no-scrollbar rounded-3xl bg-background/20 backdrop-blur-sm border border-border/10"
                        onHoverStart={() => setIsHovered(true)}
                        onHoverEnd={() => setIsHovered(false)}
                    >
                        <AnimatePresence initial={false}>
                            {categories.map((section, index) => {
                                const isActive = ` + activeVar + ` === section.id;
                                const isBig = index % 3 === 0;

                                return (
                                    <motion.button
                                        key={section.id}
                                        id={\`sidebar-item-\${section.id}\`}
                                        layout="position"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.1 } }}
                                        transition={{ layout: smoothSpring }}
                                        onClick={() => scrollToSection(section.id)}
                                        className="group flex flex-row-reverse items-center gap-4 py-0.5"
                                    >
                                        <motion.div
                                            layout
                                            transition={smoothSpring}
                                            className={cn(
                                                "h-1 rounded-full transition-colors duration-300",
                                                isActive
                                                    ? "bg-primary"
                                                    : "bg-muted-foreground/30 group-hover:bg-primary/50"
                                            )}
                                            animate={{
                                                width: isHovered ? 6 : isBig ? 24 : 12,
                                                height: isHovered ? 6 : 4,
                                                opacity: isHovered ? 0 : 1,
                                            }}
                                        />

                                        <div className="overflow-hidden">
                                            <AnimatePresence initial={false}>
                                                {isHovered && (
                                                    <motion.span
                                                        layout={false}
                                                        initial={{ opacity: 0, x: 10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: 10 }}
                                                        transition={{
                                                            type: "tween",
                                                            duration: 0.18,
                                                            ease: [0.22, 1, 0.36, 1],
                                                        }}
                                                        className={cn(
                                                            "block whitespace-nowrap text-sm font-medium",
                                                            isActive
                                                                ? "text-foreground"
                                                                : "text-muted-foreground group-hover:text-foreground"
                                                        )}
                                                    >
                                                        {section.title}
                                                    </motion.span>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>
        </aside>
    );
}`;
    fs.writeFileSync(path, code);
}

rebuildSidebar('c:/Users/Admin/Desktop/xandar-lab/app/lab/docs/components/SectionSidebar.tsx', 'useDocScroll', 'activeSection');
rebuildSidebar('c:/Users/Admin/Desktop/xandar-lab/app/lab/experiments/components/CategorySidebar.tsx', 'useExperimentScroll', 'activeCategory');
rebuildSidebar('c:/Users/Admin/Desktop/xandar-lab/app/lab/hackathons/components/MonthSidebar.tsx', 'useHackathonScroll', 'activeMonth');
rebuildSidebar('c:/Users/Admin/Desktop/xandar-lab/app/lab/notes/components/GroupSidebar.tsx', 'useNoteScroll', 'activeGroup');
rebuildSidebar('c:/Users/Admin/Desktop/xandar-lab/app/lab/jobs/components/JobSidebar.tsx', 'useJobScroll', 'activeCategory');
rebuildSidebar('c:/Users/Admin/Desktop/xandar-lab/app/lab/jobs/components/PortalSidebar.tsx', 'usePortalScroll', 'activeCategory');
// For practice
function rebuildTopicSidebar() {
    const hookName = 'useScrollSync';
    const activeVar = 'activeTopic';
    const path = 'c:/Users/Admin/Desktop/xandar-lab/app/lab/practice/components/browse/TopicSidebar.tsx';

    const code = `"use client";

import { useState, useEffect, useRef } from "react";
import type { Transition } from "framer-motion";
import { AnimatePresence, motion } from "framer-motion";
import { ` + hookName + ` } from "../../hooks/` + hookName + `";
import { cn } from "@/lib/utils";

const smoothSpring = {
    type: "spring",
    stiffness: 320,
    damping: 28,
    mass: 0.6,
} satisfies Transition;

export function TopicSidebar() {
    const { ` + activeVar + `, categories } = ` + hookName + `();
    const [isHovered, setIsHovered] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const scrollToTopic = (id: string) => {
        document.getElementById(id)?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    useEffect(() => {
        if (!` + activeVar + `) return;
        
        const timer = setTimeout(() => {
            const btn = document.getElementById(\`topic-sidebar-item-\${` + activeVar + `}\`);
            if (btn && scrollRef.current) {
                const container = scrollRef.current;
                const btnTop = btn.offsetTop;
                const btnBottom = btnTop + btn.offsetHeight;
                const containerTop = container.scrollTop;
                const containerBottom = containerTop + container.offsetHeight;
                
                if (btnTop < containerTop) {
                    container.scrollTo({ top: btnTop - 20, behavior: "smooth" });
                } else if (btnBottom > containerBottom) {
                    container.scrollTo({ top: btnBottom - container.offsetHeight + 20, behavior: "smooth" });
                }
            }
        }, 100);

        return () => clearTimeout(timer);
    }, [` + activeVar + `, isHovered]);

    return (
        <aside className="fixed right-0 top-0 z-40 flex h-full items-center pr-6 pointer-events-none">
            <AnimatePresence>
                {categories.length > 0 && (
                    <motion.div
                        ref={scrollRef}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        layout
                        transition={{ layout: smoothSpring }}
                        className="pointer-events-auto relative flex flex-col gap-3 py-6 px-3 max-h-[60vh] overflow-y-auto no-scrollbar rounded-3xl bg-background/20 backdrop-blur-sm border border-border/10"
                        onHoverStart={() => setIsHovered(true)}
                        onHoverEnd={() => setIsHovered(false)}
                    >
                        <AnimatePresence initial={false}>
                            {categories.map((topic, index) => {
                                const isActive = ` + activeVar + ` === topic.id;
                                const isBig = index % 4 === 0;

                                return (
                                    <motion.button
                                        key={topic.id}
                                        id={\`topic-sidebar-item-\${topic.id}\`}
                                        layout="position"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.1 } }}
                                        transition={{ layout: smoothSpring }}
                                        onClick={() => scrollToTopic(topic.id)}
                                        className="group flex flex-row-reverse items-center gap-4 py-0.5"
                                    >
                                        <motion.div
                                            layout
                                            transition={smoothSpring}
                                            className={cn(
                                                "h-1 rounded-full transition-colors duration-300",
                                                isActive
                                                    ? "bg-primary"
                                                    : "bg-muted-foreground/30 group-hover:bg-primary/50"
                                            )}
                                            animate={{
                                                width: isHovered ? 6 : isBig ? 24 : 12,
                                                height: isHovered ? 6 : 4,
                                                opacity: isHovered ? 0 : 1,
                                            }}
                                        />

                                        <div className="overflow-hidden">
                                            <AnimatePresence initial={false}>
                                                {isHovered && (
                                                    <motion.span
                                                        layout={false}
                                                        initial={{ opacity: 0, x: 10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: 10 }}
                                                        transition={{
                                                            type: "tween",
                                                            duration: 0.18,
                                                            ease: [0.22, 1, 0.36, 1],
                                                        }}
                                                        className={cn(
                                                            "block whitespace-nowrap text-sm font-medium",
                                                            isActive
                                                                ? "text-foreground"
                                                                : "text-muted-foreground group-hover:text-foreground"
                                                        )}
                                                    >
                                                        {topic.title}
                                                    </motion.span>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>
        </aside>
    );
}
`;
    fs.writeFileSync(path, code);
}
rebuildTopicSidebar();
console.log('Sidebars rebuilt again!');
