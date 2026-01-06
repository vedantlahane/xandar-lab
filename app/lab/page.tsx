"use client";

import { Suspense, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthContext";
import { AuthForm } from "@/components/auth/AuthForm";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import {
    Code2,
    BookOpen,
    FlaskConical,
    FileText,
    Trophy,
    ArrowRight,
    Sparkles,
    LogOut,
    User,
    ChevronRight,
    Zap
} from "lucide-react";

const NAV_ITEMS = [
    {
        href: "/lab/practice",
        label: "Practice",
        description: "DSA problems & coding challenges",
        icon: Code2,
        gradient: "from-violet-500 to-purple-600",
        shadowColor: "shadow-violet-500/25",
        available: true,
    },
    {
        href: "/lab/hackathons",
        label: "Hackathons",
        description: "Track upcoming competitions",
        icon: Trophy,
        gradient: "from-amber-500 to-orange-600",
        shadowColor: "shadow-amber-500/25",
        available: true,
    },
    {
        href: "/lab/notes",
        label: "Notes",
        description: "Personal notes & learnings",
        icon: FileText,
        gradient: "from-cyan-500 to-blue-600",
        shadowColor: "shadow-cyan-500/25",
        available: true,
    },
    {
        href: "/lab/docs",
        label: "Docs",
        description: "Documentation & references",
        icon: BookOpen,
        gradient: "from-emerald-500 to-teal-600",
        shadowColor: "shadow-emerald-500/25",
        available: true,
    },
    {
        href: "/lab/experiments",
        label: "Experiments",
        description: "Personal projects & experiments",
        icon: FlaskConical,
        gradient: "from-pink-500 to-rose-600",
        shadowColor: "shadow-pink-500/25",
        available: true,
    },
];

function LabHomeContent() {
    const { user, logout, isAuthenticated, isLoading } = useAuth();
    const [showLogin, setShowLogin] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);

    useEffect(() => {
        if (searchParams.get("mode") === "login" && !isAuthenticated && !isLoading) {
            setShowLogin(true);
        }
    }, [searchParams, isAuthenticated, isLoading]);

    useEffect(() => {
        if (isAuthenticated && showLogin) {
            setShowLogin(false);
            router.push("/lab");
        }
    }, [isAuthenticated, showLogin, router]);

    const handleCancel = () => {
        setShowLogin(false);
        router.push("/lab");
    };

    const handleNavigation = (href: string) => {
        if (!isAuthenticated) {
            router.push("/lab?mode=login");
            return;
        }
        router.push(href);
    };

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-3"
                >
                    <div className="h-2 w-2 rounded-full bg-violet-500 animate-pulse" />
                    <div className="h-2 w-2 rounded-full bg-violet-500 animate-pulse delay-75" />
                    <div className="h-2 w-2 rounded-full bg-violet-500 animate-pulse delay-150" />
                </motion.div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 text-zinc-800 dark:bg-black dark:text-zinc-200 p-4 overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-32 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
            </div>

            <motion.div
                layout
                className={`relative w-full transition-all duration-500 ease-in-out ${showLogin ? "max-w-4xl" : "max-w-5xl"
                    }`}
            >
                <AnimatePresence mode="wait">
                    {showLogin && !isAuthenticated ? (
                        <motion.div
                            key="login"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="flex flex-col md:flex-row items-center gap-12"
                        >
                            {/* Left Column (Text) */}
                            <motion.div className="flex-1 text-center md:text-right space-y-4">
                                <div className="space-y-2">
                                    <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider">
                                        Authentication Required
                                    </p>
                                    <h1 className="text-3xl font-bold tracking-tighter bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                                        Xandar Lab
                                    </h1>
                                    <p className="text-sm text-zinc-400 max-w-xs mx-auto md:ml-auto md:mr-0">
                                        Enter your credentials to access all lab modules and features.
                                    </p>
                                </div>
                                <motion.div
                                    className="h-px w-32 mx-auto md:ml-auto md:mr-0 bg-gradient-to-r from-transparent via-zinc-500 to-transparent"
                                    animate={{ opacity: [0.3, 1, 0.3], scaleX: [0.8, 1.2, 0.8] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                />
                            </motion.div>

                            {/* Right Column (Form) */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex-1 w-full"
                            >
                                <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-xl">
                                    <AuthForm align="center" />
                                    <div className="mt-4 text-center">
                                        <button
                                            onClick={handleCancel}
                                            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                                        >
                                            ← Back to Lab
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="dashboard"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-8"
                        >
                            {/* Header */}
                            <div className="text-center space-y-4">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", delay: 0.1 }}
                                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-medium"
                                >
                                    <Sparkles className="h-3 w-3" />
                                    {isAuthenticated ? `Welcome back, ${user?.username}` : "System Ready"}
                                </motion.div>

                                <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
                                    <span className="bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-200 dark:from-zinc-100 dark:via-zinc-300 dark:to-zinc-100 bg-clip-text text-transparent">
                                        Xandar Lab
                                    </span>
                                </h1>

                                <p className="text-sm text-zinc-500 max-w-md mx-auto">
                                    Your personal development environment for coding practice, project experiments, and knowledge management.
                                </p>
                            </div>

                            {/* Navigation Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {NAV_ITEMS.map((item, index) => {
                                    const Icon = item.icon;
                                    const isHovered = hoveredCard === item.href;

                                    return (
                                        <motion.button
                                            key={item.href}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 + index * 0.05 }}
                                            onClick={() => handleNavigation(item.href)}
                                            onMouseEnter={() => setHoveredCard(item.href)}
                                            onMouseLeave={() => setHoveredCard(null)}
                                            className={`group relative p-6 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/60 transition-all duration-300 text-left overflow-hidden ${isHovered ? `shadow-lg ${item.shadowColor}` : ""
                                                }`}
                                        >
                                            {/* Gradient Background on Hover */}
                                            <motion.div
                                                className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                                            />

                                            <div className="relative space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div className={`p-2.5 rounded-xl bg-gradient-to-br ${item.gradient} shadow-lg ${item.shadowColor}`}>
                                                        <Icon className="h-5 w-5 text-white" />
                                                    </div>
                                                    <motion.div
                                                        initial={{ x: -10, opacity: 0 }}
                                                        animate={{ x: isHovered ? 0 : -10, opacity: isHovered ? 1 : 0 }}
                                                        className="flex items-center gap-1 text-xs text-muted-foreground"
                                                    >
                                                        {isAuthenticated ? "Open" : "Login required"}
                                                        <ChevronRight className="h-3 w-3" />
                                                    </motion.div>
                                                </div>

                                                <div className="space-y-1">
                                                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                                        {item.label}
                                                    </h3>
                                                    <p className="text-xs text-muted-foreground/80 line-clamp-2">
                                                        {item.description}
                                                    </p>
                                                </div>

                                                {!item.available && (
                                                    <span className="inline-flex items-center gap-1 text-[10px] text-amber-500 font-medium">
                                                        <Zap className="h-3 w-3" />
                                                        Coming Soon
                                                    </span>
                                                )}
                                            </div>
                                        </motion.button>
                                    );
                                })}
                            </div>

                            {/* Footer Actions */}
                            <div className="flex items-center justify-center gap-4">
                                {isAuthenticated ? (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={logout}
                                        className="gap-2 border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Sign Out
                                    </Button>
                                ) : (
                                    <Button
                                        size="sm"
                                        onClick={() => router.push("/lab?mode=login")}
                                        className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-violet-500/25"
                                    >
                                        <User className="h-4 w-4" />
                                        Sign In
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>

                            {/* Status Indicator */}
                            <div className="flex items-center justify-center gap-2 text-xs text-zinc-500">
                                <motion.div
                                    className="h-1.5 w-1.5 rounded-full bg-green-500"
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                                All systems operational
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}

export default function LabHome() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
                    <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-violet-500 animate-pulse" />
                        <div className="h-2 w-2 rounded-full bg-violet-500 animate-pulse" />
                        <div className="h-2 w-2 rounded-full bg-violet-500 animate-pulse" />
                    </div>
                </div>
            }
        >
            <LabHomeContent />
        </Suspense>
    );
}
