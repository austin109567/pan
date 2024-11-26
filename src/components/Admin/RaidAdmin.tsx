import { FC, useState } from 'react';
import { Plus, Edit2 } from 'lucide-react';
import { RaidBossForm } from './RaidBossForm';
import { RaidBossList } from './RaidBossList';

export const RaidAdmin: FC = () => {
  const [activeView, setActiveView] = useState<'create' | 'edit'>('create');

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-white">Raid Boss Administration</h2>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button
            onClick={() => setActiveView('create')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              activeView === 'create'
                ? 'bg-primary-main text-white shadow-glow'
                : 'bg-primary-main/20 text-text-light-primary dark:text-white hover:bg-primary-main/30'
            }`}
          >
            <Plus className="w-4 h-4" />
            Create Raid Boss
          </button>
          <button
            onClick={() => setActiveView('edit')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              activeView === 'edit'
                ? 'bg-primary-main text-white shadow-glow'
                : 'bg-primary-main/20 text-text-light-primary dark:text-white hover:bg-primary-main/30'
            }`}
          >
            <Edit2 className="w-4 h-4" />
            Edit Raid Bosses
          </button>
        </div>
      </div>

      <div className="gradient-box p-6">
        {activeView === 'create' ? (
          <RaidBossForm onComplete={() => setActiveView('edit')} />
        ) : (
          <RaidBossList />
        )}
      </div>
    </div>
  );
};