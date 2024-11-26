import { FC } from 'react';
import { X, Shield, Star, Users, Sword } from 'lucide-react';
import { RaidState } from '../../types/raid';
import { GlassPanel } from '../GlassPanel';

interface RaidBossDetailsProps {
  raid: RaidState;
  onClose: () => void;
  onJoin: () => void;
  onViewQuests: () => void;
  isParticipating: boolean;
}

export const RaidBossDetails: FC<RaidBossDetailsProps> = ({
  raid,
  onClose,
  onJoin,
  onViewQuests,
  isParticipating
}) => {
  const healthPercentage = (raid.boss.health / raid.boss.maxHealth) * 100;
  const healthColor = healthPercentage > 50 
    ? 'bg-primary-main' 
    : healthPercentage > 25 
      ? 'bg-accent-warning' 
      : 'bg-accent-danger';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-background-dark/90 backdrop-blur-md"
        onClick={onClose}
      />
      <GlassPanel className="relative w-full max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-title text-white">{raid.boss.name}</h3>
          <button
            onClick={onClose}
            className="p-2 text-text-dark-secondary hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Image and Health */}
          <div>
            <div className="rounded-xl overflow-hidden mb-6">
              <img
                src={raid.boss.imageUrl}
                alt={raid.boss.name}
                className="w-full aspect-square object-cover"
              />
            </div>

            {/* Health Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white font-medium">Boss HP</span>
                <span className="text-text-dark-secondary">
                  {Math.ceil(raid.boss.health).toLocaleString()} / {raid.boss.maxHealth.toLocaleString()}
                </span>
              </div>
              <div className="h-3 bg-background-darker rounded-full overflow-hidden">
                <div
                  className={`h-full ${healthColor} transition-all duration-300`}
                  style={{ width: `${healthPercentage}%` }}
                >
                  <div className="w-full h-full animate-pulse opacity-50" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Stats and Actions */}
          <div className="space-y-6">
            <p className="text-text-dark-secondary">
              {raid.boss.description}
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <GlassPanel>
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-primary-main" />
                  <span className="text-white font-medium">Defense</span>
                </div>
                <p className="text-2xl font-bold text-primary-main">
                  {raid.boss.defense}
                </p>
              </GlassPanel>

              <GlassPanel>
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-primary-main" />
                  <span className="text-white font-medium">XP Reward</span>
                </div>
                <p className="text-2xl font-bold text-primary-main">
                  {raid.boss.rewards.xp.toLocaleString()}
                </p>
              </GlassPanel>

              <GlassPanel>
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-primary-main" />
                  <span className="text-white font-medium">Raiders</span>
                </div>
                <p className="text-2xl font-bold text-primary-main">
                  {raid.participants.length}
                </p>
              </GlassPanel>

              <GlassPanel>
                <div className="flex items-center gap-2 mb-2">
                  <Sword className="w-4 h-4 text-primary-main" />
                  <span className="text-white font-medium">Quests</span>
                </div>
                <p className="text-2xl font-bold text-primary-main">
                  {raid.boss.quests.length}
                </p>
              </GlassPanel>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              {isParticipating ? (
                <button
                  onClick={onViewQuests}
                  className="flex-1 px-6 py-3 bg-primary-main text-white rounded-lg hover:bg-primary-main/90 transition-colors shadow-glow"
                >
                  View Quests
                </button>
              ) : (
                <button
                  onClick={onJoin}
                  className="flex-1 px-6 py-3 bg-primary-main text-white rounded-lg hover:bg-primary-main/90 transition-colors shadow-glow"
                >
                  Join Raid
                </button>
              )}
            </div>
          </div>
        </div>
      </GlassPanel>
    </div>
  );
};