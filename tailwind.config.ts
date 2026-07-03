import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
            },
            colors: {
                // CSS-variable-backed semantic palette
                bg: {
                    DEFAULT: 'var(--bg)',
                    elevated: 'var(--bg-elevated)',
                    surface: 'var(--surface)',
                    hover: 'var(--surface-hover)',
                },
                brand: {
                    DEFAULT: 'var(--accent)',
                    hover: 'var(--accent-hover)',
                    soft: 'var(--accent-soft)',
                    ring: 'var(--accent-ring)',
                },
                line: {
                    DEFAULT: 'var(--border)',
                    strong: 'var(--border-strong)',
                },
                ink: {
                    DEFAULT: 'var(--text)',
                    muted: 'var(--text-muted)',
                    faint: 'var(--text-faint)',
                },
            },
            boxShadow: {
                sm:   'var(--shadow-sm)',
                md:   'var(--shadow-md)',
                lift: 'var(--shadow-lift)',
            },
            borderRadius: {
                none: '0',
                sm: '4px',
                DEFAULT: '4px',
                md: '4px',
                lg: '4px',
                xl: '4px',
                '2xl': '4px',
                '3xl': '4px',
                full: '9999px',
            },
        },
    },
    plugins: [],
};

export default config;