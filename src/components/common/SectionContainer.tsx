import React from 'react';

interface SectionContainerProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'gradient' | 'highlight';
}

export const SectionContainer: React.FC<SectionContainerProps> = ({ 
  children, 
  className = '',
  variant = 'default'
}) => {
  const baseStyles = "relative rounded-xl overflow-hidden transition-all duration-300";
  const variantStyles = {
    default: "bg-card-light-background/90 dark:bg-[#1E1523]/90",
    gradient: "bg-gradient-to-b from-primary-main/5 via-primary-light/10 to-primary-main/5 dark:from-[#1A1523]/80 dark:via-[#1E1523]/80 dark:to-[#251B2E]/80",
    highlight: "bg-primary-main/10 dark:bg-[#1E1523]/80"
  };
  
  const containerStyles = `${baseStyles} ${variantStyles[variant]} ${className}`;

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className={containerStyles}>
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary-main/5 to-transparent dark:from-[#1A1523]/50 dark:to-transparent opacity-50" />
        
        {/* Border */}
        <div className="absolute inset-0 border border-card-light-border dark:border-card-dark-border/50 rounded-xl" />
        
        {/* Content */}
        <div className="relative z-10 
                      [&>div>h2]:text-text-light-primary 
                      [&>div>h2]:dark:bg-gradient-to-r 
                      [&>div>h2]:dark:from-primary-main 
                      [&>div>h2]:dark:to-primary-light 
                      [&>div>h2]:dark:bg-clip-text 
                      [&>div>h2]:dark:text-transparent">
          {children}
        </div>
      </div>
    </div>
  );
};
