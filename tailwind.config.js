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
  content: ['./public/*.html', './src/index.tsx', './src/components/**/*.{js,jsx,ts,tsx}', './src/pages/**/*.{js,jsx,ts,tsx}'],
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
        'bark-jungle-green': '#1E1E1E',
        'white': '#ffffff',
        'white-smoke': '#F5F5F5', // white background, rgb(245, 245, 245)
        'dove-gray': '#6C6C6C', // secondary, rgb(108, 108, 108)
        'carbon-gray': '#5C5B5D',
        'soft-peach': '#EEEEEE', // rgb(238, 238, 238)
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
