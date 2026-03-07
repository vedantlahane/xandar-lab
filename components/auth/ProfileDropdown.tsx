// components/auth/ProfileDropdown.tsx
"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { User, Settings, LogOut, ChevronUp, Activity, Shield, Layers, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/AuthContext";
import { getAvatarGradientClass, getDefaultAvatarGradient } from "@/components/auth/AvatarCustomizer";
import { useClickOutside } from "@/components/auth/hooks/useClickOutside";

const smoothSpring = {
    type: "spring" as const,
    stiffness: 300,
    damping: 25,
    mass: 0.8,
};

// Static â€” defined outside component so the array reference is stable
const MENU_ITEMS = [
    { icon: Activity, label: "Statistics", path: "/lab/profile?tab=stats" },
    { icon: User, label: "Profile", path: "/lab/profile?tab=profile" },
    { icon: Layers, label: "Sessions", path: "/lab/profile?tab=sessions" },
    { icon: Shield, label: "Password", path: "/lab/profile?tab=password" },
    { icon: AlertTriangle, label: "Danger Zone", path: "/lab/profile?tab=danger" },
] as const;

interface ProfileDropdownProps {
    isExpanded: boolean;
}

export function ProfileDropdown({ isExpanded }: ProfileDropdownProps) {
    const { isAuthenticated, user, logout, openLoginModal } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsOpen(false);
    }, [pathname, searchParams]);

    // Single hook covers both click-outside and Escape â€” only active when open
    useClickOutside(dropdownRef, () => setIsOpen(false), isOpen);

    const handleProfileClick = () => {
        if (!isAuthenticated) {
            openLoginModal();
            return;
        }
        setIsOpen((prev) => !prev);
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

    const avatarGradient = user
        ? getAvatarGradientClass(user.avatarGradient || getDefaultAvatarGradient(user.username))
        : "";

    return (
        <div ref={dropdownRef} className="relative">
            {/* Profile button */}
            <motion.button
                onClick={handleProfileClick}
                className={cn(
                    "group flex items-center gap-3 rounded-xl transition-all duration-300",
                    isExpanded
                        ? "w-full px-3 py-2.5 hover:bg-black/5 dark:hover:bg-white/5"
                        : "p-2 hover:bg-black/5 dark:hover:bg-white/5"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                {/* Avatar */}
                <div
                    className={cn(
                        "flex items-center justify-center rounded-full transition-all duration-300 ring-2 ring-transparent group-hover:ring-primary/20",
                        isExpanded ? "h-9 w-9 shadow-[0_0_15px_-3px_rgba(var(--primary),0.3)]" : "h-8 w-8",
                        isAuthenticated && user
                            ? `bg-gradient-to-br ${avatarGradient}`
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

                {/* Expanded label */}
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
                                <p className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 truncate max-w-32 group-hover:text-primary transition-colors">
                                    {isAuthenticated && user ? user.username : "Sign In"}
                                </p>
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

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && isAuthenticated && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={smoothSpring}
                        className={cn(
                            "absolute z-50 min-w-56 rounded-2xl border border-white/20 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-2xl shadow-2xl shadow-black/10 dark:shadow-black/40 overflow-hidden ring-1 ring-black/5 dark:ring-white/10",
                            isExpanded
                                ? "bottom-full left-0 right-0 mb-3"
                                : "bottom-full left-0 mb-3"
                        )}
                    >
                        {/* User info header */}
                        <div className="px-4 py-3 border-b border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
                            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 relative z-10">
                                {user?.username}
                            </p>
                            {user?.email && (
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">
                                    {user.email}
                                </p>
                            )}
                        </div>

                        {/* Nav items */}
                        <div className="p-1 space-y-0.5">
                            {MENU_ITEMS.map((item, index) => {
                                const currentTab = searchParams.get("tab") || "stats";
                                const isProfilePath = pathname === "/lab/profile";
                                const itemTabMatch = item.path.match(/tab=([^&]+)/);
                                const itemTab = itemTabMatch ? itemTabMatch[1] : null;
                                const isActive = isProfilePath && itemTab === currentTab;

                                return (
                                    <motion.button
                                        key={item.label}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        onClick={() => handleNavigate(item.path)}
                                        className={cn(
                                            "group/item w-full flex items-center gap-3 px-3 py-2 text-sm font-medium transition-all rounded-xl",
                                            isActive
                                                ? "text-zinc-900 bg-black/5 dark:bg-white/10 dark:text-zinc-100"
                                                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-black/5 dark:hover:bg-white/10"
                                        )}
                                    >
                                        <item.icon className={cn("h-4 w-4 transition-transform", !isActive && "group-hover/item:scale-110 group-hover/item:text-primary", isActive && "text-primary")} />
                                        {item.label}
                                    </motion.button>
                                );
                            })}
                        </div>

                        {/* Logout */}
                        <div className="border-t border-black/5 dark:border-white/10 p-1">
                            <motion.button
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: MENU_ITEMS.length * 0.05 }}
                                onClick={handleLogout}
                                className="group/logout w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all rounded-xl"
                            >
                                <LogOut className="h-4 w-4 transition-transform group-hover/logout:-translate-x-1" />
                                Sign out
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
