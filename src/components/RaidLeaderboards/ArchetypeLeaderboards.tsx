import { FC, useState, useEffect } from 'react';
import { Trophy, Users, Star, Coins, Mountain, Heart, PartyPopper, X } from 'lucide-react';
import { guildService } from '../../services/guildService';
import { playerService } from '../../services/playerService';
import { CORE_GUILDS } from '../../types/guild';
import { calculateLevel } from '../../utils/levelCalculator';
import { motion, AnimatePresence } from 'framer-motion';
import { Player } from '../../types/player';

interface ArchetypeLeaderboardsProps {
  timeRange: 'daily' | 'weekly' | 'monthly' | 'allTime';
}

interface ArchetypeMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  archetype: typeof CORE_GUILDS[0];
  members: Player[];
}

const ArchetypeMembersModal: FC<ArchetypeMembersModalProps> = ({ isOpen, onClose, archetype, members }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-3xl max-h-[80vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-sand-900 dark:text-white">
                {archetype.name} Members
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-sand-100 dark:hover:bg-sand-800 transition-colors"
              >
                <X className="w-6 h-6 text-sand-600 dark:text-sand-400" />
              </button>
            </div>

            {/* Members List */}
            <div className="space-y-4">
              {members.map((member, index) => {
                const { level } = calculateLevel(member.experience);
                return (
                  <motion.div
                    key={member.wallet}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-4 p-4 bg-sand-50 dark:bg-gray-800 rounded-xl"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary-500/10 flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-primary-500" />
                    </div>
                    <div className="flex-grow">
                      <div className="font-medium text-sand-900 dark:text-white">
                        {member.name || member.wallet.slice(0, 6) + '...' + member.wallet.slice(-4)}
                      </div>
                      <div className="text-sm text-sand-600 dark:text-sand-400">
                        Level {level} • {member.experience.toLocaleString()} XP
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {members.length === 0 && (
                <div className="text-center py-8 text-sand-600 dark:text-sand-400">
                  No members found in this archetype
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ArchetypeCard: FC<{
  archetype: typeof CORE_GUILDS[0] & {
    memberCount: number;
    totalXp: number;
    averageLevel: number;
  };
  index: number;
  onShowMembers: () => void;
}> = ({ archetype, index, onShowMembers }) => {
  const getArchetypeIcon = (archetypeType: string) => {
    switch (archetypeType) {
      case 'Finance':
        return <Coins className="w-8 h-8 text-yellow-500" />;
      case 'Adventurer':
        return <Mountain className="w-8 h-8 text-green-500" />;
      case 'Philanthropist':
        return <Heart className="w-8 h-8 text-red-500" />;
      case 'PartyAnimal':
        return <PartyPopper className="w-8 h-8 text-purple-500" />;
      default:
        return <Trophy className="w-8 h-8 text-primary-500" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      onClick={onShowMembers}
      className="relative bg-white/40 dark:bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-sand-300/20 dark:border-sand-200/10 hover:border-primary-500/30 transition-colors duration-300 cursor-pointer"
    >
      <div className="flex items-center gap-6">
        {/* Rank */}
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
          index === 0 ? 'bg-yellow-500/10' :
          index === 1 ? 'bg-gray-400/10' :
          index === 2 ? 'bg-amber-700/10' :
          'bg-primary-500/10'
        }`}>
          <Trophy className={`w-6 h-6 ${
            index === 0 ? 'text-yellow-500' :
            index === 1 ? 'text-gray-400' :
            index === 2 ? 'text-amber-700' :
            'text-primary-500'
          }`} />
        </div>

        {/* Archetype Icon */}
        <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-sand-300/20 dark:border-sand-200/10 flex items-center justify-center bg-white/20 dark:bg-black/40">
          {getArchetypeIcon(archetype.archetype)}
        </div>

        {/* Archetype Info */}
        <div className="flex-grow min-w-0">
          <h3 className="text-lg font-bold text-sand-900 dark:text-white mb-2">{archetype.name}</h3>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary-500" />
              <span className="text-sand-700 dark:text-sand-300 font-medium">
                {archetype.memberCount} Members
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-primary-500" />
              <span className="text-sand-700 dark:text-sand-300 font-medium">
                {archetype.totalXp.toLocaleString()} XP
              </span>
            </div>
            {archetype.averageLevel > 0 && (
              <div className="text-sand-700 dark:text-sand-300 font-medium">
                Avg Level: {archetype.averageLevel}
              </div>
            )}
          </div>
        </div>

        {/* Rank Display */}
        <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-400">
          #{index + 1}
        </div>
      </div>
    </motion.div>
  );
};

export const ArchetypeLeaderboards: FC<ArchetypeLeaderboardsProps> = ({ timeRange }) => {
  const [loading, setLoading] = useState(true);
  const [archetypeStats, setArchetypeStats] = useState(CORE_GUILDS.map(guild => ({
    ...guild,
    memberCount: 0,
    totalXp: 0,
    averageLevel: 0
  })));
  const [selectedArchetype, setSelectedArchetype] = useState<typeof CORE_GUILDS[0] | null>(null);
  const [archetypeMembers, setArchetypeMembers] = useState<Player[]>([]);

  useEffect(() => {
    const loadStats = () => {
      try {
        // Get all players
        const allPlayers = Array.from(playerService.getLeaderboard());

        // Calculate stats for each archetype
        const stats = CORE_GUILDS.map(guild => {
          // Get players with this archetype
          const archetypePlayers = allPlayers.filter(player => {
            const playerData = playerService.getPlayer(player.wallet);
            return playerData?.archetype === guild.archetype;
          });

          const totalXp = archetypePlayers.reduce((sum, player) => sum + player.experience, 0);
          const averageLevel = archetypePlayers.length > 0
            ? Math.floor(
                archetypePlayers.reduce((sum, player) => {
                  const { level } = calculateLevel(player.experience);
                  return sum + level;
                }, 0) / archetypePlayers.length
              )
            : 0;

          return {
            ...guild,
            memberCount: archetypePlayers.length,
            totalXp,
            averageLevel
          };
        }).sort((a, b) => b.totalXp - a.totalXp);

        setArchetypeStats(stats);
      } catch (error) {
        console.error('Failed to load archetype stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
    const interval = setInterval(loadStats, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [timeRange]);

  const handleShowMembers = (archetype: typeof CORE_GUILDS[0]) => {
    setSelectedArchetype(archetype);
    // Get members for the selected archetype
    const allPlayers = Array.from(playerService.getLeaderboard());
    const members = allPlayers
      .filter(player => {
        const playerData = playerService.getPlayer(player.wallet);
        return playerData?.archetype === archetype.archetype;
      })
      .sort((a, b) => b.experience - a.experience);
    setArchetypeMembers(members);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {archetypeStats.map((archetype, index) => (
        <ArchetypeCard
          key={archetype.id}
          archetype={archetype}
          index={index}
          onShowMembers={() => handleShowMembers(archetype)}
        />
      ))}

      {archetypeStats.length === 0 && (
        <div className="text-center py-8 text-sand-600 dark:text-sand-400">
          No archetype data available
        </div>
      )}

      <ArchetypeMembersModal
        isOpen={selectedArchetype !== null}
        onClose={() => setSelectedArchetype(null)}
        archetype={selectedArchetype || CORE_GUILDS[0]}
        members={archetypeMembers}
      />
    </div>
  );
};