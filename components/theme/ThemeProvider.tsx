// components/theme/ThemeProvider.tsx
"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

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
        root.classList.remove("light", "dark");
        root.classList.add(resolved);
        setResolvedTheme(resolved);
    }, []);

    // Set theme function
    const setTheme = useCallback(
        (newTheme: Theme) => {
            setThemeState(newTheme);
            localStorage.setItem("xandar-theme", newTheme);
            applyTheme(resolveTheme(newTheme));
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
