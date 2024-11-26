import { FC, useEffect, useState } from 'react';
import anime from 'animejs';
import { brandConfig } from '../config/brand';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: FC<LoadingScreenProps> = ({ onComplete }) => {
  const [bgLoaded, setBgLoaded] = useState(false);

  useEffect(() => {
    // Lock scroll while loading
    document.body.style.overflow = 'hidden';

    // Preload background image
    const bgImage = new Image();
    bgImage.src = brandConfig.assets.loadingScreen;
    bgImage.onload = () => {
      setBgLoaded(true);
      startAnimation();
    };

    // Fallback if image doesn't load
    const fallbackTimer = setTimeout(() => {
      if (!bgLoaded) {
        setBgLoaded(true);
        startAnimation();
      }
    }, 1000);

    return () => {
      document.body.style.overflow = 'unset';
      clearTimeout(fallbackTimer);
    };
  }, []);

  const startAnimation = () => {
    const timeline = anime.timeline({
      easing: 'easeOutExpo',
    });

    timeline
      .add({
        targets: '.loading-progress',
        width: '100%',
        duration: 2000,
        easing: 'easeInOutQuart',
      })
      .add({
        targets: '.loading-screen, .loading-screen-bg',
        opacity: 0,
        duration: 800,
        easing: 'easeInOutQuad',
        complete: () => {
          onComplete();
        }
      }, '+=200');
  };

  return (
    <>
      {/* Background */}
      <div 
        className="loading-screen-bg fixed inset-0 z-[9998] transition-opacity duration-800 bg-background-dark"
        style={{
          backgroundImage: bgLoaded ? `url(${brandConfig.assets.loadingScreen})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 1,
        }}
      />

      {/* Content */}
      <div className="loading-screen fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div className="glass-panel p-8 w-[400px]">
          <div className="text-center mb-8">
            <div className="text-3xl font-title text-primary-main tracking-wider glow-text">
              {brandConfig.name}
            </div>
            <div className="text-xs font-light text-primary-main/80 mt-1">
              {brandConfig.domain}
            </div>
          </div>

          <div className="w-full h-1 bg-primary-main/10 rounded-full overflow-hidden">
            <div className="loading-progress h-full bg-gradient-to-r from-primary-main to-primary-secondary rounded-full" />
          </div>
        </div>
      </div>
    </>
  );
};