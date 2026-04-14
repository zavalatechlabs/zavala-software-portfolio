import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./components/**/*.{js,ts,jsx,tsx,mdx}', './app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Custom Zavala color palette - uses CSS variables for light/dark mode
        zavala: {
          bg: {
            primary: 'var(--bg-primary)',
            surface: 'var(--bg-surface)',
            elevated: 'var(--bg-elevated)',
          },
          border: {
            subtle: 'var(--border-subtle)',
            DEFAULT: 'var(--border-default)',
            strong: 'var(--border-strong)',
          },
          text: {
            primary: 'var(--text-primary)',
            secondary: 'var(--text-secondary)',
            tertiary: 'var(--text-tertiary)',
            inverse: 'var(--text-inverse)',
          },
          accent: {
            primary: '#3b82f6',
            secondary: '#10b981',
            code: '#f97316',
            warning: '#f59e0b',
            error: '#ef4444',
          },
          terminal: {
            bg: 'var(--terminal-bg)',
            header: 'var(--terminal-header)',
            border: 'var(--terminal-border)',
            text: 'var(--terminal-text)',
            'text-muted': 'var(--terminal-text-muted)',
            'line-number': 'var(--terminal-line-number)',
          },
          footer: {
            bg: 'var(--footer-bg)',
            'terminal-section': 'var(--footer-terminal-section)',
            text: 'var(--footer-text)',
            'text-muted': 'var(--footer-text-muted)',
            heading: 'var(--footer-heading)',
            border: 'var(--footer-border)',
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
