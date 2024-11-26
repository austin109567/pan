<content>import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { NFTGrid } from '../NFTGrid';
import { ConnectPrompt } from '../ConnectPrompt';
import { ContentBox } from '../ContentBox';

export const Gallery: FC = () => {
  const { connected } = useWallet();

  if (!connected) {
    return <ConnectPrompt />;
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-title text-text-light-primary dark:text-white mb-2">
          NFT Gallery
        </h1>
        <p className="text-text-light-secondary dark:text-text-dark-secondary">
          Browse and manage your NFT collection
        </p>
      </div>

      <ContentBox>
        <NFTGrid 
          showWalletOnly={false}
          initialDisplayCount={8}
          showSearch={true}
        />
      </ContentBox>
    </div>
  );
};</content>