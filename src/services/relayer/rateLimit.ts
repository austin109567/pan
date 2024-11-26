import { Cache } from '../../utils/cache';
import { scaleConfig } from '../../config/scale';
import { logError } from '../../config/monitoring';

export class RateLimiter {
  private static instance: RateLimiter;
  private cache: Cache;

  private constructor() {
    this.cache = Cache.getInstance();
  }

  static getInstance(): RateLimiter {
    if (!RateLimiter.instance) {
      RateLimiter.instance = new RateLimiter();
    }
    return RateLimiter.instance;
  }

  async checkLimit(
    key: string,
    limit: number,
    windowMs: number
  ): Promise<boolean> {
    const now = Date.now();
    const windowKey = `ratelimit:${key}:${Math.floor(now / windowMs)}`;
    
    try {
      const current = this.cache.get<number>(windowKey) || 0;
      
      if (current >= limit) {
        return false;
      }
      
      this.cache.set(windowKey, current + 1, windowMs);
      return true;
    } catch (error) {
      logError(error as Error, {
        component: 'RateLimiter',
        method: 'checkLimit',
        key,
        limit,
        windowMs
      });
      return false;
    }
  }

  async resetLimit(key: string): Promise<void> {
    const windowMs = scaleConfig.limits.rateLimit.windowMs;
    const windowKey = `ratelimit:${key}:${Math.floor(Date.now() / windowMs)}`;
    this.cache.delete(windowKey);
  }
}