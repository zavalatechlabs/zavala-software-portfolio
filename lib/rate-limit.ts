/**
 * Rate limiter with Upstash Redis support and in-memory fallback.
 *
 * - When UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are set,
 *   uses Upstash Redis for persistent, distributed rate limiting that
 *   survives serverless cold starts.
 * - When those env vars are absent, falls back to a simple in-memory
 *   sliding-window implementation (resets on cold start).
 *
 * The exported `contactRateLimiter` preserves the same `isRateLimited(key)`
 * API so call sites only need to `await` the result.
 */

import { getEnv } from '@/lib/env'
import { logger } from '@/lib/logger'

// ---------------------------------------------------------------------------
// In-memory fallback
// ---------------------------------------------------------------------------

/** Simple in-memory rate limiter using a sliding window of timestamps. */
export class RateLimiter {
  private requestMap = new Map<string, number[]>()
  private windowMs: number
  private maxRequests: number
  private lastSweepAt = Date.now()

  constructor(windowMs: number, maxRequests: number) {
    this.windowMs = windowMs
    this.maxRequests = maxRequests
  }

  /**
   * Drop keys whose every timestamp has expired, so the map does not grow
   * without bound. Runs at most once per window — O(keys) amortized.
   */
  private sweepExpiredKeys(now: number): void {
    if (now - this.lastSweepAt < this.windowMs) return
    this.lastSweepAt = now
    for (const [key, timestamps] of this.requestMap) {
      if (timestamps.every((timestamp) => now - timestamp >= this.windowMs)) {
        this.requestMap.delete(key)
      }
    }
  }

  /** Returns `true` when the key should be blocked. */
  isRateLimited(key: string): boolean {
    const now = Date.now()
    this.sweepExpiredKeys(now)
    const requests = this.requestMap.get(key) || []

    const recentRequests = requests.filter((timestamp) => now - timestamp < this.windowMs)

    this.requestMap.set(key, recentRequests)

    if (recentRequests.length >= this.maxRequests) {
      logger.warn('Rate limit exceeded', { key })
      return true
    }

    recentRequests.push(now)
    this.requestMap.set(key, recentRequests)

    return false
  }

  getRequestCount(key: string): number {
    const now = Date.now()
    const requests = this.requestMap.get(key) || []
    return requests.filter((timestamp) => now - timestamp < this.windowMs).length
  }

  clear(): void {
    this.requestMap.clear()
  }

  clearKey(key: string): void {
    this.requestMap.delete(key)
  }
}

// ---------------------------------------------------------------------------
// Upstash-backed limiter wrapper
// ---------------------------------------------------------------------------

/**
 * Thin wrapper around @upstash/ratelimit so it exposes the same
 * `isRateLimited(key)` API as the in-memory RateLimiter.
 *
 * Upstash imports are loaded lazily (dynamic import) to avoid breaking
 * Jest when ESM-only transitive dependencies (e.g. uncrypto) can't be
 * transformed by the test runner.
 */
class UpstashRateLimiter {
  private ratelimitPromise: Promise<import('@upstash/ratelimit').Ratelimit> | null = null

  private url: string
  private token: string

  constructor(url: string, token: string) {
    this.url = url
    this.token = token
  }

  private async getRatelimit() {
    if (!this.ratelimitPromise) {
      this.ratelimitPromise = (async () => {
        const { Ratelimit } = await import('@upstash/ratelimit')
        const { Redis } = await import('@upstash/redis')
        const redis = new Redis({ url: this.url, token: this.token })
        return new Ratelimit({
          redis,
          limiter: Ratelimit.slidingWindow(5, '1 h'),
          prefix: 'ratelimit:contact',
        })
      })()
    }
    return this.ratelimitPromise
  }

  /** Returns `true` when the key should be blocked (mirrors RateLimiter). */
  async isRateLimited(key: string): Promise<boolean> {
    const rl = await this.getRatelimit()
    const { success } = await rl.limit(key)
    if (!success) {
      logger.warn('Rate limit exceeded', { key })
    }
    return !success
  }
}

// ---------------------------------------------------------------------------
// Factory — choose backend based on env vars
// ---------------------------------------------------------------------------

function createContactRateLimiter(): RateLimiter | UpstashRateLimiter {
  // Read Upstash credentials through getEnv() so the URL/token pairing
  // refinement in lib/env.ts actually runs (a URL without a token — or vice
  // versa — fails loudly instead of silently falling back to in-memory).
  const { UPSTASH_REDIS_REST_URL: url, UPSTASH_REDIS_REST_TOKEN: token } = getEnv()

  if (url && token) {
    return new UpstashRateLimiter(url, token)
  }

  // Fallback to in-memory
  logger.warn(
    'Rate limiting using in-memory store (not persistent across serverless ' +
      'instances). Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN ' +
      'for production.'
  )

  return new RateLimiter(60 * 60 * 1000, 5)
}

let _contactRateLimiter: RateLimiter | UpstashRateLimiter | null = null

/**
 * Default rate limiter for the contact form: 5 requests per hour per IP.
 *
 * The backend is created lazily on first use (not at import time) so that
 * importing this module during static page generation never requires env
 * vars, mirroring the lazy `getEnv()` contract.
 */
export const contactRateLimiter = {
  async isRateLimited(key: string): Promise<boolean> {
    if (!_contactRateLimiter) {
      _contactRateLimiter = createContactRateLimiter()
    }
    return _contactRateLimiter.isRateLimited(key)
  },
}
