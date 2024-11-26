import { FC } from 'react';
import { RaidState } from '../../types/raid';
import { X, Shield, Star, Users, CheckCircle } from 'lucide-react';

interface RaidBossDetailsModalProps {
  raid: RaidState;
  onClose: () => void;
}

export const RaidBossDetailsModal: FC<RaidBossDetailsModalProps> = ({ raid, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-neutral-charcoal/90 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative w-full max-w-3xl bg-[#1A1B23] rounded-xl border border-primary-pink/20 shadow-2xl transform transition-all overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-primary-pink/20 bg-black/40">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg overflow-hidden border border-primary-pink/20">
              <img
                src={raid.boss.imageUrl}
                alt={raid.boss.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{raid.boss.name}</h3>
              <p className="text-sm text-neutral-lightGray">
                Completed {new Date(raid.endTime).toLocaleDateString()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-lightGray hover:text-white transition-colors rounded-lg hover:bg-primary-pink/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-6 space-y-6">
            {/* Boss Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-black/40 rounded-lg p-4 border border-primary-pink/20">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-primary-teal flex-shrink-0" />
                  <h4 className="text-white font-medium truncate">Defense</h4>
                </div>
                <p className="text-2xl font-bold text-primary-teal">
                  {raid.boss.defense}
                </p>
              </div>

              <div className="bg-black/40 rounded-lg p-4 border border-primary-pink/20">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-primary-pink flex-shrink-0" />
                  <h4 className="text-white font-medium truncate">XP Reward</h4>
                </div>
                <p className="text-2xl font-bold text-primary-pink">
                  {raid.boss.rewards.xp.toLocaleString()}
                </p>
              </div>

              <div className="bg-black/40 rounded-lg p-4 border border-primary-pink/20">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-primary-pink flex-shrink-0" />
                  <h4 className="text-white font-medium truncate">Participants</h4>
                </div>
                <p className="text-2xl font-bold text-primary-pink">
                  {raid.participants.length}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-black/40 rounded-lg p-4 border border-primary-pink/20">
              <p className="text-neutral-lightGray break-words">
                {raid.boss.description}
              </p>
            </div>

            {/* Quests */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Required Quests</h4>
              <div className="space-y-3">
                {raid.boss.quests.map((quest) => (
                  <div
                    key={quest.id}
                    className="bg-black/40 rounded-lg p-4 border border-primary-pink/20 hover:border-primary-pink/40 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-white mb-2 break-words">{quest.description}</p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                          <span className="text-primary-pink flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            {quest.xpReward} XP
                          </span>
                          <span className="text-neutral-lightGray flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {quest.completedBy.length} raiders
                          </span>
                        </div>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};