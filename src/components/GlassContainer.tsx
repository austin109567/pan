import { FC, ReactNode } from 'react';

interface GlassContainerProps {
  children: ReactNode;
  className?: string;
}

export const GlassContainer: FC<GlassContainerProps> = ({ children, className = '' }) => {
  return (
    <div className={`relative p-8 rounded-xl border border-primary-main/20 bg-background-light/60 dark:bg-background-dark/60 backdrop-blur-xl shadow-lg ${className}`}>
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-primary-main/5 via-primary-main/10 to-transparent rounded-xl pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};