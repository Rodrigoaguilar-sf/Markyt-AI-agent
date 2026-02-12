/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#135bec',
          600: '#0f4dc7',
          700: '#0c3fa3',
          800: '#093180',
          900: '#07265d'
        }
      },
      animation: {
        bounce: 'bounce 1s infinite'
      },
      keyframes: {
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-0.5rem)' }
        }
      }
    }
  },
  plugins: []
};
