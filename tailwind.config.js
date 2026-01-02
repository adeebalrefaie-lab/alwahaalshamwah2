/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FFF8F0',
          100: '#F5EBE0',
          200: '#E8D5C4',
          300: '#DCC5AE',
          DEFAULT: '#FDF8E7',
        },
        brown: {
          50: '#E8DDD0',
          100: '#D4C4B0',
          200: '#C9A88A',
          300: '#B8926F',
          400: '#A67C52',
          500: '#8B6F47',
          600: '#6B5644',
          700: '#4A3F35',
          800: '#3A312A',
          900: '#2A2420',
        },
        coffee: '#4A3F35',
        bronze: '#8B6F47',
      },
    },
  },
  plugins: [],
};
