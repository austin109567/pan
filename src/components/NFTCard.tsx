import { FC } from 'react';
import { NFTMetadata } from '../types/nft';
import { Heart, ExternalLink } from 'lucide-react';
import { NFTProfileButton } from './Dashboard/NFTProfileButton';
import { useWallet } from '@solana/wallet-adapter-react';
import { GlassPanel } from './GlassPanel';

interface NFTCardProps {
  nft: NFTMetadata;
  isFavorite: boolean;
  onFavoriteToggle: () => void;
  showProfileButton?: boolean;
}

export const NFTCard: FC<NFTCardProps> = ({ 
  nft, 
  isFavorite, 
  onFavoriteToggle,
  showProfileButton = false
}) => {
  const { connected } = useWallet();
  const COLLECTION_ADDRESS = 'Hcudg3n6ggbc5kMo2ZtVbXKJb7oXhNCQxJsY42ZMiPpp';
  
  return (
    <div className="bg-white/30 dark:bg-black/30 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 transform hover:scale-105 transition-all duration-300">
      {/* Action Buttons */}
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onFavoriteToggle();
          }}
          className={`p-2 rounded-lg backdrop-blur-sm transition-colors ${
            isFavorite 
              ? 'bg-primary-main text-white' 
              : 'bg-black/40 text-primary-main hover:bg-primary-main/20'
          }`}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className="w-4 h-4" fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
        <a
          href={`https://solscan.io/token/${nft.mint}?cluster=mainnet`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg bg-black/40 text-primary-main hover:bg-primary-main/20 backdrop-blur-sm transition-colors"
          onClick={(e) => e.stopPropagation()}
          title="View on Solscan"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Profile Picture Button */}
      {showProfileButton && connected && (
        <NFTProfileButton nft={nft} />
      )}

      {/* NFT Image */}
      <div className="relative aspect-square">
        {nft.image && (
          <img
            src={nft.image}
            alt={nft.name}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* NFT Details */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-text-light-primary dark:text-orange-500 mb-1">
          {nft.name || 'Unnamed NFT'}
        </h3>

        {/* Attributes */}
        {nft.attributes && nft.attributes.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            {nft.attributes.slice(0, 4).map((attr, index) => (
              <div 
                key={index} 
                className="bg-primary-main/10 rounded-lg p-2 group-hover:bg-primary-main/20 transition-colors"
                title={`${attr.trait_type}: ${attr.value}`}
              >
                <p className="text-xs text-primary-main line-clamp-1">
                  {attr.trait_type}
                </p>
                <p className="text-sm font-medium text-white line-clamp-1">
                  {attr.value}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};