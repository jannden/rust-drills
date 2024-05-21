import type { Config } from 'tailwindcss'
import colors from 'tailwindcss/colors'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontSize: {
      'xs': ['0.75rem', { lineHeight: '1rem' }],
      'sm': ['0.875rem', { lineHeight: '1.5rem' }],
      'base': ['1rem', { lineHeight: '1.5rem' }],
      'lg': ['1.125rem', { lineHeight: '2rem' }],
      'xl': ['1.25rem', { lineHeight: '2rem' }],
      '2xl': ['1.5rem', { lineHeight: '2.5rem' }],
    },
    extend: {
      spacing: {
        '100vw-100': 'calc(100vw - 100%)',
      },
      screens: {
        xs: '400px',
      },
      typography: {
        DEFAULT: {
          css: {
            'pre': {
              backgroundColor: colors.stone[50],
              padding: '0.3rem 0.6rem',
              fontFamily: 'var(--font-mono)',
            },
            'code': {
              backgroundColor: `${colors.stone[50]} !important`,
              padding: '0.1rem 0.25rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: '400 !important',
            },
            'code::before': {
              content: null,
            },
            'code::after': {
              content: null,
            },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography'), require('tailwindcss-animate')],
}
export default config
