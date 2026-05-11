import { describe, it, expect, beforeEach } from '@jest/globals'
import { RateLimiter } from '../rate-limit'

describe('RateLimiter', () => {
  let rateLimiter: RateLimiter
  const testKey = 'test-ip-123'

  beforeEach(() => {
    // Create a rate limiter with 1 second window, max 3 requests
    rateLimiter = new RateLimiter(1000, 3)
  })

  it('should allow requests under the limit', () => {
    expect(rateLimiter.isRateLimited(testKey)).toBe(false)
    expect(rateLimiter.isRateLimited(testKey)).toBe(false)
    expect(rateLimiter.isRateLimited(testKey)).toBe(false)
  })

  it('should block requests over the limit', () => {
    // Use up the limit (3 requests)
    rateLimiter.isRateLimited(testKey)
    rateLimiter.isRateLimited(testKey)
    rateLimiter.isRateLimited(testKey)

    // Fourth request should be blocked
    expect(rateLimiter.isRateLimited(testKey)).toBe(true)
  })

  it('should track different keys independently', () => {
    const key1 = 'ip-1'
    const key2 = 'ip-2'

    // Use up limit for key1
    rateLimiter.isRateLimited(key1)
    rateLimiter.isRateLimited(key1)
    rateLimiter.isRateLimited(key1)

    // key1 should be blocked
    expect(rateLimiter.isRateLimited(key1)).toBe(true)

    // key2 should still be allowed
    expect(rateLimiter.isRateLimited(key2)).toBe(false)
  })

  it('should return correct request count', () => {
    expect(rateLimiter.getRequestCount(testKey)).toBe(0)

    rateLimiter.isRateLimited(testKey)
    expect(rateLimiter.getRequestCount(testKey)).toBe(1)

    rateLimiter.isRateLimited(testKey)
    expect(rateLimiter.getRequestCount(testKey)).toBe(2)
  })

  it('should clear all data', () => {
    rateLimiter.isRateLimited(testKey)
    rateLimiter.isRateLimited('another-key')

    rateLimiter.clear()

    expect(rateLimiter.getRequestCount(testKey)).toBe(0)
    expect(rateLimiter.getRequestCount('another-key')).toBe(0)
  })

  it('should clear specific key', () => {
    const key1 = 'ip-1'
    const key2 = 'ip-2'

    rateLimiter.isRateLimited(key1)
    rateLimiter.isRateLimited(key2)

    rateLimiter.clearKey(key1)

    expect(rateLimiter.getRequestCount(key1)).toBe(0)
    expect(rateLimiter.getRequestCount(key2)).toBe(1)
  })

  it('should allow requests after time window expires', async () => {
    // Create rate limiter with very short window (50ms)
    const shortLimiter = new RateLimiter(50, 2)
    const key = 'test-key'

    // Use up the limit
    shortLimiter.isRateLimited(key)
    shortLimiter.isRateLimited(key)

    // Should be blocked
    expect(shortLimiter.isRateLimited(key)).toBe(true)

    // Wait for window to expire
    await new Promise((resolve) => setTimeout(resolve, 60))

    // Should be allowed again
    expect(shortLimiter.isRateLimited(key)).toBe(false)
  })

  it('should handle sliding window correctly', async () => {
    // Create rate limiter with 100ms window, max 2 requests
    const limiter = new RateLimiter(100, 2)
    const key = 'test-key'

    // First request at t=0
    expect(limiter.isRateLimited(key)).toBe(false)

    // Wait 60ms
    await new Promise((resolve) => setTimeout(resolve, 60))

    // Second request at t=60ms (within window)
    expect(limiter.isRateLimited(key)).toBe(false)

    // Third request should be blocked (2 requests in last 100ms)
    expect(limiter.isRateLimited(key)).toBe(true)

    // Wait another 50ms (total 110ms from first request)
    await new Promise((resolve) => setTimeout(resolve, 50))

    // First request should have expired, so this should be allowed
    expect(limiter.isRateLimited(key)).toBe(false)
  })

  it('should handle zero requests correctly', () => {
    expect(rateLimiter.getRequestCount('non-existent-key')).toBe(0)
  })

  it('should not allow more than max requests even with multiple calls', () => {
    const key = 'test-key'

    // Make 10 attempts
    const results = []
    for (let i = 0; i < 10; i++) {
      results.push(rateLimiter.isRateLimited(key))
    }

    // First 3 should be allowed (false), rest should be blocked (true)
    expect(results.slice(0, 3)).toEqual([false, false, false])
    expect(results.slice(3)).toEqual([true, true, true, true, true, true, true])
  })
})
