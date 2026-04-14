# SEO Infrastructure Documentation

This document outlines the SEO implementation for the Maximiliano Zavala Portfolio website.

## Overview

The portfolio implements comprehensive SEO best practices including:

- Dynamic robots.txt and sitemap
- PWA manifest for installability
- Open Graph images for social sharing
- Structured data (JSON-LD) for search engines
- Optimized metadata and canonical URLs

## Components

### 1. robots.txt (`app/robots.ts`)

**Purpose:** Instructs search engine crawlers on what pages to index.

**Location:** `app/robots.ts`

**Features:**

- Allows all search engines to crawl the site
- Disallows API routes and private paths
- Points to sitemap location

**Access:** https://zavalatechlabs.com/robots.txt

**Example Output:**

```
User-Agent: *
Allow: /
Disallow: /api/
Disallow: /private/

Sitemap: https://zavalatechlabs.com/sitemap.xml
```

### 2. Sitemap (`app/sitemap.ts`)

**Purpose:** Provides search engines with a structured list of all pages.

**Location:** `app/sitemap.ts`

**Features:**

- Automatically includes all static pages (home, about, projects, contact)
- Dynamically includes all project pages from MDX content
- Sets appropriate priority and change frequency for each page type
- Updates lastModified dates based on project metadata

**Access:** https://zavalatechlabs.com/sitemap.xml

**Page Priorities:**

- Homepage: 1.0 (highest)
- Projects listing: 0.9
- About: 0.8
- Contact: 0.7
- Individual projects: 0.6

### 3. PWA Manifest (`app/manifest.ts`)

**Purpose:** Enables progressive web app features and mobile installation.

**Location:** `app/manifest.ts`

**Features:**

- App name and description
- Theme colors (background: black, theme: indigo)
- App icons in multiple sizes (192x192, 512x512)
- Standalone display mode for app-like experience

**Access:** https://zavalatechlabs.com/manifest.json

### 4. Open Graph Images

**Purpose:** Generate attractive social media preview images when links are shared.

#### Homepage OG Image (`app/opengraph-image.tsx`)

**Features:**

- Generated dynamically using Next.js `ImageResponse` API
- Gradient background (purple to violet)
- Shows name, title, and key technologies
- Size: 1200x630px (optimal for all platforms)

**Access:** https://zavalatechlabs.com/opengraph-image.png

#### About Page OG Image (`app/about/opengraph-image.tsx`)

**Features:**

- Custom design for the about page
- Blue gradient background to differentiate from homepage
- Focused on "About Me" messaging
- Same optimal size: 1200x630px

**Access:** https://zavalatechlabs.com/about/opengraph-image.png

### 5. Favicons and Icons

**Purpose:** Provide branding across browsers and platforms.

**Implementation:**

- `app/icon.tsx`: Standard favicon (32x32)
- `app/apple-icon.tsx`: Apple touch icon (180x180)
- `public/icon-192.png`: PWA icon (192x192)
- `public/icon-512.png`: PWA icon (512x512)

**Features:**

- All icons use consistent branding (MZ initials)
- Gradient background matching site theme
- Generated programmatically for consistency

### 6. Enhanced Metadata (`app/layout.tsx`)

**Purpose:** Provide comprehensive metadata for search engines and social platforms.

**Features:**

#### Basic Metadata

- Enhanced title and description
- Relevant keywords for search optimization
- Author and creator information
- Publisher metadata

#### Robots Configuration

- Explicitly allows indexing
- Configures Google-specific directives
- Enables rich previews (images, videos, snippets)

#### Open Graph Tags

- Complete Open Graph implementation
- High-quality preview images
- Proper URLs and descriptions
- Optimized for Facebook, LinkedIn, etc.

#### Twitter Cards

- Large image card format
- Optimized titles and descriptions
- Proper image references

#### Canonical URLs

- Prevents duplicate content issues
- Uses environment-based base URL

### 7. Structured Data (JSON-LD)

**Purpose:** Help search engines understand site content and improve rich results.

**Schemas Implemented:**

#### Person Schema

```json
{
  "@type": "Person",
  "name": "Maximiliano Zavala",
  "jobTitle": "Full-Stack Developer",
  "knowsAbout": ["JavaScript", "TypeScript", "React", "Next.js", ...]
}
```

#### WebSite Schema

```json
{
  "@type": "WebSite",
  "name": "Maximiliano Zavala - Portfolio",
  "description": "...",
  "author": { "@type": "Person", "name": "Maximiliano Zavala" }
}
```

**Benefits:**

- Enhanced search results with rich snippets
- Better understanding of site purpose
- Potential for knowledge graph inclusion

## Testing & Validation

### 1. Open Graph Testing

**Tool:** https://www.opengraph.xyz/

**Steps:**

1. Enter your site URL
2. Verify preview image loads correctly
3. Check title and description
4. Test on multiple pages (home, about, projects)

**Expected Results:**

- Images should be 1200x630px
- Titles should be descriptive
- Descriptions should be compelling

### 2. Twitter Card Validation

**Tool:** https://cards-dev.twitter.com/validator

**Steps:**

1. Enter URL in validator
2. Preview the card appearance
3. Verify image and text display

**Expected Results:**

- Summary card with large image
- Clear title and description
- Professional appearance

### 3. Google Rich Results Test

**Tool:** https://search.google.com/test/rich-results

**Steps:**

1. Enter URL or paste code
2. Check for detected structured data
3. Verify no errors or warnings

**Expected Results:**

- Person schema detected
- WebSite schema detected
- All required properties present
- No validation errors

### 4. Lighthouse SEO Audit

**Tool:** Chrome DevTools > Lighthouse

**Steps:**

1. Open site in Chrome
2. Open DevTools (F12)
3. Navigate to Lighthouse tab
4. Run SEO audit

**Target Score:** ≥ 95/100

**Key Metrics:**

- ✓ Meta description present
- ✓ Page has title
- ✓ Links are crawlable
- ✓ robots.txt is valid
- ✓ Image alt text present
- ✓ Canonical URL set
- ✓ Structured data valid

### 5. Mobile-Friendly Test

**Tool:** https://search.google.com/test/mobile-friendly

**Steps:**

1. Enter site URL
2. Wait for analysis
3. Review mobile usability

**Expected Results:**

- Mobile-friendly designation
- No mobile usability issues
- Proper viewport configuration

## Maintenance

### Updating Project List

The sitemap automatically updates when new projects are added to `content/projects/`. No manual intervention needed.

### Changing Site URL

Update `NEXT_PUBLIC_BASE_URL` in `.env` or `.env.local`:

```bash
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

### Adding Social Media Links

To add social media to structured data:

1. Open `app/layout.tsx`
2. Update the `sameAs` array in the Person schema:

```typescript
sameAs: [
  'https://github.com/yourusername',
  'https://linkedin.com/in/yourusername',
  'https://twitter.com/yourusername',
],
```

## Performance Considerations

### Static Generation

All SEO files are generated at build time:

- robots.txt: Static output
- sitemap.xml: Generated from content at build time
- manifest.json: Static configuration
- OG images: Generated on-demand, cached by Next.js

### Caching

- OG images are cached by Next.js Image Optimization
- Sitemap is regenerated on each build
- Browsers cache icons and manifest per standard HTTP headers

## Best Practices Implemented

✅ **Semantic HTML:** Proper heading hierarchy and landmarks  
✅ **Meta Tags:** Complete set of meta tags for all pages  
✅ **Structured Data:** JSON-LD for enhanced search results  
✅ **Mobile Optimization:** Responsive design and viewport config  
✅ **Performance:** Optimized images and lazy loading  
✅ **Accessibility:** Alt text, ARIA labels, keyboard navigation  
✅ **Security:** HTTPS, proper CSP headers  
✅ **Social Sharing:** OG images and Twitter cards  
✅ **PWA Ready:** Manifest and service worker ready  
✅ **Canonical URLs:** Prevent duplicate content issues

## Future Enhancements

- [ ] Add XML sitemap index for large sites
- [ ] Implement breadcrumb structured data
- [ ] Add article schema for blog posts (if blog added)
- [ ] Set up Google Search Console
- [ ] Implement analytics tracking
- [ ] Add FAQ schema where applicable
- [ ] Create custom OG images for each project

## Resources

- [Next.js Metadata Docs](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Schema.org Documentation](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)
- [Google Search Central](https://developers.google.com/search)
- [Twitter Card Docs](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)

## Support

For questions or issues related to SEO implementation, consult:

1. This documentation
2. Next.js official documentation
3. Google Search Central help
