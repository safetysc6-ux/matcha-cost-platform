/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        matcha: {
          500: '#5E7C4E',
          600: '#49643A'
        }
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0,0,0,0.2)'
      }
    }
  },
  plugins: []
};
