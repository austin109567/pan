import { FC, useState, useEffect } from 'react';
import { Edit2, Trash2, Image as ImageIcon } from 'lucide-react';
import { Quest } from '../../types/quest';
import { QuestForm } from './QuestForm';
import { questService } from '../../services/questService';

export const QuestList: FC = () => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadQuests();
  }, []);

  const loadQuests = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedQuests = await questService.getQuests();
      setQuests(Array.isArray(fetchedQuests) ? fetchedQuests : []);
    } catch (err) {
      setError('Failed to load quests. Please try again later.');
      console.error('Error loading quests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (questId: string) => {
    try {
      if (await questService.deleteQuest(questId)) {
        await loadQuests();
      }
    } catch (err) {
      console.error('Error deleting quest:', err);
    }
  };

  const handleUpdateQuest = async (quest: Quest) => {
    try {
      if (await questService.updateQuest(quest.id, quest)) {
        await loadQuests();
        setEditingQuest(null);
      }
    } catch (err) {
      console.error('Error updating quest:', err);
    }
  };

  if (editingQuest) {
    return (
      <div>
        <button
          onClick={() => setEditingQuest(null)}
          className="text-neutral-lightGray hover:text-white mb-4 flex items-center gap-2"
        >
          ← Back to Quest List
        </button>
        <QuestForm 
          quest={editingQuest} 
          onSubmit={handleUpdateQuest}
          isEditing={true}
        />
      </div>
    );
  }

  if (loading) {
    return <div className="text-center py-4">Loading quests...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4">
        {error}
        <button 
          onClick={loadQuests}
          className="ml-4 text-sm underline hover:no-underline"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!quests.length) {
    return <div className="text-center py-4">No quests found.</div>;
  }

  return (
    <div className="space-y-4">
      {quests.map(quest => (
        <div
          key={quest.id}
          className="bg-black/40 rounded-lg overflow-hidden border border-primary-pink/20"
        >
          <div className="flex">
            {/* Quest Image */}
            <div className="w-48 h-32 bg-neutral-charcoal/40 flex-shrink-0">
              {quest.imageUrl ? (
                <img
                  src={quest.imageUrl}
                  alt={quest.description}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-neutral-lightGray/40" />
                </div>
              )}
            </div>

            {/* Quest Details */}
            <div className="flex-grow p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-white">{quest.title}</h3>
                  <p className="text-sm text-neutral-lightGray mt-1">{quest.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingQuest(quest)}
                    className="p-2 text-neutral-lightGray hover:text-white transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(quest.id)}
                    className="p-2 text-neutral-lightGray hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="mt-2 flex gap-4 text-sm">
                <span className="text-neutral-lightGray">Type: {quest.type}</span>
                <span className="text-neutral-lightGray">XP: {quest.xpReward}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};