---
paths:
  - 'app/api/**/*.ts'
---

# API Route Rules

- Extract client IP: x-real-ip (proxy-verified) -> x-forwarded-for (first entry) -> "unknown".
- Log errors with `logger.error()` from `@/lib/logger` (redacts PII in production).
- Return generic error messages to clients. Include details only in dev mode.
- POST endpoints: validate with Zod, check rate limiting, check honeypot if applicable.
- GET endpoints (health checks): no rate limiting or validation needed.
- Test files need `/** @jest-environment node */` docblock.
