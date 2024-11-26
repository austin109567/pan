import { FC, useState } from 'react';
import { Layer } from './types';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';

interface LayerSelectorProps {
  layer: Layer;
  selectedTrait: number;
  onSelect: (traitId: number) => void;
  isLoading?: boolean;
}

export const LayerSelector: FC<LayerSelectorProps> = ({
  layer,
  selectedTrait,
  onSelect,
  isLoading = false,
}) => {
  const [loadingStates, setLoadingStates] = useState<Record<number, boolean>>({});

  const handleImageLoad = (traitId: number) => {
    setLoadingStates(prev => ({
      ...prev,
      [traitId]: false
    }));
  };

  const handleImageError = (traitId: number) => {
    setLoadingStates(prev => ({
      ...prev,
      [traitId]: false
    }));
  };

  return (
    <div className={`
      bg-white/80 dark:bg-black/20 backdrop-blur-sm rounded-xl p-4 
      border border-sand-300/20 dark:border-sand-200/10 
      hover:border-primary-500/30 transition-colors duration-300
      ${isLoading ? 'opacity-50 pointer-events-none' : ''}
    `}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-sand-800 dark:text-sand-200">
          {layer.name}
        </h3>
        <button
          className="p-1 text-sand-500 hover:text-primary-500 transition-colors"
          onClick={() => {}}
          title={`${layer.name} traits information`}
        >
          <Info className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {layer.traits.map((trait) => (
          <div
            key={trait.id}
            className="relative group"
            title={trait.name}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => !isLoading && onSelect(trait.id)}
              disabled={isLoading}
              className={`
                relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200
                ${selectedTrait === trait.id
                  ? 'border-primary-500 shadow-lg shadow-primary-500/20'
                  : 'border-transparent hover:border-primary-500/50'
                }
                ${isLoading ? 'cursor-not-allowed' : ''}
              `}
            >
              {(loadingStates[trait.id] || isLoading) && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                  <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              <img
                src={trait.image}
                alt={trait.name}
                className="w-full h-full object-cover"
                onLoad={() => handleImageLoad(trait.id)}
                onError={() => handleImageError(trait.id)}
                loading="lazy"
              />
              {selectedTrait === trait.id && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-primary-500/10 pointer-events-none"
                />
              )}
            </motion.button>
            <div className="absolute inset-x-0 bottom-0 p-1 bg-black/60 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
              {trait.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};