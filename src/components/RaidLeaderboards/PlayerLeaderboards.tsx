import { FC, useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';
import { Skeleton } from '../ui/skeleton';
import { Player } from '../../types/player';

interface PlayerLeaderboardsProps {
  timeRange: 'allTime' | 'daily' | 'weekly' | 'monthly';
}

export const PlayerLeaderboards: FC<PlayerLeaderboardsProps> = ({ timeRange }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaderboardData();
  }, [timeRange]);

  const fetchLeaderboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('players')
        .select('*');

      // Add time range filters
      const now = new Date();
      if (timeRange !== 'allTime') {
        let startDate = new Date(now);
        
        switch (timeRange) {
          case 'daily':
            startDate.setDate(startDate.getDate() - 1);
            break;
          case 'weekly':
            startDate.setDate(startDate.getDate() - 7);
            break;
          case 'monthly':
            startDate.setMonth(startDate.getMonth() - 1);
            break;
        }

        // Filter by updated_at since that's when the player's data was last modified
        query = query.gte('updated_at', startDate.toISOString());
      }

      // Add sorting and pagination
      const { data, error: fetchError } = await query
        .order('xp', { ascending: false })
        .limit(50);

      if (fetchError) {
        throw fetchError;
      }

      setPlayers(data as Player[] || []);
    } catch (err) {
      console.error('Error fetching leaderboard data:', err);
      setError('Failed to load leaderboard data');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (players.length === 0) {
    return (
      <div className="text-center py-8 text-sand-600 dark:text-sand-400">
        No players found for the selected time range
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {players.map((player, index) => (
        <motion.div
          key={player.wallet_address}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="bg-white/40 dark:bg-black/20 backdrop-blur-sm rounded-xl p-4 flex items-center gap-4 border border-sand-300/20 dark:border-sand-200/10"
        >
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold">
            #{index + 1}
          </div>
          
          <div className="flex-grow">
            <h3 className="font-semibold text-lg text-sand-900 dark:text-white">
              {player.username || player.handle || player.wallet_address?.slice(0, 8)}
            </h3>
            <p className="text-sm text-sand-600 dark:text-sand-400">
              {player.archetype || 'Unknown Archetype'} • Level {Math.floor((player.xp || 0) / 1000)}
            </p>
          </div>
          
          <div className="text-right">
            <p className="font-semibold text-primary-500">
              {(player.xp || 0).toLocaleString()} XP
            </p>
            <p className="text-sm text-sand-600 dark:text-sand-400">
              {player.quests_completed || 0} Quests
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};