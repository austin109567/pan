import { FC } from 'react';
import { Wallet } from 'lucide-react';
import { GlassPanel } from './GlassPanel';

export const Welcome: FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <GlassPanel className="max-w-md mx-auto p-8">
        <Wallet className="w-16 h-16 text-primary-main mb-4" />
        <h2 className="text-3xl font-bold text-white mb-4">
          Welcome to Solana NFT Dashboard
        </h2>
        <p className="text-text-light-secondary dark:text-text-dark-secondary">
          Connect your wallet to view your NFT collection and access exclusive features.
        </p>
      </GlassPanel>
    </div>
  );
};