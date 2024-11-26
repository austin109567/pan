import { FC, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { ConnectPrompt } from '../ConnectPrompt';
import { ProfilePage } from './ProfilePage';
import { Dashboard } from '../Dashboard';
import { Gallery } from '../Gallery';

type TabType = 'profile' | 'nfts' | 'gallery';

export const RaidProfile: FC = () => {
  const { connected } = useWallet();
  const [activeTab, setActiveTab] = useState<TabType>('profile');

  if (!connected) {
    return <ConnectPrompt />;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 px-4">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-title text-text-light-primary dark:text-white mb-2 flex items-center justify-center gap-3">
          <img 
            src="/assets/pandas/nestledpanda.PNG" 
            alt="Raid Panda"
            className="w-12 h-12 object-contain"
          />
          Raid Profile
          <img 
            src="/assets/pandas/nestledpanda.PNG" 
            alt="Raid Panda"
            className="w-12 h-12 object-contain"
          />
        </h1>
        <p className="text-text-light-secondary dark:text-text-dark-secondary">
          Manage your profile, NFTs, and gallery
        </p>
      </div>

      {/* Tab Selection */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            activeTab === 'profile'
              ? 'bg-primary-main text-white shadow-glow'
              : 'bg-primary-main/20 text-text-light-primary dark:text-white hover:bg-primary-main/30'
          }`}
        >
          Profile
        </button>

        <button
          onClick={() => setActiveTab('nfts')}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            activeTab === 'nfts'
              ? 'bg-primary-main text-white shadow-glow'
              : 'bg-primary-main/20 text-text-light-primary dark:text-white hover:bg-primary-main/30'
          }`}
        >
          My NFTs
        </button>

        <button
          onClick={() => setActiveTab('gallery')}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            activeTab === 'gallery'
              ? 'bg-primary-main text-white shadow-glow'
              : 'bg-primary-main/20 text-text-light-primary dark:text-white hover:bg-primary-main/30'
          }`}
        >
          Gallery
        </button>
      </div>

      {/* Content */}
      <div className="gradient-box p-6">
        {activeTab === 'profile' && <ProfilePage />}
        {activeTab === 'nfts' && <Dashboard />}
        {activeTab === 'gallery' && <Gallery />}
      </div>
    </div>
  );
};