/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Lato"', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        brand: {
          red: '#C8102E',
          dark: '#111111',
          slate: '#0F172A',
          muted: '#666666',
          cream: '#FDFBF7'
        }
      }
    },
  },
  plugins: [],
}
