import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    // Include packages if not transpiling
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#0070f3",
          secondary: "#00a8ff"
        }
      },
      animation: {
        'twinkle': 'twinkle 3s ease-in-out infinite',
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: '0' },
          '50%': { opacity: '1' },
        },
      },
      fontFamily: {
        'pixelated': ['monospace', 'ui-monospace', 'SFMono-Regular'],
      },
    },
  },
  plugins: [],
} satisfies Config;