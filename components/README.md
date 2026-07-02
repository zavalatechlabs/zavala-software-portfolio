# Components

This directory contains reusable React components used throughout the application.

## Structure

```
components/
├── ui/                     # Shared UI primitives (Button, ButtonLink, Card, Input, Textarea, Label)
├── animations/             # CSS-driven entrance animations (HeroNameReveal, FadeInView, DecipherText)
├── contact/                # ContactForm (client component)
├── Navbar.tsx              # Navigation bar (client: mobile menu state)
├── Footer.tsx              # Footer (server component)
├── LazyTerminalWindow.tsx  # Loads TerminalWindow when the footer nears the viewport
├── TerminalWindow.tsx      # Decorative code terminal (client: collapse toggle)
├── ThemeProvider.tsx       # next-themes provider
├── ThemeToggle.tsx         # Dark/light toggle with hydration guard
└── README.md               # This file
```

## Guidelines

- Use TypeScript for all components
- Server Components by default (add `"use client"` only when needed)
- Include JSDoc comments for complex components
- Follow naming convention: PascalCase for components
- Use Tailwind CSS for styling
- Keep components focused and single-responsibility
