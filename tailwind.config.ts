import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#F6F4F0",
        ink: "#0B1220",
        muted: "#6B7280",
        surface: "#FFFFFF",
        stroke: "rgba(15, 23, 42, 0.10)",
        brand: {
          DEFAULT: "#1F5B6A",
          50: "#E7F3F6",
          100: "#CFE7EE",
          200: "#9FD0DD",
          300: "#6FB8CC",
          400: "#3FA1BC",
          500: "#2C869E",
          600: "#1F5B6A",
          700: "#174654",
          800: "#0F303D",
          900: "#081E28",
        },
        accent: {
          DEFAULT: "#D4B074",
          50: "#FBF6ED",
          100: "#F6EAD5",
          200: "#EDD4AA",
          300: "#E3BE80",
          400: "#DAB055",
          500: "#D4B074",
          600: "#B8924F",
          700: "#8F713D",
          800: "#66512B",
          900: "#3D311A",
        },
        night: {
          bg: "#0B1220",
          surface: "#0F1A2E",
          stroke: "rgba(226, 232, 240, 0.10)",
          text: "#E5E7EB",
          muted: "#94A3B8",
        },
      },
      boxShadow: {
        soft: "0 18px 45px rgba(2, 6, 23, 0.10)",
        glow: "0 0 0 6px rgba(31, 91, 106, 0.12)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
} satisfies Config;
