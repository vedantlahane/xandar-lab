// app/lab/page.tsx

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { useAuth } from "@/components/auth/AuthContext";

// Smooth spring animation config
const smoothSpring = {
    type: "spring" as const,
    stiffness: 100,
    damping: 20,
    mass: 0.8,
};

// Stagger animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
            duration: 0.6,
            ease: "easeOut" as const,
        },
    },
};

// Animated text component
function AnimatedTitle({ text, className }: { text: string; className?: string }) {
    return (
        <span className={className || "inline-flex"}>
            {text.split("").map((char, i) => (
                <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.3,
                        delay: i * 0.03,
                        ease: "easeOut",
                    }}
                    className="inline-block"
                >
                    {char}
                </motion.span>
            ))}
        </span>
    );
}

export default function LabPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading, openLoginModal, user } = useAuth();
    // Check for login mode from URL
    useEffect(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            if (params.get("mode") === "login" && !isAuthenticated && !isLoading) {
                openLoginModal();
                // Clean up the URL
                router.replace("/lab");
            }
        }
    }, [isAuthenticated, isLoading, openLoginModal, router]);

    // Get current time-based greeting
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 17) return "Good afternoon";
        return "Good evening";
    };

    return (
        <div className="relative min-h-screen text-zinc-800 dark:text-zinc-200 overflow-hidden selection:bg-teal-100 selection:text-teal-900 dark:selection:bg-teal-900 dark:selection:text-teal-100">
            {/* Grid pattern background - matching landing page */}
            <div className="pointer-events-none absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-77.5 w-77.5 rounded-full bg-teal-400 opacity-20 blur-[100px]" />
                <div className="absolute right-0 top-0 -z-10 h-screen w-screen bg-linear-to-b from-white via-transparent to-transparent dark:from-black" />
            </div>

            {/* Subtle noise texture */}
            <div
                className="pointer-events-none fixed inset-0 opacity-[0.012] dark:opacity-[0.025]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Gradient orbs with enhanced animation */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute -top-40 -right-40 h-125 w-125 rounded-full bg-linear-to-br from-teal-400/25 to-emerald-500/25 dark:from-teal-400/15 dark:to-emerald-500/15 blur-[80px]"
                    animate={{
                        scale: [1, 1.15, 1],
                        opacity: [0.4, 0.5, 0.4],
                        x: [0, 20, 0],
                        y: [0, -20, 0],
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <motion.div
                    className="absolute -bottom-40 -left-40 h-112.5 w-112.5 rounded-full bg-linear-to-tr from-violet-400/20 to-purple-500/20 dark:from-violet-400/10 dark:to-purple-500/10 blur-[80px]"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.4, 0.3],
                        x: [0, -15, 0],
                        y: [0, 15, 0],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2,
                    }}
                />
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-150 w-150 rounded-full bg-linear-to-r from-cyan-400/10 to-blue-500/10 dark:from-cyan-400/5 dark:to-blue-500/5 blur-[100px]"
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.2, 0.3, 0.2],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1,
                    }}
                />
            </div>

            {/* Main content */}
            <div className="relative z-10 mx-auto max-w-4xl px-6 py-16 sm:py-24">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-12"
                >
                    {/* Header */}
                    <motion.header variants={itemVariants} className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                            <Sparkles className="h-3.5 w-3.5" />
                            <span suppressHydrationWarning>
                                {isAuthenticated && user
                                    ? `${getGreeting()}, ${user.username}`
                                    : "Welcome to the Lab"}
                            </span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                            <AnimatedTitle text="Your workspace" />
                            <br />
                            <span className="text-zinc-400 dark:text-zinc-500">
                                <AnimatedTitle text="awaits." />
                            </span>
                        </h1>

                        <motion.p
                            variants={itemVariants}
                            className="text-lg text-zinc-600 dark:text-zinc-400 max-w-xl leading-relaxed"
                        >
                            Your distraction-free sanctuary for deep work. Whether you're solving algorithms,
                            documenting ideas, or building something new — everything you need lives in the sidebar.
                        </motion.p>
                    </motion.header>

                    {/* Quick Stats (when authenticated) */}
                    <AnimatePresence>
                        {isAuthenticated && user && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                            >
                                <motion.div
                                    variants={itemVariants}
                                    className="flex items-center gap-6 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/50 dark:bg-zinc-900/30 backdrop-blur-sm p-4"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-sm text-zinc-600 dark:text-zinc-400">
                                            {user.completedProblems?.length || 0} problems completed
                                        </span>
                                    </div>
                                    <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-700" />
                                    <div className="text-sm text-zinc-600 dark:text-zinc-400">
                                        {user.savedProblems?.length || 0} saved for later
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* ===== CITY MAP VISUALIZATION ===== */}
                    {/* <CityMapVisualization /> */}

                </motion.div>
            </div>
        </div>
    );
}
