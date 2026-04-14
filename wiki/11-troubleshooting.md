# Troubleshooting

Common issues and their solutions.

## Quick Index

- [Build Failures](#build-failures)
- [Theme / Dark Mode](#theme--dark-mode-not-working)
- [Contact Form Not Sending](#contact-form-not-sending)
- [Tests Failing](#tests-failing)
- [Animation Issues](#animation-issues)
- [Dependency Issues](#dependency-issues)
- [Pre-Commit Hook Failures](#pre-commit-hook-failures)
- [Rate Limiter Behavior](#rate-limiter-behavior)

## Build Failures

### ESLint errors on config files

**Symptom:** `@typescript-eslint/no-require-imports` error in `jest.config.js`, `tailwind.config.ts`, or `postcss.config.js`.

**Fix:** These files are already covered by an ESLint override in `.eslintrc.json` that disables `no-require-imports`. If the error persists, verify the override entry:

```json
"overrides": [
  {
    "files": ["jest.config.js", "tailwind.config.ts", "postcss.config.js"],
    "rules": { "@typescript-eslint/no-require-imports": "off" }
  }
]
```

### TypeScript strict mode errors

**Symptom:** `Type 'X' is not assignable to type 'Y'` or `Object is possibly 'undefined'`.

**Fix:** The project uses strict TypeScript. Never use `any` (enforced by ESLint `no-explicit-any: error`). Use proper type narrowing, optional chaining, or Zod's `z.infer<typeof schema>` to derive types.

### Missing environment variables at build time

**Symptom:** Build fails with Zod validation error from `lib/env.ts`.

**Fix:** The project uses lazy env validation via `getEnv()` at runtime, not import time. If a build-time check is failing, pass dummy values:

```bash
RESEND_API_KEY=re_test_dummy npm run build
```

The `/quality-gate` skill uses this pattern automatically.

## Theme / Dark Mode Not Working

**Symptom:** Theme flickers on load, dark mode does not apply, or hydration mismatch warnings.

**Causes and fixes:**

1. **Missing `suppressHydrationWarning`** -- The root `<html>` element in `app/layout.tsx` must have `suppressHydrationWarning` for next-themes compatibility. Do not remove it.

2. **Wrong class strategy** -- Dark mode uses the `class` strategy via next-themes. The theme provider sets the class on `<html>`. Colors switch via CSS custom properties on `:root` and `.dark`, not via Tailwind `dark:` prefixes on `zavala-*` tokens.

3. **localStorage key** -- The theme is stored under the key `zavala-theme`. If theme state is stale, clear `localStorage.getItem('zavala-theme')` in the browser console.

4. **Hydration guard missing** -- Client components that read browser state (like theme) must use the mounted guard pattern:

```tsx
const [mounted, setMounted] = useState(false)
useEffect(() => setMounted(true), [])
if (!mounted) return null // or skeleton
```

## Contact Form Not Sending

**Symptom:** Form submits but email never arrives, or API returns an error.

| Check                 | Details                                                                                                           |
| --------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `RESEND_API_KEY` set? | Must be set in Vercel dashboard (or `.env.local` for dev)                                                         |
| Test key prefix?      | Keys starting with `re_test_` do not send real emails. Use a production key for live delivery.                    |
| `CONTACT_EMAIL` set?  | This is the delivery destination. Required.                                                                       |
| Rate limited?         | The contact API enforces rate limiting. Check server logs for 429 responses.                                      |
| Honeypot triggered?   | The form includes a hidden honeypot field. Bots filling it get silently rejected.                                 |
| Timing check?         | Client-side only: submissions faster than 2s after page load are silently rejected. Direct API calls bypass this. |

## Tests Failing

### framer-motion mock errors

**Symptom:** `TypeError: Cannot read properties of undefined` or `motion.div is not a function`.

**Fix:** framer-motion must be mocked. The codebase uses 3 strategies depending on the component:

1. **Data attributes** (for animation config testing) -- see `FadeInView.test.tsx`
2. **Minimal passthrough** (for behavior testing) -- see `ContactForm.test.tsx`
3. **Mock useInView** (for scroll-triggered components) -- see `DecipherText.test.tsx`

Always also mock `useReducedMotion`:

```typescript
const mockUseReducedMotion = jest.fn(() => false)
jest.mock('@/hooks/useReducedMotion', () => ({
  useReducedMotion: () => mockUseReducedMotion(),
}))
```

### Wrong jest environment

**Symptom:** `ReferenceError: Request is not defined` or `document is not defined` in API tests.

**Fix:** API route tests need the Node environment. Add this docblock as the very first line:

```typescript
/** @jest-environment node */
```

Component tests use the default `jest-environment-jsdom` and do not need a docblock.

### Environment variables in tests

**Symptom:** Zod validation error when calling `getEnv()` in tests.

**Fix:** `jest.setup.js` injects dummy values for `RESEND_API_KEY`, `CONTACT_EMAIL`, and `FROM_EMAIL`. If your test needs different values, mock them per test. Do not modify `jest.setup.js` for one-off cases.

## Animation Issues

**Symptom:** Animations do not play, or content is invisible until scroll.

| Check                      | Details                                                                                                            |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `useReducedMotion`         | All animations must call `useReducedMotion()` and provide a static fallback when it returns `true`                 |
| `prefers-reduced-motion`   | OS-level setting. When enabled, animations should skip or simplify. Test by toggling in OS accessibility settings. |
| `useInView` not triggering | framer-motion's `useInView` requires the element to be in the viewport. Check the `once` and `amount` options.     |

## Dependency Issues

### `npm ci` vs `npm install`

- Use `npm ci` for clean installs (CI, fresh clones). It respects `package-lock.json` exactly.
- Use `npm install` when adding or updating packages.
- Vercel uses `npm install` by default (configured in `vercel.json`).

### `sharp` on Windows

**Symptom:** `sharp` module errors during build or image optimization.

**Fix:** Next.js uses `sharp` for image optimization. On Windows, it may need native binaries:

```bash
npm install sharp
```

If that fails, the Next.js build will fall back to the built-in image optimizer, which is slower but functional.

## Pre-Commit Hook Failures

**Symptom:** Commit is rejected by the pre-commit hook.

The pre-commit hook runs `npx lint-staged`, which executes:

- `eslint --fix` + `prettier --write` on `*.ts`, `*.tsx`, `*.js`, `*.jsx` files
- `prettier --write` on `*.json`, `*.css`, `*.md` files

**Common causes:**

1. **ESLint error that --fix cannot resolve** -- Check the error output. Common: `no-explicit-any`, unused variables (prefix with `_`), missing display names.
2. **Config file lint errors** -- `jest.config.js`, `tailwind.config.ts`, `postcss.config.js` need the ESLint override. See "Build Failures" above.
3. **Prettier conflicts** -- Run `npm run format` to fix all formatting, then re-stage and commit.

## Rate Limiter Behavior

**Symptom:** Rate limiting works in development but resets unpredictably in production.

**Explanation:** The default rate limiter is in-memory. On Vercel's serverless platform, each cold start gets a fresh instance, so limits reset between invocations.

**Fix for production:** Configure Upstash Redis for persistent rate limiting:

```
UPSTASH_REDIS_REST_URL=https://your-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token
```

Without these variables, the app falls back to in-memory limiting automatically. For local development, in-memory is fine.

Without Upstash env vars, the app uses in-memory rate limiting which resets on each server restart -- effectively no persistent limiting during local development.

## See Also

- [Deployment](09-deployment.md)
- [Testing Strategy](testing-strategy.md)
- [Security Posture](security-posture.md)
- [Quick Start](01-quick-start.md)

**Tags:** troubleshooting, debugging, errors, build, tests, theme, contact-form, rate-limiting
