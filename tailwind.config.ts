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
            primary: '#3b82f6',
            secondary: '#10b981',
            code: '#f97316',
            warning: '#f59e0b',
            error: '#ef4444',
            // Always-white foreground for text on solid accent backgrounds
            // (accent colors are theme-independent, so this is too)
            foreground: '#ffffff',
          },
          terminal: {
            bg: 'var(--terminal-bg)',
            header: 'var(--terminal-header)',
            border: 'var(--terminal-border)',
            text: 'var(--terminal-text)',
            'text-muted': 'var(--terminal-text-muted)',
            'line-number': 'var(--terminal-line-number)',
            // VS Code Dark+ syntax tokens — theme-independent by design
            syntax: {
              string: '#ce9178',
              keyword: '#569cd6',
              variable: '#9cdcfe',
              value: '#3b82f6',
            },
            // macOS traffic-light decorative controls
            control: {
              close: '#ff5f56',
              'close-hover': '#ff4d44',
              minimize: '#ffbd2e',
              'minimize-hover': '#ffab00',
              maximize: '#27c93f',
              'maximize-hover': '#1fb32f',
            },
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
