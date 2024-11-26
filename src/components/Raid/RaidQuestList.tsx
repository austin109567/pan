import { FC, useState, useEffect } from 'react';
import { X, Star } from 'lucide-react';
import { QuestSubmissionModal } from './QuestSubmissionModal';
import { raidService } from '../../services/raidService';
import { useWallet } from '@solana/wallet-adapter-react';
import { QuestSubmission } from '../../types/raid';

interface RaidQuestListProps {
  raidId: string;
  onClose: () => void;
}

export const RaidQuestList: FC<RaidQuestListProps> = ({ raidId, onClose }) => {
  const { publicKey } = useWallet();
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedQuestId, setSelectedQuestId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const raids = raidService.getActiveRaids();
  const raid = raids.find(r => r.id === raidId);
  const quests = raid?.boss.quests || [];

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleQuestComplete = (questId: string) => {
    setSelectedQuestId(questId);
    setShowSubmitModal(true);
  };

  const handleSubmitProof = async (submission: QuestSubmission) => {
    if (!publicKey || !selectedQuestId) return;
    
    const success = await raidService.completeQuest(raidId, selectedQuestId, publicKey.toString(), submission);
    if (success) {
      setShowSubmitModal(false);
      setSelectedQuestId(null);
      setRefreshKey(prev => prev + 1);
    }
  };

  if (!raid) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col 
        bg-white/20 dark:bg-black/20 backdrop-blur-sm rounded-xl 
        border border-sand-300/20 dark:border-sand-200/10 
        shadow-xl shadow-sand-400/20 dark:shadow-primary-500/20
        transform transition-all">
        {/* Header */}
        <div className="text-center p-6 border-b border-sand-300/20 dark:border-sand-200/10">
          <h3 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-400">
            {raid.boss.name} - Quests
          </h3>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-sand-600 dark:text-sand-400 
              hover:text-primary-400 transition-colors rounded-lg 
              hover:bg-sand-200/10 dark:hover:bg-sand-800/10"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Quest List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {quests.map((quest) => {
            const isCompleted = quest.completedBy?.includes(publicKey?.toString() || '');

            return (
              <div
                key={`${quest.id}-${refreshKey}`}
                className="bg-white/10 dark:bg-black/20 backdrop-blur-sm rounded-xl p-4 
                  border border-sand-300/20 dark:border-sand-200/10 
                  hover:border-primary-500/30 transition-all duration-300"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <p className="text-base md:text-lg text-sand-800 dark:text-sand-200 mb-2">
                      {quest.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm md:text-base">
                      <Star className="w-4 h-4 md:w-5 md:h-5 text-primary-400" />
                      <span className="text-primary-400">+{quest.xpReward} XP</span>
                    </div>
                  </div>
                  {isCompleted ? (
                    <div className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm md:text-base">
                      Completed
                    </div>
                  ) : (
                    <button
                      onClick={() => handleQuestComplete(quest.id)}
                      className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-400 
                        text-white rounded-lg hover:from-primary-600 hover:to-primary-500 
                        transition-all duration-300 text-sm md:text-base whitespace-nowrap"
                    >
                      Complete Quest
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {quests.length === 0 && (
            <div className="text-center py-8 text-neutral-lightGray">
              No quests available for this raid boss
            </div>
          )}
        </div>
      </div>

      {showSubmitModal && (
        <QuestSubmissionModal
          onClose={() => {
            setShowSubmitModal(false);
            setSelectedQuestId(null);
          }}
          onSubmit={handleSubmitProof}
        />
      )}
    </div>
  );
};