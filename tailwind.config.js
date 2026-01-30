/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'lh-dark': '#050505',
        'lh-purple': '#bc13fe',
      },
    },
  },
  plugins: [],
}