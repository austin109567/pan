export class Cache {
  private static instance: Cache;
  private storage: Map<string, any>;
  private maxSize: number;
  private useCompression: boolean;

  private constructor() {
    this.storage = new Map();
    this.maxSize = 100 * 1024 * 1024; // Default 100MB
    this.useCompression = false;
  }

  static getInstance(): Cache {
    if (!Cache.instance) {
      Cache.instance = new Cache();
    }
    return Cache.instance;
  }

  setMaxSize(bytes: number): void {
    this.maxSize = bytes;
  }

  enableCompression(enabled: boolean): void {
    this.useCompression = enabled;
  }

  set(key: string, value: any, duration: number): void {
    const item = {
      value,
      timestamp: Date.now(),
      expiry: duration
    };

    if (this.useCompression && typeof value === 'string') {
      item.value = this.compress(value);
    }

    this.storage.set(key, item);
    this.enforceMaxSize();
  }

  get<T>(key: string): T | null {
    const item = this.storage.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > item.expiry) {
      this.storage.delete(key);
      return null;
    }

    if (this.useCompression && typeof item.value === 'string') {
      return this.decompress(item.value) as T;
    }

    return item.value as T;
  }

  clear(): void {
    this.storage.clear();
  }

  private enforceMaxSize(): void {
    if (this.getSize() > this.maxSize) {
      const entries = Array.from(this.storage.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      while (this.getSize() > this.maxSize && entries.length) {
        const [key] = entries.shift()!;
        this.storage.delete(key);
      }
    }
  }

  private getSize(): number {
    let size = 0;
    for (const [key, value] of this.storage) {
      size += key.length * 2; // UTF-16 characters
      size += this.getObjectSize(value);
    }
    return size;
  }

  private getObjectSize(obj: any): number {
    const str = JSON.stringify(obj);
    return str.length * 2; // UTF-16 characters
  }

  private compress(str: string): string {
    // Simple RLE compression for demo
    let compressed = '';
    let count = 1;
    let current = str[0];

    for (let i = 1; i <= str.length; i++) {
      if (str[i] === current) {
        count++;
      } else {
        compressed += count + current;
        current = str[i];
        count = 1;
      }
    }

    return compressed;
  }

  private decompress(str: string): string {
    // Simple RLE decompression
    let decompressed = '';
    let count = '';

    for (let i = 0; i < str.length; i++) {
      if (!isNaN(parseInt(str[i]))) {
        count += str[i];
      } else {
        decompressed += str[i].repeat(parseInt(count));
        count = '';
      }
    }

    return decompressed;
  }
}