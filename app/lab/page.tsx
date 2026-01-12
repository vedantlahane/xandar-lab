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
            ease: "easeOut" as const,
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
            ease: "easeOut" as const,
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
                        ease: "easeOut",
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
        <div className="relative min-h-screen bg-zinc-50 dark:bg-black text-zinc-800 dark:text-zinc-200 overflow-hidden selection:bg-teal-100 selection:text-teal-900 dark:selection:bg-teal-900 dark:selection:text-teal-100">
            {/* Grid pattern background - matching landing page */}
            <div className="pointer-events-none absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-teal-400 opacity-20 blur-[100px]" />
                <div className="absolute right-0 top-0 -z-10 h-screen w-screen bg-gradient-to-b from-white via-transparent to-transparent dark:from-black" />
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
                    className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-teal-400/25 to-emerald-500/25 dark:from-teal-400/15 dark:to-emerald-500/15 blur-[80px]"
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
                    className="absolute -bottom-40 -left-40 h-[450px] w-[450px] rounded-full bg-gradient-to-tr from-violet-400/20 to-purple-500/20 dark:from-violet-400/10 dark:to-purple-500/10 blur-[80px]"
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
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-gradient-to-r from-cyan-400/10 to-blue-500/10 dark:from-cyan-400/5 dark:to-blue-500/5 blur-[100px]"
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

                    {/* Flowing Decorative Paths - Aesthetic elements pointing toward sidebar */}
                    <div className="pointer-events-none fixed inset-0 overflow-hidden">
                        {/* Flowing path 1 - Top curve */}
                        <motion.svg
                            className="absolute top-20 right-1/4 w-[400px] h-[200px]"
                            viewBox="0 0 400 200"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.4 }}
                            transition={{ delay: 1.5, duration: 1 }}
                        >
                            <motion.path
                                d="M 400 100 Q 300 20, 200 80 T 50 60 T 0 100"
                                stroke="url(#gradient1)"
                                strokeWidth="1.5"
                                fill="none"
                                strokeLinecap="round"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ delay: 1.5, duration: 2.5, ease: "easeInOut" }}
                            />
                            <defs>
                                <linearGradient id="gradient1" x1="100%" y1="0%" x2="0%" y2="0%">
                                    <stop offset="0%" stopColor="transparent" />
                                    <stop offset="30%" stopColor="rgb(20 184 166 / 0.3)" />
                                    <stop offset="70%" stopColor="rgb(20 184 166 / 0.5)" />
                                    <stop offset="100%" stopColor="rgb(20 184 166 / 0.2)" />
                                </linearGradient>
                            </defs>
                        </motion.svg>

                        {/* Flowing path 2 - Middle horizontal wave */}
                        <motion.svg
                            className="absolute top-1/3 right-10 w-[500px] h-[150px]"
                            viewBox="0 0 500 150"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.3 }}
                            transition={{ delay: 2, duration: 1 }}
                        >
                            <motion.path
                                d="M 500 75 Q 420 30, 350 75 Q 280 120, 200 75 Q 120 30, 50 75 L 0 75"
                                stroke="url(#gradient2)"
                                strokeWidth="1"
                                fill="none"
                                strokeLinecap="round"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ delay: 2, duration: 3, ease: "easeInOut" }}
                            />
                            <defs>
                                <linearGradient id="gradient2" x1="100%" y1="0%" x2="0%" y2="0%">
                                    <stop offset="0%" stopColor="transparent" />
                                    <stop offset="40%" stopColor="rgb(139 92 246 / 0.25)" />
                                    <stop offset="100%" stopColor="rgb(139 92 246 / 0.15)" />
                                </linearGradient>
                            </defs>
                        </motion.svg>

                        {/* Flowing path 3 - Lower graceful curve */}
                        <motion.svg
                            className="absolute bottom-1/4 right-1/3 w-[350px] h-[180px]"
                            viewBox="0 0 350 180"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.35 }}
                            transition={{ delay: 2.5, duration: 1 }}
                        >
                            <motion.path
                                d="M 350 90 C 280 150, 200 30, 120 90 S 40 150, 0 100"
                                stroke="url(#gradient3)"
                                strokeWidth="1.2"
                                fill="none"
                                strokeLinecap="round"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ delay: 2.5, duration: 2.8, ease: "easeInOut" }}
                            />
                            <defs>
                                <linearGradient id="gradient3" x1="100%" y1="0%" x2="0%" y2="0%">
                                    <stop offset="0%" stopColor="transparent" />
                                    <stop offset="50%" stopColor="rgb(6 182 212 / 0.3)" />
                                    <stop offset="100%" stopColor="rgb(6 182 212 / 0.2)" />
                                </linearGradient>
                            </defs>
                        </motion.svg>

                        {/* Flowing path 4 - Subtle top-right to left */}
                        <motion.svg
                            className="absolute top-1/4 right-20 w-[600px] h-[100px]"
                            viewBox="0 0 600 100"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.25 }}
                            transition={{ delay: 3, duration: 1 }}
                        >
                            <motion.path
                                d="M 600 50 Q 500 10, 400 50 Q 300 90, 200 50 Q 100 10, 0 50"
                                stroke="url(#gradient4)"
                                strokeWidth="0.8"
                                fill="none"
                                strokeLinecap="round"
                                strokeDasharray="8 4"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ delay: 3, duration: 3.5, ease: "easeInOut" }}
                            />
                            <defs>
                                <linearGradient id="gradient4" x1="100%" y1="0%" x2="0%" y2="0%">
                                    <stop offset="0%" stopColor="transparent" />
                                    <stop offset="60%" stopColor="rgb(244 114 182 / 0.2)" />
                                    <stop offset="100%" stopColor="rgb(244 114 182 / 0.1)" />
                                </linearGradient>
                            </defs>
                        </motion.svg>

                        {/* Floating dots that drift toward sidebar */}
                        {[...Array(6)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-1.5 h-1.5 rounded-full bg-teal-500/30 dark:bg-teal-400/20"
                                style={{
                                    top: `${20 + i * 12}%`,
                                    right: `${10 + i * 8}%`,
                                }}
                                initial={{ opacity: 0, x: 0 }}
                                animate={{
                                    opacity: [0, 0.6, 0.3, 0],
                                    x: [-20, -100, -200, -300],
                                }}
                                transition={{
                                    delay: 2 + i * 0.4,
                                    duration: 4 + i * 0.5,
                                    repeat: Infinity,
                                    repeatDelay: 3 + i,
                                    ease: "easeInOut",
                                }}
                            />
                        ))}

                        {/* Small accent lines near sidebar */}
                        <motion.div
                            className="absolute left-12 top-1/3 w-16 h-px"
                            style={{
                                background: "linear-gradient(to left, transparent, rgb(20 184 166 / 0.4), rgb(20 184 166 / 0.1))"
                            }}
                            initial={{ scaleX: 0, opacity: 0 }}
                            animate={{ scaleX: 1, opacity: 1 }}
                            transition={{ delay: 3.5, duration: 1, ease: "easeOut" }}
                        />
                        <motion.div
                            className="absolute left-10 top-1/2 w-20 h-px"
                            style={{
                                background: "linear-gradient(to left, transparent, rgb(139 92 246 / 0.3), rgb(139 92 246 / 0.1))"
                            }}
                            initial={{ scaleX: 0, opacity: 0 }}
                            animate={{ scaleX: 1, opacity: 1 }}
                            transition={{ delay: 4, duration: 1.2, ease: "easeOut" }}
                        />
                        <motion.div
                            className="absolute left-14 top-2/3 w-12 h-px"
                            style={{
                                background: "linear-gradient(to left, transparent, rgb(6 182 212 / 0.35), rgb(6 182 212 / 0.1))"
                            }}
                            initial={{ scaleX: 0, opacity: 0 }}
                            animate={{ scaleX: 1, opacity: 1 }}
                            transition={{ delay: 4.5, duration: 0.8, ease: "easeOut" }}
                        />
                    </div>

                </motion.div>
            </div>
        </div>
    );
}
