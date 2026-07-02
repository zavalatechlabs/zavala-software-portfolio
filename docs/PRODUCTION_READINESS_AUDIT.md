# Production Readiness Audit

**Date:** 2026-07-02
**Scope:** Full repository — application code, tests, configuration, content, documentation
**Method:** 11 parallel specialist review passes (coding standards, dead code, security, testing,
runtime correctness, accessibility, performance, build/config, documentation, SEO/content, React
craft), each finding adversarially re-verified against the actual code, plus a full run of the
project's own quality gate (`type-check`, `lint`, `format:check`, `npm test -- --coverage`,
`npm run build`, `npm audit`).

---

## Executive Summary

**Verdict: Not production-ready.** The architecture is genuinely strong — a senior reviewer would
credit the `lib/` layer (Zod-first schemas with `z.infer`, lazy env validation, PII-redacting
logger, honeypot + rate-limit + CRLF-sanitization pipeline), full static prerendering, and error
boundaries. But the same reviewer would find that the site's **primary conversion funnel silently
loses messages in two independent ways**, three of five top-level pages are **de-indexed by a wrong
canonical tag**, project hero images **400 in production**, the E2E suite **tests a UI that does not
exist**, an **entire unshipped chat feature and unused UI-primitive library ride along as dead
code**, and the resume page ships **placeholder employers**. For a portfolio whose stated premise is
"code quality is a skill being demonstrated," the gap between the documented standards and the
shipped code is itself the headline finding: the repo fails its own Prettier gate on 29 files, CI is
disabled, and the docs describe shipped features as "future enhancements."

**Quality gate (measured):** type-check ✅ · lint ✅ · tests 214/214 ✅ · build ✅ (19 static pages)
· `format:check` ❌ 29 files · `npm audit` ❌ 9 vulnerabilities (4 high) · coverage ~48% lines with
entire directories at 0%.

---

## Critical Findings (verified)

### C1. Contact form reports success when the email was never sent

`lib/email.ts:88-105` — the Resend SDK (v3) does **not throw** on API errors; it returns
`{ data, error }`. The code awaits `resend.emails.send(...)`, never checks `emailResponse.error`,
logs `'Email sent successfully'` with `emailId: undefined`, and returns `success: true`. Any
API-level failure (invalid/revoked key, unverified sending domain, quota exhaustion) silently drops
the message while the user sees "Message sent."
**Fix:** check `emailResponse.error` and return `success: false` on it; alert/log at error level.

### C2. Client-side timing check silently discards legitimate messages

`components/contact/ContactForm.tsx:67-73` — submissions less than 2 s after mount get a **fake
success**: status set to `success`, form cleared, message never sent. A real user with browser
autofill (or returning to a pre-rendered tab) loses their message with no error and no retry path.
Meanwhile the check provides no bot protection (bots POST the API directly; the server has **no**
timing check, contradicting both CLAUDE.md and `docs/SECURITY.md`, which document it as a server
pipeline stage).
**Fix:** move timing enforcement server-side (submit a rendered-at token) or drop it; never fake
success to a human.

### C3. Root canonical de-indexes /about, /projects, and /contact

`app/layout.tsx:81-83` sets `alternates.canonical: baseUrl` in the **root layout**; `/about`,
`/projects`, `/contact` define no `alternates`, so they inherit it. Verified in the built HTML: all
three pages emit `<link rel="canonical" href="https://zavalatechlabs.com"/>`, telling search engines
they are duplicates of the homepage. Only `/projects/[slug]` overrides correctly. The same
inheritance leaks the homepage `og:title`/`og:url` onto /contact and /projects, and
`twitter.images: ['/opengraph-image.png']` points at a path that 404s (the generated route is
`/opengraph-image`).
**Fix:** remove `alternates` from the root layout; set per-page canonicals and OG blocks.

### C4. Homepage (including the LCP hero) is server-rendered invisible

`components/animations/HeroNameReveal.tsx` renders the `<h1>` with `initial="hidden"`
(`opacity: 0`) — the prerendered HTML ships invisible and first paint is gated on the full
framer-motion bundle downloading and hydrating. `useReducedMotion` also returns `false` on first
render, so even reduced-motion users get the hidden-then-animate flash. No JS (or a failed chunk) =
permanently blank hero. This hurts LCP, SEO rendering, and accessibility simultaneously.
**Fix:** render visible HTML and animate with CSS (or framer-motion's `whileInView`-style
progressive enhancement on top of visible content); honor reduced motion at SSR via media query.

### C5. Fabricated/placeholder content is live on a real-identity portfolio

- `app/about/page.tsx:60,189` — employers/education are placeholders: "Tech Innovations Inc.",
  "Tech University".
- Project frontmatter points at **foreign GitHub accounts**: `github.com/zavala/*` and
  `github.com/maxzavala/*`, while the site's canonical identity everywhere else is
  `github.com/zavalatechlabs`. "View on GitHub" sends recruiters to 404s or strangers.
- `content/projects/task-dashboard.mdx` and `task-management-dashboard.mdx` are the **same project
  published twice** (identical title "Task Management Dashboard", identical demo URL, conflicting
  dates/tags/featured flags) — both render on /projects and both are in the sitemap.
  **Fix:** replace placeholder employers with real history, fix or null the repo/demo links, delete
  one duplicate MDX (and its orphaned SVG).

---

## High-Severity Findings (verified)

### H1. Project hero images return 400 in production

`app/projects/[slug]/page.tsx:99` renders frontmatter images through `next/image`, every project
image is an SVG (`/images/projects/*.svg`), and `next.config.js` has **no `images` config** —
`dangerouslyAllowSVG` defaults to false, so the optimizer rejects SVG requests. Every project detail
hero is broken. The same SVGs are also declared as `og:image`/`twitter:image`, which social crawlers
won't render regardless.
**Fix:** use raster (PNG/WebP) project images (also fixes OG), or `unoptimized` for SVGs.

### H2. The E2E suite tests an application that does not exist

- `e2e/navigation.spec.ts` expects title `/Zavala Software Portfolio/` (actual:
  "Maximiliano Zavala - Full-Stack Developer & Software Engineer") and clicks an "About" nav link
  (the navbar has Home / **Resume** / Projects / Contact).
- `e2e/contact-form.spec.ts` asserts error strings that appear nowhere in the app and is
  structurally defeated by the 2-second timing check (C2) — fill-and-submit gets fake success.
- `playwright.config.ts` runs against `next dev`, not the production build.
  These tests have plainly never passed; they exist as ornamentation. This is the single most damaging
  thing a senior reviewer could find in a "quality-as-showcase" repo.
  **Fix:** rewrite E2E specs against the real UI, run them against `next build && next start`, and
  wire them into CI.

### H3. No quality gate actually runs

`.github/workflows/ci.yml` triggers on `workflow_dispatch` only (CI fully disabled), the husky
pre-commit runs lint-staged only (no tests, no type-check), `npm run check` uses
`--passWithNoTests`, and the tree **fails its own `format:check` on 29 files** (trailing whitespace
and non-canonical wrapping in `app/page.tsx`, `components/ui/*`, `hooks/useReducedMotion.ts`, etc.).
Nothing between a developer and `main` enforces the standards CLAUDE.md declares.
**Fix:** enable CI push/PR triggers, add `format:check` to `npm run check`, run
`npx prettier --write .` once, and drop `--passWithNoTests`.

### H4. Node/toolchain pinned to EOL versions

`.nvmrc` = `18` and CI uses Node 18 — EOL since April 2025 and no longer supported by Vercel builds,
so CI and production run different majors. `package.json` engines `>=18.17.0` even permits a version
`next@15.5.15` itself rejects (`^18.18.0 || >=20`). ESLint 8 (EOL Oct 2024) + legacy `.eslintrc` +
deprecated `next lint` (removed in Next 16) compound this. `@types/jest@30` is a major ahead of
`jest@29`, and `tsconfig` injects jest globals into **all** source via `types: ["jest", ...]`.
**Fix:** Node 20/22 via `node-version-file: .nvmrc`; migrate to ESLint 9 flat config + ESLint CLI;
align `@types/jest`; scope jest types to tests.

### H5. Dead code and repo clutter contradict the "everything is intentional" premise

Verified unreferenced:

- **Entire chat feature** — `components/chat/AIChat.tsx`, `ChatWindow.tsx`, `FloatingButton.tsx`:
  zero imports anywhere, no backing API route, 0% coverage.
- **UI primitives** — of `components/ui/*`, only `Card` is imported (once, `app/page.tsx`).
  `Button`, `Input`, `Textarea`, `Label` are dead; `ContactForm` hand-rolls duplicates of them.
- **`lib/utils.ts` (`cn()`)** — used by zero components; its only consumer is its own test; it is
  the sole reason `tailwind-merge` is a production dependency.
- **Unused devDependencies** — `@next/bundle-analyzer` (never wired into `next.config.js`), `sharp`.
- **Duplicate/orphaned assets** — duplicate task-dashboard MDX + SVG pair, `icon-192.svg`/
  `icon-512.svg` (PNGs are the referenced ones), `public/images/projects/.gitkeep` in a populated
  directory.
- **Root clutter** — `claude-code-team-guide.html`, `CLAUDE_CODE_CUSTOMIZATION_PROPOSAL.md`,
  `WIKI_PLAN.md`: internal planning artifacts in a public portfolio repo.
  **Fix:** delete (or finish and wire up) the chat feature; either adopt the ui/ primitives in
  ContactForm or delete them; delete `lib/utils.ts` + `tailwind-merge` or start using `cn()`; prune
  deps, duplicate content, and root artifacts.

### H6. `border-zavala-border-default` does not exist — 16 usages emit no CSS

Tailwind generates `border-zavala-border` (DEFAULT), `-subtle`, `-strong`; `-default` compiles to
nothing (verified by compiling a probe with the project config). 16 usages across
`app/about/page.tsx` (12×), `app/projects/page.tsx`, `app/error.tsx`, `app/not-found.tsx`,
`app/projects/[slug]/error.tsx` silently fall back to preflight's light-gray `#e5e7eb` — visibly
wrong borders in the default dark theme.
**Fix:** global replace with `border-zavala-border`.

### H7. WCAG AA contrast failures in the shipped palette

- Primary buttons: white on `#3b82f6` = **3.68:1** (needs 4.5:1) — every primary CTA including the
  contact submit button.
- `text-zavala-text-tertiary` `#737373` = **4.18:1** on `#0a0a0a` and **3.67:1** on `#1a1a1a`, used
  at 12–14 px for resume dates, skill headings, error digests.
- Accent tokens are theme-invariant, producing additional light-mode failures.
  Also: ProjectCard nests `<a>` inside `<Link>` (invalid HTML, double tab stops — the same
  button-in-anchor pattern recurs on every CTA), its hover-only quick links are invisible keyboard tab
  stops, and many interactive elements omit the design system's mandated focus-visible ring.
  **Fix:** darken filled-button blue to `#2563eb`+, bump dark tertiary to ≥`#8a8a8a`, flatten nested
  interactive elements, apply the focus ring pattern consistently.

### H8. Avoidable client-bundle weight on every page

Full `import { motion } from 'framer-motion'` ships ~35.8 KB gz in the shared initial chunks of
every page for trivial fades; `/contact` additionally ships the full Zod bundle (~25 KB gz) to
validate three fields. The Footer's `next/dynamic(TerminalWindow)` defers nothing (chunk is
preloaded on every page). ~60 KB gz of the ~145 KB first-load is avoidable.
**Fix:** `LazyMotion` + `m` with `domAnimation` (or CSS for the simple fades); replace client Zod
with native constraint validation; make TerminalWindow load on visibility.

### H9. Security docs describe a different application

`docs/SECURITY.md` lists the contact form, rate limiting, and honeypot as "Future Enhancement" /
"to be added" — all shipped. `ARCHITECTURE.md` claims "✅ CSRF Protection: Next.js API routes
include CSRF tokens" — **factually false** (no such mechanism exists in App Router or this code).
`docs/DEPLOYMENT.md` tells deployers to set only `RESEND_API_KEY` + `NEXT_PUBLIC_SITE_URL` — but
`lib/env.ts` **requires `CONTACT_EMAIL`** (first submission 500s) and the code reads
`NEXT_PUBLIC_BASE_URL`, not `SITE_URL`. `docs/TESTING.md` claims 70% coverage thresholds;
`jest.config.js` enforces 25/35/40/40; reality is ~48%. CLAUDE.md documents the security pipeline in
an order the code doesn't follow. `.env.example` documents `RATE_LIMIT_ENABLED`, which nothing
reads.
**Fix:** one documentation-truth pass; delete or rewrite stale docs (the newer `wiki/` pages are
largely accurate — the older `docs/` tier is the problem).

---

## Medium-Severity Findings (spot-verified)

**Security hardening**

- Rate limiter keys on the **first** `x-forwarded-for` entry (attacker-controllable behind any
  appending proxy/CDN; safe on bare Vercel only by platform accident). Prefer the platform-verified
  IP or rightmost untrusted entry.
- `lib/rate-limit.ts` reads `process.env` at import time, bypassing `getEnv()`'s Upstash URL/token
  pairing validation; in-memory Map never evicts keys (unbounded growth per instance); production
  silently degrades to per-instance limiting without Upstash vars (build log confirms the warning).
- `lib/email.ts` logs submitter name + email at info level (PII redaction list incomplete).
- JSON-LD injected via `dangerouslySetInnerHTML` without escaping `<` (low risk while content is
  static; still escape).
- `X-XSS-Protection: 1; mode=block` is deprecated guidance (modern: `0`).
- `npm audit`: 9 vulnerabilities (4 high — `ws` via `webpack-bundle-analyzer`; `postcss`), fixable
  via `npm audit fix`.

**Validation correctness**

- `.trim()` runs **after** `.min()` in `contactFormSchema` — a single-space name and 10-space
  message pass validation and produce an empty-name email (verified against installed Zod).
- Frontmatter `date` is `z.string()` — an unparseable date silently breaks sort order and crashes
  the **sitemap build** with a RangeError pointing nowhere near the offending MDX.
- Rate limiter counts requests before validation — 5 typo'd submissions lock a real user out for an
  hour.

**Testing honesty**

- `lib/projects.ts` — the core content pipeline including the security-relevant slug guard — has
  **0% coverage**. `lib/__tests__/email.test.ts` mocks Resend to always succeed and asserts nothing
  that can fail. Theme tests largely test their own mocks. Untested surface (ui/, Footer,
  ProjectCard, TerminalWindow, chat/) exceeds the tested surface. The 214-test count is padded with
  assertions that cannot fail.

**Standards drift (fully adversarially verified)**

- Default exports on `Navbar`, `Footer`, `TerminalWindow` violate the named-export rule.
- Unnecessary `'use client'` on `Footer`; raw hex colors in `TerminalWindow`; `duration-300` hovers
  vs the `duration-200` standard; `require()` in `tailwind.config.ts`.
- Two divergent project-card implementations (ProjectCard component vs hand-rolled card in
  `app/projects/page.tsx`, which also ignores project images and renders a placeholder block).
- `baseUrl` fallback expression duplicated in 5 files instead of one shared constant.

**Config**

- Playwright boots `next dev` (dev-only branches active; prod error UI untestable).
- `vercel.json` uses `npm install` (vs CI's `npm ci`); `.gitignore` misses `.env.production` /
  `.env.development` / `.env.test`; `tsconfig` lacks `noUncheckedIndexedAccess`; broken doc links
  (`docs/DESIGN_DIRECTION.md` ×4, `docs/RESEARCH.md`, `wiki/security-posture.md` ×6).

---

## What Is Genuinely Good

Credit where due — these would impress a senior panel:

- `lib/env.ts`: lazy, Zod-validated env with paired-variable refinement and `z.infer` types.
- The contact API's layered defenses (Zod with control-character regexes, honeypot with fake
  success, header-injection sanitization, Resend timeout guard) — better than typical portfolio code.
- Fully static prerendering with correct `generateStaticParams`; SHA-pinned GitHub Actions with
  minimal permissions; Dependabot configured.
- ContactForm's a11y wiring (labels, `aria-invalid`/`aria-describedby`, focus-on-error) and the
  skip link / landmark structure.
- The newer `wiki/` documentation tier is accurate and thorough.

---

## Prioritized Remediation Plan

**P0 — the product is lying to users (do first)**

1. Check `emailResponse.error` in `lib/email.ts` (C1).
2. Remove/replace the client timing fake-success (C2).
3. Fix canonicals + OG inheritance + `twitter:image` 404 (C3).
4. Fix SVG hero images 400 (H1).
5. Replace placeholder employers, foreign GitHub links; delete duplicate project (C5).

**P1 — the repo contradicts its own standards** 6. `prettier --write .`; add `format:check` to `check`; enable CI; drop `--passWithNoTests` (H3). 7. Delete dead code: chat/, unused ui primitives (or adopt them), `lib/utils.ts`+`tailwind-merge`,
unused deps, duplicate assets, root clutter (H5). 8. Global-replace `border-zavala-border-default` (H6). 9. Rewrite E2E specs against the real UI; run against prod build (H2). 10. Documentation truth pass: SECURITY.md, ARCHITECTURE.md CSRF claim, DEPLOYMENT.md env vars,
TESTING.md thresholds, CLAUDE.md pipeline order, `.env.example` (H9). 11. Node 20/22, ESLint 9 migration, `@types/jest` alignment, `npm audit fix` (H4).

**P2 — polish to "impressive"** 12. Visible-by-default hero with CSS animation (C4); LazyMotion/CSS + drop client Zod (H8). 13. Contrast tokens, nested-interactive cleanup, focus rings (H7). 14. Validation fixes (`.trim()` order, date refinement, rate-limit-after-validation). 15. Rate limiter: platform IP, key eviction, `getEnv()` routing; PII log redaction. 16. Real tests for `lib/projects.ts`; de-vacuous email/theme tests; unify the two project-card
implementations.

---

_Methodology note: every Critical and High finding above was independently re-verified against the
working tree (grep/read/compile/build output) before inclusion. Medium findings were reported by
specialist review passes and spot-checked; line numbers may drift as fixes land._

---

## Remediation Addendum (2026-07-02)

All Critical and High findings — and the actionable Mediums — were addressed
the same day, directly on `main`:

- **C1/C2:** Resend `{ data, error }` is now checked; the client-side
  fake-success timing check was removed (docs updated to match the real
  pipeline: rate limit → Zod → honeypot → sanitize → send).
- **C3:** Per-page canonicals + OG blocks; root-layout canonical and the
  broken manual `twitter:image` reference removed (file-convention OG images).
- **C4:** Hero rewritten as a Server Component with pure CSS stagger
  animation — visible in server HTML, reduced-motion collapses to final frame.
- **C5/H1:** Placeholder GitHub/demo links nulled, duplicate project deleted,
  SVG hero images render via `unoptimized` (no more optimizer 400s).
  _Remaining owner action: replace the placeholder employers/university on
  the resume page with real history._
- **H2/H3:** E2E specs rewritten against the real UI (CI runs the production
  build); CI enabled on push/PR; `format:check` added to `npm run check`;
  Prettier applied repo-wide; coverage thresholds raised to 60/50/60/60.
- **H4:** Node 22 (`node-version-file`), ESLint 9 flat config + ESLint CLI,
  `@types/jest@29`, jest globals scoped to tests via `tsconfig.test.json`,
  `noUncheckedIndexedAccess` enabled.
- **H5:** Deleted: chat feature, `lib/utils.ts` + `tailwind-merge`,
  `@next/bundle-analyzer`, `sharp`, duplicate MDX/SVG, icon SVG duplicates,
  root planning artifacts. Adopted: ui primitives now power ContactForm.
- **H6:** `border-zavala-border-default` → `border-zavala-border` (16×).
- **H7:** Theme-aware accent variables (light mode uses AA-compliant darker
  shades); filled buttons use `accent-primary-strong` (#2563eb); dark
  tertiary text bumped to #8a8a8a; ProjectCard rebuilt with the
  stretched-link pattern (no nested interactive elements) and
  keyboard-visible quick links; focus-visible rings applied consistently.
- **H8:** framer-motion **removed entirely** (~36KB gz off every page) in
  favor of CSS keyframes + a 50-line `useInView` hook; client Zod replaced
  by a dependency-free validator sharing constants with the server schema
  (~25KB gz off /contact); TerminalWindow now loads on footer visibility.
- **H9:** Documentation truth pass across SECURITY.md, ARCHITECTURE.md
  (false CSRF claim removed), DEPLOYMENT.md (correct env vars), TESTING.md,
  CLAUDE.md, READMEs, and wiki links.

Remaining accepted items: Next.js's internal `postcss@8.4.31` advisory
(build-time only, documented in SECURITY.md) and the nonce-based CSP
follow-up.
