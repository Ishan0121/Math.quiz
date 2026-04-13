/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary-color)",
        secondary: "var(--secondary-color)",
        accent: "var(--accent-color)",
        background: "var(--bg-color)",
        text: "var(--text-color)"
      },
      borderRadius: {
        'theme': "var(--border-radius)",
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'], // standard
        playful: ['"Comic Sans MS"', '"Fredoka One"', 'cursive'] 
      }
    },
  },
  plugins: [],
}
