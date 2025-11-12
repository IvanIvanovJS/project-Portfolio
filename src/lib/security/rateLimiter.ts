/**
 * Rate limiter for contact form submissions
 * Prevents abuse by limiting submission frequency per IP address
 * Requirements: 3.3, 3.4, 3.5
 */

export interface RateLimitEntry {
  count: number;
  resetAt: number;
}

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * In-memory rate limiter using Map storage
 * Configured for 3 requests per 60 minutes per IP
 */
export class RateLimiter {
  private store: Map<string, RateLimitEntry>;
  private config: RateLimitConfig;

  constructor(
    config: RateLimitConfig = { maxRequests: 3, windowMs: 60 * 60 * 1000 }
  ) {
    this.store = new Map();
    this.config = config;
  }

  /**
   * Checks if a request is allowed for the given identifier (IP address)
   * Automatically cleans up expired entries
   */
  check(identifier: string): RateLimitResult {
    // Clean up expired entries first
    this.cleanup();

    const now = Date.now();
    const entry = this.store.get(identifier);

    // No previous requests or expired window
    if (!entry || now >= entry.resetAt) {
      const newEntry: RateLimitEntry = {
        count: 1,
        resetAt: now + this.config.windowMs,
      };
      this.store.set(identifier, newEntry);

      return {
        allowed: true,
        remaining: this.config.maxRequests - 1,
        resetAt: newEntry.resetAt,
      };
    }

    // Within rate limit window
    if (entry.count < this.config.maxRequests) {
      entry.count++;
      this.store.set(identifier, entry);

      return {
        allowed: true,
        remaining: this.config.maxRequests - entry.count,
        resetAt: entry.resetAt,
      };
    }

    // Rate limit exceeded
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
    };
  }

  /**
   * Removes expired entries from the store
   * Called automatically on each check
   */
  cleanup(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    // Find expired entries
    for (const [key, entry] of this.store.entries()) {
      if (now >= entry.resetAt) {
        expiredKeys.push(key);
      }
    }

    // Remove expired entries
    for (const key of expiredKeys) {
      this.store.delete(key);
    }
  }

  /**
   * Resets rate limit for a specific identifier
   * Useful for testing or manual intervention
   */
  reset(identifier: string): void {
    this.store.delete(identifier);
  }

  /**
   * Clears all rate limit data
   * Useful for testing
   */
  clear(): void {
    this.store.clear();
  }

  /**
   * Gets current rate limit status for an identifier
   * Does not increment the counter
   */
  getStatus(identifier: string): RateLimitResult | null {
    const entry = this.store.get(identifier);
    const now = Date.now();

    if (!entry || now >= entry.resetAt) {
      return null;
    }

    return {
      allowed: entry.count < this.config.maxRequests,
      remaining: Math.max(0, this.config.maxRequests - entry.count),
      resetAt: entry.resetAt,
    };
  }
}

// Export singleton instance with default configuration
// 3 requests per 60 minutes
export const rateLimiter = new RateLimiter({
  maxRequests: 3,
  windowMs: 60 * 60 * 1000, // 60 minutes in milliseconds
});
