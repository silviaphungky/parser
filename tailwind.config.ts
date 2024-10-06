import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      textColor: {
        'red-500': '#E11711',
      },
      border: {
        'red-500': '#E11711',
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: '#EA454C',
        light: '#F8F8F8',
        soft: '#F5F7FA',
        'gray-200': '#E6EFF5',
        dark: '#3B4752',
      },
      fontFamily: {
        poppins: ['var(--font-poppins)'],
        barlow: ['var(--font-barlow)'],
      },
    },
  },
  plugins: [],
}
export default config
