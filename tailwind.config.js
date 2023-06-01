/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primary: '#562AD0',
        secondary: '#261A65',
        teal: '#2AD8BF',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Staatliches', 'mono'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}