import { FC, useState, useEffect } from 'react';
import { Trophy, Users, Star, Coins, Mountain, Heart, PartyPopper } from 'lucide-react';
import { guildService } from '../../services/guildService';
import { playerService } from '../../services/playerService';
import { CORE_GUILDS } from '../../types/guild';
import { calculateLevel } from '../../utils/levelCalculator';
import { supabase } from '../../lib/supabase';

export const Archetypes: FC = () => {
  const [archetypeStats, setArchetypeStats] = useState(CORE_GUILDS.map(guild => ({
    ...guild,
    memberCount: 0,
    totalXp: 0,
    averageLevel: 0
  })));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        
        // Get all players from supabase
        const { data: players, error } = await supabase
          .from('players')
          .select('*')
          .not('archetype', 'is', null);

        if (error) throw error;

        // Calculate stats for each archetype
        const stats = CORE_GUILDS.map(guild => {
          // Get players with this archetype
          const archetypePlayers = players.filter(player => 
            player.archetype === guild.archetype
          );

          const totalXp = archetypePlayers.reduce((sum, player) => sum + (player.experience || 0), 0);
          const averageLevel = archetypePlayers.length > 0
            ? Math.floor(
                archetypePlayers.reduce((sum, player) => {
                  const { level } = calculateLevel(player.experience || 0);
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
  }, []);

  const getArchetypeIcon = (archetype: string) => {
    switch (archetype) {
      case 'Finance':
        return <Coins className="w-6 h-6 text-yellow-400" />;
      case 'Adventurer':
        return <Mountain className="w-6 h-6 text-green-400" />;
      case 'Philanthropist':
        return <Heart className="w-6 h-6 text-red-400" />;
      case 'PartyAnimal':
        return <PartyPopper className="w-6 h-6 text-purple-400" />;
      default:
        return <Trophy className="w-6 h-6 text-primary-main" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-main"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {archetypeStats.map((archetype, index) => (
        <div
          key={archetype.id}
          className="bg-gradient-radial from-primary-main/5 via-primary-main/10 to-transparent backdrop-blur-sm rounded-xl p-6 border border-primary-main/20"
        >
          <div className="flex items-center gap-6">
            {/* Rank */}
            <div className="w-12 h-12 rounded-full bg-primary-main/10 flex items-center justify-center">
              <Trophy className={`w-6 h-6 ${
                index === 0 ? 'text-yellow-400' :
                index === 1 ? 'text-gray-400' :
                index === 2 ? 'text-amber-700' :
                'text-primary-main'
              }`} />
            </div>

            {/* Archetype Icon */}
            <div className="w-16 h-16 rounded-lg overflow-hidden border border-primary-main/20 flex items-center justify-center bg-black/40">
              {getArchetypeIcon(archetype.archetype)}
            </div>

            {/* Archetype Info */}
            <div className="flex-grow min-w-0">
              <h3 className="text-lg font-medium text-white mb-2">{archetype.name}</h3>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary-main" />
                  <span className="text-white">{archetype.memberCount} Members</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-primary-main" />
                  <span className="text-white">{archetype.totalXp.toLocaleString()} XP</span>
                </div>
                {archetype.averageLevel > 0 && (
                  <div className="text-white">
                    Avg Level: {archetype.averageLevel}
                  </div>
                )}
              </div>
            </div>

            {/* Rank Display */}
            <div className="text-2xl font-bold text-primary-main">
              #{index + 1}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};