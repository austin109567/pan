import { FC } from 'react';
import { calculateLevel } from '../utils/levelCalculator';

interface LevelDisplayProps {
  xp: number;
  showProgress?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const LevelDisplay: FC<LevelDisplayProps> = ({ xp, showProgress = false, size = 'md' }) => {
  const { level, currentLevelXp, nextLevelXp, progress } = calculateLevel(xp);

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className="flex flex-col">
      <div className={`font-bold ${sizeClasses[size]} text-primary-main`}>
        Level {level}
      </div>
      
      {showProgress && (
        <div className="space-y-1">
          <div className="text-xs text-text-light-secondary dark:text-text-dark-secondary">
            {currentLevelXp.toLocaleString()} / {nextLevelXp.toLocaleString()} XP
          </div>
          <div className="h-1 bg-primary-main/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary-main transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};