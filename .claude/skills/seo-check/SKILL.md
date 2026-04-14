---
name: seo-check
description: Audit meta tags, structured data, OG images, sitemap, and robots.txt across all pages.
disable-model-invocation: false
allowed-tools: Read Glob Grep
argument-hint: '[page-path]'
---

Audit SEO health across the site (or a specific page if argument provided).

1. PAGE METADATA: Read each page's metadata export. Check:
   - Title length (<60 chars)
   - Description length (120-160 chars)
   - OG fields present
   - Twitter card fields present

2. STRUCTURED DATA: Read lib/schema.ts. Verify Person/WebSite schemas.

3. SITEMAP: Read app/sitemap.ts. Verify all pages included, dates valid, priorities sensible.

4. ROBOTS: Read app/robots.ts. Verify crawl rules.

5. OG IMAGES: Check for opengraph-image route handlers per section.

6. DYNAMIC ROUTES: Verify generateMetadata and generateStaticParams in app/projects/[slug]/page.tsx.

Output: Page-by-page SEO scorecard with ISSUES ranked by search impact.
