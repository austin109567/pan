import { FC, useState } from 'react';
import { Plus, Edit2 } from 'lucide-react';
import { QuestForm } from './QuestForm';
import { QuestList } from './QuestList';

export const QuestAdmin: FC = () => {
  const [activeView, setActiveView] = useState<'create' | 'edit'>('create');

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-white">Quest Administration</h2>
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
            Add New Quest
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
            Edit Quests
          </button>
        </div>
      </div>

      <div className="gradient-box p-6">
        {activeView === 'create' ? (
          <QuestForm onSubmit={() => setActiveView('edit')} />
        ) : (
          <QuestList />
        )}
      </div>
    </div>
  );
};