# Components

This directory contains reusable React components used throughout the application.

## Structure

```
components/
├── ui/                 # Shared UI components (buttons, inputs, cards)
├── Navbar.tsx         # Navigation bar component
├── Footer.tsx         # Footer component
├── ProjectCard.tsx    # Project card for listing projects
├── ContactForm.tsx    # Contact form (client component)
└── README.md          # This file
```

## Guidelines

- Use TypeScript for all components
- Server Components by default (add `"use client"` only when needed)
- Include JSDoc comments for complex components
- Follow naming convention: PascalCase for components
- Use Tailwind CSS for styling
- Keep components focused and single-responsibility
