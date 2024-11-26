import { FC, useState, useEffect } from 'react';
import { Play, Pause, Sun, Moon, ChevronDown } from 'lucide-react';
import { useAudio } from '../contexts/AudioContext';
import { useTheme } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingControlsProps {
  onScrollToTop: () => void;
}

export const FloatingControls: FC<FloatingControlsProps> = ({ onScrollToTop }) => {
  const { isPlaying, togglePlay, volume, setVolume } = useAudio();
  const { theme, toggleTheme } = useTheme();
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleScrollClick = () => {
    const viewportHeight = window.innerHeight;
    const currentScroll = window.scrollY;
    const nextSection = Math.ceil((currentScroll + 10) / viewportHeight) * viewportHeight;
    
    window.scrollTo({
      top: nextSection,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showVolumeSlider) {
        setShowVolumeSlider(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showVolumeSlider]);

  useEffect(() => {
    let ticking = false;
    let timeout: NodeJS.Timeout;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          setIsVisible(currentScrollY <= 0 || currentScrollY < lastScrollY);
          setLastScrollY(currentScrollY);
          ticking = false;
        });

        ticking = true;
      }

      // Reset visibility after scrolling stops
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeout);
    };
  }, [lastScrollY]);

  const buttonClasses = "w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br from-primary-500/90 to-primary-600/90 hover:from-primary-500 hover:to-primary-600 shadow-lg shadow-primary-500/30 hover:shadow-primary-500/40 text-white transition-all duration-300 backdrop-blur-sm dark:from-primary-900/90 dark:to-primary-800/90 dark:hover:from-primary-800 dark:hover:to-primary-700";
  const iconClasses = "w-5 h-5 sm:w-6 sm:h-6";

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-4 inset-x-0 mx-auto z-40 flex justify-center"
          >
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <motion.button
                onClick={toggleTheme}
                className={buttonClasses}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {theme === 'dark' ? (
                  <Sun className={iconClasses} />
                ) : (
                  <Moon className={iconClasses} />
                )}
              </motion.button>

              {/* Down Arrow */}
              <motion.button
                onClick={handleScrollClick}
                className={buttonClasses}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronDown className={iconClasses} />
              </motion.button>

              {/* Play/Pause Button */}
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isPlaying) {
                    setShowVolumeSlider(true);
                  }
                  togglePlay();
                }}
                className={buttonClasses}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isPlaying ? (
                  <Pause className={iconClasses} />
                ) : (
                  <Play className={iconClasses} />
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Volume Slider Popup */}
      <AnimatePresence>
        {showVolumeSlider && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 inset-x-0 mx-auto z-50 w-[90%] max-w-[300px] bg-white/90 dark:bg-black/90
              rounded-xl p-4 shadow-xl border border-sand-200/20 backdrop-blur-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-sand-900 dark:text-sand-100">
                  Volume
                </span>
                <span className="text-xs text-sand-600 dark:text-sand-400">
                  {Math.round(volume * 100)}%
                </span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full h-2 bg-sand-200 dark:bg-sand-800 rounded-full appearance-none cursor-pointer
                    focus:outline-none focus:ring-2 focus:ring-primary-500/50
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-4
                    [&::-webkit-slider-thumb]:h-4
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-primary-500
                    [&::-webkit-slider-thumb]:shadow-lg
                    [&::-webkit-slider-thumb]:shadow-primary-500/30
                    [&::-webkit-slider-thumb]:border-2
                    [&::-webkit-slider-thumb]:border-white
                    dark:[&::-webkit-slider-thumb]:border-black
                    [&::-webkit-slider-thumb]:transition-all
                    [&::-webkit-slider-thumb]:hover:scale-110
                    [&::-moz-range-thumb]:w-4
                    [&::-moz-range-thumb]:h-4
                    [&::-moz-range-thumb]:rounded-full
                    [&::-moz-range-thumb]:bg-primary-500
                    [&::-moz-range-thumb]:border-2
                    [&::-moz-range-thumb]:border-white
                    dark:[&::-moz-range-thumb]:border-black
                    [&::-moz-range-thumb]:transition-all
                    [&::-moz-range-thumb]:hover:scale-110"
                />
                <div 
                  className="absolute left-0 top-1/2 h-2 bg-primary-500 rounded-l-full pointer-events-none"
                  style={{ width: `${volume * 100}%`, transform: 'translateY(-50%)' }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};