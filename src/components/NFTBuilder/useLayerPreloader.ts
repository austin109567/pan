import { useState, useEffect } from 'react';
import { Layer } from './index';

export const useLayerPreloader = (layers: Layer[]) => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadedImages, setLoadedImages] = useState(new Set<string>());

  useEffect(() => {
    const allImagePaths = layers.flatMap(layer => 
      layer.traits.map(trait => trait.image)
    );

    const totalImages = allImagePaths.length;
    let loadedCount = 0;
    let hasError = false;

    const preloadImage = (src: string) => {
      if (loadedImages.has(src)) {
        loadedCount++;
        setLoadingProgress(Math.floor((loadedCount / totalImages) * 100));
        return Promise.resolve();
      }

      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = () => {
          loadedCount++;
          setLoadedImages(prev => new Set(prev).add(src));
          setLoadingProgress(Math.floor((loadedCount / totalImages) * 100));
          resolve();
        };

        img.onerror = () => {
          hasError = true;
          console.error(`Failed to load image: ${src}`);
          loadedCount++;
          setLoadingProgress(Math.floor((loadedCount / totalImages) * 100));
          resolve(); // Resolve anyway to continue loading other images
        };

        img.src = src;
      });
    };

    // Load images in small batches to prevent overwhelming the browser
    const loadImagesInBatches = async () => {
      const batchSize = 5;
      for (let i = 0; i < allImagePaths.length; i += batchSize) {
        const batch = allImagePaths.slice(i, i + batchSize);
        await Promise.all(batch.map(preloadImage));
      }

      if (hasError) {
        console.warn('Some images failed to load. Preview may be incomplete.');
      }
    };

    loadImagesInBatches();

    return () => {
      // Cleanup function
      setLoadedImages(new Set());
      setLoadingProgress(0);
    };
  }, [layers]);

  return { loadingProgress };
};