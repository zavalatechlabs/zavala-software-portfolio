/**
 * Simple in-memory rate limiter
 * 
 * Tracks requests by IP address and enforces limits based on:
 * - Maximum requests per time window
 * - Sliding window algorithm (cleans old timestamps)
 * 
 * Note: This is memory-based and will reset on server restart.
 * For production, consider Redis or a database-backed solution.
 */
export class RateLimiter {
  private requestMap = new Map<string, number[]>()
  private windowMs: number
  private maxRequests: number

  /**
   * Create a new rate limiter
   * @param windowMs - Time window in milliseconds
   * @param maxRequests - Maximum requests allowed in the window
   */
  constructor(windowMs: number, maxRequests: number) {
    this.windowMs = windowMs
    this.maxRequests = maxRequests
  }

  /**
   * Check if a key (e.g., IP address) is rate limited
   * @param key - Identifier to track (typically IP address)
   * @returns true if rate limited, false if allowed
   */
  isRateLimited(key: string): boolean {
    const now = Date.now()
    const requests = this.requestMap.get(key) || []
    
    // Remove timestamps older than the window
    const recentRequests = requests.filter(timestamp => 
      now - timestamp < this.windowMs
    )
    
    // Update the map with cleaned requests
    this.requestMap.set(key, recentRequests)
    
    // Check if limit exceeded
    if (recentRequests.length >= this.maxRequests) {
      console.warn(`Rate limit exceeded for key: ${key}`)
      return true
    }
    
    // Add current timestamp
    recentRequests.push(now)
    this.requestMap.set(key, recentRequests)
    
    return false
  }

  /**
   * Get the number of requests made by a key in the current window
   * @param key - Identifier to check
   * @returns Number of requests in current window
   */
  getRequestCount(key: string): number {
    const now = Date.now()
    const requests = this.requestMap.get(key) || []
    
    // Count only recent requests
    return requests.filter(timestamp => 
      now - timestamp < this.windowMs
    ).length
  }

  /**
   * Clear all rate limit data (useful for testing)
   */
  clear(): void {
    this.requestMap.clear()
  }

  /**
   * Remove rate limit data for a specific key
   * @param key - Identifier to clear
   */
  clearKey(key: string): void {
    this.requestMap.delete(key)
  }
}

// Default rate limiter instance for contact form
// 5 requests per hour per IP
export const contactRateLimiter = new RateLimiter(
  60 * 60 * 1000, // 1 hour in milliseconds
  5 // max 5 requests
)
