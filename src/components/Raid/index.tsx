import { FC, useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { QuestList } from './QuestList';
import { Leaderboard } from './Leaderboard';
import { UserProfile } from './UserProfile';
import { RaidBoss } from './RaidBoss';
import { CompletedRaids } from './CompletedRaids';
import { ConnectPrompt } from '../ConnectPrompt';
import { raidService } from '../../services/raidService';
import { RaidState } from '../../types/raid';

export const Raid: FC = () => {
  const { connected } = useWallet();
  const [completedRaids, setCompletedRaids] = useState<RaidState[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompletedRaids = async () => {
      try {
        const raids = await raidService.getCompletedRaids();
        setCompletedRaids(raids);
      } catch (error) {
        console.error('Error fetching completed raids:', error);
      } finally {
        setLoading(false);
      }
    };

    if (connected) {
      fetchCompletedRaids();
    }
  }, [connected]);

  if (!connected) {
    return <ConnectPrompt />;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-4 md:pt-6 max-w-7xl">
        
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-400">
            Raid Arena
          </h1>
          <p className="text-base md:text-lg text-sand-600 dark:text-sand-400 max-w-2xl mx-auto mt-2">
            Join epic raid battles and earn rewards
          </p>
        </div>

        {/* User Profile */}
      <div className="mb-6 md:mb-8 bg-gradient-to-br from-primary-500/30 via-sand-200/30 to-transparent
            border border-primary-500/40 dark:border-primary-500/30
            shadow-2xl shadow-primary-500/30
            hover:shadow-primary-500/50 hover:border-primary-500/50
            dark:from-primary-950 dark:via-background-900 dark:to-background-950
            backdrop-blur-md rounded-xl p-4 md:p-6 transition-all duration-300">
          <UserProfile />
        </div>

        {/* Active Raid Bosses */}
      <div className="mb-6 md:mb-8 bg-gradient-to-br from-primary-500/30 via-sand-200/30 to-transparent
            border border-primary-500/40 dark:border-primary-500/30
            shadow-2xl shadow-primary-500/30
            hover:shadow-primary-500/50 hover:border-primary-500/50
            dark:from-primary-950 dark:via-background-900 dark:to-background-950
            backdrop-blur-md rounded-xl p-4 md:p-6 transition-all duration-300">
          <RaidBoss />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {/* Available Quests */}
          <div className="lg:col-span-2 bg-gradient-to-br from-primary-500/30 via-sand-200/30 to-transparent
            border border-primary-500/40 dark:border-primary-500/30
            shadow-2xl shadow-primary-500/30
            hover:shadow-primary-500/50 hover:border-primary-500/50
            dark:from-primary-950 dark:via-background-900 dark:to-background-950
            backdrop-blur-md rounded-xl p-4 md:p-6 transition-all duration-300">
            <QuestList />
          </div>

          {/* Leaderboard & Completed Raids */}
          <div className="space-y-4 md:space-y-6 lg:space-y-8">
          <div className="bg-gradient-to-br from-primary-500/30 via-sand-200/30 to-transparent
            border border-primary-500/40 dark:border-primary-500/30
            shadow-2xl shadow-primary-500/30
            hover:shadow-primary-500/50 hover:border-primary-500/50
            dark:from-primary-950 dark:via-background-900 dark:to-background-950
            backdrop-blur-md rounded-xl p-4 md:p-6 transition-all duration-300">
              <Leaderboard />
            </div>
            {loading ? (
              <div className="animate-pulse bg-sand-200/20 dark:bg-sand-800/20 backdrop-blur-sm rounded-xl h-48" />
            ) : (
              <div className="bg-gradient-to-br from-primary-500/30 via-sand-200/30 to-transparent
                border border-primary-500/40 dark:border-primary-500/30
                shadow-2xl shadow-primary-500/30
                hover:shadow-primary-500/50 hover:border-primary-500/50
                dark:from-primary-950 dark:via-background-900 dark:to-background-950
                backdrop-blur-md rounded-xl p-4 md:p-6 transition-all duration-300">
                <CompletedRaids raids={completedRaids} />
              </div>
            )}
          </div>
        </div>

    </div>
  );
};

export { RaidBossDetails } from './RaidBossDetails';