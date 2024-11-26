import { useEffect, useState } from 'react';

export function useScrollEffect() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    // Initial scroll position
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getParallaxStyle = (speed: number = 0.02) => ({
    transform: `translate3d(0, ${scrollY * speed}px, 0)`,
  });

  return { scrollY, getParallaxStyle };
}
