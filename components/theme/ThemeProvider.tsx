// components/theme/ThemeProvider.tsx
"use client";

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
    theme: Theme;
    resolvedTheme: "light" | "dark";
    setTheme: (theme: Theme) => void;
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
        if (!root.classList.contains(resolved)) {
            root.classList.remove("light", "dark");
            root.classList.add(resolved);
        }
        root.style.colorScheme = resolved;
        setResolvedTheme(resolved);
    }, []);

    // Set theme function
    const setTheme = useCallback(
        (newTheme: Theme) => {
            const nextResolved = resolveTheme(newTheme);
            setThemeState(newTheme);
            if (typeof window !== "undefined") {
                localStorage.setItem("xandar-theme", newTheme);
            }
            applyTheme(nextResolved);
        },
        [applyTheme, resolveTheme]
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

    const contextValue = useMemo(
        () => ({ theme, resolvedTheme, setTheme }),
        [theme, resolvedTheme, setTheme]
    );

    return (
        <ThemeContext.Provider value={contextValue}>
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
