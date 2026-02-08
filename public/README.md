# Public Assets

This directory contains static assets served directly by Next.js.

## Structure

```
public/
├── images/
│   └── projects/       # Project screenshots and images
├── resume.pdf          # Downloadable resume (to be added)
├── favicon.ico         # Favicon (to be added)
└── README.md           # This file
```

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
