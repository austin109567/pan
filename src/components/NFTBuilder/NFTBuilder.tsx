import { FC, useState, useEffect, useCallback } from 'react';
import { NFTPreview } from './NFTPreview';
import { LayerSelector } from './LayerSelector';
import { LAYERS } from './layers';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, Download, Shuffle, Loader } from 'lucide-react';
import { mergeImages, preloadImages } from './utils';

// Toast notification component
const Toast: FC<{ message: string; type: 'success' | 'error' | 'warning' }> = ({ message, type }) => (
  <div className={`
    fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white z-50
    ${type === 'success' ? 'bg-green-500' : ''}
    ${type === 'error' ? 'bg-red-500' : ''}
    ${type === 'warning' ? 'bg-yellow-500' : ''}
  `}>
    {message}
  </div>
);

// Loading overlay component
const LoadingOverlay: FC<{ message: string; progress?: number }> = ({ message, progress }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
  >
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className="w-12 h-12">
          <motion.div
            className="absolute inset-0 border-4 border-primary-500/30 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-0 border-4 border-t-primary-500 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>
      <p className="mt-4 text-white font-medium">{message}</p>
      {progress !== undefined && (
        <div className="w-48 h-1 bg-black/20 rounded-full mt-2">
          <motion.div 
            className="h-full bg-primary-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}
    </div>
  </motion.div>
);

// Simple toast hook
const useCustomToast = () => {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'warning') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  return { toast, showToast };
};

export const NFTBuilder: FC = () => {
  const [selectedTraits, setSelectedTraits] = useState<Record<number, number>>({});
  const [downloading, setDownloading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { toast, showToast } = useCustomToast();

  // Preload all layer images on mount
  useEffect(() => {
    let mounted = true;
    
    const loadAssets = async () => {
      try {
        setIsLoading(true);
        // Get all image sources
        const imageSources = LAYERS.flatMap(layer =>
          layer.traits.map(trait => trait.image)
        );

        // Calculate total images for progress
        const totalImages = imageSources.length;
        let loadedImages = 0;

        // Create a progress callback
        const onProgress = () => {
          if (mounted) {
            loadedImages++;
            setLoadingProgress(Math.floor((loadedImages / totalImages) * 100));
          }
        };

        // Load images in parallel with progress
        await Promise.all(
          imageSources.map(async src => {
            try {
              await preloadImages([src]);
              onProgress();
            } catch (error) {
              console.error(`Failed to load image: ${src}`, error);
              onProgress(); // Still update progress even on error
              showToast(`Failed to load image: ${src}`, 'error');
            }
          })
        );

        if (mounted) {
          setLoadingProgress(100);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Failed to preload images:', error);
        if (mounted) {
          if (retryCount < 3) {
            setRetryCount(prev => prev + 1);
            showToast('Loading assets failed. Retrying...', 'warning');
          } else {
            showToast('Failed to load assets. Please refresh the page.', 'error');
          }
        }
      }
    };

    loadAssets();
    
    return () => {
      mounted = false;
    };
  }, [retryCount, showToast]);

  // Generate random configuration immediately
  useEffect(() => {
    handleRandomize();
  }, []);

  const handleTraitSelect = useCallback((layerId: number, traitId: number) => {
    setSelectedTraits(prev => ({
      ...prev,
      [layerId]: traitId
    }));
  }, []);

  const handleRandomize = useCallback(() => {
    const randomTraits: Record<number, number> = {};
    LAYERS.forEach(layer => {
      const randomTrait = layer.traits[Math.floor(Math.random() * layer.traits.length)];
      randomTraits[layer.id] = randomTrait.id;
    });
    setSelectedTraits(randomTraits);
  }, []);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const selectedImages = LAYERS.map(layer => {
        const traitId = selectedTraits[layer.id];
        const trait = layer.traits.find(t => t.id === traitId);
        return trait?.image || '';
      }).filter(Boolean);

      if (selectedImages.length > 0) {
        const mergedImage = await mergeImages(selectedImages);
        const link = document.createElement('a');
        link.href = mergedImage;
        link.download = 'my-nft.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showToast('NFT Downloaded Successfully', 'success');
      }
    } catch (error) {
      console.error('Failed to download NFT:', error);
      showToast('Failed to download NFT. Please try again.', 'error');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="relative space-y-12 sm:space-y-16 lg:space-y-24 pb-12 sm:pb-16 lg:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-400 sm:text-5xl">
            Create Your Character
          </h1>
          <p className="mt-4 text-lg font-medium text-sand-600 dark:text-sand-300">
            Customize your unique NFT warrior with powerful traits and attributes
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Preview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-4"
          >
            <div className="sticky top-24 z-10">
              <div className="relative bg-white/80 dark:bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-sand-300/20 dark:border-sand-200/10 hover:border-primary-500/30 transition-colors duration-300 shadow-xl shadow-sand-900/5 transform-gpu">
                <div className="relative">
                  <NFTPreview 
                    layers={LAYERS} 
                    selectedTraits={selectedTraits}
                    loadingProgress={loadingProgress}
                    onError={(message) => showToast(message, 'warning')}
                  />
                  <AnimatePresence>
                    {isLoading && (
                      <LoadingOverlay 
                        message="Loading assets..." 
                        progress={loadingProgress}
                      />
                    )}
                    {downloading && (
                      <LoadingOverlay message="Generating your NFT..." />
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex gap-3 mt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRandomize}
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-primary-500/10 text-primary-700 dark:text-primary-400 text-sm rounded-lg hover:bg-primary-500/20 transition-colors disabled:opacity-50"
                  >
                    <Shuffle className="w-4 h-4" />
                    Randomize
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDownload}
                    disabled={downloading || isLoading}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 shadow-sm shadow-primary-500/20"
                  >
                    {downloading ? (
                      <>
                        <Wand2 className="w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Download
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Layer Selectors */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-8 flex items-center"
          >
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 w-full">
              {LAYERS.map((layer, index) => (
                <motion.div
                  key={layer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <LayerSelector
                    layer={layer}
                    selectedTrait={selectedTraits[layer.id]}
                    onSelect={(traitId) => handleTraitSelect(layer.id, traitId)}
                    isLoading={isLoading}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Toast Notifications */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};