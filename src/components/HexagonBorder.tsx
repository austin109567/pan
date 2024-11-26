import { FC } from 'react';

interface HexagonBorderProps {
  children: React.ReactNode;
  className?: string;
}

export const HexagonBorder: FC<HexagonBorderProps> = ({ children, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M50 0L93.3013 25V75L50 100L6.69873 75V25L50 0Z"
          stroke="url(#hexagon-gradient)"
          strokeWidth="2"
          className="animate-pulse-slow"
        />
        <defs>
          <linearGradient
            id="hexagon-gradient"
            x1="0"
            y1="0"
            x2="100"
            y2="100"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#D24985" />
            <stop offset="50%" stopColor="#9071A8" />
            <stop offset="100%" stopColor="#D24985" />
          </linearGradient>
        </defs>
      </svg>
      {children}
    </div>
  );
};