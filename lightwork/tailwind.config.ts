import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/slices/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bone: "#F7F5F1", // page background
        surface: "#FFFFFF", // product card frames, form fields
        ink: "#111110", // text, primary buttons
        "ink-60": "#6B6862", // secondary text, prices on cards
        line: "#E4E0D8", // hairline borders and dividers
        wa: "#25D366", // WhatsApp glyph ONLY, never a background
        error: "#B3261E",
      },
      fontFamily: {
        display: ["var(--font-archivo)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      maxWidth: {
        content: "1360px",
      },
      spacing: {
        "4": "4px",
        "8": "8px",
        "12": "12px",
        "16": "16px",
        "24": "24px",
        "32": "32px",
        "48": "48px",
        "64": "64px",
        "96": "96px",
        "128": "128px",
      },
      borderRadius: {
        DEFAULT: "2px", // buttons + inputs
        none: "0",
      },
    },
  },
  plugins: [],
};
export default config;
