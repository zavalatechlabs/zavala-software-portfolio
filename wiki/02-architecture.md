# Architecture

Technical stack, design decisions, and project structure for the Zavala Software Portfolio.

## Tech Stack

| Layer         | Technology                           | Version        | Purpose                                           |
| ------------- | ------------------------------------ | -------------- | ------------------------------------------------- |
| Framework     | Next.js (App Router)                 | ^15.5          | SSR/SSG, file-based routing, API routes           |
| UI            | React                                | ^19.2          | Component model                                   |
| Language      | TypeScript (strict)                  | ~5.8           | Type safety, compile-time checks                  |
| Styling       | Tailwind CSS                         | ^3.4           | Utility-first CSS with custom `zavala-*` tokens   |
| Animation     | Framer Motion                        | ^11.0          | GPU-accelerated declarative animations            |
| Content       | next-mdx-remote + gray-matter        | ^6.0 / ^4.0    | MDX rendering, frontmatter parsing                |
| Validation    | Zod                                  | ^4.3           | Runtime schema validation (env, forms, content)   |
| Email         | Resend                               | ^3.2           | Contact form delivery                             |
| Icons         | lucide-react                         | ^0.563         | SVG icon library                                  |
| Theme         | next-themes                          | ^0.4           | Class-based dark/light mode                       |
| Rate Limiting | @upstash/ratelimit + @upstash/redis  | ^2.0 / ^1.37   | Distributed rate limiting with in-memory fallback |
| Testing       | Jest + RTL + Playwright              | 29 / 16 / 1.42 | Unit, component, and E2E tests                    |
| Dev Tools     | ESLint, Prettier, Husky, lint-staged | --             | Code quality and formatting                       |

## Key Architecture Decisions

### Server Components by Default

All components are React Server Components unless they need state, effects, or browser APIs. Only then add `'use client'`. This keeps the client JavaScript bundle small and improves initial page load.

### Zod as Single Source of Truth

Zod schemas define the shape of data at three boundaries:

1. **Environment variables** -- `lib/env.ts` validates `RESEND_API_KEY`, `CONTACT_EMAIL`, Upstash credentials at runtime via `getEnv()`
2. **Contact form input** -- `lib/validation.ts` validates name, email, message server-side
3. **MDX frontmatter** -- `lib/projects.ts` validates every project file at build time via `projectMetadataSchema`

TypeScript types are derived with `z.infer<>`, never hand-written.

### Lazy Environment Validation

`getEnv()` in `lib/env.ts` validates on first call, not at import time. This allows Next.js to statically generate pages that transitively import the module without requiring every env var at build time. The validation only fires when server code (e.g., the contact API route) actually needs the values.

### Dynamic Imports for Heavy Components

`next/dynamic` loads below-fold components (like the Footer terminal window) lazily. See `Footer.tsx` for the pattern.

### Hydration Safety

Client components that read browser state use a mounted guard:

```tsx
const [mounted, setMounted] = useState(false)
useEffect(() => setMounted(true), [])
```

The root `<html>` tag has `suppressHydrationWarning` for next-themes compatibility.

### Motion Accessibility

All Framer Motion animations integrate `useReducedMotion` from `hooks/useReducedMotion.ts`, respecting the user's `prefers-reduced-motion` OS setting.

## Data Flow

```
content/projects/*.mdx
        |
        v
lib/projects.ts  (reads files, parses frontmatter with gray-matter, validates with Zod)
        |
        v
app/projects/page.tsx  (getAllProjects() -> sorted list)
app/projects/[slug]/page.tsx  (getProjectBySlug() -> single project)
app/page.tsx  (getFeaturedProjects() -> homepage cards)
        |
        v
components/ProjectCard.tsx  (renders each project as a card)
```

MDX content is rendered at request time via `next-mdx-remote`. Frontmatter is validated against `projectMetadataSchema` -- malformed files produce a clear Zod error at build time rather than silently propagating bad data.

## Project Structure

```
zavala-software-portfolio/
|-- app/                          Next.js 15 App Router
|   |-- layout.tsx                Root layout (metadata, JSON-LD, providers, fonts)
|   |-- page.tsx                  Homepage
|   |-- globals.css               Global styles + Tailwind imports
|   |-- error.tsx                 Error boundary
|   |-- sitemap.ts                Dynamic sitemap generation
|   |-- about/page.tsx            About page
|   |-- contact/page.tsx          Contact form page
|   |-- projects/page.tsx         Projects listing
|   |-- projects/[slug]/page.tsx  Dynamic project detail (SSG)
|   |-- api/contact/route.ts      POST endpoint (rate limit + Zod + honeypot + email)
|   |-- api/health/route.ts       GET health check endpoint
|
|-- components/                   React components
|   |-- Navbar.tsx                Navigation bar
|   |-- Footer.tsx                Footer with terminal window (dynamic import)
|   |-- ProjectCard.tsx           Project card for listings
|   |-- ThemeToggle.tsx           Dark/light mode toggle
|   |-- ThemeProvider.tsx         next-themes wrapper
|   |-- TerminalWindow.tsx        Decorative code window
|   |-- animations/               Framer Motion wrappers (FadeInView, DecipherText, HeroNameReveal)
|   |-- contact/                  ContactForm and related UI
|   |-- chat/                     AI chat widget (ChatWindow, FloatingButton)
|   |-- ui/                       Shared primitives (Button, etc.)
|   |-- __tests__/                Component test files
|
|-- content/projects/             MDX project files with YAML frontmatter
|
|-- lib/                          Server utilities
|   |-- projects.ts               MDX reader/parser (Zod-validated frontmatter)
|   |-- email.ts                  Resend email sender (CRLF-sanitized headers)
|   |-- env.ts                    Zod-validated server env vars (lazy)
|   |-- rate-limit.ts             Upstash Redis rate limiter with in-memory fallback
|   |-- validation.ts             Zod schemas for contact form
|   |-- utils.ts                  General utilities (clsx/tailwind-merge)
|   |-- __tests__/                Lib test files
|
|-- hooks/                        Custom React hooks
|   |-- useReducedMotion.ts       Respects prefers-reduced-motion
|
|-- public/                       Static assets
|   |-- images/projects/          SVG project placeholders
|   |-- resume.pdf                Downloadable resume
|   |-- icon-192.png / .svg        PWA icons (192x192)
|   |-- icon-512.png / .svg        PWA icons (512x512)
|
|-- docs/                         Internal documentation
|   |-- SECURITY.md               Security practices and threat model
|   |-- TESTING.md                Test infrastructure details
|   |-- DESIGN_SYSTEM.md          Color tokens, spacing, typography
|   |-- ANIMATION_PATTERNS.md     Animation component patterns
|   |-- DEPLOYMENT.md             Deployment procedures
|   |-- SEO.md                    SEO implementation details
|   |-- CODE_QUALITY.md           Code quality standards
|
|-- wiki/                         GitHub Wiki pages (this directory)
|
|-- e2e/                          Playwright E2E test specs
|
|-- .husky/pre-commit             Runs lint-staged on commit
|-- tailwind.config.ts            Custom zavala-* color tokens, fonts
|-- next.config.js                Security headers, image config
|-- jest.config.js                Jest config with coverage thresholds
|-- tsconfig.json                 Strict mode, path aliases (@/*)
|-- CLAUDE.md                     Project instructions for AI assistants
|-- ARCHITECTURE.md               Deep-dive architecture document
```

## Design System Summary

- Custom `zavala-*` color tokens only -- no raw hex or default Tailwind colors
- Dark mode default, class-based toggle via next-themes (storage key: `zavala-theme`)
- Accent palette: primary (blue), secondary (green), code (orange), warning (amber), error (red)
- Fonts: Inter (sans) + JetBrains Mono (mono) via `next/font/google`
- Mobile-first responsive design with `md:` as the primary breakpoint

See `../docs/DESIGN_SYSTEM.md` for the full color palette and spacing patterns.

## Adding a New Page

To add a new route (e.g., `/blog` or `/services`):

1. Create `app/new-page/page.tsx` -- Server Component by default
2. Export `metadata` with title and description (uses title.template from layout)
3. Wrap content in `<main id="main-content">` for the skip-to-content link
4. Use `zavala-*` tokens only for all styling
5. Add the route to `app/sitemap.ts` with appropriate priority and changeFrequency
6. Add a nav link in `components/Navbar.tsx` if it should appear in navigation
7. Optionally create `app/new-page/opengraph-image.tsx` for a custom social card
8. Run `/quality-gate` to verify the build

## See Also

- [Architecture Overview](architecture-overview.md) -- the existing wiki deep-dive
- [Quick Start](01-quick-start.md) -- get running locally
- [Security Posture](security-posture.md) -- security layers in detail
- [Performance](performance.md) -- performance analysis
- `../ARCHITECTURE.md` -- full architecture document

**Tags:** architecture, tech-stack, project-structure, design-decisions, server-components, zod, next-js
