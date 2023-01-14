/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        dark: '#303030'
      },
      fontFamily: {
        OpenSans: 'Open Sans, sans-serif'
      }
    }
  },
  plugins: [],
  darkMode: ['class', '[data-mode="dark"]']
}
