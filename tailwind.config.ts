import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

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
            // Theme-aware: light mode uses darker shades so accent text
            // meets WCAG AA contrast on white backgrounds.
            primary: {
              DEFAULT: 'var(--accent-primary)',
              // Fill color for solid buttons: white text on this passes AA
              // (4.5:1+) in BOTH themes. The DEFAULT shade is for text/icons.
              strong: '#2563eb',
            },
            secondary: 'var(--accent-secondary)',
            code: 'var(--accent-code)',
            warning: 'var(--accent-warning)',
            error: 'var(--accent-error)',
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
  plugins: [typography],
}
export default config
