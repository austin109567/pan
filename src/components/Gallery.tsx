import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { NFTGrid } from './NFTGrid';
import { ConnectPrompt } from './ConnectPrompt';
import { ContentBox } from './ContentBox';

export const Gallery: FC = () => {
  const { connected } = useWallet();

  if (!connected) {
    return <ConnectPrompt />;
  }

  return (
    <div className="page-container">
      <div className="page-content">
        <ContentBox title="NFT Gallery">
          <p className="text-text-light-secondary dark:text-text-dark-secondary mb-6">
            Browse the complete collection gallery
          </p>

          <NFTGrid 
            showWalletOnly={false}
            initialDisplayCount={8}
            showSearch={true}
          />
        </ContentBox>
      </div>
    </div>
  );
};