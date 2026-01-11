"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
    FlaskConical,
    BookOpen,
    FileText,
    StickyNote,
    Lightbulb,
    Trophy,
    ArrowRight,
    Sparkles,
} from "lucide-react";
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
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

// Loading dots animation
function LoadingDots() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="flex items-center gap-1.5">
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-zinc-400"
                        animate={{
                            opacity: [0.2, 0.8, 0.2],
                        }}
                        transition={{
                            duration: 1.4,
                            repeat: Infinity,
                            delay: i * 0.15,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

// Lab sections data
const labSections = [
    {
        href: "/lab/practice",
        icon: FlaskConical,
        title: "Practice",
        description: "Master DSA with curated problem sets",
        status: "active" as const,
        gradient: "from-emerald-500/10 to-teal-500/10",
        iconColor: "text-emerald-600 dark:text-emerald-400",
        borderColor: "hover:border-emerald-500/30",
    },
    {
        href: "/lab/hackathons",
        icon: Trophy,
        title: "Hackathons",
        description: "Track and prepare for competitions",
        status: "active" as const,
        gradient: "from-amber-500/10 to-orange-500/10",
        iconColor: "text-amber-600 dark:text-amber-400",
        borderColor: "hover:border-amber-500/30",
    },
    {
        href: "/lab/notes",
        icon: StickyNote,
        title: "Notes",
        description: "Organize your learning journey",
        status: "active" as const,
        gradient: "from-violet-500/10 to-purple-500/10",
        iconColor: "text-violet-600 dark:text-violet-400",
        borderColor: "hover:border-violet-500/30",
    },
    {
        href: "/lab/docs",
        icon: BookOpen,
        title: "Docs",
        description: "Documentation and references",
        status: "active" as const,
        gradient: "from-blue-500/10 to-cyan-500/10",
        iconColor: "text-blue-600 dark:text-blue-400",
        borderColor: "hover:border-blue-500/30",
    },
    {
        href: "/lab/experiments",
        icon: Lightbulb,
        title: "Experiments",
        description: "Try new ideas and prototypes",
        status: "active" as const,
        gradient: "from-rose-500/10 to-pink-500/10",
        iconColor: "text-rose-600 dark:text-rose-400",
        borderColor: "hover:border-rose-500/30",
    },
];

// Section Card Component
function SectionCard({
    section,
    index,
    onNavigate,
}: {
    section: (typeof labSections)[0];
    index: number;
    onNavigate: (href: string) => void;
}) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            variants={cardVariants}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <motion.button
                onClick={() => onNavigate(section.href)}
                className={`group relative w-full text-left rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/50 dark:bg-zinc-900/30 backdrop-blur-sm p-6 transition-all duration-300 ${section.borderColor} hover:shadow-lg hover:shadow-zinc-200/50 dark:hover:shadow-zinc-900/50`}
                whileHover={{ y: -4 }}
                transition={smoothSpring}
            >
                {/* Gradient Background */}
                <motion.div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${section.gradient} opacity-0 transition-opacity duration-300`}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                />

                {/* Content */}
                <div className="relative z-10">
                    <div className="flex items-start justify-between">
                        <div className={`p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 ${section.iconColor} transition-colors duration-300`}>
                            <section.icon className="h-5 w-5" />
                        </div>
                        <motion.div
                            className="text-zinc-400 dark:text-zinc-500"
                            animate={{ x: isHovered ? 4 : 0, opacity: isHovered ? 1 : 0.5 }}
                            transition={{ duration: 0.2 }}
                        >
                            <ArrowRight className="h-4 w-4" />
                        </motion.div>
                    </div>

                    <div className="mt-4 space-y-1.5">
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-lg tracking-tight">
                            {section.title}
                        </h3>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                            {section.description}
                        </p>
                    </div>
                </div>
            </motion.button>
        </motion.div>
    );
}

// Letter by letter animation component
function AnimatedTitle({ text, className }: { text: string; className?: string }) {
    return (
        <span className={className}>
            {text.split("").map((char, i) => (
                <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.4,
                        delay: i * 0.03,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                >
                    {char}
                </motion.span>
            ))}
        </span>
    );
}

export default function LabPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { isAuthenticated, isLoading, openLoginModal, user } = useAuth();
    const [mounted, setMounted] = useState(false);

    // Check for login mode from URL
    useEffect(() => {
        if (searchParams.get("mode") === "login" && !isAuthenticated && !isLoading) {
            openLoginModal();
            // Clean up the URL
            router.replace("/lab");
        }
    }, [searchParams, isAuthenticated, isLoading, openLoginModal, router]);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleNavigate = (href: string) => {
        if (!isAuthenticated) {
            openLoginModal();
            return;
        }
        router.push(href);
    };

    if (!mounted || isLoading) {
        return <LoadingDots />;
    }

    // Get current time-based greeting
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 17) return "Good afternoon";
        return "Good evening";
    };

    return (
        <div className="relative min-h-screen bg-zinc-50 dark:bg-black text-zinc-800 dark:text-zinc-200 overflow-hidden">
            {/* Subtle noise texture */}
            <div
                className="pointer-events-none fixed inset-0 opacity-[0.015] dark:opacity-[0.03]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Gradient orbs */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-gradient-to-br from-teal-400/20 to-emerald-500/20 dark:from-teal-400/10 dark:to-emerald-500/10 blur-3xl"
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.4, 0.3],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <motion.div
                    className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-gradient-to-tr from-violet-400/20 to-purple-500/20 dark:from-violet-400/10 dark:to-purple-500/10 blur-3xl"
                    animate={{
                        scale: [1, 1.15, 1],
                        opacity: [0.25, 0.35, 0.25],
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
                            <span>
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
                            A calm environment for focused learning. Practice problems, take notes,
                            explore documentation, and experiment with ideas.
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

                    {/* Section Cards Grid */}
                    <motion.div variants={itemVariants} className="space-y-4">
                        <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                            Explore
                        </h2>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {labSections.map((section, index) => (
                                <SectionCard
                                    key={section.href}
                                    section={section}
                                    index={index}
                                    onNavigate={handleNavigate}
                                />
                            ))}
                        </div>
                    </motion.div>

                    {/* Footer hint */}
                    <motion.footer variants={itemVariants} className="pt-8">
                        <div className="flex items-center gap-3 text-sm text-zinc-400 dark:text-zinc-500">
                            <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
                            <span>
                                {isAuthenticated
                                    ? "Select a section to begin"
                                    : "Sign in to start your journey"}
                            </span>
                            <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
                        </div>
                    </motion.footer>
                </motion.div>
            </div>
        </div>
    );
}
