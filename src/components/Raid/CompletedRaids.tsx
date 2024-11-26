import { FC, useState } from 'react';
import { Trophy, Star, Users } from 'lucide-react';
import { RaidState } from '../../types/raid';
import { RaidBossDetailsModal } from './RaidBossDetailsModal';
import { RaidBossShareModal } from './RaidBossShareModal';
import { useWallet } from '@solana/wallet-adapter-react';
import { GlassPanel } from '../GlassPanel';

interface CompletedRaidsProps {
  raids: RaidState[];
}

export const CompletedRaids: FC<CompletedRaidsProps> = ({ raids }) => {
  const { publicKey } = useWallet();
  const [selectedRaid, setSelectedRaid] = useState<RaidState | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  const handleShare = (raid: RaidState) => {
    setSelectedRaid(raid);
    setShowShareModal(true);
  };

  const didParticipate = (raid: RaidState) => {
    return raid.participants.some(p => p.wallet === publicKey?.toString());
  };

  return (
    <div className="bg-white/20 dark:bg-black/10 backdrop-blur-sm rounded-xl p-6
      border border-sand-300/20 dark:border-sand-200/10 
      hover:border-primary-500/30 transition-all duration-300">
      <div className="text-center mb-6">
        <h3 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-400">
          Completed Raids
        </h3>
      </div>

      <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
        {raids.map((raid) => (
          <div
            key={raid.id}
            className="bg-white/10 dark:bg-black/20 rounded-xl overflow-hidden 
              border border-sand-300/20 dark:border-sand-200/10 
              hover:border-primary-500/30 transition-all duration-300"
          >
            <div className="aspect-[3/2] relative">
              <img
                src={raid.boss.imageUrl}
                alt={raid.boss.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h4 className="text-base md:text-lg font-semibold text-white mb-1">{raid.boss.name}</h4>
                <div className="flex items-center gap-3 text-xs md:text-sm">
                  <div className="flex items-center gap-1 text-sand-300">
                    <Users className="w-3 h-3 md:w-4 md:h-4" />
                    {raid.participants.length}
                  </div>
                  <div className="flex items-center gap-1 text-primary-400">
                    <Star className="w-3 h-3 md:w-4 md:h-4" />
                    {raid.boss.rewards.bonusXp.toLocaleString()} XP
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 flex justify-between items-center">
              <button
                onClick={() => setSelectedRaid(raid)}
                className="text-sm md:text-base text-sand-600 dark:text-sand-400 hover:text-primary-400 transition-colors"
              >
                View Details
              </button>
              <button
                onClick={() => handleShare(raid)}
                className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-400 
                  text-white rounded-lg hover:from-primary-600 hover:to-primary-500 
                  transition-all duration-300 text-sm md:text-base"
              >
                Share Victory
              </button>
            </div>
          </div>
        ))}

        {raids.length === 0 && (
          <div className="text-center py-8 text-sand-600 dark:text-sand-400 text-base md:text-lg">
            No completed raids yet
          </div>
        )}
      </div>

      {selectedRaid && !showShareModal && (
        <RaidBossDetailsModal
          raid={selectedRaid}
          onClose={() => setSelectedRaid(null)}
        />
      )}

      {selectedRaid && showShareModal && (
        <RaidBossShareModal
          raid={selectedRaid}
          participated={didParticipate(selectedRaid)}
          onClose={() => {
            setSelectedRaid(null);
            setShowShareModal(false);
          }}
        />
      )}
    </div>
  );
};