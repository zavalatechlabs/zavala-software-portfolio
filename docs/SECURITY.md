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
| **X-XSS-Protection**          | `1; mode=block`                                | Enables browser XSS protection                     |
| **Referrer-Policy**           | `strict-origin-when-cross-origin`              | Controls referrer information sent with requests   |
| **Permissions-Policy**        | `camera=(), microphone=(), geolocation=()`     | Disables unnecessary browser features              |
| **Content-Security-Policy**   | See below                                      | Controls which resources can be loaded             |

### Content Security Policy (CSP)

Our CSP is configured to:

- **`default-src 'self'`** - Only load resources from same origin by default
- **`script-src 'self' 'unsafe-inline'`** - Allow inline scripts (required for Next.js bootstrap and next-themes pre-hydration). `'unsafe-eval'` has been removed; nonce-based CSP is a planned follow-up.
- **`style-src 'self' 'unsafe-inline'`** - Allow inline styles (required for Tailwind)
- **`img-src 'self' data: https:`** - Allow images from same origin, data URIs, and HTTPS
- **`font-src 'self' data:`** - Allow fonts from same origin and data URIs
- **`connect-src 'self'`** - Only allow API calls to same origin
- **`frame-ancestors 'none'`** - Prevent embedding in iframes
- **`base-uri 'self'`** - Restrict base tag URLs
- **`form-action 'self'`** - Only allow form submissions to same origin

**Note:** `unsafe-inline` is necessary for Next.js bootstrap scripts, next-themes pre-hydration, and Tailwind CSS to function. In a future enhancement, nonces or hashes via middleware could replace `unsafe-inline` on `script-src` for a stricter CSP.

## Environment Variables

Sensitive data is stored in environment variables and never committed to Git.

### Required Variables (Production)

```bash
RESEND_API_KEY=re_your_api_key_here
```

### Public Variables

```bash
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

**Important:** Only prefix variables with `NEXT_PUBLIC_` if they need to be exposed to the browser. All other variables remain server-side only.

## HTTPS/TLS

- **Vercel Deployment:** Automatic HTTPS with Let's Encrypt certificates
- **HSTS Header:** Forces HTTPS for 2 years with preload
- **Mixed Content:** Prevented by CSP and HTTPS enforcement

## Input Validation

### Contact Form (Future Enhancement)

When implemented, the contact form will include:

- Server-side validation of all inputs
- Email validation (format and domain checks)
- Rate limiting (max 5 submissions per hour per IP)
- CAPTCHA or honeypot for spam prevention
- XSS prevention through React's built-in escaping

## Dependency Security

### Regular Audits

Run security audits regularly:

```bash
npm audit
npm audit fix          # Fix non-breaking issues
npm audit fix --force  # Fix all issues (may break things)
```

### Dependabot

GitHub Dependabot is enabled to:

- Monitor for vulnerable dependencies
- Auto-create PRs for security updates
- Alert on new vulnerabilities

## Authentication (Future)

If authentication is added in the future:

- Use NextAuth.js or Clerk for OAuth
- Implement CSRF protection
- Use secure, HttpOnly cookies
- Hash passwords with bcrypt (if using credentials)
- Implement rate limiting on login

## API Security

When API routes are added:

- Validate all inputs
- Implement rate limiting
- Use API keys or JWT for authentication
- Log all requests for monitoring
- Handle errors without leaking info

## Monitoring

### Vercel Analytics

- Monitor for unusual traffic patterns
- Track errors and performance
- Alert on anomalies

### Browser Dev Tools

Test security headers locally:

1. Open browser dev tools (F12)
2. Go to Network tab
3. Click any request
4. Check Response Headers
5. Verify security headers are present

### Online Tools

- [Security Headers](https://securityheaders.com) - Check header configuration
- [SSL Labs](https://www.ssllabs.com/ssltest/) - Test SSL/TLS configuration
- [Mozilla Observatory](https://observatory.mozilla.org) - Comprehensive security scan

## Incident Response

If a security issue is discovered:

1. **Assess Impact:** Understand scope and severity
2. **Mitigate:** Deploy fix or temporary workaround
3. **Document:** Record what happened and how it was fixed
4. **Notify:** Inform affected users if necessary
5. **Post-Mortem:** Analyze and improve processes

## Security Checklist

- ✅ Security headers configured
- ✅ HTTPS enforced via HSTS
- ✅ CSP prevents XSS and code injection
- ✅ Clickjacking prevented (X-Frame-Options)
- ✅ MIME sniffing blocked
- ✅ Environment variables protected
- ✅ Dependencies regularly audited
- ⏳ Rate limiting (to be added with API routes)
- ⏳ CAPTCHA/honeypot (to be added with contact form)

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/security-headers)
- [MDN Security Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers#security)
- [Vercel Security](https://vercel.com/docs/security/overview)

## Contact

For security concerns or to report vulnerabilities, contact: zavala.techlabs@gmail.com

---

**Last Updated:** 2026-02-08  
**Next Review:** 2026-05-08 (quarterly)
