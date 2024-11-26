import { Cache } from '../../utils/cache';
import { cacheDuration } from '../../config/database';

export class CacheManager {
  private static instance: CacheManager;
  private cache: Cache;
  private keyPrefix: string = 'db:';

  private constructor() {
    this.cache = Cache.getInstance();
  }

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  get<T>(key: string): T | null {
    return this.cache.get<T>(`${this.keyPrefix}${key}`);
  }

  set<T>(key: string, value: T, duration: number = cacheDuration.SHORT): void {
    this.cache.set(`${this.keyPrefix}${key}`, value, duration);
  }

  delete(key: string): void {
    this.cache.delete(`${this.keyPrefix}${key}`);
  }

  clear(): void {
    this.cache.clear();
  }

  clearPattern(pattern: string): void {
    const prefix = `${this.keyPrefix}${pattern}`;
    this.cache.clearPattern(prefix);
  }

  setWithTags<T>(key: string, value: T, tags: string[], duration: number = cacheDuration.SHORT): void {
    this.set(key, value, duration);
    tags.forEach(tag => {
      const taggedKeys = this.get<string[]>(`tag:${tag}`) || [];
      if (!taggedKeys.includes(key)) {
        taggedKeys.push(key);
        this.set(`tag:${tag}`, taggedKeys, cacheDuration.LONG);
      }
    });
  }

  invalidateTag(tag: string): void {
    const taggedKeys = this.get<string[]>(`tag:${tag}`);
    if (taggedKeys) {
      taggedKeys.forEach(key => this.delete(key));
      this.delete(`tag:${tag}`);
    }
  }
}