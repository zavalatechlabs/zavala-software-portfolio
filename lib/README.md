# Library / Utilities

This directory contains utility functions and helper modules.

## Files

- **projects.ts** - MDX file reader/parser with Zod-validated frontmatter
- **email.ts** - Email sending via Resend (timeout guard, header sanitization, error handling)
- **validation.ts** - Server-side Zod schema for the contact form
- **contact-form.ts** - Client-safe field limits/messages and per-field validator (no Zod in the client bundle)
- **rate-limit.ts** - Upstash-backed rate limiter with in-memory fallback
- **env.ts** - Lazy, Zod-validated server environment access
- **logger.ts** - Structured logger with PII redaction in production
- **schema.ts** - JSON-LD builders and safe serializer
- **site.ts** - Shared site URL/title/description constants

## Usage

```typescript
import { getAllProjects, getProjectBySlug } from '@/lib/projects'
import { validateContactField } from '@/lib/contact-form'
import { SITE_URL } from '@/lib/site'

const projects = getAllProjects() // newest first, Zod-validated frontmatter
const nameError = validateContactField('name', value) // string | null
```
