/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'bounce-slow': 'bounce 2s infinite',
      },
      boxShadow: {
        'glow': '0 0 15px rgba(129, 140, 248, 0.5)',
        'glow-dark': '0 0 15px rgba(167, 139, 250, 0.5)',
      },
    },
  },
  plugins: [],
};