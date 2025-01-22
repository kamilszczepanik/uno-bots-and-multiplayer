/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors'

export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: colors.green,
        background: 'var(--color-background)',
        text: 'var(--color-text)',
      },
    },
  },
  plugins: [],
}
