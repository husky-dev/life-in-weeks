/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme');

/**
 * Material UI breakpoints
 * xs, extra-small: 0px
 * sm, small: 600px
 * md, medium: 900px
 * lg, large: 1200px
 * xl, extra-large: 1536px
 */

module.exports = {
  content: ['./src/index.tsx', './src/components/**/*.{js,jsx,ts,tsx}', './src/pages/**/*.{js,jsx,ts,tsx}'],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        'black': '#000000',
        'white': '#ffffff',
        'carbon-gray': '#5C5B5D',
      },
      fontFamily: {
        // 'montserrat': ['Montserrat', ...defaultTheme.fontFamily.sans],
        // 'montserrat-bold': ['Montserrat-Bold', ...defaultTheme.fontFamily.sans],
        // 'montserrat-regular': ['Montserrat-Regular', ...defaultTheme.fontFamily.sans],
        // 'montserrat-medium': ['Montserrat-Medium', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [
    // require('@tailwindcss/line-clamp'),
  ],
};
