---
name: portfolio-audit
description: Monthly health check covering content freshness, broken references, design consistency, dependency security, and build health.
disable-model-invocation: true
allowed-tools: Read Bash(npm *) Bash(npx *) Glob Grep
argument-hint: '[focus: all|content|design|deps|tests]'
---

Run a comprehensive portfolio audit. Default focus: all.

1. CONTENT FRESHNESS:
   - Read all MDX files in content/projects/. Flag projects older than 12 months.
   - Check for placeholder text or TODO markers
   - Verify image references exist in public/images/projects/
   - Check /resume.pdf exists

2. DESIGN CONSISTENCY:
   - Search for hardcoded hex colors in components/ and app/
   - Search for non-zavala Tailwind color classes (text-gray-_, bg-blue-_, etc.)
   - Verify focus-visible patterns on interactive elements

3. DEPENDENCY HEALTH:
   - Run `npm audit`
   - Run `npm outdated`

4. TEST & BUILD HEALTH:
   - Run `npm test -- --passWithNoTests`
   - Run `RESEND_API_KEY=re_test_dummy npm run build`

Output: Structured report with PASS/WARN/FAIL per category and a PRIORITY ACTIONS section.
