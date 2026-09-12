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
        // Trippy brutalism palette; existing token names preserve component APIs.
        bg: "#fff0fa",
        ink: "#171722",
        muted: "#62576d",
        panel: "#fffdf2",
        line: "#171722",
        forest: "#376b50",
        gold: "#d5fa55",
        danger: "#ae234b",
        info: "#3450ac",

        // Navy stage, cream cards, pink surfaces and acid-lime accents.
        night: "#222c49",
        "night-800": "#303958",
        "night-deep": "#171722",
        parchment: "#fffdf2",
        "parchment-2": "#f6d9ef",
        "parchment-edge": "#171722",
        sepia: "#171722",
        "sepia-muted": "#62576d",
        ember: "#bc2859",
        arcane: "#923cdb",
        "gold-bright": "#d5fa55"
      },
      fontFamily: {
        display: ["var(--font-display)", "Arial Black", "sans-serif"],
        body: ["var(--font-body)", "Arial", "sans-serif"]
      },
      boxShadow: {
        soft: "4px 4px 0 #171722",
        parchment: "6px 6px 0 #171722",
        seal: "3px 3px 0 #171722",
        glow: "4px 4px 0 #171722",
        "glow-lg": "6px 6px 0 #171722",
        carved: "2px 2px 0 #171722"
      },
      borderRadius: {
        lg: "0.25rem",
        xl: "0.375rem",
        "2xl": "0.5rem",
        "3xl": "0.75rem"
      }
    }
  },
  plugins: []
};

export default config;
