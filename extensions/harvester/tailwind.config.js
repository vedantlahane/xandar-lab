/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./**/*.tsx"],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                surface: {
                    DEFAULT: "#0a0a0f",
                    raised: "#12121a",
                    overlay: "#1a1a25",
                },
                harvest: {
                    DEFAULT: "#f59e0b",
                    hover: "#fbbf24",
                    muted: "rgba(245, 158, 11, 0.15)",
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
