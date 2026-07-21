/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // THIS LINE IS CRITICAL for production!
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}