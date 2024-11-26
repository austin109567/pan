import { FC, useState } from 'react';
import { User } from 'lucide-react';
import { playerService } from '../services/playerService';

interface AvatarProps {
  wallet: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showBorder?: boolean;
  onClick?: () => void;
}

export const Avatar: FC<AvatarProps> = ({ 
  wallet, 
  size = 'md',
  showBorder = true,
  onClick 
}) => {
  const [imageError, setImageError] = useState(false);
  const player = playerService.getPlayer(wallet);
  const profilePic = player?.profilePicture;

  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const borderClasses = showBorder 
    ? 'border-2 border-primary-main/20 hover:border-primary-main/40 transition-colors' 
    : '';

  const handleError = () => {
    setImageError(true);
  };

  return (
    <div 
      className={`
        ${sizeClasses[size]} 
        ${borderClasses}
        rounded-full overflow-hidden bg-primary-main/10
        ${onClick ? 'cursor-pointer hover:scale-105 transition-transform' : ''}
      `}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
    >
      {profilePic && !imageError ? (
        <img
          src={profilePic}
          alt="Profile"
          className="w-full h-full object-cover"
          onError={handleError}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <User className={`${
            size === 'xs' || size === 'sm' ? 'w-3 h-3' :
            size === 'md' ? 'w-5 h-5' :
            'w-8 h-8'
          } text-primary-main/60`} />
        </div>
      )}
    </div>
  );
};