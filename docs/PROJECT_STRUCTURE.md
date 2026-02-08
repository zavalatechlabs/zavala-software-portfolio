# Project Structure & Workflow

**Last Updated:** 2026-02-08

---

## Project Board Organization

We use **GitHub Milestones** to organize work into phases, similar to Features in Azure DevOps.

### Milestone Structure

```
Milestone (Phase/Feature)
└── Issues (User Stories/Tasks)
```

---

## Current Milestones

### 📋 Milestone 1: Phase 1 - Architecture & Research

**Status:** In Progress (1 issue)
**Description:** Research portfolio examples, evaluate tech stack options, and document architecture decisions

**Issues:**

- #1: Research & Architecture: Portfolio Tech Stack

---

### ⚙️ Milestone 2: Phase 2 - Implementation (Boilerplate)

**Status:** Not Started (9 issues)
**Description:** Set up Next.js project, configure tools, create basic structure, and establish testing infrastructure

**Issues:**

- #2: Initialize Next.js project with TypeScript and Tailwind
- #3: Set up project folder structure
- #4: Implement root layout with Navbar and Footer
- #5: Create basic page routes
- #6: Add MDX support for project content
- #7: Configure Vercel deployment
- #8: Add security headers and configuration
- #9: Set up ESLint, Prettier, and TypeScript strict mode
- #17: Set up testing infrastructure (Jest + Playwright)

**Goal:** Fully functional Next.js boilerplate deployed to Vercel with testing infrastructure

---

### 🎨 Milestone 3: Phase 3 - Design & Content

**Status:** Not Started (7 issues)
**Description:** Define design system, create content strategy, and plan page layouts

**Issues:**

- #10: Design consultation and inspiration review
- #11: Define homepage content and layout
- #12: Define projects page structure and content
- #13: Define about page content
- #14: Define contact page design and form fields
- #15: Create design system documentation
- #16: Define animation patterns and interactions

**Goal:** Complete design system and content plan documented and ready for implementation

---

### 🚀 Milestone 4: Phase 4 - Execution (Features)

**Status:** Not Started (0 issues)
**Description:** Implement designed features, polish UI, and add animations

**Issues:** _To be created after Phase 3 completion_

**Goal:** Fully designed and polished portfolio site launched to production

---

## Workflow

### Querying Work by Phase

**View all issues in a phase:**

```bash
gh issue list --milestone "Phase 2: Implementation (Boilerplate)"
```

**Check milestone progress:**

```bash
gh api repos/zavalatechlabs/zavala-software-portfolio/milestones | \
  jq -r '.[] | "\(.title): \(.open_issues) open / \(.closed_issues) closed"'
```

**Assign issue to milestone:**

```bash
gh issue edit <number> --milestone "Phase 2: Implementation (Boilerplate)"
```

### Agent Instructions

**For Phase 2 sub-agent:**
"Complete all issues in the 'Phase 2: Implementation (Boilerplate)' milestone"

**For Phase 3 work:**
"Work on issues in the 'Phase 3: Design & Content' milestone"

---

## Progress Tracking

Milestones show percentage complete:

- Phase 1: X/1 complete (X%)
- Phase 2: X/9 complete (X%)
- Phase 3: X/7 complete (X%)
- Phase 4: X/TBD complete (X%)

View progress at: https://github.com/zavalatechlabs/zavala-software-portfolio/milestones

---

## Benefits of This Structure

✅ **Clear organization:** No manual "Phase X.Y" prefixes needed  
✅ **Progress tracking:** See % complete per phase  
✅ **Easy filtering:** View only Phase 2 tasks, for example  
✅ **Agent-friendly:** "Complete all issues in Phase 2 milestone"  
✅ **Familiar workflow:** Similar to ADO Feature → User Story structure  
✅ **Native GitHub:** Uses built-in GitHub features, not custom labels
