"use client";

import { useState, useEffect } from "react";
import { motion, type Transition } from "framer-motion";
import { usePathname } from "next/navigation";
import { ProfileDropdown } from "@/components/auth/ProfileDropdown";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/AuthContext";
import { getAvatarGradientClass, getDefaultAvatarGradient } from "@/components/auth/AvatarCustomizer";

const smoothSpring = {
    type: "spring",
    stiffness: 320,
    damping: 28,
    mass: 0.6,
} satisfies Transition;

export default function LabProfile() {
    const [isHovered, setIsHovered] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isTouch, setIsTouch] = useState(false);
    const pathname = usePathname();
    const { user } = useAuth();

    useEffect(() => {
        if (typeof window !== "undefined") {
            setIsTouch(window.matchMedia("(pointer: coarse)").matches);
        }
    }, []);

    useEffect(() => {
        setIsHovered(false);
        setIsOpen(false);
    }, [pathname]);

    const isExpanded = isHovered || isOpen;

    const avatarGradient = user
        ? getAvatarGradientClass(user.avatarGradient || getDefaultAvatarGradient(user.username))
        : "from-indigo-500/10 via-purple-500/10 to-pink-500/10";

    return (
        <>
            {/* Invisible Outside Tap Backdrop to dismiss open profile on touch */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside className="fixed left-0 bottom-0 z-40 flex items-end justify-start pl-2 sm:pl-4 pb-2 sm:pb-4 pointer-events-none">
                <div
                    className={cn(
                        "pointer-events-auto relative rounded-2xl transition-all duration-200 select-none cursor-pointer",
                        isExpanded ? "bg-card shadow-lg ring-1 ring-border/50" : ""
                    )}
                    onMouseEnter={() => !isTouch && setIsHovered(true)}
                    onMouseLeave={() => !isTouch && setIsHovered(false)}
                    onClick={() => {
                        if (isTouch) {
                            setIsOpen((prev) => !prev);
                        }
                    }}
                >
                    <div className={cn(
                        "absolute inset-0 rounded-2xl transition-opacity duration-300 bg-gradient-to-br",
                        user ? avatarGradient : "from-indigo-500/10 via-purple-500/10 to-pink-500/10",
                        isExpanded ? (user ? "opacity-20" : "opacity-100") : "opacity-0"
                    )} />
                    <div className="relative z-10">
                        <ProfileDropdown isExpanded={isExpanded} />
                    </div>
                </div>
            </aside>
        </>
    );
}
