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
        bg: "#f8f5ee",
        ink: "#1f2421",
        muted: "#66706a",
        panel: "#fffdf7",
        line: "#ded7c8",
        forest: "#176b4d",
        gold: "#c8942c",
        danger: "#b33a3a",
        info: "#2f6db3"
      },
      boxShadow: {
        soft: "0 10px 30px rgba(31, 36, 33, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;

