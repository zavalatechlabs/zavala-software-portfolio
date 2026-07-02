# Testing Guide

This document covers the testing infrastructure and practices for the Zavala Software Portfolio project.

## Testing Stack

### Unit & Component Testing

- **Framework:** Jest
- **Library:** React Testing Library
- **Coverage:** Jest coverage reports

### End-to-End (E2E) Testing

- **Framework:** Playwright
- **Browsers:** Chromium, Firefox, WebKit
- **Mobile:** iPhone 12, Pixel 5

## Running Tests

### Unit Tests

```bash
# Run all unit tests
npm test

# Run tests in watch mode (development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### E2E Tests

```bash
# Run E2E tests (headless)
npm run test:e2e

# Run E2E tests with UI (debugging)
npm run test:e2e:ui

# Run E2E tests in headed mode (see browser)
npm run test:e2e:headed
```

### All Tests

```bash
# Run type checking, linting, and all tests
npm run type-check && npm run lint && npm test && npm run test:e2e
```

## Test Organization

### Directory Structure

```
zavala-software-portfolio/
├── components/
│   ├── __tests__/          # Component tests
│   │   └── Navbar.test.tsx
│   └── Navbar.tsx
├── lib/
│   ├── __tests__/          # Utility function tests
│   │   └── utils.test.ts
│   └── utils.ts
├── e2e/                    # E2E tests
│   └── navigation.spec.ts
├── jest.config.js          # Jest configuration
├── jest.setup.js           # Jest setup file
└── playwright.config.ts    # Playwright configuration
```

### Naming Conventions

- **Unit tests:** `*.test.ts` or `*.test.tsx`
- **E2E tests:** `*.spec.ts`
- **Test folders:** `__tests__/` (for unit tests)
- **E2E folder:** `e2e/` (at project root)

## Writing Tests

### Unit Test Example

```typescript
// components/__tests__/Button.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from '../Button'

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    await userEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### E2E Test Example

```typescript
// e2e/contact-form.spec.ts
import { test, expect } from '@playwright/test'

test('contact form submission', async ({ page }) => {
  await page.goto('/contact')

  await page.fill('[name="name"]', 'John Doe')
  await page.fill('[name="email"]', 'john@example.com')
  await page.fill('[name="message"]', 'Test message')

  await page.click('button[type="submit"]')

  await expect(page.locator('.success-message')).toBeVisible()
})
```

## Testing Best Practices

### Unit Tests

**Do:**

- Test component rendering
- Test user interactions (clicks, inputs)
- Test edge cases and error states
- Mock external dependencies
- Keep tests focused and isolated

**Don't:**

- Test implementation details
- Test third-party libraries
- Write tests that depend on other tests
- Use real API calls or database connections

### E2E Tests

**Do:**

- Test critical user flows
- Test across multiple browsers
- Test mobile responsive behavior
- Use data-testid for stable selectors
- Take screenshots on failure

**Don't:**

- Test every possible scenario (leave that to unit tests)
- Make tests dependent on external services
- Use flaky selectors (e.g., nth-child without context)
- Write overly long test scenarios

## Coverage Goals

### Target Coverage

```javascript
{
  branches: 60,
  functions: 50,
  lines: 60,
  statements: 60
}
```

These are the values enforced by `jest.config.js` — they sit a few points
below current coverage so regressions fail the gate. Raise them as coverage
grows.

```

```

### Viewing Coverage

```bash
# Generate coverage report
npm run test:coverage

# Open HTML report
open coverage/lcov-report/index.html  # macOS
xdg-open coverage/lcov-report/index.html  # Linux
start coverage/lcov-report/index.html  # Windows
```

### What to Cover

**High Priority:**

- Business logic in `/lib`
- Critical UI components
- Form validation
- Data transformations
- Error handling

**Lower Priority:**

- Simple presentational components
- Third-party integrations (mock instead)
- Configuration files
- Type definitions

## Debugging Tests

### Jest Debugging

```bash
# Run a single test file
npm test -- Navbar.test

# Run tests matching a pattern
npm test -- --testNamePattern="renders"

# Debug in VS Code
# Add breakpoint, then use "Jest: Debug" launch configuration
```

### Playwright Debugging

```bash
# Run with UI mode (best for debugging)
npm run test:e2e:ui

# Run in headed mode
npm run test:e2e:headed

# Debug a specific test
npx playwright test navigation.spec.ts --debug

# Show trace viewer for last run
npx playwright show-trace
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npm run type-check

      - name: Lint
        run: npm run lint

      - name: Unit tests
        run: npm test -- --coverage

      - name: E2E tests
        run: npm run test:e2e

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

## Common Issues

### Jest

**Issue:** "Cannot find module '@/...' from 'test.ts'"
**Fix:** Check `moduleNameMapper` in `jest.config.js`

**Issue:** "TextEncoder is not defined"
**Fix:** Add to `jest.setup.js`:

```javascript
import { TextEncoder, TextDecoder } from 'util'
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder
```

### Playwright

**Issue:** "Timeout 30000ms exceeded"
**Fix:** Increase timeout in `playwright.config.ts`:

```typescript
use: {
  actionTimeout: 10000,
}
```

**Issue:** "Browser not found"
**Fix:** Install browsers:

```bash
npx playwright install
```

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

**Last Updated:** 2026-02-08
