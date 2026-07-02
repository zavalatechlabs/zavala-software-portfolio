# Design System

Reference for the visual language, component patterns, and theme architecture used across the portfolio. For the complete specification, see [../docs/DESIGN_SYSTEM.md](../docs/DESIGN_SYSTEM.md).

---

## Color Architecture

Colors are driven by CSS custom properties defined in `app/globals.css` and mapped to Tailwind utilities in `tailwind.config.ts` under the `zavala` namespace. Theme switching swaps the variable values; component code stays the same.

### Semantic Variables (Light / Dark)

| Token              | Light     | Dark      | Purpose                     |
| ------------------ | --------- | --------- | --------------------------- |
| `--bg-primary`     | `#ffffff` | `#0a0a0a` | Page background             |
| `--bg-surface`     | `#f5f5f5` | `#1a1a1a` | Cards, elevated panels      |
| `--bg-elevated`    | `#e5e5e5` | `#242424` | Hover states, modals        |
| `--border-subtle`  | `#e5e5e5` | `#2a2a2a` | Subtle dividers             |
| `--border-default` | `#d4d4d4` | `#3a3a3a` | Standard borders            |
| `--border-strong`  | `#a3a3a3` | `#4a4a4a` | Emphasized borders          |
| `--text-primary`   | `#0a0a0a` | `#f5f5f5` | Primary content             |
| `--text-secondary` | `#525252` | `#a3a3a3` | Secondary / muted content   |
| `--text-tertiary`  | `#737373` | `#737373` | Subtle labels               |
| `--text-inverse`   | `#ffffff` | `#0a0a0a` | Text on opposing background |

Terminal and footer each have their own variable sets (`--terminal-*`, `--footer-*`) following the same light/dark pattern. See `globals.css` for the full list.

### Accent Colors (Hardcoded Hex)

These do not change between themes.

| Token              | Hex       | Usage                       |
| ------------------ | --------- | --------------------------- |
| `accent-primary`   | `#3b82f6` | CTAs, links, focus rings    |
| `accent-secondary` | `#10b981` | Success states, hover glows |
| `accent-code`      | `#f97316` | Code highlights, terminal   |
| `accent-warning`   | `#f59e0b` | Warning indicators          |
| `accent-error`     | `#ef4444` | Error states, validation    |

Tailwind class example: `bg-zavala-accent-primary`, `text-zavala-accent-error`.

**Rule:** Never use raw hex or default Tailwind color names in components. Always use `zavala-*` tokens.

---

## Typography

Fonts are loaded via `next/font/google` in `app/layout.tsx` and exposed as CSS variables.

| Family         | Variable       | Fallbacks                                  | Usage                      |
| -------------- | -------------- | ------------------------------------------ | -------------------------- |
| Inter          | `--font-inter` | `system-ui`, `sans-serif`                  | Body text, headings, UI    |
| JetBrains Mono | `--font-mono`  | `JetBrains Mono`, `Fira Code`, `monospace` | Code, terminal, tech stack |

### Heading Scale (from `globals.css`)

| Element | Mobile          | Desktop                          |
| ------- | --------------- | -------------------------------- |
| `h1`    | `text-3xl` 30px | `text-5xl` 48px                  |
| `h2`    | `text-2xl` 24px | `text-3xl` 30px                  |
| `h3`    | `text-xl` 20px  | `text-2xl` 24px                  |
| `h4`    | `text-lg` 18px  | `text-lg` 18px (`font-semibold`) |

All headings use `font-bold tracking-tight`. Body paragraphs use `text-zavala-text-secondary leading-relaxed`.

---

## Component Patterns

### Button Component (`components/ui/Button.tsx`)

Three variants (`primary`, `secondary`, `ghost`) and three sizes (`sm`, `md`, `lg`), composed with `clsx`.

**Base styles:** `inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200`

| Variant     | Visual                                             |
| ----------- | -------------------------------------------------- |
| `primary`   | Solid blue background, white text, shadow on hover |
| `secondary` | Transparent with blue border, fills on hover       |
| `ghost`     | Transparent, subtle background on hover            |

All variants include `disabled:opacity-50 disabled:cursor-not-allowed` and hover lift (`hover:-translate-y-0.5 active:translate-y-0` for primary/secondary).

### Focus Ring Pattern

The standard focus ring used across all interactive elements:

```
focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zavala-bg-primary
```

- Primary/secondary buttons add `focus:ring-zavala-accent-primary`
- Ghost buttons use `focus:ring-zavala-border-strong`

The `focus-visible` variant from CLAUDE.md:

```
focus-visible:ring-2 focus-visible:ring-zavala-accent-primary/50
focus-visible:ring-offset-2 focus-visible:ring-offset-zavala-bg-primary
focus-visible:outline-none
```

---

## Animation Guidelines

Animations use **Framer Motion**. Every animated component must respect the user's motion preference.

### useReducedMotion Requirement

All animation components import `useReducedMotion` from `@/hooks/useReducedMotion`. When the hook returns `true`, the component either:

- Sets `initial` to the final visible state (opacity 1, no transform) and `transition.duration` to `0` (see `FadeInView`)
- Skips the animation entirely by short-circuiting the effect (see `DecipherText`)

A global CSS fallback in `globals.css` also zeroes out all `animation-duration` and `transition-duration` values under `@media (prefers-reduced-motion: reduce)`.

### Key Animation Components

| Component        | Technique                       | Reduced-motion behavior    |
| ---------------- | ------------------------------- | -------------------------- |
| `FadeInView`     | `motion.div` + `whileInView`    | Static state, duration 0   |
| `DecipherText`   | `useInView` + `setInterval`     | Skips scramble, shows text |
| `HeroNameReveal` | `motion.span` + stagger variant | Static variant (opacity 1) |

---

## Dark Mode Implementation

| Concern              | Detail                                                  |
| -------------------- | ------------------------------------------------------- |
| Library              | `next-themes`                                           |
| Strategy             | `attribute="class"` on `<html>`                         |
| Default theme        | `dark`                                                  |
| System preference    | Disabled (`enableSystem={false}`)                       |
| Storage key          | `zavala-theme` in `localStorage`                        |
| Hydration            | `suppressHydrationWarning` on root `<html>`             |
| Transition on change | Enabled (`disableTransitionOnChange={false}`)           |
| Color scheme meta    | `enableColorScheme={true}`                              |
| FOUC prevention      | next-themes inline script sets class before first paint |

The `ThemeProvider` wrapper lives at `components/ThemeProvider.tsx` and is rendered in `app/layout.tsx`.

---

## Responsive Patterns

- **Approach:** Mobile-first. Base styles target small screens; larger layouts use the `md:` breakpoint (768px).
- **Container:** `max-w-7xl mx-auto px-6` (1280px max, 24px horizontal padding).
- **Heading scale:** Every heading jumps one size at `md:` (see heading table above).

---

## Accessibility Highlights

- Skip-to-content link at top of `layout.tsx`
- Visible focus rings on all interactive elements
- WCAG AA color contrast (4.5:1 body text, 3:1 large text)
- Semantic HTML landmarks (`<nav>`, `<main>`, `<footer>`)
- `useReducedMotion` in every animation component

For the full accessibility audit, see [accessibility.md](accessibility.md).

## Performance Notes

- `next/font/google` for zero-CLS font loading
- `next/dynamic` for heavy below-fold components (Footer)
- CSS-variable-based theming avoids runtime style recalculation
- `@tailwindcss/typography` plugin for prose content

For the full performance audit, see [performance.md](performance.md).

## See Also

- [../docs/DESIGN_SYSTEM.md](../docs/DESIGN_SYSTEM.md) -- complete design specification
- [../docs/ANIMATION_PATTERNS.md](../docs/ANIMATION_PATTERNS.md) -- animation specs and code examples
- [accessibility.md](accessibility.md) -- accessibility audit
- [performance.md](performance.md) -- performance audit

**Tags:** design-system, colors, typography, dark-mode, tailwind, css-animations, accessibility, theming
