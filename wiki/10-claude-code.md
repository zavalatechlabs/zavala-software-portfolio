# Claude Code Integration

The portfolio uses Claude Code with 10 specialized agents and 5 skills to automate development, content creation, career positioning, and quality assurance.

## Overview

Agents are conversational specialists invoked with `@agent-name`. Skills are automated task runners invoked with `/skill-name`. Together they cover the full lifecycle from scaffolding a new project to auditing the entire portfolio.

- **5 career agents** -- content, branding, and job search optimization
- **5 technical agents** -- building, testing, reviewing, and SEO
- **5 skills** -- repeatable workflows with constrained tool access

Agent definitions live in `.claude/agents/*.md`. Skill definitions live in `.claude/skills/*/SKILL.md`.

## Career Team

| Agent                   | Model  | Purpose                                                                                         | When to Use                                           |
| ----------------------- | ------ | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| `@portfolio-strategist` | opus   | Holistic portfolio audit: project curation, career narrative, skill gaps, strategic positioning | Quarterly review or before a job search               |
| `@career-coach`         | opus   | Strengthens resume bullets, work experience, and professional positioning on the about page     | Adding a new role or preparing applications           |
| `@recruiter-eye`        | opus   | Simulates a hiring manager with 5-second, 30-second, and 2-minute reading passes                | Before applying to jobs or after major redesigns      |
| `@brand-voice`          | opus   | Audits all site copy for brand consistency, tone, persuasive power, and messaging               | After major content updates or audience repositioning |
| `@project-storyteller`  | sonnet | Transforms project MDX from technical specs into compelling problem-solution-impact narratives  | Adding or refining a project showcase                 |

## Technical Team

| Agent                  | Model  | Purpose                                                                                                      | When to Use                                    |
| ---------------------- | ------ | ------------------------------------------------------------------------------------------------------------ | ---------------------------------------------- |
| `@frontend-builder`    | sonnet | Builds React components, pages, and UI features matching the zavala design system                            | Implementing new components or visual features |
| `@test-writer`         | sonnet | Writes Jest + RTL tests matching codebase patterns, including the useInView/useReducedMotion mock strategies | After building new features                    |
| `@code-reviewer`       | sonnet | Consolidated review: security, accessibility, and design system compliance in one pass                       | After code changes, before committing          |
| `@seo-specialist`      | sonnet | Optimizes page metadata, structured data, OG tags, sitemap, and robots configuration                         | After content changes or for SEO audits        |
| `@mdx-content-builder` | sonnet | Creates and edits MDX project files with validated frontmatter matching the Zod schema                       | Adding new portfolio projects                  |

## Skills

| Skill              | Purpose                                                                           | Arguments                                    | Model Invocation   |
| ------------------ | --------------------------------------------------------------------------------- | -------------------------------------------- | ------------------ |
| `/quality-gate`    | Full quality pipeline: type-check, lint, format-check, test, build                | `[fix]` `[skip-build]`                       | Yes                |
| `/add-project`     | Scaffold new MDX project file with validated frontmatter and placeholder image    | `[project-slug]`                             | No (template only) |
| `/update-resume`   | Add a new work experience entry to the about page matching existing JSX pattern   | `[title] [company] [dates]`                  | No (template only) |
| `/portfolio-audit` | Monthly health check: content freshness, design consistency, dependencies, build  | `[focus: all\|content\|design\|deps\|tests]` | No (template only) |
| `/seo-check`       | Audit meta tags, structured data, OG images, sitemap, and robots across all pages | `[page-path]`                                | Yes                |

Skills with "No" model invocation (`disable-model-invocation: true`) run as structured checklists with constrained tool access. Skills with "Yes" can reason freely within their allowed tools.

## Common Workflows

### 1. Adding a New Project

```
/add-project my-new-project     -- scaffold MDX + placeholder image
  (fill in content)
@project-storyteller             -- refine narrative arc
@seo-specialist                  -- optimize metadata and descriptions
/quality-gate                    -- verify everything passes
```

### 2. Quarterly Portfolio Review

```
@portfolio-strategist            -- audit project curation, gaps, positioning
@recruiter-eye                   -- simulate hiring manager read-through
@brand-voice                     -- check copy consistency and tone
/portfolio-audit                 -- automated health check
```

### 3. Building a Feature

```
@frontend-builder                -- implement component or page
@test-writer                     -- write tests for new code
@code-reviewer                   -- security, a11y, design system review
/quality-gate                    -- full pipeline check
```

### 4. Updating Resume

```
/update-resume "Sr. Engineer" "Acme Corp" "2024-2026"
  (provide achievement bullets when prompted)
@career-coach                    -- strengthen bullets and positioning
/quality-gate                    -- verify build still passes
```

## Settings Overview

Settings are split between project-level (`.claude/settings.json`) and local overrides (`.claude/settings.local.json`).

### Allow Rules (project -- `.claude/settings.json`)

| Rule                     | Purpose                      |
| ------------------------ | ---------------------------- |
| `Read`                   | Read any file                |
| `Bash(npm run *)`        | Run any npm script           |
| `Bash(npm test *)`       | Run tests with arguments     |
| `Bash(npx jest *)`       | Run jest directly            |
| `Bash(npx prettier *)`   | Run prettier directly        |
| `Bash(npx playwright *)` | Run Playwright E2E tests     |
| `Bash(git log *)`        | View git history             |
| `Bash(git diff *)`       | View diffs                   |
| `Bash(git status *)`     | Check working tree           |
| `Bash(git branch *)`     | List/manage branches         |
| `Bash(ls *)`             | List directory contents      |
| `Bash(wc *)`             | Count lines/words/characters |

### Deny Rules (project -- `.claude/settings.json`)

| Rule                       | Purpose                              |
| -------------------------- | ------------------------------------ |
| `Bash(rm -rf *)`           | Prevent recursive force delete       |
| `Bash(rm -r *)`            | Prevent recursive delete             |
| `Bash(rm --recursive *)`   | Prevent recursive delete (long flag) |
| `Bash(git push --force *)` | Prevent force push                   |
| `Bash(git clean *)`        | Prevent working tree clean           |
| `Bash(npm publish *)`      | Prevent accidental publish           |
| `Edit(.env.local)`         | Prevent editing local secrets        |

### Local Overrides (`.claude/settings.local.json`)

The local settings file adds additional allow rules for npm install, build with dummy env vars, WebSearch, directory creation for agents/skills, and other development utilities. These do not override deny rules.

## Adding New Agents

1. Create `.claude/agents/your-agent.md`
2. Include YAML frontmatter: `name`, `description`, `model` (opus or sonnet), `tools`
3. Write the system prompt with specific instructions for the domain
4. Invoke with `@your-agent` in conversation

## Adding New Skills

1. Create `.claude/skills/your-skill/SKILL.md`
2. Include YAML frontmatter: `name`, `description`, `disable-model-invocation`, `allowed-tools`, `argument-hint`
3. Write numbered steps the skill should execute
4. Use `$ARGUMENTS` placeholder for user-provided input
5. Invoke with `/your-skill [args]` in conversation

## See Also

- [CLAUDE.md](../CLAUDE.md) -- project-level instructions loaded into every session
- [Quick Start](01-quick-start.md) -- initial setup and local development
- [Development Workflow](03-development-workflow.md) -- git conventions, quality gates
- [Testing Strategy](testing-strategy.md) -- audit findings on test coverage

**Tags:** claude-code, agents, skills, ai, automation, workflows, settings
