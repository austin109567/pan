import { FC, useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Star, TrendingUp, User, Wallet } from 'lucide-react';
import { playerService } from '../../services/playerService';
import { LevelDisplay } from '../LevelDisplay';
import { Player } from '../../types/player';

export const UserProfile: FC = () => {
  const { publicKey } = useWallet();
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [rank, setRank] = useState<number | null>(null);

  useEffect(() => {
    const fetchPlayerData = async () => {
      if (!publicKey) {
        setLoading(false);
        return;
      }

      try {
        const fetchedPlayer = await playerService.getPlayer(publicKey.toString());
        setPlayer(fetchedPlayer);
        
        // Fetch rank
        const leaderboard = await playerService.getLeaderboard();
        const playerRank = leaderboard.findIndex(p => p.wallet_address === publicKey.toString()) + 1;
        setRank(playerRank > 0 ? playerRank : null);
      } catch (error) {
        console.error('Error fetching player data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerData();
  }, [publicKey]);

  if (loading) {
    return (
      <div className="animate-pulse flex flex-col items-center justify-center gap-4 p-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-sand-300/20 dark:bg-sand-700/20" />
          <div className="space-y-2">
            <div className="h-6 w-32 bg-sand-300/20 dark:bg-sand-700/20 rounded" />
            <div className="h-4 w-24 bg-sand-300/20 dark:bg-sand-700/20 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!publicKey || !player) {
    return null;
  }

  const truncatedWallet = `${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}`;

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      {/* User Info Section */}
      <div className="flex flex-col items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-primary-500/20 flex items-center justify-center">
          <User className="w-10 h-10 text-primary-500" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">{player.username || 'Anonymous Raider'}</h2>
          <div className="flex items-center justify-center gap-2 text-neutral-lightGray">
            <Wallet className="w-4 h-4" />
            <span>{truncatedWallet}</span>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 w-full">
        <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-white/5 border border-white/10">
          <LevelDisplay xp={player?.xp ?? 0} />
          <span className="text-neutral-lightGray">Level</span>
        </div>

        <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-primary-500" />
            <span className="text-xl font-bold text-white truncate max-w-[120px]">
              {(player?.xp ?? 0).toLocaleString()}
            </span>
          </div>
          <span className="text-neutral-lightGray">Total XP</span>
        </div>

        <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-500" />
            <span className="text-xl font-bold text-white">#{rank || '---'}</span>
          </div>
          <span className="text-neutral-lightGray">Rank</span>
        </div>
      </div>
    </div>
  );
};