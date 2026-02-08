# Code Quality & Standards

This document outlines the code quality tools and standards for the Zavala Software Portfolio project.

## TypeScript

### Strict Mode

TypeScript strict mode is **enabled** in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

This enables all strict type-checking options:

- `noImplicitAny` - Error on expressions with an implied 'any' type
- `strictNullChecks` - Null and undefined are not assignable to other types
- `strictFunctionTypes` - Stricter checking of function types
- `strictBindCallApply` - Check bind, call, and apply methods
- `strictPropertyInitialization` - Class properties must be initialized
- `noImplicitThis` - Error on 'this' expressions with an implied 'any'
- `alwaysStrict` - Parse in strict mode and emit "use strict"

### Type Checking

Run type checking manually:

```bash
npm run type-check
```

TypeScript errors will block:
- Development server compilation
- Production builds
- CI/CD pipelines

## ESLint

### Configuration

ESLint is configured in `.eslintrc.json` with:

- **Next.js rules** - `next/core-web-vitals` preset
- **TypeScript rules** - `@typescript-eslint/recommended`
- **Custom rules** - See configuration below

### Custom Rules

```json
{
  "@typescript-eslint/no-unused-vars": "warn",
  "@typescript-eslint/no-explicit-any": "warn",
  "prefer-const": "warn",
  "no-console": ["warn", { "allow": ["warn", "error"] }]
}
```

**Note:** Warnings don't block builds, but should be addressed before merging.

### Commands

```bash
# Run linting
npm run lint

# Auto-fix linting issues
npm run lint:fix
```

### Common Issues

**Unused variables:**
- Prefix with `_` if intentionally unused: `_error`, `_param`
- Remove if truly unnecessary

**Unescaped entities:**
- Use `&apos;` instead of `'` in JSX text
- Use `&quot;` instead of `"` in JSX text
- Or use template literals: `{text}`

**Console statements:**
- Use `console.warn()` or `console.error()` (allowed)
- Avoid `console.log()` in production code
- Use proper logging library for production

## Prettier

### Configuration

Prettier is configured in `.prettierrc` with these settings:

```json
{
  "semi": false,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always"
}
```

### Commands

```bash
# Format all files
npm run format

# Check if files are formatted correctly (CI)
npm run format:check
```

### Ignored Files

Configured in `.prettierignore`:
- `node_modules/`
- `.next/`
- `build/` and `dist/`
- Lock files

## Pre-commit Hooks (Future Enhancement)

Consider adding Husky + lint-staged for automatic:
- Linting on commit
- Formatting on commit
- Type checking on push

Example configuration:

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

## CI/CD Integration

In your CI/CD pipeline (GitHub Actions, Vercel, etc.), run:

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Format checking
npm run format:check

# Build
npm run build
```

Block merges if any of these fail.

## Code Review Guidelines

### What to Look For

**TypeScript:**
- No `any` types (use proper types or `unknown`)
- Properly typed function parameters and returns
- Avoid type assertions unless necessary

**React/Next.js:**
- Server Components by default
- `"use client"` only when needed
- Proper error boundaries
- Accessible HTML (semantic tags, ARIA labels)

**Performance:**
- No unnecessary re-renders
- Proper memoization when needed
- Optimized images (Next.js Image component)
- Lazy loading for heavy components

**Security:**
- No sensitive data in client components
- Input validation on server
- Proper environment variable usage

### Style Guide

**File naming:**
- Components: `PascalCase.tsx` (e.g., `ProjectCard.tsx`)
- Utils: `camelCase.ts` (e.g., `getProjects.ts`)
- Pages: `page.tsx` (Next.js convention)

**Component structure:**
```typescript
// Imports
import { useState } from 'react'
import type { ComponentType } from './types'

// Types
type Props = {
  title: string
}

// Component
export default function Component({ title }: Props) {
  // Hooks
  const [state, setState] = useState()

  // Handlers
  const handleClick = () => {}

  // Render
  return <div>{title}</div>
}
```

**Function declarations:**
- Use `function` for components and named functions
- Use arrow functions for handlers and callbacks
- Use `const` for everything else

**Comments:**
- JSDoc for public functions
- Inline comments for complex logic
- No obvious comments

## VS Code Setup (Recommended)

Install extensions:
- ESLint
- Prettier
- TypeScript

Configure settings (`settings.json`):

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Options](https://prettier.io/docs/en/options.html)
- [Next.js ESLint](https://nextjs.org/docs/basic-features/eslint)

---

**Last Updated:** 2026-02-08
