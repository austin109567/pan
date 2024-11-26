import { FC } from 'react';
import { Shield, Star } from 'lucide-react';
import { RaidState } from '../../types/raid';

interface RaidBossCardProps {
  raid: RaidState;
  onJoin: () => void;
  onViewQuests: () => void;
  onShowDetails: () => void;
  isParticipating: boolean;
  hasCompletedAllQuests: boolean;
}

export const RaidBossCard: FC<RaidBossCardProps> = ({
  raid,
  onJoin,
  onViewQuests,
  onShowDetails,
  isParticipating,
  hasCompletedAllQuests
}) => {
  const healthPercentage = (raid.boss.health / raid.boss.maxHealth) * 100;

  return (
    <div className="bg-white/20 dark:bg-black/10 backdrop-blur-sm rounded-xl 
      border border-sand-300/20 dark:border-sand-200/10 
      group hover:border-primary-500/30 transition-all duration-300">
      {/* Raid Boss Image */}
      <button
        onClick={onShowDetails}
        className="w-full aspect-video relative overflow-hidden rounded-t-xl"
      >
        <img
          src={raid.boss.imageUrl}
          alt={raid.boss.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors">
            {raid.boss.name}
          </h3>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Shield className="w-4 h-4 text-primary-400" />
              <span className="text-sand-200">{raid.boss.defense}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-primary-400" />
              <span className="text-sand-200">
                {raid.boss.rewards.xp.toLocaleString()} XP
              </span>
            </div>
          </div>
        </div>
      </button>

      {/* Health Bar */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-sand-700 dark:text-sand-300 font-medium">Boss HP</span>
          <span className="text-sand-700 dark:text-sand-300 font-medium">
            {Math.ceil(raid.boss.health).toLocaleString()} / {raid.boss.maxHealth.toLocaleString()}
          </span>
        </div>
        <div className="h-2 bg-sand-200/20 dark:bg-sand-800/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-300"
            style={{ width: `${healthPercentage}%` }}
          >
            <div className="w-full h-full animate-pulse opacity-50 bg-white/20" />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 pt-2">
        {isParticipating ? (
          <button
            onClick={onViewQuests}
            className={`w-full px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              hasCompletedAllQuests
                ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                : 'bg-gradient-to-r from-primary-500 to-primary-400 text-white hover:from-primary-600 hover:to-primary-500'
            }`}
          >
            {hasCompletedAllQuests ? 'Completed' : 'View Quests'}
          </button>
        ) : (
          <button
            onClick={onJoin}
            className="w-full px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-400 text-white rounded-lg 
              hover:from-primary-600 hover:to-primary-500 transition-all duration-300"
          >
            Join Raid
          </button>
        )}
      </div>
    </div>
  );
};