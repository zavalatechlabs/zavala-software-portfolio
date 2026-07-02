/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // Security headers
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate, max-age=0' },
        ],
      },
      {
        // Apply headers to all routes
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // X-XSS-Protection intentionally omitted: the legacy browser XSS
          // auditor is deprecated and can itself introduce vulnerabilities;
          // CSP below is the real protection.
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // TODO(task #2): Replace 'unsafe-inline' on script-src with a
              // nonce-based CSP via middleware. 'unsafe-inline' is retained for
              // now because Next.js emits inline bootstrap/runtime scripts and
              // next-themes injects a pre-hydration inline script to prevent
              // FOUC. 'unsafe-eval' has been removed as it has no legitimate
              // use in this portfolio.
              "script-src 'self' 'unsafe-inline'",
              // Tailwind JIT and next-themes rely on inline styles; switching
              // style-src to a nonce/hash approach is a separate follow-up.
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self' data:",
              "connect-src 'self'",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "object-src 'none'",
            ].join('; '),
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
