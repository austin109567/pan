import { FC, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Skeleton } from '../ui/skeleton';
import { Shield, Trophy, Users, Star } from 'lucide-react';
import { guildService } from '../../services/guildService';
import { Guild } from '../../types/guild';
import { CORE_GUILDS } from '../../types/guild';
import { playerService } from '../../services/playerService';

interface GuildLeaderboardsProps {
  timeRange: 'allTime' | 'daily' | 'weekly' | 'monthly';
}

interface GuildWithStats extends Guild {
  periodXp: number;
  memberCount: number;
}

export const GuildLeaderboards: FC<GuildLeaderboardsProps> = ({ timeRange }) => {
  const [guilds, setGuilds] = useState<GuildWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaderboardData();
  }, [timeRange]);

  const fetchLeaderboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get all guilds including core guilds and community guilds
      const communityGuilds = guildService.getCommunityGuilds();
      const allGuilds = [...communityGuilds, ...CORE_GUILDS];

      // Calculate additional stats for each guild
      const guildsWithStats = await Promise.all(allGuilds.map(async guild => {
        const members = guild.members || [];
        let periodXp = guild.totalXp || 0;

        // Calculate XP based on time range
        if (timeRange !== 'allTime') {
          const now = new Date();
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

          // Sum up XP gained by members in the time period
          const memberXPs = await Promise.all(members.map(async memberId => {
            const player = await playerService.getPlayer(memberId);
            return player?.experience || 0;
          }));
          
          periodXp = memberXPs.reduce((sum, xp) => sum + xp, 0);
        }

        return {
          ...guild,
          periodXp,
          memberCount: members.length
        };
      }));

      // Sort guilds by XP
      const sortedGuilds = guildsWithStats.sort((a, b) => b.periodXp - a.periodXp);
      setGuilds(sortedGuilds);
    } catch (err) {
      console.error('Error fetching guild leaderboard data:', err);
      setError('Failed to load guild leaderboard data');
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

  if (guilds.length === 0) {
    return (
      <div className="text-center py-8 text-sand-600 dark:text-sand-400">
        No guilds found for the selected time range
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {guilds.map((guild, index) => (
        <motion.div
          key={guild.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="bg-white/40 dark:bg-black/20 backdrop-blur-sm rounded-xl p-4 flex items-center gap-4 border border-sand-300/20 dark:border-sand-200/10"
        >
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold">
            {index < 3 ? (
              <Trophy className={`w-6 h-6 ${
                index === 0 ? 'text-yellow-300' :
                index === 1 ? 'text-gray-300' :
                'text-amber-600'
              }`} />
            ) : (
              `#${index + 1}`
            )}
          </div>
          
          <div className="flex-grow">
            <h3 className="font-semibold text-lg text-sand-900 dark:text-white">
              {guild.name}
            </h3>
            <p className="text-sm text-sand-600 dark:text-sand-400">
              {guild.description}
            </p>
          </div>
          
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-primary-500" />
              <span className="font-semibold text-primary-500">
                {guild.periodXp.toLocaleString()} XP
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-sand-600 dark:text-sand-400">
              <Users className="w-4 h-4" />
              <span>{guild.memberCount} Members</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};