/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blur: {
          bg: '#0A0A0F',
          purple: '#9B30FF',
          pink: '#FF2D78',
          cyan: '#00F5FF',
          surface: 'rgba(255, 255, 255, 0.05)',
        }
      },
      fontFamily: {
        display: ['Bebas Neue', 'sans-serif'],
        sans: ['Outfit', 'sans-serif'],
      },
      animation: {
        'glow-pulse': 'glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        glow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        }
      }
    },
  },
  plugins: [],
}
