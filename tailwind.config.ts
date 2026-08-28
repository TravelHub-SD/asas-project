import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef7f4",
          100: "#d3ebe4",
          200: "#a8d7c9",
          300: "#74bda9",
          400: "#48a189",
          500: "#2f8570",
          600: "#236a5a",
          700: "#1d5449",
          800: "#19433c",
          900: "#153833",
        },
        sand: {
          50: "#faf8f4",
          100: "#f3eee4",
          200: "#e6dcc8",
          300: "#d4c3a2",
        },
        accent: {
          500: "#c98a1f",
          600: "#a97016",
        },
      },
      fontFamily: {
        sans: ["var(--font-arabic)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "72rem",
      },
    },
  },
  plugins: [],
};

export default config;
