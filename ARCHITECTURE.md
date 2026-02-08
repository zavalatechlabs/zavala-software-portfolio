# Zavala Software Portfolio - Architecture Documentation

**Project:** Zavala Software Portfolio  
**Repository:** [zavalatechlabs/zavala-software-portfolio](https://github.com/zavalatechlabs/zavala-software-portfolio)  
**Team:** Zavala TechLabs  
**Architect:** ZTL Claw 🦞  
**Last Updated:** 2026-02-08

---

## Overview

Modern developer portfolio website showcasing projects, skills, and experience. Built with performance, security, and developer experience as top priorities.

---

## Tech Stack

### Frontend Framework
**Next.js 14+ (App Router)**
- **Why:** Industry standard for React applications, built-in SSR/SSG, excellent SEO, zero-config
- **Version:** Latest stable (14.x+)
- **Router:** App Router (modern approach, better DX)
- **Key Features:**
  - File-based routing
  - Server and Client Components
  - Built-in optimization (images, fonts, scripts)
  - API routes for backend functionality

**App Router vs Pages Router:**
- Using App Router (new standard)
- Benefits: Better layouts, server components by default, improved data fetching
- File structure: `app/page.tsx` instead of `pages/index.tsx`

### Language
**TypeScript**
- **Why:** Type safety, better IDE support, fewer runtime errors, self-documenting code
- **Configuration:** Strict mode enabled
- **Benefits:**
  - Catch errors at compile time
  - Better autocomplete and refactoring
  - Improved code quality and maintainability

### Styling
**Tailwind CSS**
- **Why:** Utility-first, fast iteration, consistent design system, responsive by default
- **Approach:** Utility classes for rapid development, component extraction for reusability
- **Key Features:**
  - Built-in design system (spacing, colors, typography)
  - Responsive breakpoints (sm, md, lg, xl)
  - Dark mode support (dark: prefix)
  - PurgeCSS for minimal production bundle

**Responsive Breakpoints:**
- `sm:` 640px+ (tablets)
- `md:` 768px+ (medium tablets)
- `lg:` 1024px+ (desktops)
- `xl:` 1280px+ (large desktops)

### Content Management
**MDX + Local Files**
- **Why:** Version-controlled, no CMS costs, flexible, supports embedded React components
- **Structure:** Projects stored as MDX files in `/content/projects/`
- **Benefits:**
  - Git versioning
  - Fast (no API calls)
  - Can embed interactive components in markdown
  - Simple backup and migration

**Content Structure:**
```
/content
  /projects
    project-1.mdx
    project-2.mdx
  /blog (optional for future)
```

### Animations
**Framer Motion**
- **Why:** Declarative animations, performant (GPU-accelerated), excellent DX
- **Use Cases:**
  - Page transitions
  - Scroll-triggered animations
  - Hover effects
  - Interactive elements

### Deployment
**Vercel**
- **Why:** Made by Next.js team, zero-config, automatic deployments, generous free tier
- **Features:**
  - Git-based deployment (push to GitHub → auto-deploy)
  - Preview deployments (every PR gets a unique URL)
  - Global CDN
  - Automatic HTTPS
  - Built-in analytics
  - Environment variable management

**Workflow:**
1. Push to GitHub
2. Vercel auto-builds
3. Preview URL generated
4. Merge to main → production deploy

**Custom Domain:** Will configure `zavalatechlabs.com` (or subdomain) later

### Email/Contact Form
**Resend + React Email**
- **Why:** Modern email API, free tier (100/day, 3K/month), React-based templates
- **Implementation:** Next.js API route handles form submissions
- **Security:** API key server-side only, rate limiting, optional CAPTCHA

**Alternative considered:** Formspree (simpler, but less customizable)

### Analytics
**Vercel Analytics**
- **Why:** Built-in, privacy-friendly, no cookie banner required
- **Features:** Page views, performance metrics, Web Vitals
- **Optional Addition:** Plausible Analytics for deeper insights (GDPR compliant)

---

## Architecture Patterns

### Server vs Client Components

**Server Components (Default):**
- Run on Vercel server
- Send only HTML to browser (no JavaScript)
- Can directly access databases, files, APIs
- Keep secrets server-side
- Examples: project lists, static content, layouts

**Client Components (Opt-in with `"use client"`):**
- Run in user's browser
- Needed for interactivity (useState, onClick, forms)
- Examples: contact form, animations, interactive buttons

**Rule of Thumb:**
- Start with Server Components (default)
- Add `"use client"` only when you need interactivity

### Data Flow

```
User Request
    ↓
Vercel Server (Next.js)
    ↓
Server Components render (fetch data, read files)
    ↓
HTML sent to browser (fast!)
    ↓
Client Components hydrate (add interactivity)
    ↓
User sees fully functional page
```

**Benefits:**
- Fast initial load (HTML ready immediately)
- Good SEO (search engines see full content)
- Less JavaScript to browser (faster on mobile)

---

## Project Structure

```
zavala-software-portfolio/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout (navbar, footer, shared UI)
│   ├── page.tsx             # Homepage (/)
│   ├── globals.css          # Global styles + Tailwind imports
│   ├── about/
│   │   └── page.tsx         # About page (/about)
│   ├── projects/
│   │   ├── page.tsx         # Projects list (/projects)
│   │   └── [slug]/
│   │       └── page.tsx     # Dynamic project pages (/projects/project-name)
│   ├── contact/
│   │   └── page.tsx         # Contact page with form (/contact)
│   └── api/
│       └── contact/
│           └── route.ts     # Contact form API handler (server-side)
├── components/               # Reusable UI components
│   ├── Navbar.tsx           # Navigation bar
│   ├── Footer.tsx           # Footer
│   ├── ProjectCard.tsx      # Project card component
│   ├── ContactForm.tsx      # Contact form (client component)
│   └── ui/                  # Shared UI elements (buttons, inputs, etc.)
├── content/                  # MDX content files
│   └── projects/
│       ├── project-1.mdx
│       └── project-2.mdx
├── lib/                      # Utility functions and helpers
│   ├── getProjects.ts       # MDX file reader and parser
│   ├── email.ts             # Email sending utilities
│   └── utils.ts             # General utilities
├── public/                   # Static assets (images, resume, etc.)
│   ├── images/
│   │   └── projects/        # Project screenshots/images
│   ├── resume.pdf
│   └── favicon.ico
├── styles/
│   └── globals.css          # Global Tailwind styles
├── .env.local               # Environment variables (not committed to git)
├── .env.example             # Example env vars (committed for reference)
├── .gitignore               # Git ignore rules
├── tailwind.config.ts       # Tailwind configuration (colors, fonts, etc.)
├── next.config.js           # Next.js configuration
├── tsconfig.json            # TypeScript configuration
├── package.json             # Dependencies and scripts
├── ARCHITECTURE.md          # This file
└── README.md                # Project overview and setup instructions
```

---

## Security Considerations

### Built-in Protections
✅ **Environment Variables:** Server-side by default (unless prefixed with `NEXT_PUBLIC_`)  
✅ **HTTPS:** Automatic on Vercel  
✅ **XSS Protection:** React escapes strings by default  
✅ **CSRF Protection:** Next.js API routes include CSRF tokens  
✅ **Dependency Scanning:** Run `npm audit` regularly  

### Additional Measures
- **Rate Limiting:** Middleware for API routes (contact form)
- **Security Headers:** Configure in `next.config.js`:
  - Content-Security-Policy
  - X-Frame-Options
  - X-Content-Type-Options
  - Referrer-Policy
- **Input Validation:** Server-side validation for all form inputs
- **Email Protection:** API keys stored as environment variables, never in code

### Configuration Example
```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      }
    ];
  }
};
```

---

## Development Workflow

### Local Development
1. Clone repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local` and configure
4. Run dev server: `npm run dev`
5. Open http://localhost:3000

### Git Workflow
1. Make changes locally
2. Test thoroughly
3. Commit with clear message (see Commit Standards below)
4. Push to GitHub
5. Vercel auto-deploys preview
6. Review preview URL
7. Merge to main → production deploy

### Commit Standards
- Use descriptive, imperative mood commit messages
- Examples:
  - `"add tech stack architecture documentation"`
  - `"implement contact form with Resend integration"`
  - `"fix responsive layout on mobile devices"`
  - `"update project card hover animations"`
- Group related changes in single commit
- Keep commits atomic (one logical change per commit)

---

## Performance Optimizations

### Built-in Next.js Optimizations
- **Image Optimization:** Next.js `<Image>` component (automatic WebP, lazy loading)
- **Font Optimization:** Next.js font loading (preload, no layout shift)
- **Code Splitting:** Automatic per-route code splitting
- **Static Generation:** Pre-render pages at build time when possible

### Tailwind Optimizations
- **PurgeCSS:** Removes unused styles in production
- **Minification:** Compressed CSS output
- **Tree Shaking:** Only includes utilities used in code

### Bundle Analysis
- Run `npm run build` to see bundle sizes
- Use `@next/bundle-analyzer` for detailed analysis
- Keep client-side JavaScript minimal

---

## Scalability Considerations

### Current Scale (Portfolio)
- Static/SSG pages where possible
- Minimal server-side logic
- No database needed (MDX content)
- CDN-delivered assets

### Future Growth Options
If portfolio evolves into a blog/business site:
- **CMS:** Add Sanity or Contentful for non-technical content editing
- **Database:** Add PostgreSQL (Vercel Postgres) for dynamic content
- **Authentication:** NextAuth.js for protected pages
- **API Routes:** Expand API routes for backend functionality

---

## Dependencies

### Core
- `next` - Framework
- `react` - UI library
- `react-dom` - React DOM rendering
- `typescript` - Type safety

### Styling
- `tailwindcss` - CSS framework
- `autoprefixer` - CSS vendor prefixes
- `postcss` - CSS processing

### Content
- `next-mdx-remote` - MDX support for Next.js
- `gray-matter` - Parse frontmatter in MDX files

### Animations
- `framer-motion` - Animation library

### Email
- `resend` - Email API client
- `@react-email/components` - Email templates

### Dev Tools
- `eslint` - Linting
- `prettier` - Code formatting
- `@types/*` - TypeScript definitions

---

## Deployment Configuration

### Environment Variables
```bash
# .env.local (not committed)
RESEND_API_KEY=re_***
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### Vercel Configuration
- **Framework Preset:** Next.js
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`
- **Node Version:** 18.x or higher

### Custom Domain Setup (Future)
1. Add domain in Vercel dashboard
2. Configure DNS records (provided by Vercel)
3. Wait for SSL certificate (automatic)
4. Domain live in ~5 minutes

---

## Testing Strategy

### Manual Testing
- Cross-browser testing (Chrome, Firefox, Safari)
- Mobile responsive testing (iOS, Android)
- Accessibility testing (screen readers, keyboard navigation)
- Performance testing (Lighthouse scores)

### Automated Testing (Optional for Future)
- **Unit Tests:** Jest + React Testing Library
- **E2E Tests:** Playwright or Cypress
- **Type Checking:** TypeScript compiler (`tsc --noEmit`)
- **Linting:** ESLint

---

## Accessibility

### Standards
- WCAG 2.1 Level AA compliance
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Screen reader friendly

### Implementation
- Proper heading hierarchy (h1 → h2 → h3)
- Alt text for all images
- Color contrast ratios (4.5:1 minimum)
- Focus indicators for interactive elements
- Skip links for navigation

---

## Browser Support

### Target Browsers
- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android 10+)

### Progressive Enhancement
- Core functionality works without JavaScript
- Enhanced experience with JavaScript enabled
- Graceful degradation for older browsers

---

## Future Enhancements

### Phase 2 (After Initial Launch)
- Blog section with MDX posts
- Dark mode toggle
- Advanced animations and interactions
- Open source projects integration (GitHub API)
- RSS feed for blog

### Phase 3 (Business Growth)
- Client testimonials section
- Case studies with detailed project breakdowns
- Contact form with scheduling integration (Calendly)
- Newsletter signup (ConvertKit or Mailchimp)

### Phase 4 (Advanced Features)
- Headless CMS (Sanity) for non-technical editing
- Search functionality
- Multi-language support (i18n)
- Admin dashboard for analytics

---

## Reference Links

### Official Documentation
- [Next.js App Router](https://nextjs.org/docs/app)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [Resend](https://resend.com/docs)
- [Vercel](https://vercel.com/docs)

### Inspiration & Examples
- [Developer Portfolios Repo](https://github.com/emmabostian/developer-portfolios)
- [Tailwind UI Components](https://tailwindui.com)
- [HyperUI Components](https://www.hyperui.dev)

---

## Questions or Changes?

This architecture is established but not set in stone. If requirements change or better approaches emerge, we'll update this document and discuss trade-offs before implementation.

**Contact:** zavala.techlabs@gmail.com  
**Repository:** [github.com/zavalatechlabs/zavala-software-portfolio](https://github.com/zavalatechlabs/zavala-software-portfolio)
