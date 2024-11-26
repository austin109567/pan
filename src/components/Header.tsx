import { FC, useState, useEffect } from 'react';
import { WalletConnect } from './WalletConnect';
import { Navigation } from './Navigation';
import { Logo } from './Logo';

export const Header: FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show header when scrolling up or at top
      setIsVisible(currentScrollY <= 0 || currentScrollY < lastScrollY);
      setIsAtTop(currentScrollY <= 0);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${isVisible ? 'translate-y-0' : '-translate-y-full'}
        ${!isAtTop ? 'bg-white/80 dark:bg-black/80 backdrop-blur-lg shadow-lg' : 'bg-transparent'}`}
    >
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-2 sm:gap-4">
            <WalletConnect />
          </div>
        </div>
        
        {/* Navigation - Only visible on larger screens */}
        <div className="hidden lg:block pb-4">
          <Navigation />
        </div>

        {/* Mobile Navigation Button - Only visible on mobile */}
        <div className="lg:hidden flex justify-center pb-2">
          <Navigation />
        </div>
      </div>
    </header>
  );
};