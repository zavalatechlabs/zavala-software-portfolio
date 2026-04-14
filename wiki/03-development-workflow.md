# Development Workflow

Day-to-day development practices, scripts, and quality gates.

## NPM Scripts

| Script            | Command                   | Purpose                                    |
| ----------------- | ------------------------- | ------------------------------------------ |
| `dev`             | `npm run dev`             | Start Next.js dev server at localhost:3000 |
| `build`           | `npm run build`           | Production build                           |
| `start`           | `npm run start`           | Serve production build                     |
| `lint`            | `npm run lint`            | Run ESLint (next lint)                     |
| `lint:fix`        | `npm run lint:fix`        | Auto-fix ESLint issues                     |
| `format`          | `npm run format`          | Format all files with Prettier             |
| `format:check`    | `npm run format:check`    | Check formatting without writing           |
| `type-check`      | `npm run type-check`      | Run TypeScript compiler (`tsc --noEmit`)   |
| `test`            | `npm test`                | Run Jest unit/component tests              |
| `test:watch`      | `npm run test:watch`      | Run tests in watch mode                    |
| `test:coverage`   | `npm run test:coverage`   | Run tests with coverage report             |
| `test:e2e`        | `npm run test:e2e`        | Run Playwright E2E tests                   |
| `test:e2e:ui`     | `npm run test:e2e:ui`     | Playwright with interactive UI             |
| `test:e2e:headed` | `npm run test:e2e:headed` | Playwright in headed browser               |
| `check`           | `npm run check`           | Full quality gate (see below)              |
| `prepare`         | `npm run prepare`         | Install Husky git hooks                    |

## Quality Gate

The `check` script is the full quality gate. Run it before every commit:

```bash
npm run check
```

This chains four commands in sequence, stopping on the first failure:

1. `npm run type-check` -- TypeScript strict-mode compilation
2. `npm run lint` -- ESLint with next/core-web-vitals rules
3. `npm run test -- --passWithNoTests` -- Jest with coverage thresholds (25% branches, 35% functions, 40% lines/statements)
4. `npm run build` -- Full Next.js production build

If any step fails, the remaining steps do not run.

## Pre-Commit Hooks

The project uses **Husky** + **lint-staged** to enforce quality on every commit. The `.husky/pre-commit` hook runs `npx lint-staged`, which applies these rules to staged files:

| File Pattern      | Actions                                 |
| ----------------- | --------------------------------------- |
| `*.{ts,tsx}`      | `eslint --fix`, then `prettier --write` |
| `*.{js,jsx}`      | `eslint --fix`, then `prettier --write` |
| `*.{json,css,md}` | `prettier --write`                      |

This means ESLint auto-fixes and Prettier formatting are applied automatically to every staged file before the commit completes. If ESLint finds unfixable errors, the commit is blocked.

After cloning, run `npm install` to activate the hooks (the `prepare` script calls `husky`).

## Git Conventions

### Commit Messages

Use **conventional commits** in imperative mood:

```
fix: resolve contact form validation on empty email
feat: add project filtering by tag
refactor: extract email sanitization into lib/email.ts
chore: update dependencies to latest patch versions
docs: add content management wiki page
test: add unit tests for rate limiter fallback
```

Prefix types: `fix:`, `feat:`, `refactor:`, `chore:`, `docs:`, `test:`

### Branch Strategy

- **main** -- production branch, deployed to Vercel on push
- **feature branches** -- branch from main, merge back via PR
- Never force push to main

### Workflow

1. Create a feature branch from main
2. Make changes, commit with conventional message
3. Run `npm run check` to validate
4. Push and open a pull request
5. Vercel generates a preview deployment for the PR
6. Review, then merge to main for production deploy

## Code Style

Enforced by Prettier (via pre-commit hook):

- No semicolons
- Single quotes
- 100 character line width
- Trailing commas (es5)
- LF line endings

Additional rules from CLAUDE.md:

- No `any` types
- No `require()` -- use ES module imports
- Unused variables prefixed with `_`
- Named exports for components: `export function ComponentName`
- `clsx` for class merging in UI components, raw Tailwind strings elsewhere

## See Also

- [Quick Start](01-quick-start.md) -- initial setup
- [Architecture](02-architecture.md) -- tech stack and project structure
- [Testing Strategy](testing-strategy.md) -- detailed testing practices
- `../docs/TESTING.md` -- test infrastructure details
- `../docs/CODE_QUALITY.md` -- code quality standards

**Tags:** development, workflow, scripts, git, commits, pre-commit, husky, lint-staged, quality-gate
