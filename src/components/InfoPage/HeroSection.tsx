import { FC } from 'react';
import { motion } from 'framer-motion';

export const HeroSection: FC = () => {
  return (
    <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 mx-2 sm:mx-6 lg:mx-8">
        <div className="relative w-full h-full rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background-900/60 via-background-900/70 to-background-900/90 z-10" />
          <img 
            src="/assets/pandas/sittingpanda.PNG"
            alt="Pan Da Pan Info"
            className="absolute inset-0 w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-primary-500/20 mix-blend-overlay" />
          <div className="absolute inset-0 rounded-3xl ring-1 ring-white/20" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-3 sm:px-4 py-6 sm:py-8 lg:py-12 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-xl sm:text-2xl font-medium mb-2 text-sand-100">
            Discover
          </h2>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-400">
            Pan Da Pan
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-sand-200 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
            A revolutionary NFT gaming platform where your digital collectibles come to life in epic battles and quests. 
            Experience the future of gaming on Solana.
          </p>
        </motion.div>
      </div>
    </div>
  );
};
