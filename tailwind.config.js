/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Blue colors from your logo
        'iphrd-blue': {
          50: '#e8f0f9',
          100: '#d1e1f3',
          200: '#a3c3e7',
          300: '#75a5db',
          400: '#4787cf',
          500: '#1A4D8C',     // Medium Blue
          600: '#002B5C',     // Dark Blue (Primary)
          700: '#002244',
          800: '#001a33',
          900: '#001122',
          DEFAULT: '#2E2F6F',
        },
        // Green accent from your logo
        'iphrd-green': {
          50: '#00721d',
          100: '#00721d',
          200: '#00721d',
          300: '#00721d',
          400: '#00721d',
          500: '#00721d',
          600: '#00721d',
          700: '#00721d',
          800: '#00721d',
          900: '#00721d',
          DEFAULT: '#00721d',
        },
      },
    },
  },
  plugins: [],
}