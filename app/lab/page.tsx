"use client";

import { Suspense, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthContext";
import { AuthForm } from "@/components/auth/AuthForm";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";

// Smooth spring config for organic motion
const smoothSpring = {
    type: "spring" as const,
    stiffness: 100,
    damping: 20,
    mass: 0.8,
};

// Stagger animation variants - fade only, no y movement for calmer feel
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, filter: "blur(4px)" },
    visible: {
        opacity: 1,
        filter: "blur(0px)",
        transition: {
            duration: 0.6,
            ease: "easeOut" as const,
        },
    },
};

// Animated loading dots
function LoadingDots() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
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

// Smooth title reveal - slide up with blur fade
function AnimatedTitle({ text }: { text: string }) {
    return (
        <motion.h1
            initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1], // Smooth ease-out-expo
            }}
            className="text-4xl md:text-5xl font-bold tracking-tight"
        >
            {text}
        </motion.h1>
    );
}

function LabHomeContent() {
    const { user, logout, isAuthenticated, isLoading } = useAuth();
    const [showLogin, setShowLogin] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();

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

    if (isLoading) {
        return <LoadingDots />;
    }

    const titleText = isAuthenticated ? `Welcome, ${user?.username}` : "Xandar Lab";

    return (
        <div className="relative flex min-h-screen items-center justify-center bg-zinc-50 text-zinc-800 dark:bg-black dark:text-zinc-200 p-4 overflow-hidden">
            {/* Subtle noise texture overlay */}
            <div
                className="pointer-events-none fixed inset-0 opacity-[0.015] dark:opacity-[0.025]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
            />

            <motion.div
                layout
                transition={smoothSpring}
                className={`relative w-full ${showLogin ? "max-w-4xl" : "max-w-lg"}`}
            >
                <div className={`flex ${showLogin ? "flex-row items-center gap-12" : "flex-col items-center gap-6"}`}>

                    {/* Left Column (Text) */}
                    <motion.div
                        layout
                        transition={smoothSpring}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className={`flex flex-col ${showLogin ? "flex-1 items-end text-right" : "w-full items-center text-center"}`}
                    >
                        <div className="space-y-4 flex flex-col items-inherit">
                            {/* Animated Title */}
                            <AnimatedTitle text={titleText} />

                            {/* Description */}
                            <motion.div
                                variants={itemVariants}
                                className="flex flex-col gap-3 items-inherit"
                            >
                                <p className="text-base text-zinc-500 dark:text-zinc-400 max-w-sm leading-relaxed">
                                    {isAuthenticated
                                        ? "Access modules via the sidebar menu on the left. All systems are operational."
                                        : "Access modules via the sidebar menu on the left. Please sign in to continue."
                                    }
                                </p>

                                {/* Animated divider line */}
                                <motion.div
                                    className="h-px w-24 bg-gradient-to-r from-transparent via-zinc-400 dark:via-zinc-600 to-transparent"
                                    animate={{
                                        opacity: [0.3, 0.7, 0.3],
                                        scaleX: [0.95, 1.05, 0.95]
                                    }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                />
                            </motion.div>

                            {/* Logout Button (only when authenticated) */}
                            {isAuthenticated && (
                                <motion.div variants={itemVariants} className="pt-2 flex gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={logout}
                                        size="sm"
                                        className="text-destructive border-destructive/30 hover:bg-destructive hover:text-destructive-foreground transition-colors duration-200"
                                    >
                                        Logout
                                    </Button>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>

                    {/* Right Column (Sign In Button or Form) */}
                    <AnimatePresence mode="wait">
                        {!isAuthenticated && !showLogin && (
                            <motion.div
                                key="sign-in-button"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{
                                    duration: 0.4,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                                className="fixed right-8 top-1/2 -translate-y-1/2 z-30"
                            >
                                <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => router.push("/lab?mode=login")}
                                >
                                    Sign In
                                </Button>
                            </motion.div>
                        )}
                        {!isAuthenticated && showLogin && (
                            <motion.div
                                key="auth-form"
                                initial={{ opacity: 0, x: 20, filter: "blur(4px)" }}
                                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                                exit={{ opacity: 0, x: -20, filter: "blur(4px)" }}
                                transition={{
                                    duration: 0.4,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                                className="flex-1 w-full"
                            >
                                <AuthForm align="left" />
                                <div className="mt-4 pl-4 text-left">
                                    <button
                                        onClick={handleCancel}
                                        className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors duration-200"
                                    >
                                        ← Cancel
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>
            </motion.div>
        </div>
    );
}

export default function LabHome() {
    return (
        <Suspense fallback={<LoadingDots />}>
            <LabHomeContent />
        </Suspense>
    );
}
