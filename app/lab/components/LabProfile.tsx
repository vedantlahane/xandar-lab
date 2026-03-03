"use client";

import { useState } from "react";
import { motion, type Transition } from "framer-motion";
import { ProfileDropdown } from "@/components/auth/ProfileDropdown";
import { cn } from "@/lib/utils";

const smoothSpring = {
    type: "spring",
    stiffness: 320,
    damping: 28,
    mass: 0.6,
} satisfies Transition;

export default function LabProfile() {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <aside className="fixed left-0 bottom-0 z-40 flex items-end justify-start pl-4 pb-4 pointer-events-none">
            <motion.div
                layout
                transition={{ layout: smoothSpring }}
                className={cn(
                    "pointer-events-auto relative rounded-2xl transition-all duration-300",
                    isHovered ? "bg-white/40 dark:bg-zinc-900/40 shadow-xl shadow-black/5 ring-1 ring-black/5 dark:ring-white/10 backdrop-blur-xl" : ""
                )}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
            >
                <div className={cn(
                    "absolute inset-0 rounded-2xl transition-opacity duration-300 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10",
                    isHovered ? "opacity-100" : "opacity-0"
                )} />
                <div className="relative z-10">
                    <ProfileDropdown isExpanded={isHovered} />
                </div>
            </motion.div>
        </aside>
    );
}
