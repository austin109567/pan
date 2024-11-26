import { FC, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { Button } from '../Button';
import { useAudio } from '../../contexts/AudioContext';
import { useNavigate } from 'react-router-dom';

export const HeroSection: FC = () => {
  const { connected } = useWallet();
  const { isPlaying } = useAudio();
  const [hasScrolled, setHasScrolled] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="relative min-h-[80vh] sm:min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 mx-2 sm:mx-6 lg:mx-8">
        <div className="relative w-full h-full rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background-900/30 via-background-900/50 to-background-900/80 z-10" />
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: isPlaying ? 1 : 0.5, transition: 'opacity 0.5s ease-in-out' }}
            poster="/assets/images/hero-poster.webp"
          >
            <source src="/videos/hero-background.webm" type="video/webm" />
            <source src="/videos/hero-background.mp4" type="video/mp4" />
          </video>
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
          <h2 className="text-xl sm:text-2xl font-medium mb-2 text-sand-200">
            Welcome to
          </h2>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-400">
            Pan Da Pan
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-sand-300 mb-8 sm:mb-10 max-w-2xl mx-auto">
            Join forces with fellow raiders, battle epic bosses, and earn valuable NFT rewards in this
            next-generation Web3 gaming experience.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto sm:max-w-none">
            <WalletMultiButton className="!bg-primary-500 hover:!bg-primary-600 !transition-all !duration-300 !px-6 !py-3 !h-auto !rounded-xl" />

            

          </div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none mx-2 sm:mx-6 lg:mx-8">
        <div className="relative w-full h-full rounded-3xl overflow-hidden">
          {/* Top gradient */}
          <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-background-900 to-transparent" />
          
          {/* Bottom gradient */}
          <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-background-900 to-transparent" />
          
          {/* Side gradients */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background-900 to-transparent" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background-900 to-transparent" />
        </div>
      </div>
    </div>
  );
};