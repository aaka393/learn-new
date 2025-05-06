/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      backgroundImage: {
        'grid-gray-900': 'radial-gradient(circle, rgb(17 24 39 / 0.15) 1px, transparent 1px)',
        'grid-white': 'radial-gradient(circle, rgb(255 255 255 / 0.1) 1px, transparent 1px)',
      },
      colors: {
        dark: {
          DEFAULT: '#1a1b1e',
          lighter: '#25262b',
          border: '#2c2e33',
        }
      }
    },
  },
  plugins: [],
};