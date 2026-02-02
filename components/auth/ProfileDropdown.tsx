"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { User, Settings, LogOut, ChevronUp, Activity, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/AuthContext";
import { getAvatarGradientClass, getDefaultAvatarGradient } from "@/components/auth/AvatarCustomizer";

// Smooth spring config
const smoothSpring = {
    type: "spring" as const,
    stiffness: 300,
    damping: 25,
    mass: 0.8,
};

interface ProfileDropdownProps {
    isExpanded: boolean;
}

export function ProfileDropdown({ isExpanded }: ProfileDropdownProps) {
    const { isAuthenticated, user, logout, openLoginModal } = useAuth();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    // Close on escape
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false);
        };
        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, []);

    const handleProfileClick = () => {
        if (!isAuthenticated) {
            openLoginModal();
            return;
        }
        setIsOpen(!isOpen);
    };

    const handleNavigate = (path: string) => {
        setIsOpen(false);
        router.push(path);
    };

    const handleLogout = async () => {
        setIsOpen(false);
        await logout();
        router.push("/lab");
    };

    // Get avatar gradient - use saved preference or generate from username
    const getAvatarGradient = () => {
        if (!user) return "bg-zinc-200 dark:bg-zinc-800";
        const gradientId = user.avatarGradient || getDefaultAvatarGradient(user.username);
        return getAvatarGradientClass(gradientId);
    };

    const menuItems = [
        {
            icon: User,
            label: "Profile",
            action: () => handleNavigate("/lab/profile"),
        },
        {
            icon: Activity,
            label: "Statistics",
            action: () => handleNavigate("/lab/profile?tab=stats"),
        },
        {
            icon: Settings,
            label: "Settings",
            action: () => handleNavigate("/lab/profile?tab=profile"),
        },
        {
            icon: Shield,
            label: "Security",
            action: () => handleNavigate("/lab/profile?tab=password"),
        },
    ];

    return (
        <div ref={dropdownRef} className="relative">
            {/* Profile Button */}
            <motion.button
                onClick={handleProfileClick}
                className={cn(
                    "group flex items-center gap-3 rounded-xl transition-all duration-200",
                    isExpanded
                        ? "w-full px-3 py-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                        : "p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                {/* Avatar */}
                <div
                    className={cn(
                        "flex items-center justify-center rounded-full transition-all duration-200",
                        isExpanded ? "h-9 w-9" : "h-8 w-8",
                        isAuthenticated && user
                            ? `bg-gradient-to-br ${getAvatarGradient()}`
                            : "bg-zinc-200 dark:bg-zinc-800"
                    )}
                >
                    {isAuthenticated && user ? (
                        <span className="text-sm font-semibold text-white uppercase">
                            {user.username.charAt(0)}
                        </span>
                    ) : (
                        <User className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                    )}
                </div>

                {/* Expanded content */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={smoothSpring}
                            className="flex flex-1 items-center justify-between overflow-hidden"
                        >
                            <div className="text-left">
                                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate max-w-[100px]">
                                    {isAuthenticated && user ? user.username : "Sign In"}
                                </p>
                                {isAuthenticated && (
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                        {user?.completedProblems?.length || 0} completed
                                    </p>
                                )}
                            </div>
                            {isAuthenticated && (
                                <ChevronUp
                                    className={cn(
                                        "h-4 w-4 text-zinc-400 transition-transform duration-200",
                                        isOpen ? "rotate-180" : "rotate-0"
                                    )}
                                />
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && isAuthenticated && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={smoothSpring}
                        className={cn(
                            "absolute z-50 min-w-[200px] rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl shadow-lg shadow-zinc-200/50 dark:shadow-zinc-900/50 overflow-hidden",
                            isExpanded
                                ? "bottom-full left-0 right-0 mb-2"
                                : "bottom-full left-0 mb-2"
                        )}
                    >
                        {/* User info header */}
                        <div className="px-3 py-3 border-b border-zinc-200/60 dark:border-zinc-800/60">
                            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                {user?.username}
                            </p>
                            {user?.email && (
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">
                                    {user.email}
                                </p>
                            )}
                        </div>

                        {/* Menu items */}
                        <div className="py-1">
                            {menuItems.map((item, index) => (
                                <motion.button
                                    key={item.label}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={item.action}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.label}
                                </motion.button>
                            ))}
                        </div>

                        {/* Logout */}
                        <div className="border-t border-zinc-200/60 dark:border-zinc-800/60 py-1">
                            <motion.button
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                            >
                                <LogOut className="h-4 w-4" />
                                Sign out
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
