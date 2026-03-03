"use client";

import { useState } from "react";
import { motion, type Transition } from "framer-motion";
import { ProfileDropdown } from "@/components/auth/ProfileDropdown";

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
                className="pointer-events-auto"
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
            >
                <ProfileDropdown isExpanded={isHovered} />
            </motion.div>
        </aside>
    );
}
