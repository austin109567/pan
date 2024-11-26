import { FC, ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface SectionProps {
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary';
}

export const Section: FC<SectionProps> = ({
  children,
  className,
  noPadding = false,
  size = 'md',
  variant = 'primary',
}) => {
  const sizeClasses = {
    sm: 'p-4 sm:p-6',
    md: 'p-6 sm:p-8',
    lg: 'p-8 sm:p-12',
    xl: 'p-12 sm:p-16',
  };

  const variantClasses = {
    primary: `
      bg-surface-light-primary dark:bg-surface-dark-primary
      backdrop-blur-sm
      shadow-glow
      border border-border-light-primary dark:border-border-dark-primary
    `,
    secondary: `
      bg-surface-light-secondary dark:bg-surface-dark-secondary
      backdrop-blur-sm
      shadow-glow-sm
      border border-border-light-secondary dark:border-border-dark-secondary
    `,
  };

  return (
    <section
      className={cn(
        'rounded-2xl',
        !noPadding && sizeClasses[size],
        variantClasses[variant],
        'transition-all duration-300',
        'hover:shadow-glow-lg',
        className
      )}
    >
      {children}
    </section>
  );
};
