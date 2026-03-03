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
        primary: "var(--bg-primary)",
        secondary: "var(--bg-secondary)",
        tertiary: "var(--bg-tertiary)",
        'text-primary': "var(--text-primary)",
        'text-secondary': "var(--text-secondary)",
        border: "var(--border)",
        'accent-blue': "var(--accent-blue)",
        'accent-purple': "var(--accent-purple)",
        'risk-low': "var(--risk-low)",
        'risk-medium': "var(--risk-medium)",
        'risk-high': "var(--risk-high)",
        'risk-critical': "var(--risk-critical)",
        'card-bg': "var(--card-bg)",
        'hover-bg': "var(--hover-bg)",
      },
    },
  },
  plugins: [],
};
export default config;
