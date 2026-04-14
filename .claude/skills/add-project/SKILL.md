---
name: add-project
description: Scaffold a new MDX project file with validated frontmatter and placeholder image.
disable-model-invocation: true
allowed-tools: Read Write Edit Glob
argument-hint: '[project-slug]'
---

Create a new portfolio project:

1. Read lib/projects.ts to confirm the current Zod schema
2. Read an existing project (e.g., content/projects/ai-chat-assistant.mdx) for structure reference
3. Verify the slug "$ARGUMENTS" matches [a-z0-9-] and doesn't collide with existing files
4. Create `content/projects/$ARGUMENTS.mdx` with:
   - Valid frontmatter (all required fields)
   - Section template: Problem, Solution, Tech Stack, Key Features, Challenges, Learnings
   - [FILL IN] placeholders for content the user needs to provide
5. Check existing files in public/images/projects/ and create a matching placeholder SVG
6. Remind the user to fill in content and run /quality-gate
