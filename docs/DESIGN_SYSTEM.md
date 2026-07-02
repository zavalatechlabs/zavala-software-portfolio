# Design System Documentation

**Project:** Zavala Software Portfolio  
**Version:** 1.0  
**Last Updated:** 2026-02-08  
**Status:** Active

---

## Overview

This document defines the complete design system for the Zavala Software Portfolio. It establishes visual consistency, reusable patterns, and implementation standards for all UI components.

**Design Philosophy:** Minimal, modern, and deeply technical — a portfolio that feels like a polished developer tool with sophisticated interactions and clean aesthetics.

---

## Color Palette

### Dark Theme (Default)

#### Background Colors

```css
--bg-primary: #0a0a0a /* Main background - near-black */ --bg-surface: #1a1a1a
  /* Cards, elevated elements */ --bg-elevated: #242424 /* Hover states, modals */;
```

#### Border Colors

```css
--border-subtle: #2a2a2a /* Subtle dividers */ --border-default: #3a3a3a /* Standard borders */
  --border-strong: #4a4a4a /* Emphasized borders */;
```

#### Text Colors

```css
--text-primary: #f5f5f5 /* Primary content - near-white */ --text-secondary: #a3a3a3
  /* Secondary content - muted gray */ --text-tertiary: #737373 /* Tertiary content - subtle gray */
  --text-inverse: #0a0a0a /* Text on light backgrounds */;
```

#### Accent Colors

```css
--accent-primary: #3b82f6 /* Primary blue - text/icons on dark */ --accent-secondary: #10b981
  /* Green - success, hover effects */ --accent-code: #f97316 /* Orange - code, terminal prompts */
  --accent-warning: #f59e0b /* Amber - warnings */ --accent-error: #ef4444 /* Red - errors */
  /* Filled buttons use the theme-invariant strong shade so white text
   meets WCAG AA (4.5:1+) in BOTH themes: */ /* zavala-accent-primary-strong: #2563eb */;
```

#### Special Effects

```css
--glow-blue: rgba(59, 130, 246, 0.1) /* Subtle blue glow */ --glow-green: rgba(16, 185, 129, 0.1)
  /* Subtle green glow */ --shadow-sm: rgba(0, 0, 0, 0.3) /* Small shadow */
  --shadow-md: rgba(0, 0, 0, 0.5) /* Medium shadow */ --shadow-lg: rgba(0, 0, 0, 0.7)
  /* Large shadow */;
```

### Light Theme (Optional)

#### Background Colors

```css
--bg-primary: #ffffff /* Main background - white */ --bg-surface: #f5f5f5
  /* Cards, elevated elements */ --bg-elevated: #e5e5e5 /* Hover states, modals */;
```

#### Border Colors

```css
--border-subtle: #e5e5e5 /* Subtle dividers */ --border-default: #d4d4d4 /* Standard borders */
  --border-strong: #a3a3a3 /* Emphasized borders */;
```

#### Text Colors

```css
--text-primary: #0a0a0a /* Primary content - near-black */ --text-secondary: #525252
  /* Secondary content - dark gray */ --text-tertiary: #737373 /* Tertiary content - medium gray */
  --text-inverse: #ffffff /* Text on dark backgrounds */;
```

#### Accent Colors (Light Theme)

Accents are theme-aware CSS variables. Light mode uses darker shades so
accent-colored text meets WCAG AA on white backgrounds:

```css
--accent-primary: #2563eb; /* blue-600 */
--accent-secondary: #047857; /* emerald-700 */
--accent-code: #c2410c; /* orange-700 */
--accent-warning: #b45309; /* amber-700 */
--accent-error: #dc2626; /* red-600 */
```

### Tailwind Configuration

Tokens map to CSS variables so a single class is theme-aware (the variables
flip between `:root` and `.dark` in `app/globals.css`). This is the actual
`tailwind.config.ts` shape:

```typescript
import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        zavala: {
          bg: {
            primary: 'var(--bg-primary)',
            surface: 'var(--bg-surface)',
            elevated: 'var(--bg-elevated)',
          },
          border: {
            subtle: 'var(--border-subtle)',
            DEFAULT: 'var(--border-default)', // class: border-zavala-border
            strong: 'var(--border-strong)',
          },
          text: {
            primary: 'var(--text-primary)',
            secondary: 'var(--text-secondary)',
            tertiary: 'var(--text-tertiary)',
            inverse: 'var(--text-inverse)',
          },
          accent: {
            primary: {
              DEFAULT: 'var(--accent-primary)',
              strong: '#2563eb', // filled buttons: AA with white text in both themes
            },
            secondary: 'var(--accent-secondary)',
            code: 'var(--accent-code)',
            warning: 'var(--accent-warning)',
            error: 'var(--accent-error)',
          },
        },
      },
    },
  },
  plugins: [typography],
}

export default config
```

> Note: the border DEFAULT key generates `border-zavala-border` — there is
> no `border-zavala-border-default` class.

**Usage Example:**

```tsx
<div className="bg-zavala-bg-surface border border-zavala-border">
  <h2 className="text-zavala-text-primary">Heading</h2>
  <p className="text-zavala-text-secondary">Body text</p>
  <button className="bg-zavala-accent-primary">Click Me</button>
</div>
```

---

## Typography

### Font Families

#### Primary Font (Sans-Serif)

**Font:** Inter or SF Pro Display  
**Purpose:** Main content, headings, UI elements  
**Weights:** 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

**Installation (Inter via Google Fonts):**

```tsx
// app/layout.tsx
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
})
```

#### Monospace Font

**Font:** JetBrains Mono or Fira Code  
**Purpose:** Code snippets, terminal windows, tech stack, data structures  
**Weights:** 400 (regular), 500 (medium), 600 (semibold)

**Installation (JetBrains Mono via Google Fonts):**

```tsx
// app/layout.tsx
import { JetBrains_Mono } from 'next/font/google'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
})
```

### Tailwind Font Configuration

```typescript
// tailwind.config.ts
theme: {
  extend: {
    fontFamily: {
      sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      mono: ['var(--font-mono)', 'JetBrains Mono', 'Fira Code', 'monospace'],
    },
  },
}
```

### Type Scale

#### Hero Typography

```tsx
// Hero name (Homepage)
<h1 className="text-6xl md:text-8xl font-bold tracking-tight">
  {/* 96px desktop, 60px mobile */}
</h1>

// Hero tagline
<p className="text-xl md:text-2xl font-medium text-zavala-text-secondary">
  {/* 24px desktop, 20px mobile */}
</p>
```

#### Heading Scale

```tsx
// H1 - Section headings
<h1 className="text-3xl md:text-5xl font-bold tracking-tight">
  {/* 48px desktop, 30px mobile */}
</h1>

// H2 - Subsection headings
<h2 className="text-2xl md:text-3xl font-semibold">
  {/* 30px desktop, 24px mobile */}
</h2>

// H3 - Component headings
<h3 className="text-xl md:text-2xl font-semibold">
  {/* 24px desktop, 20px mobile */}
</h3>

// H4 - Small headings
<h4 className="text-lg font-medium">
  {/* 18px */}
</h4>
```

#### Body Typography

```tsx
// Large body text
<p className="text-lg leading-relaxed">
  {/* 18px, 1.75 line-height */}
</p>

// Regular body text
<p className="text-base leading-normal">
  {/* 16px, 1.5 line-height */}
</p>

// Small text
<p className="text-sm text-zavala-text-secondary">
  {/* 14px */}
</p>

// Extra small text (captions, labels)
<span className="text-xs text-zavala-text-tertiary">
  {/* 12px */}
</span>
```

#### Code Typography

```tsx
// Inline code
<code className="font-mono text-sm bg-zavala-bg-elevated px-2 py-1 rounded">
  {/* 14px monospace */}
</code>

// Code blocks
<pre className="font-mono text-sm bg-zavala-bg-surface p-4 rounded-lg overflow-x-auto">
  {/* 14px monospace */}
</pre>
```

### Font Properties

#### Line Heights

- **Tight:** `leading-tight` (1.25) — Hero text, large headings
- **Normal:** `leading-normal` (1.5) — Body text, paragraphs
- **Relaxed:** `leading-relaxed` (1.75) — Long-form content
- **Loose:** `leading-loose` (2) — Spaced content, lists

#### Letter Spacing

- **Tighter:** `tracking-tighter` (-0.05em) — Large display text
- **Tight:** `tracking-tight` (-0.025em) — Headings
- **Normal:** `tracking-normal` (0) — Body text
- **Wide:** `tracking-wide` (0.025em) — Small caps, labels

#### Font Weights

- **Regular:** `font-normal` (400) — Body text
- **Medium:** `font-medium` (500) — Emphasized text
- **Semibold:** `font-semibold` (600) — Subheadings, buttons
- **Bold:** `font-bold` (700) — Headings, strong emphasis

---

## Component Styles

### Button Variants

#### Primary Button

**Use Case:** Main CTAs, important actions

```tsx
<button
  className="
  px-6 py-3 
  bg-zavala-accent-primary 
  text-white font-semibold 
  rounded-lg 
  transition-all duration-200
  hover:bg-blue-600 
  hover:shadow-lg hover:shadow-zavala-accent-primary/20
  hover:-translate-y-0.5
  active:translate-y-0
  focus:outline-none focus:ring-2 focus:ring-zavala-accent-primary focus:ring-offset-2 focus:ring-offset-zavala-bg-primary
  disabled:opacity-50 disabled:cursor-not-allowed
"
>
  Primary Action
</button>
```

#### Secondary Button

**Use Case:** Alternative actions, less emphasis

```tsx
<button
  className="
  px-6 py-3 
  bg-transparent 
  text-zavala-accent-primary font-semibold 
  border-2 border-zavala-accent-primary 
  rounded-lg 
  transition-all duration-200
  hover:bg-zavala-accent-primary 
  hover:text-white
  hover:-translate-y-0.5
  active:translate-y-0
  focus:outline-none focus:ring-2 focus:ring-zavala-accent-primary focus:ring-offset-2 focus:ring-offset-zavala-bg-primary
  disabled:opacity-50 disabled:cursor-not-allowed
"
>
  Secondary Action
</button>
```

#### Ghost Button

**Use Case:** Subtle actions, navigation

```tsx
<button
  className="
  px-4 py-2 
  bg-transparent 
  text-zavala-text-secondary font-medium 
  rounded-lg 
  transition-all duration-200
  hover:bg-zavala-bg-elevated 
  hover:text-zavala-text-primary
  active:bg-zavala-bg-surface
  focus:outline-none focus:ring-2 focus:ring-zavala-border-strong focus:ring-offset-2 focus:ring-offset-zavala-bg-primary
"
>
  Ghost Action
</button>
```

#### Icon Button

**Use Case:** Toolbar actions, compact interfaces

```tsx
<button
  className="
  p-2 
  bg-transparent 
  text-zavala-text-secondary 
  rounded-lg 
  transition-all duration-200
  hover:bg-zavala-bg-elevated 
  hover:text-zavala-text-primary
  active:bg-zavala-bg-surface
  focus:outline-none focus:ring-2 focus:ring-zavala-border-strong focus:ring-offset-2 focus:ring-offset-zavala-bg-primary
"
>
  <IconComponent className="w-5 h-5" />
</button>
```

### Card Styles

#### Project Card

**Use Case:** Displaying projects in grid

```tsx
<article
  className="
  bg-zavala-bg-surface 
  border border-zavala-border 
  rounded-lg 
  overflow-hidden
  transition-all duration-200
  hover:border-zavala-accent-primary/50
  hover:shadow-xl hover:shadow-black/30
  hover:-translate-y-2
  group
"
>
  {/* Image */}
  <div className="relative aspect-video overflow-hidden bg-zavala-bg-elevated">
    <img
      src="/project-image.jpg"
      alt="Project"
      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
    />
  </div>

  {/* Content */}
  <div className="p-6">
    <h3 className="text-xl font-semibold mb-2 text-zavala-text-primary">Project Title</h3>
    <p className="text-zavala-text-secondary text-sm mb-4">
      Brief project description explaining what it does.
    </p>

    {/* Tech stack tags */}
    <div className="flex flex-wrap gap-2 mb-4">
      <span className="px-3 py-1 text-xs font-mono bg-zavala-bg-elevated border border-zavala-border rounded-full">
        React
      </span>
      <span className="px-3 py-1 text-xs font-mono bg-zavala-bg-elevated border border-zavala-border rounded-full">
        TypeScript
      </span>
    </div>

    {/* CTA */}
    <button className="text-zavala-accent-primary font-medium text-sm hover:underline">
      View Project →
    </button>
  </div>
</article>
```

#### Info Card

**Use Case:** "What I Do" sections, feature boxes

```tsx
<div
  className="
  bg-zavala-bg-surface 
  border border-zavala-border 
  rounded-lg 
  p-6
  transition-all duration-200
  hover:border-zavala-accent-secondary/50
  hover:shadow-lg hover:shadow-black/20
"
>
  {/* Icon */}
  <div className="w-12 h-12 bg-zavala-accent-secondary/10 rounded-lg flex items-center justify-center mb-4">
    <IconComponent className="w-6 h-6 text-zavala-accent-secondary" />
  </div>

  <h3 className="text-xl font-semibold mb-2 text-zavala-text-primary">Category Title</h3>
  <p className="text-zavala-text-secondary">Description of this category or service area.</p>
</div>
```

### Form Input Styles

#### Text Input

```tsx
<input
  type="text"
  className="
    w-full px-4 py-3
    bg-zavala-bg-surface 
    border border-zavala-border 
    rounded-lg
    text-zavala-text-primary
    placeholder:text-zavala-text-tertiary
    transition-all duration-200
    focus:outline-none 
    focus:border-zavala-accent-primary 
    focus:ring-2 focus:ring-zavala-accent-primary/20
    hover:border-zavala-border-strong
    disabled:opacity-50 disabled:cursor-not-allowed
  "
  placeholder="Enter text..."
/>
```

#### Textarea

```tsx
<textarea
  rows={4}
  className="
    w-full px-4 py-3
    bg-zavala-bg-surface 
    border border-zavala-border 
    rounded-lg
    text-zavala-text-primary
    placeholder:text-zavala-text-tertiary
    transition-all duration-200
    focus:outline-none 
    focus:border-zavala-accent-primary 
    focus:ring-2 focus:ring-zavala-accent-primary/20
    hover:border-zavala-border-strong
    disabled:opacity-50 disabled:cursor-not-allowed
    resize-none
  "
  placeholder="Enter message..."
/>
```

#### Label

```tsx
<label className="block text-sm font-medium text-zavala-text-secondary mb-2">Field Label</label>
```

#### Error State

```tsx
<input
  type="text"
  className="
    w-full px-4 py-3
    bg-zavala-bg-surface
    border-2 border-zavala-accent-error
    rounded-lg
    text-zavala-text-primary
    focus:outline-none
    focus:ring-2 focus:ring-zavala-accent-error/20
  "
/>
<p className="text-sm text-zavala-accent-error mt-1">
  Error message here
</p>
```

### Navigation Styles

#### Navbar

```tsx
<nav
  className="
  fixed top-0 left-0 right-0 z-50
  bg-zavala-bg-primary/80 
  backdrop-blur-lg 
  border-b border-zavala-border
"
>
  <div className="max-w-7xl mx-auto px-6 py-4">
    <div className="flex items-center justify-between">
      {/* Logo */}
      <a
        href="/"
        className="text-xl font-bold text-zavala-text-primary hover:text-zavala-accent-primary transition-colors"
      >
        MZ
      </a>

      {/* Nav links */}
      <div className="flex items-center gap-8">
        <a
          href="/about"
          className="text-zavala-text-secondary hover:text-zavala-text-primary transition-colors"
        >
          About
        </a>
        <a
          href="/projects"
          className="text-zavala-text-secondary hover:text-zavala-text-primary transition-colors"
        >
          Projects
        </a>
        <a
          href="/contact"
          className="text-zavala-text-secondary hover:text-zavala-text-primary transition-colors"
        >
          Contact
        </a>
      </div>

      {/* Theme toggle */}
      <button className="p-2 rounded-lg bg-zavala-bg-surface hover:bg-zavala-bg-elevated transition-colors">
        <IconMoon className="w-5 h-5" />
      </button>
    </div>
  </div>
</nav>
```

#### Footer

```tsx
<footer
  className="
  bg-zavala-bg-surface 
  border-t border-zavala-border 
  py-12
"
>
  <div className="max-w-7xl mx-auto px-6">
    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
      {/* Copyright */}
      <p className="text-zavala-text-tertiary text-sm">© 2026 Max Zavala. All rights reserved.</p>

      {/* Social links */}
      <div className="flex items-center gap-6">
        <a
          href="https://github.com"
          className="text-zavala-text-secondary hover:text-zavala-text-primary transition-colors"
        >
          <IconGitHub className="w-5 h-5" />
        </a>
        <a
          href="https://linkedin.com"
          className="text-zavala-text-secondary hover:text-zavala-text-primary transition-colors"
        >
          <IconLinkedIn className="w-5 h-5" />
        </a>
      </div>
    </div>
  </div>
</footer>
```

---

## Spacing Scale

### Tailwind Default Spacing

The portfolio uses Tailwind's default spacing scale (4px base unit):

```
spacing[0]  = 0px      spacing[7]  = 28px    spacing[20] = 80px
spacing[1]  = 4px      spacing[8]  = 32px    spacing[24] = 96px
spacing[2]  = 8px      spacing[9]  = 36px    spacing[28] = 112px
spacing[3]  = 12px     spacing[10] = 40px    spacing[32] = 128px
spacing[4]  = 16px     spacing[11] = 44px    spacing[36] = 144px
spacing[5]  = 20px     spacing[12] = 48px    spacing[40] = 160px
spacing[6]  = 24px     spacing[16] = 64px    spacing[48] = 192px
```

### Component Spacing Standards

#### Padding Standards

```tsx
// Small components (buttons, inputs)
className = 'px-4 py-2' // 16px horizontal, 8px vertical

// Medium components (cards, sections)
className = 'px-6 py-4' // 24px horizontal, 16px vertical

// Large components (hero sections, containers)
className = 'px-8 py-6' // 32px horizontal, 24px vertical
```

#### Margin/Gap Standards

```tsx
// Tight spacing (within components)
className = 'gap-2' // 8px

// Normal spacing (between elements)
className = 'gap-4' // 16px

// Loose spacing (between sections)
className = 'gap-8' // 32px

// Extra loose spacing (major sections)
className = 'gap-16' // 64px
```

#### Section Spacing

```tsx
// Section padding
<section className="py-16 md:py-24">
  {/* 64px mobile, 96px desktop */}
</section>

// Section gaps
<div className="space-y-12 md:space-y-16">
  {/* 48px mobile, 64px desktop between children */}
</div>
```

#### Container Max-Width

```tsx
// Standard container
<div className="max-w-7xl mx-auto px-6">
  {/* 1280px max width, 24px horizontal padding */}
</div>

// Narrow container (reading content)
<div className="max-w-4xl mx-auto px-6">
  {/* 896px max width */}
</div>

// Wide container
<div className="max-w-[1440px] mx-auto px-8">
  {/* 1440px max width, 32px horizontal padding */}
</div>
```

---

## Light/Dark Mode

### Theme Implementation

#### Default Theme

**Dark mode** is the default theme. Light mode is available as an opt-in alternative.

#### Theme Toggle UI

**Location:** Navbar (top-right corner)  
**Design:** Icon button (sun/moon icon)  
**Behavior:** Click to toggle between light and dark themes

```tsx
// ThemeToggle.tsx
'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="
        p-2 rounded-lg
        bg-zavala-bg-surface 
        hover:bg-zavala-bg-elevated
        transition-colors
      "
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-zavala-text-secondary" />
      ) : (
        <Moon className="w-5 h-5 text-zavala-text-secondary" />
      )}
    </button>
  )
}
```

#### Theme Provider Setup

```tsx
// app/providers.tsx
'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemesProvider>
  )
}
```

```tsx
// app/layout.tsx
import { Providers } from './providers'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

#### Tailwind Dark Mode Configuration

```typescript
// tailwind.config.ts
const config: Config = {
  darkMode: 'class', // Use class-based dark mode
  theme: {
    extend: {
      // Colors adapt automatically with dark: prefix
    },
  },
}
```

#### Theme-Aware Component Example

```tsx
<div
  className="
  bg-white dark:bg-zavala-bg-primary
  text-gray-900 dark:text-zavala-text-primary
  border-gray-200 dark:border-zavala-border
"
>
  Content adapts to theme
</div>
```

### Theme Persistence

- Theme choice is stored in `localStorage`
- Automatically restored on page load
- No flash of wrong theme (SSR-safe)

---

## Usage Guidelines

### Component Composition

Build complex components from base styles:

```tsx
// ✅ Good: Compose base styles
<button className="btn-primary">
  Submit
</button>

// ✅ Good: Extend base styles
<button className="btn-primary text-lg px-8">
  Large Submit
</button>

// ❌ Avoid: Inconsistent styling
<button className="bg-blue-500 p-3 rounded hover:bg-blue-600">
  Submit
</button>
```

### Responsive Design

Follow mobile-first approach:

```tsx
// ✅ Good: Mobile-first
<h1 className="text-3xl md:text-5xl lg:text-6xl">
  {/* 30px → 48px → 60px */}
</h1>

// ❌ Avoid: Desktop-first
<h1 className="text-6xl md:text-3xl">
  {/* Backwards */}
</h1>
```

### Accessibility

#### Focus States

All interactive elements must have visible focus states:

```tsx
<button className="focus:outline-none focus:ring-2 focus:ring-zavala-accent-primary focus:ring-offset-2">
  Accessible Button
</button>
```

#### Color Contrast

- Text on background: Minimum 4.5:1 ratio
- Large text (18px+): Minimum 3:1 ratio
- All accent colors meet WCAG AA standards

#### Semantic HTML

Use appropriate HTML elements:

```tsx
// ✅ Good
<nav>...</nav>
<main>...</main>
<footer>...</footer>
<button onClick={...}>Click Me</button>

// ❌ Avoid
<div onClick={...}>Click Me</div>
```

---

## Design Tokens Export

For design tools (Figma, Sketch):

```json
{
  "colors": {
    "background": {
      "primary": "#0a0a0a",
      "surface": "#1a1a1a",
      "elevated": "#242424"
    },
    "text": {
      "primary": "#f5f5f5",
      "secondary": "#a3a3a3",
      "tertiary": "#737373"
    },
    "accent": {
      "primary": "#3b82f6",
      "secondary": "#10b981",
      "code": "#f97316"
    }
  },
  "typography": {
    "fontFamily": {
      "sans": "Inter, system-ui, sans-serif",
      "mono": "JetBrains Mono, Fira Code, monospace"
    },
    "fontSize": {
      "hero": "96px",
      "h1": "48px",
      "h2": "30px",
      "h3": "24px",
      "body": "16px",
      "small": "14px"
    }
  },
  "spacing": {
    "xs": "8px",
    "sm": "16px",
    "md": "24px",
    "lg": "32px",
    "xl": "48px",
    "2xl": "64px"
  },
  "borderRadius": {
    "sm": "4px",
    "md": "8px",
    "lg": "12px",
    "full": "9999px"
  }
}
```

---

## References

- **Animation Patterns:** [`ANIMATION_PATTERNS.md`](./ANIMATION_PATTERNS.md) — Animation specifications and code examples
- **Tailwind CSS:** [tailwindcss.com](https://tailwindcss.com/docs)
- **Next.js Fonts:** [nextjs.org/docs/app/api-reference/components/font](https://nextjs.org/docs/app/api-reference/components/font)
- **next-themes:** [github.com/pacocoursey/next-themes](https://github.com/pacocoursey/next-themes)

---

**Document Status:** ✅ Complete  
**Next Steps:** Implement animation patterns (see `ANIMATION_PATTERNS.md`)
