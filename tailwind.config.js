/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gan-blue': '#0a0e27',
        'gan-gold': '#ffd700',
        'gan-purple': '#667eea',
      }
    },
  },
  plugins: [],
}