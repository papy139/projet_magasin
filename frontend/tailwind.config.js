/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2D6A4F',
          dark: '#1B4332',
          light: '#52B788',
        },
        accent: {
          DEFAULT: '#F4A261',
          dark: '#E76F51',
        },
        cream: '#FAFAF5',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '16px',
        '2xl': '20px',
      },
    },
  },
  plugins: [],
};
