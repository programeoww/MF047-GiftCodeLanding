/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        'sans': ['AlternateGothic', 'sans-serif'],
      },
      colors: {
        primary: '#ffbd59',
        secondary: '#2c4f4f',
      }
    }
  },
  plugins: [],
}