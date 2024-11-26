import { FC } from 'react';
import { HexagonBorder } from './HexagonBorder';
import { playerService } from '../services/playerService';

interface ProfilePictureProps {
  wallet: string;
  size?: 'sm' | 'md' | 'lg';
  showBorder?: boolean;
}

export const ProfilePicture: FC<ProfilePictureProps> = ({ 
  wallet, 
  size = 'md',
  showBorder = true 
}) => {
  const player = playerService.getPlayer(wallet);
  const isNFTProfile = player?.profilePicture?.startsWith('http');

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const Picture = () => (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-primary-pink/20`}>
      {player?.profilePicture ? (
        <img
          src={player.profilePicture}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      ) : (
        <img
          src="/assets/defaultpfp.png"
          alt="Default Profile"
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );

  if (isNFTProfile && showBorder) {
    return (
      <HexagonBorder className={sizeClasses[size]}>
        <Picture />
      </HexagonBorder>
    );
  }

  return <Picture />;
};