import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          DEFAULT: "#F5EEDC",
          deep: "#EBE1C6",
          shadow: "#DDD0AD",
        },
        cream: "#FBF6E8",
        ink: {
          DEFAULT: "#1F1A10",
          soft: "#4A3F2A",
          muted: "#6B5D42",
        },
        gold: {
          DEFAULT: "#B8943D",
          deep: "#8C6F2C",
        },
        burgundy: {
          DEFAULT: "#6B2020",
          level: "#8C2F2F",
        },
        navy: {
          DEFAULT: "#0E2038",
          level: "#2B4A72",
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', "Georgia", "serif"],
        body: ['"EB Garamond"', "Georgia", "serif"],
        caps: ['"Cormorant SC"', "Georgia", "serif"],
      },
      maxWidth: {
        prose: "780px",
      },
    },
  },
  plugins: [],
};

export default config;
