# SEO and Metadata

How search engines, social platforms, and PWA installers discover and present the portfolio. For the full reference, see [../docs/SEO.md](../docs/SEO.md).

---

## Per-Page Metadata

Metadata is defined in `app/layout.tsx` using the Next.js `Metadata` API.

- **Title template:** `%s | Maximiliano Zavala` (child pages supply the `%s` segment)
- **Default title:** `Maximiliano Zavala - Full-Stack Developer & Software Engineer`
- **Description:** 150-160 characters targeting core keywords (Next.js, TypeScript, React)
- **Canonical URL:** derived from `NEXT_PUBLIC_BASE_URL` (defaults to `https://zavalatechlabs.com`)
- **Robots:** indexing and following enabled; Google-specific directives allow large image/video/snippet previews

---

## JSON-LD Structured Data

Three schema generators live in `lib/schema.ts` and are injected as `<script type="application/ld+json">` in `layout.tsx`.

| Schema           | Key fields                                                                      |
| ---------------- | ------------------------------------------------------------------------------- |
| `Person`         | name, jobTitle ("Full-Stack Developer"), knowsAbout (7 skills), sameAs (GitHub) |
| `WebSite`        | name, url, description, author                                                  |
| `BreadcrumbList` | Positional items with name and url (available for per-page use)                 |

---

## Open Graph Images

Generated dynamically using `next/og` `ImageResponse` at the edge. Size: 1200x630 px.

| File                            | Design                                      |
| ------------------------------- | ------------------------------------------- |
| `app/opengraph-image.tsx`       | Purple gradient, name, title, tech keywords |
| `app/about/opengraph-image.tsx` | Blue gradient, "About Me" messaging         |

Twitter cards use `summary_large_image` format referencing the same images.

---

## Sitemap Configuration

`app/sitemap.ts` generates `/sitemap.xml` at build time.

**Static pages:**

| URL         | Priority | Change frequency | lastModified logic               |
| ----------- | -------- | ---------------- | -------------------------------- |
| `/`         | 1.0      | monthly          | Most recent project date         |
| `/projects` | 0.9      | weekly           | Most recent project date         |
| `/about`    | 0.8      | monthly          | Fixed date (update when changed) |
| `/contact`  | 0.7      | monthly          | Fixed date (update when changed) |

**Dynamic project pages:** Each MDX project gets priority `0.6`, monthly change frequency, and `lastModified` from its frontmatter `date` field.

---

## Robots Configuration

`app/robots.ts` generates `/robots.txt`.

```
User-Agent: *
Allow: /
Disallow: /api/
Disallow: /private/
Sitemap: https://zavalatechlabs.com/sitemap.xml
```

---

## PWA Manifest

`app/manifest.ts` generates `/manifest.json`.

| Field              | Value                                                |
| ------------------ | ---------------------------------------------------- |
| `name`             | Maximiliano Zavala - Portfolio                       |
| `short_name`       | MZ Portfolio                                         |
| `display`          | standalone                                           |
| `background_color` | `#0a0a0a`                                            |
| `theme_color`      | `#0a0a0a`                                            |
| Icons              | `/icon-192.png` (192x192), `/icon-512.png` (512x512) |

Theme-color meta tags in `layout.tsx` adapt to light (`#ffffff`) and dark (`#0a0a0a`) via `prefers-color-scheme` media queries.

---

## Tooling

- **/seo-check skill** -- run an automated SEO audit against the live or local site
- **@seo-specialist agent** -- agent that can review metadata, structured data, and sitemap configuration
- **External validators:** [opengraph.xyz](https://www.opengraph.xyz/), [Google Rich Results Test](https://search.google.com/test/rich-results), Lighthouse SEO audit (target 95+)

---

## See Also

- [../docs/SEO.md](../docs/SEO.md) -- full SEO infrastructure documentation
- [seo-metadata.md](seo-metadata.md) -- SEO audit and findings
- [05-design-system.md](05-design-system.md) -- theme-color and dark mode details
- [07-security.md](07-security.md) -- CSP and header configuration

**Tags:** seo, metadata, json-ld, open-graph, sitemap, robots, pwa, structured-data
