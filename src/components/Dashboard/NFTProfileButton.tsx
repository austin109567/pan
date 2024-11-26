import { FC, useState } from 'react';
import { NFTMetadata } from '../../types/nft';
import { playerService } from '../../services/playerService';
import { useWallet } from '@solana/wallet-adapter-react';

interface NFTProfileButtonProps {
  nft: NFTMetadata;
}

export const NFTProfileButton: FC<NFTProfileButtonProps> = ({ nft }) => {
  const { publicKey } = useWallet();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSetProfilePicture = () => {
    if (!publicKey) return;

    const success = playerService.setProfilePicture(publicKey.toString(), nft.image);
    if (success) {
      setShowSuccess(true);
    }
  };

  return (
    <>
      <button
        onClick={handleSetProfilePicture}
        className="absolute bottom-2 left-2 z-10 px-3 py-1.5 rounded-lg backdrop-blur-sm transition-colors bg-black/60 text-primary-pink hover:bg-primary-pink/20 text-sm font-medium"
      >
        Use as PDA PFP
      </button>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-neutral-charcoal/90 backdrop-blur-md"
            onClick={() => setShowSuccess(false)}
          />
          <div className="relative bg-[#1A1B23] rounded-xl border border-primary-pink/20 p-6 text-center">
            <h3 className="text-xl font-bold text-white mb-4">
              Profile Picture Updated
            </h3>
            <button
              onClick={() => setShowSuccess(false)}
              className="px-6 py-2 bg-primary-pink text-white rounded-lg hover:bg-primary-pink/90 transition-colors"
            >
              Okay, Thanks!
            </button>
          </div>
        </div>
      )}
    </>
  );
};