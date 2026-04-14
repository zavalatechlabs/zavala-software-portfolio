# Quick Start

Get the portfolio running locally in under 5 minutes.

## Prerequisites

- **Node.js** 18.17 or higher
- **npm** (ships with Node)
- **git**

## Setup

```bash
git clone https://github.com/zavalatechlabs/zavala-software-portfolio.git
cd zavala-software-portfolio
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You will see the homepage with the hero section, featured projects, and footer terminal window.

No environment variables are required for basic local development. The contact form will render but cannot send emails, and rate limiting uses an in-memory fallback.

## Optional Environment Variables

Copy `.env.example` to `.env.local` and fill in values as needed:

| Variable                   | Required  | Purpose                                                |
| -------------------------- | --------- | ------------------------------------------------------ |
| `RESEND_API_KEY`           | For email | Resend API key (must start with `re_`)                 |
| `CONTACT_EMAIL`            | For email | Where contact form submissions are delivered           |
| `FROM_EMAIL`               | No        | Sender address (defaults to Resend onboarding address) |
| `NEXT_PUBLIC_BASE_URL`     | For SEO   | Production URL for canonical tags and meta             |
| `UPSTASH_REDIS_REST_URL`   | No        | Persistent rate limiting (Upstash Redis)               |
| `UPSTASH_REDIS_REST_TOKEN` | No        | Must be set together with the URL above                |

Both Upstash variables must be set together or both omitted. See `lib/env.ts` for the full Zod validation schema.

## What You See

- **/** -- Hero section with animated name reveal, featured project cards, footer with terminal window
- **/projects** -- Grid of all projects loaded from `content/projects/*.mdx`
- **/projects/[slug]** -- Individual project detail page rendered from MDX
- **/about** -- About page with background and skills
- **/contact** -- Contact form (functional only when `RESEND_API_KEY` and `CONTACT_EMAIL` are set)

## Next Steps

- [Architecture](02-architecture.md) -- understand the tech stack and project structure
- [Development Workflow](03-development-workflow.md) -- scripts, git conventions, quality gates
- [Content Management](04-content-management.md) -- add or edit MDX project pages

## See Also

- [Architecture Overview](architecture-overview.md)
- [Security Posture](security-posture.md)
- [Testing Strategy](testing-strategy.md)
- `../CLAUDE.md` -- full project instructions for AI assistants

**Tags:** setup, getting-started, installation, local-development, environment-variables
