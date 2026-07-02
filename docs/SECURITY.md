# Security Configuration

This document explains the security measures implemented in the Zavala Software Portfolio.

## Security Headers

Security headers are configured in `next.config.js` and applied to all routes.

### Headers Overview

| Header                        | Value                                          | Purpose                                            |
| ----------------------------- | ---------------------------------------------- | -------------------------------------------------- |
| **X-DNS-Prefetch-Control**    | `on`                                           | Enables DNS prefetching for improved performance   |
| **Strict-Transport-Security** | `max-age=63072000; includeSubDomains; preload` | Forces HTTPS for 2 years, including subdomains     |
| **X-Frame-Options**           | `DENY`                                         | Prevents clickjacking by blocking iframe embedding |
| **X-Content-Type-Options**    | `nosniff`                                      | Prevents MIME type sniffing                        |
| **Referrer-Policy**           | `strict-origin-when-cross-origin`              | Controls referrer information sent with requests   |
| **Permissions-Policy**        | `camera=(), microphone=(), geolocation=()`     | Disables unnecessary browser features              |
| **Content-Security-Policy**   | See below                                      | Controls which resources can be loaded             |

API routes additionally send `Cache-Control: no-store, no-cache, must-revalidate, max-age=0`.

`X-XSS-Protection` is intentionally **not** sent: the legacy browser XSS
auditor is deprecated and can itself introduce vulnerabilities. CSP is the
real protection. `X-Powered-By` is disabled via `poweredByHeader: false`.

### Content Security Policy (CSP)

Our CSP is configured to:

- **`default-src 'self'`** - Only load resources from same origin by default
- **`script-src 'self' 'unsafe-inline'`** - Inline scripts allowed (Next.js bootstrap + next-themes pre-hydration script). `unsafe-eval` is NOT allowed.
- **`style-src 'self' 'unsafe-inline'`** - Allow inline styles (required for Tailwind)
- **`img-src 'self' data: https:`** - Allow images from same origin, data URIs, and HTTPS
- **`font-src 'self' data:`** - Allow fonts from same origin and data URIs
- **`connect-src 'self'`** - Only allow API calls to same origin
- **`frame-ancestors 'none'`** - Prevent embedding in iframes
- **`base-uri 'self'`** - Restrict base tag URLs
- **`form-action 'self'`** - Only allow form submissions to same origin
- **`object-src 'none'`** - Block plugins/objects

**Note:** `unsafe-inline` on `script-src`/`style-src` is required by Next.js
and Tailwind today. A nonce-based CSP via middleware is a tracked follow-up.

## Environment Variables

Sensitive data is stored in environment variables and never committed to Git.
`lib/env.ts` validates them lazily with Zod on first access and fails loudly
with a descriptive error if anything required is missing or malformed
(including a paired-variable check for the Upstash credentials).

### Required Variables (Production)

```bash
RESEND_API_KEY=re_your_api_key_here   # must start with re_
CONTACT_EMAIL=you@example.com          # where submissions are delivered
```

### Optional Variables

```bash
FROM_EMAIL="Portfolio Contact <onboarding@resend.dev>"  # sender (has default)
UPSTASH_REDIS_REST_URL=...    # persistent rate limiting (recommended in prod)
UPSTASH_REDIS_REST_TOKEN=...  # must be set together with the URL
```

### Public Variables

```bash
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

**Important:** Only prefix variables with `NEXT_PUBLIC_` if they need to be
exposed to the browser. All other variables remain server-side only.

## HTTPS/TLS

- **Vercel Deployment:** Automatic HTTPS with Let's Encrypt certificates
- **HSTS Header:** Forces HTTPS for 2 years with preload
- **Mixed Content:** Prevented by CSP and HTTPS enforcement

## Contact Form Defense Pipeline (implemented)

`app/api/contact/route.ts` runs, in order:

1. **Rate limiting** — 5 requests/hour per IP, keyed on `x-real-ip` (proxy-verified) with `x-forwarded-for` fallback. Uses Upstash Redis when configured; otherwise a per-instance in-memory sliding window with periodic key eviction. Counted before validation so invalid probes also consume quota.
2. **Zod validation** — `lib/validation.ts`: trim-first length checks, email format, and control-character rejection (`\r`, `\n`, null bytes, Unicode line separators) on every field. Field-level errors are returned as structured `details`.
3. **Honeypot** — a hidden `website` field; bots that fill it receive a **fake success** response so they can't learn they were caught.
4. **Sanitization** — `sanitizeForHeader()` strips header-injection characters from values used in the email subject/reply-to; `sanitizeHtml()` entity-encodes all user content in the email body.
5. **Send** — Resend with a 10 s timeout guard. The SDK's `{ data, error }` response is checked explicitly; API-level errors return a 500 to the client instead of a false success.

Client-side, `ContactForm` mirrors the same limits via `lib/contact-form.ts`
(no Zod in the browser bundle) for inline UX, and surfaces the API's
structured 429/validation responses. There is deliberately **no** client-side
timing check — an earlier version silently discarded fast (autofilled)
legitimate submissions.

## Logging

`lib/logger.ts` emits structured JSON in production and redacts PII fields
(`ip`, `clientIp`, `email`, `name`). Errors return generic messages to
clients; details stay server-side.

## Dependency Security

### Regular Audits

Run security audits regularly:

```bash
npm audit
npm audit fix          # Fix non-breaking issues
```

**Known accepted advisory:** Next.js pins an internal `postcss@8.4.31`
(GHSA-qx2v-qp2m-jg93, moderate). It is build-time only, processes no
untrusted CSS in this project, and npm's proposed "fix" is a breaking
downgrade of Next itself. It will clear when Next bumps its internal pin.

### Dependabot

GitHub Dependabot is enabled to:

- Monitor for vulnerable dependencies
- Auto-create PRs for security updates
- Alert on new vulnerabilities

## API Security

Implemented for `/api/contact` (see pipeline above) and `/api/health`
(no sensitive data — returns a static `{ status: 'ok' }`). Rules for future
routes live in `.claude/rules/api-security.md`:

- Validate all inputs with Zod
- Rate limit POST endpoints
- Extract client IP: `x-real-ip` → first `x-forwarded-for` entry → `unknown`
- Log with `logger.*` (PII-redacting); return generic errors to clients

## Monitoring

### Vercel Analytics

- Monitor for unusual traffic patterns
- Track errors and performance
- Alert on anomalies

### Verifying Headers

1. Open browser dev tools (F12) → Network tab → any request → Response Headers
2. Or use [Security Headers](https://securityheaders.com), [SSL Labs](https://www.ssllabs.com/ssltest/), [Mozilla Observatory](https://observatory.mozilla.org)

## Incident Response

If a security issue is discovered:

1. **Assess Impact:** Understand scope and severity
2. **Mitigate:** Deploy fix or temporary workaround
3. **Document:** Record what happened and how it was fixed
4. **Notify:** Inform affected users if necessary
5. **Post-Mortem:** Analyze and improve processes

## Security Checklist

- ✅ Security headers configured (HSTS, CSP, frame/MIME protections)
- ✅ HTTPS enforced via HSTS
- ✅ CSP without `unsafe-eval`; `form-action 'self'`
- ✅ Clickjacking prevented (X-Frame-Options + frame-ancestors)
- ✅ Environment variables validated lazily with Zod
- ✅ Contact form: rate limiting, validation, honeypot, header-injection + XSS sanitization
- ✅ Structured logging with PII redaction
- ✅ Dependencies audited; Dependabot enabled
- ⏳ Nonce-based CSP (follow-up)
- ⏳ Error monitoring service (e.g. Sentry) — logger is structured and ready

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/security-headers)
- [MDN Security Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers#security)
- [Vercel Security](https://vercel.com/docs/security/overview)

## Contact

For security concerns or to report vulnerabilities, contact: zavala.techlabs@gmail.com

---

**Last Updated:** 2026-07-02
**Next Review:** 2026-10-02 (quarterly)
