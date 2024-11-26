import { FC, useEffect, useRef, useState, useMemo } from 'react';
import { Layer } from './types';
import { Loader, AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { getCachedImage, isImageCached, preloadImage } from './utils';

interface NFTPreviewProps {
  layers: Layer[];
  selectedTraits: Record<number, number>;
  loadingProgress: number;
  onError?: (message: string) => void;
}

export const NFTPreview: FC<NFTPreviewProps> = ({ 
  layers, 
  selectedTraits,
  loadingProgress,
  onError 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryAttempt, setRetryAttempt] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);

  // Memoize the selected images array
  const selectedImages = useMemo(() => {
    return layers.map(layer => {
      const traitId = selectedTraits[layer.id];
      const trait = layer.traits.find(t => t.id === traitId);
      return trait?.image || '';
    }).filter(Boolean);
  }, [layers, selectedTraits]);

  // Draw layers on canvas
  const drawLayers = async () => {
    const canvas = canvasRef.current;
    if (!canvas || isDrawing) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) {
      setError('Could not initialize canvas context');
      onError?.('Could not initialize canvas context');
      return;
    }

    setIsDrawing(true);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setError(null);

    try {
      // Enable image smoothing for better quality
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      for (const src of selectedImages) {
        try {
          // Use cached image if available
          let img: HTMLImageElement;
          if (isImageCached(src)) {
            img = getCachedImage(src)!;
          } else {
            img = await preloadImage(src);
          }
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        } catch (error) {
          console.error(`Failed to load image:`, error);
          onError?.(`Failed to load image. Retrying...`);
          if (retryAttempt < 3) {
            setRetryAttempt(prev => prev + 1);
            return;
          }
          setError(`Failed to load image`);
        }
      }
    } catch (error) {
      console.error('Failed to draw layers:', error);
      setError('Failed to generate preview');
      onError?.('Failed to generate preview');
    } finally {
      setIsDrawing(false);
    }
  };

  // Only redraw when selected images change or loading completes
  useEffect(() => {
    if (loadingProgress === 100 && selectedImages.length > 0) {
      drawLayers();
    }
  }, [selectedImages, loadingProgress]);

  return (
    <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-gradient-to-br from-black/40 to-black/20 border-2 border-primary-500/20">
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        className="w-full h-full"
      />
      
      {loadingProgress < 100 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm"
        >
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-primary-500/20" />
            <Loader className="w-8 h-8 text-primary-500 animate-spin relative z-10" />
          </div>
          <div className="mt-4 text-sm text-white font-medium">
            Loading assets... {loadingProgress}%
          </div>
          <div className="w-48 h-1 bg-black/20 rounded-full mt-2">
            <motion.div 
              className="h-full bg-primary-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${loadingProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      )}

      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
          <AlertCircle className="w-8 h-8 text-red-500" />
          <div className="mt-4 text-sm text-white font-medium text-center px-4">
            {error}
          </div>
          <button
            onClick={() => drawLayers()}
            className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg flex items-center gap-2 hover:bg-primary-600 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      )}
    </div>
  );
};