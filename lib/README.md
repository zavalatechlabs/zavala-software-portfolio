# Library / Utilities

This directory contains utility functions and helper modules.

## Files

- **utils.ts** - General utility functions (class merging, date formatting, etc.)
- **getProjects.ts** - MDX file reader and parser for project content (to be created)
- **email.ts** - Email sending utilities with Resend (to be created)

## Usage

```typescript
import { cn, formatDate } from '@/lib/utils'

// Merge Tailwind classes
const className = cn('text-lg', isActive && 'font-bold', 'text-gray-900')

// Format dates
const formattedDate = formatDate('2024-01-01') // "January 1, 2024"
```
