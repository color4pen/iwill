import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#0070f3",
          secondary: "#00a8ff"
        }
      }
    },
  },
  plugins: [],
  // Prefix Tailwind classes to avoid conflicts with other frameworks/libraries
  prefix: "ui-", 
} satisfies Config;