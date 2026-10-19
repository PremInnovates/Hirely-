/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // WorkBridge brand palette
        primary: {
          50: '#eef0fd',
          100: '#dbe0fb',
          200: '#b6c1f7',
          300: '#8d9ef1',
          400: '#6478e9',
          500: '#4338CA', // core primary - deep indigo
          600: '#372eb0',
          700: '#2c258c',
          800: '#211c69',
          900: '#161347',
        },
        accent: {
          500: '#7C3AED', // violet secondary accent
          600: '#6D28D9',
        },
        surface: '#F8FAFC',
        ink: '#0F172A',
        success: '#16A34A',
        warning: '#D97706',
        danger: '#DC2626',
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        display: ['"Sora"', '"Inter"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
