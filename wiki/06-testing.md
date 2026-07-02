# Testing Guide

How to run, write, and maintain tests for the portfolio. For the full reference, see [../docs/TESTING.md](../docs/TESTING.md).

---

## Test Stack

| Layer            | Tool                         | Version     |
| ---------------- | ---------------------------- | ----------- |
| Unit / Component | Jest + React Testing Library | 29.7 / 16.3 |
| E2E              | Playwright                   | 1.42        |
| Coverage         | Jest built-in (Istanbul)     |             |
| Assertions       | `@testing-library/jest-dom`  |             |

---

## Running Tests

```bash
npm test                  # Run all unit tests
npm run test:watch        # Watch mode (re-run on save)
npm run test:coverage     # Generate coverage report
npm run test:e2e          # Playwright headless
npm run test:e2e:ui       # Playwright interactive UI
npm run test:e2e:headed   # Playwright with visible browser
npm run check             # type-check -> lint -> test -> build
```

---

## Coverage Thresholds

Defined in `jest.config.js`:

| Metric     | Threshold |
| ---------- | --------- |
| Branches   | 60%       |
| Functions  | 50%       |
| Lines      | 60%       |
| Statements | 60%       |

Coverage collects from `app/`, `components/`, and `lib/`, excluding `.d.ts`, `node_modules`, `.next`, and `coverage` directories.

---

## Writing a Component Test

Tests live in `__tests__/` directories next to their source. Pattern from `Navbar.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import Navbar from '../Navbar'

describe('Navbar', () => {
  it('renders the brand name', () => {
    render(<Navbar />)
    expect(screen.getByText('MZ')).toBeInTheDocument()
  })

  it('navigation links have correct href attributes', () => {
    render(<Navbar />)
    const homeLink = screen.getByText('Home').closest('a')
    expect(homeLink).toHaveAttribute('href', '/')
  })
})
```

Use `userEvent` for typing and keyboard interactions. `fireEvent.click` is acceptable for simple button clicks.

---

## Animation Mock Strategies

Animations are CSS-driven (no framer-motion). Two hooks need mocking in
animation tests.

### Strategy 1: Mock `@/hooks/useInView`

The custom IntersectionObserver hook returns a `[ref, isInView]` tuple.
Mock it to control visibility deterministically (jsdom has no
IntersectionObserver).

**Demonstrated in:** `FadeInView.test.tsx`, `DecipherText.test.tsx`

```tsx
jest.mock('@/hooks/useInView', () => ({
  useInView: jest.fn(),
}))
const mockUseInView = useInView as jest.MockedFunction<typeof useInView>
mockUseInView.mockReturnValue([{ current: null }, true]) // element is in view
```

### Strategy 2: Assert CSS animation classes and inline styles

Pure-CSS components (e.g. `HeroNameReveal`, a Server Component) need no
mocks at all — assert on the rendered markup: `animate-rise-in` classes,
`style.animationDelay` staggering, and `aria-hidden` on decorative spans.

**Demonstrated in:** `HeroNameReveal.test.tsx`

### Strategy 3: Mock `useReducedMotion`

**Always** mock this hook in animation tests, regardless of which other strategy you use. Make it controllable per test.

**Demonstrated in:** all animation test files

```tsx
const mockUseReducedMotion = jest.fn(() => false)
jest.mock('@/hooks/useReducedMotion', () => ({
  useReducedMotion: () => mockUseReducedMotion(),
}))
// In reduced-motion tests:
mockUseReducedMotion.mockReturnValue(true)
```

---

## API Route Test Pattern

API route tests require the Node environment because they use `NextRequest`/`NextResponse`. Add the docblock at the top of the file:

```ts
/** @jest-environment node */
```

Mock external dependencies (email, rate limiter) before imports so Jest hoists them. See `app/api/contact/__tests__/route.test.ts` for the full pattern, which covers validation errors (400), rate limiting (429), honeypot fake-success (200), email failure (500), and IP extraction.

---

## E2E Test Overview

Five spec files in `e2e/`, run against five Playwright browser profiles:

| Spec                   | Coverage                      |
| ---------------------- | ----------------------------- |
| `navigation.spec.ts`   | Page links, routing           |
| `contact-form.spec.ts` | Form submission flow          |
| `theme.spec.ts`        | Dark/light toggle persistence |
| `projects.spec.ts`     | Project listing and detail    |
| `mobile.spec.ts`       | Mobile menu, responsive       |

**Browser profiles** (from `playwright.config.ts`):

1. Desktop Chrome (Chromium)
2. Desktop Firefox
3. Desktop Safari (WebKit)
4. Mobile Chrome (Pixel 5)
5. Mobile Safari (iPhone 12)

Screenshots are captured on failure. Traces are collected on first retry.

---

## Using the Test Writer Agent

The `@test-writer` agent can generate tests that follow these patterns. Provide it with the component path and it will produce a test file co-located in `__tests__/` with the correct mocking strategy for useInView and useReducedMotion.

---

## See Also

- [../docs/TESTING.md](../docs/TESTING.md) -- full testing infrastructure reference
- [05-design-system.md](05-design-system.md) -- animation guidelines (useReducedMotion)
- [07-security.md](07-security.md) -- API route security tested via route.test.ts

**Tags:** testing, jest, react-testing-library, playwright, coverage, mocking, e2e
