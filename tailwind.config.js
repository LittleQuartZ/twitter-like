/** @type {import('tailwindcss').Config} */
const withAnimation = require('animated-tailwindcss')

module.exports = withAnimation({
  content: ['./src/pages/**/*.tsx', './src/components/**/*.tsx'],
  theme: {
    extend: {
      keyframes: {
        slideUpAndFade: {
          '0%': { opacity: 0, transform: 'translateY(5px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        slideDownAndFade: {
          '0%': { opacity: 0, transform: 'translateY(-5px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        slideRightAndFade: {
          '0%': { opacity: 0, transform: 'translateX(-5px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        slideLeftAndFade: {
          '0%': { opacity: 0, transform: 'translateX(5px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
      },
      animation: {
        slideUpAndFade: 'slideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideDownAndFade:
          'slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideRightAndFade:
          'slideRightAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideLeftAndFade:
          'slideLeftAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [
    require('tailwindcss-radix')({
      variantPrefix: 'radix',
    }),
  ],
})
