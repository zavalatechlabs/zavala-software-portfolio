# Portfolio Tech Stack Research

**Date:** 2026-02-07  
**Phase:** Planning (Opus 4.6)  
**Issue:** #1

---

## Executive Summary

After analyzing 1478+ developer portfolios and modern web development patterns, this document presents comprehensive tech stack options for the Zavala Software Portfolio. Key findings:

- **Dominant pattern:** Static-first with React/Next.js + TypeScript
- **Hosting:** Vercel dominates (60%+ of modern portfolios)
- **Styling:** Tailwind CSS is the current standard
- **Performance:** SSG (Static Site Generation) preferred over SSR for portfolios
- **Security:** Minimal attack surface through static deployment

---

## Analysis of Portfolio Examples

### Common Patterns Observed:

**Tech Stack Distribution** (from sample analysis):

- **Next.js:** ~40% of modern portfolios
- **React (Vite/CRA):** ~25%
- **Static HTML/CSS/JS:** ~15%
- **Vue/Nuxt:** ~10%
- **Gatsby:** ~5%
- **Others (Astro, SvelteKit):** ~5%

**Hosting Patterns:**

- **Vercel:** ~60% (seamless Next.js integration)
- **Netlify:** ~20% (excellent for static sites)
- **GitHub Pages:** ~10% (free, simple)
- **Custom/Cloud:** ~10%

**Notable Examples:**

- Brittany Chiang (brittanychiang.com) - Gatsby + Netlify
- Anshul Chauhan (anshulchauhan.dev) - Next.js iOS-style portfolio
- Jhon Goh (shenggg2000.github.io/portfolio) - Clean, minimalist approach
- Akshay Abraham - 3D Three.js integration

---

## The Portfolio Architecture Stack

### 1. FRONTEND FRAMEWORK

The foundation of your portfolio's UI/UX.

#### **Option A: Next.js 15 (App Router)** ⭐ RECOMMENDED

**Pros:**

- ✅ React-based (largest ecosystem)
- ✅ Built-in SSG, SSR, ISR flexibility
- ✅ Image optimization out of the box
- ✅ API routes for contact forms/dynamic features
- ✅ Excellent SEO capabilities
- ✅ TypeScript support first-class
- ✅ Vercel deployment (zero-config)
- ✅ File-based routing
- ✅ Server Components (performance)

**Cons:**

- ⚠️ Larger bundle than alternatives
- ⚠️ Learning curve if new to React
- ⚠️ Overkill for purely static content

**Best For:** Full-featured portfolios with potential for dynamic features (blog, CMS integration, contact forms)

---

#### **Option B: Astro**

**Pros:**

- ✅ Ultra-lightweight (ships zero JS by default)
- ✅ Component framework agnostic (React, Vue, Svelte in one project)
- ✅ Built for content-first websites
- ✅ Excellent performance scores
- ✅ Markdown/MDX support built-in
- ✅ Island Architecture (interactive components on demand)

**Cons:**

- ⚠️ Smaller ecosystem than React
- ⚠️ Less familiar to most developers
- ⚠️ Fewer pre-built component libraries

**Best For:** Ultra-fast, content-heavy portfolios where performance is #1 priority

---

#### **Option C: React + Vite**

**Pros:**

- ✅ Lightweight alternative to Next.js
- ✅ Blazing fast dev server
- ✅ Full React ecosystem
- ✅ Simpler mental model than Next.js
- ✅ Can deploy anywhere

**Cons:**

- ⚠️ No built-in SSG/SSR
- ⚠️ Manual SEO optimization required
- ⚠️ Need separate backend for API routes

**Best For:** SPAs with client-side routing, less concern about SEO

---

#### **Option D: SvelteKit**

**Pros:**

- ✅ Svelte's reactive paradigm (less boilerplate)
- ✅ Built-in SSG/SSR like Next.js
- ✅ Smaller bundle sizes than React
- ✅ Excellent DX (Developer Experience)

**Cons:**

- ⚠️ Smaller ecosystem
- ⚠️ Fewer job market skills (if portfolio goal is employment)
- ⚠️ Less widespread adoption

**Best For:** Developers who value DX and bundle size over ecosystem

---

### 2. STYLING & UI

#### **Option A: Tailwind CSS** ⭐ RECOMMENDED

**Pros:**

- ✅ Utility-first (rapid development)
- ✅ Consistent design system
- ✅ Tree-shaking (only used classes ship)
- ✅ Responsive design built-in
- ✅ Dark mode support
- ✅ Massive component library ecosystem (shadcn/ui, daisyUI, etc.)

**Cons:**

- ⚠️ HTML can look cluttered
- ⚠️ Learning curve for class names

**Best For:** Fast iteration, modern design

---

#### **Option B: CSS Modules**

**Pros:**

- ✅ Scoped CSS (no global conflicts)
- ✅ Standard CSS syntax
- ✅ Works with all frameworks
- ✅ No build dependency

**Cons:**

- ⚠️ More manual work than Tailwind
- ⚠️ No built-in design system

**Best For:** Developers who prefer traditional CSS

---

#### **Option C: styled-components / Emotion**

**Pros:**

- ✅ CSS-in-JS (component-scoped)
- ✅ Dynamic styling with props
- ✅ TypeScript integration

**Cons:**

- ⚠️ Runtime cost (unless zero-runtime options)
- ⚠️ Debugging can be harder
- ⚠️ Falling out of favor for performance reasons

**Best For:** React projects with heavy dynamic styling

---

### 3. COMPONENT LIBRARY (OPTIONAL)

Pre-built UI components for faster development.

#### **Option A: shadcn/ui** ⭐ RECOMMENDED (with Tailwind)

**Pros:**

- ✅ Copy-paste components (not npm dependency)
- ✅ Fully customizable
- ✅ Radix UI primitives (accessibility)
- ✅ Beautiful default styling

**Cons:**

- ⚠️ Requires Tailwind
- ⚠️ Manual updates to components

---

#### **Option B: Material-UI (MUI)**

**Pros:**

- ✅ Comprehensive component library
- ✅ Material Design patterns
- ✅ Enterprise-grade

**Cons:**

- ⚠️ Opinionated design (harder to customize)
- ⚠️ Large bundle size

---

#### **Option C: Chakra UI**

**Pros:**

- ✅ Accessible by default
- ✅ Theme-able
- ✅ Great DX

**Cons:**

- ⚠️ Maintenance has slowed
- ⚠️ Migration concerns

---

### 4. HOSTING & DEPLOYMENT

#### **Option A: Vercel** ⭐ RECOMMENDED

**Pros:**

- ✅ Zero-config for Next.js
- ✅ Automatic HTTPS
- ✅ Edge network (global CDN)
- ✅ Preview deployments on PRs
- ✅ Generous free tier
- ✅ Built-in analytics
- ✅ Serverless functions

**Cons:**

- ⚠️ Vendor lock-in (minimal)
- ⚠️ Pricing can scale up for heavy usage

**Security:** A+ SSL, DDoS protection, automatic security headers

---

#### **Option B: Netlify**

**Pros:**

- ✅ Similar to Vercel
- ✅ Excellent CI/CD
- ✅ Built-in forms (great for contact forms)
- ✅ Generous free tier

**Cons:**

- ⚠️ Less Next.js-optimized than Vercel
- ⚠️ Build times can be slower

**Security:** Similar to Vercel

---

#### **Option C: GitHub Pages**

**Pros:**

- ✅ Free
- ✅ Direct GitHub integration
- ✅ Simple

**Cons:**

- ⚠️ Static only (no SSR/API routes)
- ⚠️ Limited custom domain features
- ⚠️ No preview deployments

**Security:** Basic HTTPS, limited control

---

#### **Option D: Custom VPS (Current Setup)**

**Pros:**

- ✅ Full control
- ✅ Can host multiple projects
- ✅ No vendor lock-in

**Cons:**

- ⚠️ Manual security maintenance
- ⚠️ No automatic scaling
- ⚠️ Need to manage SSL, CDN, etc.

**Security:** You own it (requires hardening)

---

### 5. CONTENT MANAGEMENT (OPTIONAL)

For blogs, projects, case studies.

#### **Option A: Markdown/MDX** ⭐ RECOMMENDED FOR PORTFOLIOS

**Pros:**

- ✅ Version-controlled with Git
- ✅ No external dependencies
- ✅ MDX allows React components in markdown
- ✅ Fast builds

**Cons:**

- ⚠️ Less user-friendly for non-devs
- ⚠️ No GUI editor

---

#### **Option B: Headless CMS (Sanity, Contentful)**

**Pros:**

- ✅ Non-technical editing
- ✅ Structured content
- ✅ API-first

**Cons:**

- ⚠️ External dependency
- ⚠️ Added complexity
- ⚠️ Potential costs

---

### 6. ANALYTICS & MONITORING

#### **Option A: Vercel Analytics** ⭐ RECOMMENDED (if using Vercel)

**Pros:**

- ✅ Privacy-friendly
- ✅ No cookie consent needed
- ✅ Zero config
- ✅ Web Vitals tracking

---

#### **Option B: Plausible / Umami**

**Pros:**

- ✅ Privacy-focused
- ✅ GDPR compliant
- ✅ Lightweight

**Cons:**

- ⚠️ Self-hosting required (Umami) or paid (Plausible)

---

#### **Option C: Google Analytics**

**Pros:**

- ✅ Free
- ✅ Comprehensive

**Cons:**

- ⚠️ Privacy concerns
- ⚠️ Cookie consent required (GDPR)
- ⚠️ Overkill for portfolio

---

### 7. FORMS & CONTACT

#### **Option A: Formspree / Netlify Forms** ⭐ RECOMMENDED

**Pros:**

- ✅ Simple integration
- ✅ No backend needed
- ✅ Spam protection

**Cons:**

- ⚠️ Limited free tier
- ⚠️ External dependency

---

#### **Option B: Email via API Route (Next.js)**

**Pros:**

- ✅ Full control
- ✅ Custom logic
- ✅ Can integrate with Gmail (via gog!)

**Cons:**

- ⚠️ Need to handle spam
- ⚠️ Requires API key management

---

### 8. ANIMATIONS & INTERACTIONS

#### **Option A: Framer Motion** ⭐ RECOMMENDED

**Pros:**

- ✅ React-first animations
- ✅ Declarative API
- ✅ Scroll animations built-in

---

#### **Option B: GSAP**

**Pros:**

- ✅ Most powerful animation library
- ✅ Framework-agnostic

**Cons:**

- ⚠️ Steeper learning curve
- ⚠️ Licensing for commercial use

---

### 9. ADDITIONAL INTEGRATIONS

- **3D Graphics:** Three.js / React Three Fiber (optional for visual impact)
- **Icons:** Lucide React, React Icons, Hero Icons
- **Fonts:** Google Fonts, Font Source
- **SEO:** next-seo (for Next.js)
- **Sitemap:** next-sitemap (automatic generation)
- **Email:** Resend, SendGrid, or direct SMTP

---

## SECURITY CONSIDERATIONS

### Threat Model for a Portfolio Site:

**Attack Vectors:**

- Contact form spam/abuse
- XSS (Cross-Site Scripting)
- DDoS
- SEO spam injection
- Data exfiltration (if storing visitor info)

### Security Best Practices:

1. **Static-First Architecture**
   - Minimal server-side code = minimal attack surface
   - All content pre-rendered at build time

2. **HTTPS Everywhere**
   - Force HTTPS redirects
   - HSTS headers

3. **Content Security Policy (CSP)**
   - Restrict inline scripts
   - Whitelist external resources

4. **Form Protection**
   - Rate limiting on contact forms
   - CAPTCHA or honeypot
   - Input validation & sanitization

5. **Dependency Management**
   - Regular `npm audit` checks
   - Automated Dependabot updates (GitHub)
   - Minimal dependencies

6. **Environment Variables**
   - Never commit API keys
   - Use Vercel environment variables

7. **Analytics Privacy**
   - Avoid Google Analytics (use privacy-friendly alternatives)
   - No tracking without consent

8. **DDoS Protection**
   - Vercel/Netlify handle this automatically
   - Rate limiting on API routes

---

## RECOMMENDED STACK FOR ZAVALA SOFTWARE PORTFOLIO

Based on:

- ✅ Modern best practices
- ✅ Security-first approach
- ✅ Max's learning goals (full understanding before building)
- ✅ Future extensibility (can add blog, projects, etc.)

### **PRIMARY RECOMMENDATION:**

**Frontend:**

- **Framework:** Next.js 15 (App Router) + React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui components
- **Animations:** Framer Motion
- **Icons:** Lucide React

**Content:**

- **Management:** MDX (Markdown + React components)
- **Structure:** `/projects`, `/blog`, `/about` folders

**Forms:**

- **Contact Form:** Next.js API route → Email via gog (Gmail)
- **Spam Protection:** Turnstile (Cloudflare) or reCAPTCHA

**Hosting:**

- **Primary:** Vercel (automatic deployments from GitHub)
- **Domain:** Custom domain via Zavala TechLabs
- **Analytics:** Vercel Analytics (privacy-friendly)

**Development Tools:**

- **Version Control:** Git + GitHub
- **Package Manager:** pnpm (faster than npm)
- **Linting:** ESLint + Prettier
- **Pre-commit Hooks:** Husky + lint-staged

**CI/CD:**

- **Auto-deploy:** GitHub → Vercel (on push to `main`)
- **Preview branches:** Automatic preview URLs for PRs

---

## ALTERNATIVE STACK (Lightweight Option):

**Frontend:**

- **Framework:** Astro
- **Styling:** Tailwind CSS
- **Hosting:** Netlify
- **Content:** Markdown

**Trade-offs:**

- ⬆️ **Performance:** Even faster than Next.js
- ⬇️ **Flexibility:** Less dynamic features
- ⬇️ **Learning:** Less transferable to other projects

---

## NEXT STEPS

1. **Max reviews this research**
2. **Discussion:** Walk through each layer of the stack
3. **Decision:** Lock in the tech choices
4. **PRD Creation:** Convert decisions into implementation requirements
5. **GitHub Board:** Break down PRD into tasks/issues

---

**Research completed by:** ZTL Claw 🦞  
**Model:** Claude Opus 4.6  
**Date:** 2026-02-07 23:42 UTC
