---
name: update-resume
description: Add a new work experience position to the about page matching the existing JSX pattern.
disable-model-invocation: true
allowed-tools: Read Edit
argument-hint: '[title] [company] [dates]'
---

Add a new work experience entry:

1. Read app/about/page.tsx to understand the existing JSX structure
2. Parse arguments: job title, company name, date range from $ARGUMENTS
3. Ask the user for: achievement bullet points and tech stack tags
4. Build a new position block matching the EXACT existing template:
   - border-l-2 accent border
   - Flex layout with title, company, dates
   - Bullet list of achievements
   - Tech stack tag badges
5. Insert at the top of the work experience section (most recent first)
6. Remind user to update sitemap lastModified date and run /quality-gate
