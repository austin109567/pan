import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { NFTGrid } from './NFTGrid';
import { ConnectPrompt } from './ConnectPrompt';
import { ContentBox } from './ContentBox';

export const Dashboard: FC = () => {
  const { connected } = useWallet();

  if (!connected) {
    return <ConnectPrompt />;
  }

  return (
    <div className="space-y-8">
      <ContentBox title="My NFT Dashboard">
        <p className="text-text-light-secondary dark:text-text-dark-secondary mb-6">
          View and manage your NFT collection
        </p>
        
        <NFTGrid 
          showWalletOnly={true}
          initialDisplayCount={4}
          showSearch={false}
        />
      </ContentBox>
    </div>
  );
};