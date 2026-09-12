// components/theme/ThemeProvider.tsx
"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
    theme: Theme;
    resolvedTheme: "light" | "dark";
    setTheme: (theme: Theme, origin?: { x: number; y: number }) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>("system");
    const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("dark");
    const [mounted, setMounted] = useState(false);

    // Get system preference
    const getSystemTheme = useCallback((): "light" | "dark" => {
        if (typeof window !== "undefined") {
            return window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light";
        }
        return "dark";
    }, []);

    // Resolve the actual theme to apply
    const resolveTheme = useCallback(
        (themeValue: Theme): "light" | "dark" => {
            if (themeValue === "system") {
                return getSystemTheme();
            }
            return themeValue;
        },
        [getSystemTheme]
    );

    // Apply theme to document
    const applyTheme = useCallback((resolved: "light" | "dark") => {
        const root = document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(resolved);
        setResolvedTheme(resolved);
    }, []);

    // Set theme function with origin-based planar spatial transition
    const setTheme = useCallback(
        (newTheme: Theme, origin?: { x: number; y: number }) => {
            const nextResolved = resolveTheme(newTheme);

            if (nextResolved === resolvedTheme && newTheme === theme) {
                return;
            }

            setThemeState(newTheme);
            if (typeof window !== "undefined") {
                localStorage.setItem("xandar-theme", newTheme);
            }

            const prefersReducedMotion =
                typeof window !== "undefined" &&
                window.matchMedia("(prefers-reduced-motion: reduce)").matches;

            // Use origin-based planar View Transition when supported and appropriate
            if (
                typeof document !== "undefined" &&
                "startViewTransition" in document &&
                !prefersReducedMotion &&
                nextResolved !== resolvedTheme
            ) {
                const originX = origin?.x ?? (typeof window !== "undefined" ? window.innerWidth - 48 : 0);
                const originY = origin?.y ?? (typeof window !== "undefined" ? window.innerHeight - 48 : 0);

                const transition = (
                    document as unknown as {
                        startViewTransition: (cb: () => void) => { ready: Promise<void> };
                    }
                ).startViewTransition(() => {
                    applyTheme(nextResolved);
                });

                transition.ready
                    .then(() => {
                        const maxDim = Math.max(window.innerWidth, window.innerHeight);
                        const R = Math.round(maxDim * 2.2);

                        // Animate incoming theme view with planar diamond sweep
                        document.documentElement.animate(
                            [
                                {
                                    clipPath: `polygon(${originX}px ${originY}px, ${originX}px ${originY}px, ${originX}px ${originY}px, ${originX}px ${originY}px)`,
                                    transform: "scale(1.008)",
                                    transformOrigin: `${originX}px ${originY}px`,
                                },
                                {
                                    clipPath: `polygon(${originX}px ${originY - R}px, ${originX + R}px ${originY}px, ${originX}px ${originY + R}px, ${originX - R}px ${originY}px)`,
                                    transform: "scale(1)",
                                    transformOrigin: `${originX}px ${originY}px`,
                                },
                            ],
                            {
                                duration: 620,
                                easing: "cubic-bezier(0.16, 1, 0.3, 1)",
                                pseudoElement: "::view-transition-new(root)",
                            }
                        );

                        // Animate outgoing theme view with subtle scale relaxation
                        document.documentElement.animate(
                            [
                                {
                                    transform: "scale(1)",
                                    opacity: 1,
                                    transformOrigin: `${originX}px ${originY}px`,
                                },
                                {
                                    transform: "scale(0.994)",
                                    opacity: 0.95,
                                    transformOrigin: `${originX}px ${originY}px`,
                                },
                            ],
                            {
                                duration: 620,
                                easing: "cubic-bezier(0.16, 1, 0.3, 1)",
                                pseudoElement: "::view-transition-old(root)",
                            }
                        );
                    })
                    .catch(() => {
                        applyTheme(nextResolved);
                    });
            } else {
                applyTheme(nextResolved);
            }
        },
        [applyTheme, resolveTheme, resolvedTheme, theme]
    );

    // Initialize on mount
    useEffect(() => {
        const stored = localStorage.getItem("xandar-theme") as Theme | null;
        const initialTheme = stored || "system";
        setThemeState(initialTheme);
        applyTheme(resolveTheme(initialTheme));
        setMounted(true);
    }, [applyTheme, resolveTheme]);

    // Listen for system preference changes
    useEffect(() => {
        if (!mounted) return;

        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

        const handleChange = () => {
            if (theme === "system") {
                applyTheme(getSystemTheme());
            }
        };

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, [theme, mounted, applyTheme, getSystemTheme]);

    // Prevent flash of wrong theme
    if (!mounted) {
        return null;
    }

    return (
        <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
