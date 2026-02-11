/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./**/*.tsx"],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                surface: {
                    DEFAULT: "#0f0f14",
                    raised: "#16161d",
                    overlay: "#1e1e28",
                },
                accent: {
                    DEFAULT: "#6c63ff",
                    hover: "#8078ff",
                    muted: "rgba(108, 99, 255, 0.15)",
                },
                success: "#34d399",
                danger: "#f87171",
                muted: "#6b7280",
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
            },
        },
    },
    plugins: [],
}
