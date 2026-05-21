/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand Identity from Logo
        primary: {
          DEFAULT: '#0F172A', // Deep Slate (Backgrounds/Footer)
          light: '#334155',
        },
        secondary: {
          DEFAULT: '#0EA5E9', // Sky Blue (Buttons/Accents)
          hover: '#0284C7',
        },
        neutral: {
          DEFAULT: '#F8FAFC', // Off-white (Section backgrounds)
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'], // Industrial/Clean look
      }
    },
  },
  plugins: [],
}
