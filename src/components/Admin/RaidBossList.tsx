import { FC, useState, useEffect } from 'react';
import { Edit2, Trash2, Image as ImageIcon, Shield, Star, Users } from 'lucide-react';
import { RaidState } from '../../types/raid';
import { raidService } from '../../services/raidService';
import { RaidBossForm } from './RaidBossForm';

export const RaidBossList: FC = () => {
  const [raids, setRaids] = useState<RaidState[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRaid, setEditingRaid] = useState<RaidState | null>(null);

  useEffect(() => {
    const loadRaids = async () => {
      try {
        setLoading(true);
        const allRaids = await raidService.getAllRaids();
        setRaids(allRaids || []);
      } catch (error) {
        console.error('Error loading raids:', error);
        setRaids([]);
      } finally {
        setLoading(false);
      }
    };

    loadRaids();
  }, []);

  const handleDelete = async (raidId: string) => {
    try {
      await raidService.deleteRaid(raidId);
      const allRaids = await raidService.getAllRaids();
      setRaids(allRaids || []);
    } catch (error) {
      console.error('Error deleting raid:', error);
    }
  };

  if (editingRaid) {
    return (
      <div>
        <button
          onClick={() => setEditingRaid(null)}
          className="text-neutral-lightGray hover:text-white mb-4 flex items-center gap-2"
        >
          ← Back to Raid Boss List
        </button>
        <RaidBossForm 
          raid={editingRaid} 
          onComplete={async () => {
            setEditingRaid(null);
            const allRaids = await raidService.getAllRaids();
            setRaids(allRaids || []);
          }}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary-pink"></div>
      </div>
    );
  }

  if (raids.length === 0) {
    return (
      <div className="text-center p-8 text-neutral-lightGray">
        No raid bosses found. Create one using the form above.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {raids.map((raid) => {
        if (!raid || !raid.boss) return null;
        
        return (
          <div
            key={raid.id}
            className="bg-black/40 rounded-lg overflow-hidden border border-primary-pink/20"
          >
            <div className="flex flex-col md:flex-row">
              {/* Raid Boss Image */}
              <div className="w-full md:w-64 h-48 bg-neutral-charcoal/40 flex-shrink-0">
                {raid.boss.imageUrl ? (
                  <img
                    src={raid.boss.imageUrl}
                    alt={raid.boss.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-lightGray">
                    <ImageIcon className="w-12 h-12" />
                  </div>
                )}
              </div>

              {/* Raid Boss Details */}
              <div className="flex-1 p-6">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="space-y-4 w-full">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2 break-words">{raid.boss.name}</h3>
                      <p className="text-neutral-lightGray break-words">{raid.boss.description}</p>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-primary-teal" />
                        <span className="text-neutral-lightGray">
                          Defense: {raid.boss.defense}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-primary-pink" />
                        <span className="text-neutral-lightGray">
                          XP: {raid.boss.rewards.xp.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary-pink" />
                        <span className="text-neutral-lightGray">
                          Participants: {raid.participants.length}
                        </span>
                      </div>
                    </div>

                    {/* Quest List */}
                    <div>
                      <h4 className="text-white font-medium mb-2">Quests:</h4>
                      <ul className="space-y-2">
                        {raid.boss.quests.map((quest, index) => (
                          <li key={quest.id} className="text-neutral-lightGray text-sm">
                            {index + 1}. {quest.description} ({quest.xpReward} XP)
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {raid.status !== 'completed' && (
                      <button
                        onClick={() => setEditingRaid(raid)}
                        className="p-2 text-neutral-lightGray hover:text-white transition-colors rounded-lg hover:bg-white/5"
                        title="Edit raid boss"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(raid.id)}
                      className="p-2 text-red-400 hover:text-red-300 transition-colors rounded-lg hover:bg-red-400/5"
                      title="Delete raid boss"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};