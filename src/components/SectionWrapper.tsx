import { FC, ReactNode } from 'react';
import { cn } from '../lib/utils';

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'alternate';
}

export const SectionWrapper: FC<SectionWrapperProps> = ({
  children,
  className,
  variant = 'default'
}) => {
  return (
    <section
      className={cn(
        'w-full py-8 md:py-12',
        variant === 'alternate' ? 'bg-sand-100/50 dark:bg-sand-900/50' : '',
        className
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
};
