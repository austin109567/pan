// Global image cache
const imageCache = new Map<string, HTMLImageElement>();

// Preload a single image with retry logic
export async function preloadImage(src: string, retries = 3): Promise<HTMLImageElement> {
  if (imageCache.has(src)) {
    return imageCache.get(src)!;
  }

  let lastError: Error | null = null;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = src;
      });
      imageCache.set(src, img);
      return img;
    } catch (error) {
      lastError = error as Error;
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, attempt * 500));
      }
    }
  }
  throw lastError;
}

// Batch preload images with concurrency control
export async function preloadImages(sources: string[], concurrency = 5): Promise<void> {
  const chunks: string[][] = [];
  for (let i = 0; i < sources.length; i += concurrency) {
    chunks.push(sources.slice(i, i + concurrency));
  }

  for (const chunk of chunks) {
    await Promise.all(chunk.map(src => preloadImage(src).catch(console.error)));
  }
}

// Optimized image merging with canvas reuse
export async function mergeImages(images: string[]): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = 500;
  canvas.height = 500;
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) throw new Error('Could not get canvas context');

  // Enable image smoothing for better quality
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw all images in sequence
  for (const src of images) {
    try {
      const img = await preloadImage(src);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    } catch (error) {
      console.error('Failed to load image:', error);
    }
  }

  return canvas.toDataURL('image/png', 1.0);
}

// Check if an image is cached
export function isImageCached(src: string): boolean {
  return imageCache.has(src);
}

// Get cached image
export function getCachedImage(src: string): HTMLImageElement | undefined {
  return imageCache.get(src);
}

// Clear image cache
export function clearImageCache(): void {
  imageCache.clear();
}

// Get cache size
export function getImageCacheSize(): number {
  return imageCache.size;
}