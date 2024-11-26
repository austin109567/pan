import { FC, useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRaid } from '../../hooks/useRaid';
import { RaidQuestList } from './RaidQuestList';
import { RaidBossCard } from './RaidBossCard';
import { RaidBossDetails } from './RaidBossDetails';

export const RaidBoss: FC = () => {
  const { publicKey } = useWallet();
  const { currentRaids, joinRaid } = useRaid();
  const [showQuests, setShowQuests] = useState(false);
  const [selectedRaidId, setSelectedRaidId] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Auto-refresh raid status
  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedRaidId(prev => prev);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleJoinRaid = (raidId: string) => {
    if (!publicKey) return;
    const success = joinRaid(raidId, 'default-nft-id');
    if (success) {
      setSelectedRaidId(raidId);
      setShowQuests(true);
    }
  };

  const handleShowQuests = (raidId: string) => {
    setSelectedRaidId(raidId);
    setShowQuests(true);
  };

  const handleShowDetails = (raidId: string) => {
    setSelectedRaidId(raidId);
    setShowDetails(true);
  };

  return (
    <div className="bg-white/30 dark:bg-black/10 backdrop-blur-sm rounded-xl p-6
      border border-sand-300/20 dark:border-sand-200/10 
      hover:border-primary-500/30 transition-all duration-300">
      <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-400 mb-6">
        Active Raid Bosses
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {currentRaids.map((raid) => {
          const isParticipating = raid.participants.some(
            p => p.wallet === publicKey?.toString()
          );
          const hasCompletedAllQuests = raid.boss.quests.every(
            quest => quest.completedBy.includes(publicKey?.toString() || '')
          );

          return (
            <RaidBossCard
              key={raid.id}
              raid={raid}
              onJoin={() => handleJoinRaid(raid.id)}
              onViewQuests={() => handleShowQuests(raid.id)}
              onShowDetails={() => handleShowDetails(raid.id)}
              isParticipating={isParticipating}
              hasCompletedAllQuests={hasCompletedAllQuests}
            />
          );
        })}

        {currentRaids.length === 0 && (
          <div className="col-span-full text-center py-8 text-sand-600 dark:text-sand-400">
            No active raid bosses
          </div>
        )}
      </div>

      {showQuests && selectedRaidId && (
        <RaidQuestList
          raidId={selectedRaidId}
          onClose={() => {
            setShowQuests(false);
            setSelectedRaidId(null);
          }}
        />
      )}

      {showDetails && selectedRaidId && (
        <RaidBossDetails
          raid={currentRaids.find(r => r.id === selectedRaidId)!}
          onClose={() => {
            setShowDetails(false);
            setSelectedRaidId(null);
          }}
          onJoin={() => handleJoinRaid(selectedRaidId)}
          onViewQuests={() => {
            setShowDetails(false);
            handleShowQuests(selectedRaidId);
          }}
          isParticipating={currentRaids.find(r => r.id === selectedRaidId)?.participants.some(
            p => p.wallet === publicKey?.toString()
          ) || false}
        />
      )}
    </div>
  );
};