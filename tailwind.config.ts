import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-open-sans)', 'sans-serif'], // 正文用 Open Sans
        jost: ['var(--font-jost)', 'sans-serif'],       // 标题用 Jost
      },
      colors: {
        dao: {
          dark: '#131313',
          gold: '#ddba82',
        }
      }
    },
  },
  plugins: [],
};
export default config;