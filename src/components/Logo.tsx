import { FC } from 'react';
import { Link } from 'react-router-dom';

export const Logo: FC = () => {
  return (
    <Link to="/" className="flex-shrink-0">
      <div className="text-center">
        <div className="text-2xl font-display font-bold text-primary-main tracking-wider glow-text">
          Pan <span className="text-primary-500">Da Pan</span>
        </div>
      </div>
    </Link>
  );
};