/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7ed321', // Vert lime principal
          dark: '#6bb91c',
          light: '#95e040'
        },
        dark: {
          DEFAULT: '#0a0a1f', // Bleu marine très foncé (background)
          card: '#3e4378',    // Violet/indigo (cartes)
          lighter: '#2d2f5c'  // Variante plus claire
        }
      },
      backgroundColor: {
        'dark-main': '#0a0a1f',
        'dark-card': '#3e4378',
      }
    },
  },
  plugins: [],
}
