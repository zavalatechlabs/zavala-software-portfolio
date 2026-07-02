# Public Assets

This directory contains static assets served directly by Next.js.

## Structure

```
public/
├── images/
│   └── projects/       # Project illustrations (SVG)
├── icon-192.png        # PWA icon (referenced by app/manifest.ts)
├── icon-512.png        # PWA icon (referenced by app/manifest.ts)
├── resume.pdf          # Downloadable resume
└── README.md           # This file
```

Favicons and OG images are generated from code: `app/icon.tsx`,
`app/apple-icon.tsx`, and `app/opengraph-image.tsx` (Next.js file conventions).

## Guidelines

- Place all images in `/images/` subdirectories
- Optimize images before adding (use WebP when possible)
- Use descriptive filenames (project-name-screenshot.jpg)
- Keep file sizes reasonable (< 500KB for images)

## Referencing Assets

```tsx
import Image from 'next/image'
;<Image
  src="/images/projects/project-screenshot.jpg"
  alt="Project screenshot"
  width={800}
  height={600}
/>
```

Or for simple assets:

```html
<a href="/resume.pdf" download>Download Resume</a>
```
