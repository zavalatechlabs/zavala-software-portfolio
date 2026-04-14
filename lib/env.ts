import { z } from 'zod'

// NOTE: This module is server-only. Do NOT import it from any file that
// ends up in the client bundle (i.e. anything marked "use client" or
// transitively imported by one). Next.js does not strip non-`NEXT_PUBLIC_*`
// env vars when bundling for the browser, so if this file is ever pulled
// into a client component the Zod parse below will throw at bundle load
// time with a descriptive error — which is still fail-loud, just later
// than we'd like. For client-exposed (NEXT_PUBLIC_*) variables, create a
// separate `lib/env.public.ts` module.

/**
 * Server-side environment variable schema.
 *
 * Validation is lazy — it runs on the first call to `getEnv()`, not at
 * module import time. This allows Next.js to statically generate pages
 * that transitively import this module without requiring every env var
 * to be present at build time. The actual validation only fires when
 * server code (e.g. an API route handler) calls `getEnv()` at runtime.
 */
const serverEnvSchema = z
  .object({
    /**
     * Resend API key used by the contact form email sender.
     * Must start with `re_` (Resend's key prefix; `re_test_*` keys are also
     * allowed so local/dev builds can run without a live key).
     */
    RESEND_API_KEY: z
      .string()
      .min(1, 'RESEND_API_KEY is required')
      .startsWith('re_', 'RESEND_API_KEY must start with "re_"'),

    /**
     * Recipient email address for contact form submissions.
     */
    CONTACT_EMAIL: z
      .string()
      .min(1, 'CONTACT_EMAIL is required')
      .email('CONTACT_EMAIL must be a valid email address'),

    /**
     * Sender address for contact form emails.
     * Defaults to the Resend onboarding sender if not set.
     */
    FROM_EMAIL: z.string().default('Portfolio Contact <onboarding@resend.dev>'),

    /**
     * Upstash Redis credentials for persistent, distributed rate limiting.
     * Both are optional — when absent the app falls back to an in-memory
     * rate limiter (sufficient for development, not for production).
     * Get credentials from: https://console.upstash.com/
     */
    UPSTASH_REDIS_REST_URL: z.string().url().optional(),
    UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),
  })
  .superRefine((data, ctx) => {
    const hasUrl = data.UPSTASH_REDIS_REST_URL !== undefined
    const hasToken = data.UPSTASH_REDIS_REST_TOKEN !== undefined
    if (hasUrl !== hasToken) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          'Both UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set together, or both omitted.',
        path: [hasUrl ? 'UPSTASH_REDIS_REST_TOKEN' : 'UPSTASH_REDIS_REST_URL'],
      })
    }
  })

export type ServerEnv = z.infer<typeof serverEnvSchema>

let _env: ServerEnv | null = null

/**
 * Returns validated server environment variables.
 *
 * Validation runs lazily on the first call and is cached thereafter.
 * This means importing this module during static page generation will
 * NOT fail — only calling `getEnv()` at runtime requires the env vars
 * to be present.
 */
export function getEnv(): ServerEnv {
  if (!_env) {
    const parsed = serverEnvSchema.safeParse(process.env)

    if (!parsed.success) {
      const issues = parsed.error.issues
        .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
        .join('\n')

      throw new Error(
        `Invalid or missing server environment variables:\n${issues}\n\n` +
          'Set these in your deployment environment (or .env.local for development). ' +
          'See .env.example for the full list of expected variables.'
      )
    }

    _env = Object.freeze(parsed.data)
  }
  return _env
}
