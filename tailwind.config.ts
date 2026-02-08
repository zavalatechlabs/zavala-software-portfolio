import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Custom Zavala color palette
        zavala: {
          bg: {
            primary: '#0a0a0a',
            surface: '#1a1a1a',
            elevated: '#242424',
          },
          border: {
            subtle: '#2a2a2a',
            DEFAULT: '#3a3a3a',
            strong: '#4a4a4a',
          },
          text: {
            primary: '#f5f5f5',
            secondary: '#a3a3a3',
            tertiary: '#737373',
            inverse: '#0a0a0a',
          },
          accent: {
            primary: '#3b82f6',
            secondary: '#10b981',
            code: '#f97316',
            warning: '#f59e0b',
            error: '#ef4444',
          },
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
export default config
