# Zavala Software Portfolio

[![CI](https://github.com/zavalatechlabs/zavala-software-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/zavalatechlabs/zavala-software-portfolio/actions/workflows/ci.yml)

Professional software portfolio showcasing projects, skills, and experience for Zavala TechLabs.

## 📋 Project Resources

- **GitHub Repository:** [zavalatechlabs/zavala-software-portfolio](https://github.com/zavalatechlabs/zavala-software-portfolio)
- **Project Board:** [GitHub Project #1](https://github.com/users/zavalatechlabs/projects/1)
- **Architecture Documentation:** [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Status:** ✅ Phase 5: Final Polish & Launch Preparation
- **Deployment Guide:** [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)

## 🏗️ Architecture

This project uses a modern, secure, and performant tech stack:

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Content:** MDX (Markdown + React components, parsed via `gray-matter` + `next-mdx-remote`)
- **Deployment:** Vercel
- **Email:** Resend
- **Animations:** Framer Motion (with `prefers-reduced-motion` respected)

For complete architecture details, design decisions, and security considerations, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## ✨ Features

### Core Pages

- **Homepage:** Hero section with animated name reveal, featured projects showcase
- **About:** Professional bio, "What I Do" cards, skills showcase, resume download
- **Projects:** Grid of project cards, individual MDX-driven project case studies
- **Contact:** Validated form with rate limiting, honeypot, and Resend-powered email

### Interactive Elements

- **Terminal Code Window:** VS Code-themed footer terminal displaying developer info as syntax-highlighted TypeScript
- **Theme Toggle:** Dark/light mode via `next-themes` with persisted preference
- **Smooth Animations:** Framer Motion transitions, hover effects, and scroll reveals

### Technical Highlights

- **MDX Content Management:** Write projects in Markdown with embedded React components
- **Type-Safe:** Full TypeScript coverage with strict mode enabled
- **Responsive Design:** Mobile-first approach, tested across devices
- **Accessibility:** WCAG AA compliant, keyboard navigation, screen reader support
- **Performance Optimized:** Next.js Image optimization, code splitting, fast page loads
- **SEO Ready:** Meta tags, Open Graph, Twitter Cards, sitemap generation

## 📂 Project Structure

```
zavala-software-portfolio/
├── app/              # Next.js App Router (pages, layouts, API routes)
├── components/       # Reusable React components
├── content/          # MDX content files (projects, blog)
├── lib/              # Utility functions and helpers
├── public/           # Static assets (images, resume, etc.)
├── docs/             # Additional documentation
├── ARCHITECTURE.md   # Tech stack and architecture documentation
└── README.md         # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/zavalatechlabs/zavala-software-portfolio.git
cd zavala-software-portfolio

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run Jest tests
npm run test:e2e     # Run Playwright E2E tests
```

## 🌐 Deployment

This project is configured for deployment on Vercel with automatic builds from GitHub.

### Quick Deploy to Vercel

1. Push code to GitHub (already configured)
2. Go to [vercel.com](https://vercel.com) and import the repository
3. Vercel auto-detects Next.js and configures build settings
4. Click "Deploy"

For detailed deployment instructions, see [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md).

**Deployment Status:**

- ⏳ Awaiting manual Vercel connection
- Repository ready for deployment
- Build tested and passing

## 📚 Documentation

Additional documentation can be found in the `/docs` folder:

- [Design System](./docs/DESIGN_SYSTEM.md)
- [Animation Patterns](./docs/ANIMATION_PATTERNS.md)
- [Code Quality](./docs/CODE_QUALITY.md)
- [Testing](./docs/TESTING.md)
- [SEO](./docs/SEO.md)
- [Security](./docs/SECURITY.md)
- [Deployment](./docs/DEPLOYMENT.md)

## 🤝 Contributing

This is a personal portfolio project for Zavala TechLabs. For questions or suggestions, contact zavala.techlabs@gmail.com.

## 📄 License

_To be determined_

---

**Built with ❤️ by Zavala TechLabs** 🦞
