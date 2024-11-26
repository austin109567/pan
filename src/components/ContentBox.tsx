import { FC, ReactNode } from 'react';

interface ContentBoxProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}

export const ContentBox: FC<ContentBoxProps> = ({ 
  children, 
  title,
  subtitle,
  className = '' 
}) => {
  return (
    <div className={`
      bg-white/30 dark:bg-black/30 
      backdrop-blur-sm 
      rounded-xl p-6 
      border border-white/10
      ${className}
    `}>
      {title && (
        <div className="mb-4">
          <h2 className="text-2xl font-title text-primary-main dark:text-orange-500">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1 text-text-light-secondary dark:text-white/90">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
};