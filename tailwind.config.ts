import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        // Original light UI tokens (kept for existing screens)
        bg: "#f8f5ee",
        ink: "#1f2421",
        muted: "#66706a",
        panel: "#fffdf7",
        line: "#ded7c8",
        forest: "#176b4d",
        gold: "#c8942c",
        danger: "#b33a3a",
        info: "#2f6db3",

        // Dark-fantasy "Chronicle" tokens
        night: "#14100a",
        "night-800": "#1d1710",
        "night-deep": "#0a0805",
        parchment: "#efe4c9",
        "parchment-2": "#e6d7b4",
        "parchment-edge": "#d1ba8c",
        sepia: "#2a2013",
        "sepia-muted": "#7c6b4b",
        ember: "#b4472f",
        arcane: "#6d5bb0",
        "gold-bright": "#e8bf6a"
      },
      fontFamily: {
        display: ["var(--font-display)", "Trajan Pro", "Georgia", "serif"],
        body: ["var(--font-body)", "Iowan Old Style", "Georgia", "serif"]
      },
      boxShadow: {
        soft: "0 10px 30px rgba(31, 36, 33, 0.08)",
        parchment:
          "0 18px 38px rgba(8, 6, 3, 0.55), 0 3px 8px rgba(8, 6, 3, 0.45)",
        seal: "0 8px 18px rgba(10, 8, 5, 0.6)",
        glow: "0 0 20px rgba(200, 148, 44, 0.35)",
        "glow-lg": "0 0 36px rgba(200, 148, 44, 0.5)",
        carved:
          "inset 0 1px 0 rgba(255, 249, 232, 0.8), inset 0 -3px 8px rgba(120, 96, 54, 0.22)"
      },
      borderRadius: {
        "2xl": "1.1rem",
        "3xl": "1.6rem"
      }
    }
  },
  plugins: []
};

export default config;
