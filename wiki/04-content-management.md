# Content Management

How to add, edit, and manage MDX project content.

## Adding a New Project

This is the most common content task. Each project is an MDX file in `content/projects/`.

### Using the /add-project Skill

The fastest approach -- invoke the `/add-project` skill in Claude Code and provide the project details. It generates the MDX file with valid frontmatter and starter content.

### Manual Creation

1. Choose a slug. It must match `[a-z0-9-]` only (lowercase letters, digits, hyphens). Example: `my-new-project`

2. Create the file at `content/projects/my-new-project.mdx`

3. Add YAML frontmatter at the top:

```yaml
---
title: 'My New Project'
description: 'A brief one-line description of what this project does'
date: '2026-04-13'
tags: ['TypeScript', 'Next.js', 'Tailwind CSS']
image: '/images/projects/my-new-project.svg'
github: 'https://github.com/zavala/my-new-project'
demo: 'https://my-new-project.vercel.app'
featured: true
---
```

4. Write MDX content below the frontmatter (standard Markdown with optional JSX).

5. Add a project image as an SVG file at `public/images/projects/my-new-project.svg`.

6. Run `npm run build` to validate. Zod will reject malformed frontmatter with a clear error.

## Frontmatter Field Reference

These fields are defined by the `projectMetadataSchema` Zod schema in `lib/projects.ts`:

| Field         | Type           | Required | Description                                                 |
| ------------- | -------------- | -------- | ----------------------------------------------------------- |
| `title`       | string         | Yes      | Project display name                                        |
| `description` | string         | Yes      | One-line summary shown on project cards                     |
| `date`        | string         | Yes      | ISO date (`YYYY-MM-DD`). Controls sort order (newest first) |
| `tags`        | string[]       | Yes      | Technology tags displayed as badges                         |
| `image`       | string         | No       | Path to project image (relative to `public/`)               |
| `github`      | string or null | No       | GitHub repository URL                                       |
| `demo`        | string or null | No       | Live demo URL                                               |
| `featured`    | boolean        | No       | Set `true` to show on the homepage                          |

The schema is validated at build time by `projectMetadataSchema.parse(data)` in `lib/projects.ts`. Missing required fields or wrong types produce a Zod error that stops the build.

## Slug Validation

The `getProjectBySlug()` function in `lib/projects.ts` enforces slug format as a defense-in-depth measure:

```typescript
if (!/^[a-z0-9-]+$/.test(slug)) return undefined
```

Valid: `my-project`, `task-dashboard`, `ai-chat-assistant`
Invalid: `My_Project`, `project.v2`, `../secret`, `project name`

The slug is derived from the filename: `content/projects/my-project.mdx` becomes slug `my-project`.

## Image Conventions

- Place project images in `public/images/projects/`
- Use SVG format for placeholder/illustration images
- The filename should match the project slug: `my-project.svg`
- Reference in frontmatter as `/images/projects/my-project.svg` (no `public/` prefix)
- All existing projects use SVG placeholders

## Featured Projects

Set `featured: true` in frontmatter to display a project on the homepage. The `getFeaturedProjects()` function in `lib/projects.ts` filters for these and accepts an optional `limit` parameter.

There is no enforced maximum, but keep the homepage focused -- 3 to 4 featured projects is typical.

## Content Quality Checklist

Before committing a new project file:

- [ ] Slug matches `[a-z0-9-]` pattern
- [ ] All required frontmatter fields are present (`title`, `description`, `date`, `tags`)
- [ ] Date is valid ISO format (`YYYY-MM-DD`)
- [ ] Tags array is not empty
- [ ] Image file exists at the path specified in frontmatter
- [ ] MDX content has proper heading hierarchy (start with `#`, then `##`, etc.)
- [ ] `npm run build` succeeds without Zod validation errors
- [ ] Project appears correctly on `/projects` and `/projects/[slug]`

## Content Agents

For richer project write-ups, use these Claude Code agents:

- **@project-storyteller** -- generates narrative project descriptions with problem/solution structure
- **@mdx-content-builder** -- scaffolds complete MDX files with frontmatter, sections, and code examples

## How Projects Are Loaded

The pipeline in `lib/projects.ts`:

1. `fs.readdirSync()` reads all `.mdx` files from `content/projects/`
2. `gray-matter` parses YAML frontmatter from file contents
3. `projectMetadataSchema.parse()` validates the frontmatter against the Zod schema
4. Projects are sorted by `date` descending (newest first)
5. Page components call `getAllProjects()`, `getFeaturedProjects()`, or `getProjectBySlug()`

## See Also

- [Quick Start](01-quick-start.md) -- initial setup
- [Architecture](02-architecture.md) -- data flow and project structure
- `../docs/ANIMATION_PATTERNS.md` -- animation patterns for project pages
- `../docs/SECURITY.md` -- input sanitization details
- `../CLAUDE.md` -- full content rules under the "Content (MDX)" section

**Tags:** content, mdx, projects, frontmatter, zod, content-management, featured-projects
