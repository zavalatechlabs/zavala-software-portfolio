# Security Reference

Security headers, contact form defense pipeline, rate limiting, environment handling, and API documentation. For the full security overview, see [../docs/SECURITY.md](../docs/SECURITY.md). For the audit checklist, see [../docs/SECURITY.md](../docs/SECURITY.md).

---

## Security Headers

All headers are configured in `next.config.js` and applied to every route (`/:path*`).

| Header                    | Value                                          |
| ------------------------- | ---------------------------------------------- |
| Strict-Transport-Security | `max-age=63072000; includeSubDomains; preload` |
| X-Frame-Options           | `DENY`                                         |
| X-Content-Type-Options    | `nosniff`                                      |
| X-XSS-Protection          | `1; mode=block`                                |
| Referrer-Policy           | `strict-origin-when-cross-origin`              |
| Permissions-Policy        | `camera=(), microphone=(), geolocation=()`     |
| X-DNS-Prefetch-Control    | `on`                                           |

### Content Security Policy

```
default-src 'self';
script-src 'self' 'unsafe-inline';
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
font-src 'self' data:;
connect-src 'self';
frame-ancestors 'none';
base-uri 'self';
form-action 'self';
object-src 'none'
```

`unsafe-inline` on `script-src` is required by Next.js runtime scripts and next-themes FOUC prevention. `unsafe-eval` has been removed. API routes additionally get `Cache-Control: no-store, no-cache, must-revalidate, max-age=0`.

---

## Contact Form Defense Pipeline

Requests to `POST /api/contact` pass through these layers in order:

1. **Rate limiting** -- 5 requests per hour per IP (checked first, before body parsing)
2. **Zod validation** -- schema enforces field lengths, email format, control-character rejection
3. **Honeypot check** -- if `website` field is non-empty, return fake 200 (bot silently discarded)
4. **CRLF sanitization** -- regex in Zod rejects `\r`, `\n`, `\0`, `\u2028`, `\u2029` in name/email
5. **HTML encoding** -- `sanitizeHtml()` in `lib/validation.ts` escapes `& < > " ' /` before email body

---

## Rate Limiting

Defined in `lib/rate-limit.ts`. 5 requests per hour per client IP.

| Backend       | When                                        | Persistence          |
| ------------- | ------------------------------------------- | -------------------- |
| Upstash Redis | `UPSTASH_REDIS_REST_URL` + `TOKEN` both set | Survives cold starts |
| In-memory     | Either env var missing                      | Resets on cold start |

The Upstash limiter uses `Ratelimit.slidingWindow(5, '1 h')` with prefix `ratelimit:contact`. Both backends expose the same `isRateLimited(key)` API.

---

## Environment Variable Handling

`lib/env.ts` defines a Zod schema for server-side env vars. Validation is **lazy** -- it runs on the first call to `getEnv()`, not at import time. This allows static generation to succeed without all env vars present at build time.

| Variable                   | Required | Notes                                  |
| -------------------------- | -------- | -------------------------------------- |
| `RESEND_API_KEY`           | Yes      | Must start with `re_`                  |
| `CONTACT_EMAIL`            | Yes      | Valid email format                     |
| `FROM_EMAIL`               | No       | Defaults to Resend onboarding sender   |
| `UPSTASH_REDIS_REST_URL`   | No       | Must be set with TOKEN or both omitted |
| `UPSTASH_REDIS_REST_TOKEN` | No       | Must be set with URL or both omitted   |

The parsed result is frozen and cached after first validation.

---

## PII Redaction in Logs

`lib/logger.ts` automatically redacts fields named `ip`, `email`, or `clientIp` with `[REDACTED]` in production (JSON structured logs). In development, output is human-readable via `console.*`.

---

## API Reference

### POST /api/contact

Handles contact form submissions.

**Request body:**

```json
{
  "name": "string (1-100 chars, required)",
  "email": "string (valid email, max 255 chars, required)",
  "message": "string (10-5000 chars, required)",
  "website": "string (optional, honeypot -- must be empty)"
}
```

**Response: 200 Success**

```json
{ "success": true, "message": "Message sent successfully!" }
```

**Response: 200 Honeypot triggered** (identical shape -- bot cannot distinguish)

```json
{ "success": true, "message": "Message sent successfully!" }
```

**Response: 400 Validation error**

```json
{
  "success": false,
  "message": "Validation failed",
  "code": "validation_error",
  "details": [{ "field": "email", "message": "Invalid email address" }]
}
```

**Response: 429 Rate limited**

```json
{
  "success": false,
  "message": "Too many requests",
  "code": "rate_limited",
  "retryAfter": "1 hour"
}
```

**Response: 500 Server error**

```json
{
  "success": false,
  "message": "Failed to send message. Please try again later.",
  "code": "server_error"
}
```

### GET /api/contact

Health check endpoint. No authentication or rate limiting.

**Response: 200**

```json
{ "status": "ok" }
```

---

## See Also

- [../docs/SECURITY.md](../docs/SECURITY.md) -- full security configuration reference
- [06-testing.md](06-testing.md) -- API route test patterns (route.test.ts)
- [05-design-system.md](05-design-system.md) -- CSP implications for inline styles

**Tags:** security, csp, headers, rate-limiting, validation, honeypot, api, environment-variables, logging
