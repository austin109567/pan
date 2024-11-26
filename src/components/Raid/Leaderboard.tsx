import { FC, useEffect, useState } from 'react';
import { Trophy, Medal, Star } from 'lucide-react';
import { LeaderboardEntry } from '../../types/player';
import { playerService } from '../../services/playerService';
import { ProfileModal } from '../RaidLeaderboards/ProfileModal';
import { motion } from 'framer-motion';

export const Leaderboard: FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<LeaderboardEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const updateLeaderboard = async () => {
      try {
        setLoading(true);
        const data = await playerService.getLeaderboard();
        setLeaderboard(data.slice(0, 5));
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    updateLeaderboard();
    const interval = setInterval(updateLeaderboard, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleProfileClick = async (entry: LeaderboardEntry) => {
    try {
      const player = await playerService.getPlayer(entry.wallet_address);
      if (player) {
        setSelectedPlayer(entry);
      }
    } catch (error) {
      console.error('Error fetching player profile:', error);
    }
  };

  const getRankDisplay = (rank: number) => {
    if (rank <= 3) {
      return (
        <Medal className={`w-5 h-5 md:w-6 md:h-6 ${
          rank === 1 ? 'text-yellow-400' :
          rank === 2 ? 'text-gray-400' :
          'text-amber-700'
        }`} />
      );
    }
    return <span className="text-sand-500 dark:text-sand-400 font-mono text-sm md:text-base">#{rank}</span>;
  };

  return (
    <motion.div 
      key="leaderboard-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto px-4 sm:px-6 lg:px-8"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-400 tracking-tight">
          Top Raiders
        </h2>
        <p className="mt-2 text-sm text-sand-600 dark:text-sand-400">
          Leading the charge in our community
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className="animate-pulse flex items-center gap-4 p-4 rounded-xl
                bg-sand-300/20 dark:bg-sand-700/20"
            >
              <div className="w-8 h-8 rounded-full bg-sand-400/20 dark:bg-sand-600/20" />
              <div className="flex-1">
                <div className="h-4 w-24 bg-sand-400/20 dark:bg-sand-600/20 rounded" />
              </div>
              <div className="h-4 w-16 bg-sand-400/20 dark:bg-sand-600/20 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {leaderboard.map((entry, index) => (
            <motion.button
              key={`leaderboard-entry-${entry.wallet_address}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleProfileClick(entry)}
              className="w-full flex items-center gap-4 p-4 rounded-xl
                bg-gradient-to-br from-sand-100/80 via-sand-100/60 to-transparent
                dark:from-black/40 dark:via-black/30 dark:to-transparent
                hover:bg-primary-500/10 dark:hover:bg-primary-500/20
                border border-sand-300/50 dark:border-sand-200/10
                hover:border-primary-500/30 dark:hover:border-primary-500/30
                transition-all duration-300"
            >
              <div className="flex items-center justify-center w-8 h-8">
                {getRankDisplay(index + 1)}
              </div>
              
              <div className="flex-1 text-left">
                <span className="font-semibold text-sand-700 dark:text-sand-300 group-hover:text-primary-500 transition-colors">
                  {entry.username || entry.wallet_address.slice(0, 4) + '...' + entry.wallet_address.slice(-4)}
                </span>
              </div>
              
            </motion.button>
          ))}
        </div>
      )}

      {selectedPlayer && (
        <ProfileModal
          isOpen={!!selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
          wallet={selectedPlayer.wallet_address}
        />
      )}
    </motion.div>
  );
};