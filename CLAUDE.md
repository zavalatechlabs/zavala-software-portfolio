# Zavala Software Portfolio

Professional portfolio for Maximiliano Zavala. Every page is a first impression for recruiters,
hiring managers, and potential clients. The contact form is a conversion funnel.
Performance, accessibility, and code quality are skills being demonstrated, not just practiced.

## Key Directories

app/ (pages, layouts, API routes) | components/ (React components) | content/projects/ (MDX)
lib/ (utilities) | hooks/ (custom React hooks) | public/ (static assets) | docs/ (documentation)

## Commands

- Dev: `npm run dev` (http://localhost:3000)
- Build: `npm run build`
- Test: `npm test` | Coverage: `npm test -- --coverage`
- E2E: `npm run test:e2e`
- Lint: `npm run lint` | Format: `npm run format:check`
- Type check: `npm run type-check`
- Full check: `npm run check` (type-check -> lint -> test -> build)

## Code Style

- No `any` types. No `require()`. Unused vars prefixed with `_`.
- Prettier: no semicolons, single quotes, 100 char width, trailing commas (es5), LF.
- UI components use `clsx` for class merging. Other components use raw Tailwind strings. Both OK.
- Named exports for components (`export function ComponentName`).

## Architecture

- Server Components by default. Add `'use client'` only for state, effects, or browser APIs.
- Zod schemas = single source of truth. Derive types with `z.infer<>`.
- Lazy env validation: `getEnv()` from `lib/env.ts` at runtime, not import time.
- `next/dynamic` for heavy below-fold components (see Footer.tsx for pattern).
- Hydration guard for client components reading browser state:
  `const [mounted, setMounted] = useState(false); useEffect(() => setMounted(true), [])`
- Root `<html>` has `suppressHydrationWarning` for next-themes compatibility.
- JSON-LD structured data (Person, WebSite schemas) in layout.tsx. Do not remove.
- Fonts: Inter (sans) + JetBrains Mono (mono) via next/font/google.

## Content (MDX)

- Projects: `content/projects/*.mdx` with YAML frontmatter.
- Required: title, description, date (ISO), tags (array).
- Optional: image, github, demo, featured.
- Slugs must match `[a-z0-9-]` only.
- See @docs/SECURITY.md for input sanitization details.

## Design System

- Use `zavala-*` color tokens only. Never raw hex or default Tailwind colors.
- Dark mode: class-based via next-themes. Default: dark. Key: `zavala-theme`.
- Accents: primary (blue), secondary (green), code (orange), warning (amber), error (red).
- Focus: `focus-visible:ring-2 focus-visible:ring-zavala-accent-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-zavala-bg-primary focus-visible:outline-none`
- Responsive: mobile-first, `md:` primary breakpoint.
- Transitions: `duration-200` for hover/interactive.
- Shadows: `shadow-xl` for cards, `shadow-lg` for buttons (with color modifiers).
- Icons: lucide-react for standard; some components use inline SVGs.
- All animations MUST respect `prefers-reduced-motion` via `useReducedMotion` hook.
- See @docs/DESIGN_SYSTEM.md for full color palette and spacing patterns.

## Testing

- Co-locate in `__tests__/` next to source. Unit: `*.test.ts(x)`. E2E: `e2e/*.spec.ts`.
- Coverage thresholds: 25% branches, 35% functions, 40% lines/statements.
- API route tests: `/** @jest-environment node */` docblock at file top.
- framer-motion mocking (3 strategies -- read component source to choose):
  - `motion.*` elements -> mock motion with passthrough divs
  - `useInView` -> mock useInView specifically
  - Always mock `@/hooks/useReducedMotion`
- `userEvent` for text/keyboard; `fireEvent.click` OK for buttons.
- Lib tests import from `@jest/globals`; component tests use ambient globals.
- CI is disabled. Run `npm run check` before committing.
- See @docs/TESTING.md for full test infrastructure details.

## Git & Security

- Conventional commits: `fix:`, `feat:`, `refactor:`, `chore:`, `docs:`, `test:`
- Never force push to main. Pre-commit: lint-staged (ESLint + Prettier).
- Never commit .env files or API keys.
- Contact API security: Zod -> honeypot -> timing check -> rate limit -> CRLF sanitization.
