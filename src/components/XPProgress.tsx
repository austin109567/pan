import { FC, useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { calculateLevel } from '../utils/levelCalculator';

interface XPProgressProps {
  xp: number;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  animate?: boolean;
}

export const XPProgress: FC<XPProgressProps> = ({ 
  xp, 
  size = 'md',
  showDetails = false,
  animate = true 
}) => {
  const [displayXP, setDisplayXP] = useState(0);
  const { level, currentLevelXp, nextLevelXp, progress } = calculateLevel(xp);

  useEffect(() => {
    if (animate && xp !== displayXP) {
      const step = Math.ceil((xp - displayXP) / 20);
      const interval = setInterval(() => {
        setDisplayXP(prev => {
          const next = prev + step;
          return next >= xp ? xp : next;
        });
      }, 50);

      return () => clearInterval(interval);
    } else {
      setDisplayXP(xp);
    }
  }, [xp, animate, displayXP]);

  const sizeClasses = {
    sm: 'text-sm space-y-1',
    md: 'text-base space-y-2',
    lg: 'text-lg space-y-3'
  };

  return (
    <div className={sizeClasses[size]}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Star className={`${
            size === 'sm' ? 'w-4 h-4' :
            size === 'md' ? 'w-5 h-5' :
            'w-6 h-6'
          } text-primary-main`} />
          <span className="font-bold text-primary-main">Level {level}</span>
        </div>
        {showDetails && (
          <span className="text-text-light-secondary dark:text-text-dark-secondary">
            {displayXP.toLocaleString()} XP
          </span>
        )}
      </div>

      <div className="space-y-1">
        {showDetails && (
          <div className="flex justify-between text-xs text-text-light-secondary dark:text-text-dark-secondary">
            <span>{currentLevelXp.toLocaleString()} XP</span>
            <span>{nextLevelXp.toLocaleString()} XP</span>
          </div>
        )}
        <div className="h-2 bg-primary-main/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary-main to-primary-main/80 transition-all duration-300"
            style={{ width: `${progress}%` }}
          >
            {animate && (
              <div className="w-full h-full animate-pulse opacity-50 bg-white/20" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};