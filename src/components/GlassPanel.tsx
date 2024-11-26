import { FC, ReactNode } from 'react';

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const GlassPanel: FC<GlassPanelProps> = ({ children, className = '', onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`mb-6 md:mb-8 bg-gradient-to-br from-primary-500/30 via-sand-200/30 to-transparent
            border border-primary-500/40 dark:border-primary-500/30
            shadow-2xl shadow-primary-500/30
            hover:shadow-primary-500/50 hover:border-primary-500/50
            dark:from-primary-950 dark:via-background-900 dark:to-background-950
            backdrop-blur-md rounded-xl p-4 md:p-6 transition-all duration-300
        ${className}
      `}
    >
      {children}
    </div>
  );
};