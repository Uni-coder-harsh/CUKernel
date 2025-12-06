import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#00629B", // IEEE Core Blue
          neon: "#00D4FF", // Glowing accent
          purple: "#7C3AED", // AI/Future accent
          dark: "#050505", // Deep background
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
        heading: ["var(--font-space)"], // Use this for titles
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'conic-gradient(from 180deg at 50% 50%, #00629B 0deg, #00D4FF 180deg, #7C3AED 360deg)',
      },
    },
  },
  plugins: [],
};
export default config;