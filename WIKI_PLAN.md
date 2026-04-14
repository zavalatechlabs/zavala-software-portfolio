# Wiki Implementation Plan

## Principle: Guide, Don't Duplicate

Existing docs are excellent. The wiki is a **developer guide layer** that answers "how do I...?" and links to existing docs for deep dives.

## Structure (14 pages + index)

```
wiki/
├── README.md                    # Index with navigation + existing audit links
├── 01-quick-start.md            # 5-minute setup (tutorial)
├── 02-architecture.md           # Tech stack, decisions, data flow (reference)
├── 03-project-structure.md      # File tree with descriptions (reference)
├── 04-development-workflow.md   # Git, pre-commit, quality gates (how-to)
├── 05-content-management.md     # Adding/editing MDX projects (how-to)
├── 06-design-system.md          # Colors, tokens, components, animations (reference)
├── 07-testing.md                # Jest, Playwright, mock strategies (how-to + reference)
├── 08-security.md               # Headers, validation, rate limiting (reference)
├── 09-seo-metadata.md           # Meta tags, structured data, sitemap (reference)
├── 10-deployment.md             # Vercel setup, env vars, monitoring (how-to)
├── 11-api-reference.md          # Contact API, health check, schemas (reference)
├── 12-claude-code.md            # Agents, skills, workflows (how-to + reference)
├── 13-troubleshooting.md        # Common issues and fixes (explanation)
└── [existing audit files remain untouched]
```

## Per-Page Content Plan

### README.md (rewrite)

- Project name, one-line description
- Quick links to all 13 pages
- Links to existing audit wiki (architecture-overview, accessibility, security-posture, etc.)
- Links to root docs (ARCHITECTURE.md, CLAUDE.md)
- "Last updated" date

### 01-quick-start.md

- Prerequisites (Node 18+, npm, git)
- Clone, install, run dev server (3 commands)
- What you see at localhost:3000
- Next steps (link to other pages)

### 02-architecture.md

- Tech stack table (framework, language, styling, testing, etc. with versions)
- Architecture diagram (text-based)
- Key design decisions with rationale (Server Components, Zod, lazy env, etc.)
- Link to ARCHITECTURE.md for full details

### 03-project-structure.md

- Full file tree with one-line descriptions per directory
- Key files explained (layout.tsx, globals.css, tailwind.config.ts, etc.)
- Where things live (pages, components, content, lib, hooks, public, docs)

### 04-development-workflow.md

- Git branch strategy
- Conventional commits format with examples
- Pre-commit hooks (Husky + lint-staged explained)
- Running quality checks (npm run check)
- Available npm scripts table
- PR process

### 05-content-management.md

- MDX frontmatter schema (all fields, required vs optional)
- Step-by-step: adding a new project
- Step-by-step: editing existing project
- Image conventions (SVG placeholders in public/images/projects/)
- Featured project selection (featured: true in frontmatter)
- Using /add-project skill
- Content quality checklist

### 06-design-system.md

- Color palette (all zavala-\* tokens with hex values for both themes)
- Typography (fonts, heading scale, body text)
- Spacing patterns (containers, sections, gaps)
- Component patterns (Button variants, focus rings, hover effects)
- Animation guidelines (Framer Motion patterns, useReducedMotion)
- Dark mode implementation (CSS variables, next-themes, class strategy)
- Icon usage (lucide-react + inline SVGs)
- Link to docs/DESIGN_SYSTEM.md for full reference

### 07-testing.md

- Test stack overview (Jest + RTL + Playwright)
- Running tests (commands table)
- Coverage thresholds
- Writing a component test (step-by-step with example)
- Writing an API route test (with @jest-environment docblock)
- The 3 framer-motion mock strategies (when to use each)
- E2E test structure
- Using @test-writer agent
- Link to docs/TESTING.md for full reference

### 08-security.md

- Security headers (CSP, HSTS, X-Frame-Options, etc.)
- Contact form defense-in-depth pipeline
- Rate limiting (Upstash + in-memory)
- Environment variable handling (lib/env.ts)
- PII redaction in logs
- Link to docs/SECURITY.md for full reference

### 09-seo-metadata.md

- Per-page metadata requirements
- JSON-LD structured data (Person, WebSite, Breadcrumb)
- Open Graph images
- Sitemap and robots configuration
- Using /seo-check skill
- Link to docs/SEO.md for full reference

### 10-deployment.md

- Pre-deployment checklist
- Environment variables needed (table with required/optional)
- Vercel setup steps
- Build command and configuration
- Custom domain setup
- Monitoring and rollback
- Link to docs/DEPLOYMENT.md for details

### 11-api-reference.md

- POST /api/contact (request schema, response schema, error codes, rate limiting)
- GET /api/health (response schema)
- Error response format
- Rate limiting headers

### 12-claude-code.md

- Overview of the AI team (career + technical)
- Agent quick-reference table (name, purpose, model, when to use)
- Skill quick-reference table (name, purpose, arguments)
- Common workflows with step-by-step
- Settings and permissions overview
- Path-scoped rules
- How to add new agents/skills

### 13-troubleshooting.md

- Build failures (ESLint, TypeScript, missing env vars)
- Theme/dark mode issues
- Contact form not sending
- Test failures (framer-motion, jest-environment, env vars)
- Animation performance
- Rate limiter behavior
- Common dependency issues
