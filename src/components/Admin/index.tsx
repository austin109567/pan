import { FC, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { QuestAdmin } from './QuestAdmin';
import { RaidAdmin } from './RaidAdmin';
import { GuildAdmin } from './GuildAdmin';
import { ScrollText, Sword, ClipboardList, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const ADMIN_WALLET = "8jN1XtgiuWeyNjzysYVqGZ1mPAG37sjmuCTnENz66wrs";

type AdminTab = 'quests' | 'raids' | 'guilds';

interface AdminTabButtonProps {
  icon: typeof ScrollText;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const AdminTabButton: FC<AdminTabButtonProps> = ({ icon: Icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors ${
      isActive
        ? 'bg-primary-main text-white shadow-glow'
        : 'bg-primary-main/20 text-text-light-secondary dark:text-neutral-lightGray hover:bg-primary-main/30 hover:text-primary-main'
    }`}
  >
    <Icon className="w-5 h-5" />
    <span className="whitespace-nowrap">{label}</span>
  </button>
);

export const AdminPanel: FC = () => {
  const { publicKey } = useWallet();
  const [activeTab, setActiveTab] = useState<AdminTab>('quests');
  
  if (!publicKey || publicKey.toString() !== ADMIN_WALLET) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-title text-text-light-primary dark:text-white mb-4">Access Denied</h2>
          <p className="text-text-light-secondary dark:text-text-dark-secondary">
            You don't have permission to access this area.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-title text-text-light-primary dark:text-white">Admin Panel</h1>
        
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Link
            to="/admin/subs"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary-main/20 text-text-light-secondary dark:text-neutral-lightGray hover:bg-primary-main/30 hover:text-primary-main transition-colors"
          >
            <ClipboardList className="w-5 h-5" />
            <span className="whitespace-nowrap">Submissions</span>
          </Link>

          <AdminTabButton
            icon={ScrollText}
            label="Quest Administration"
            isActive={activeTab === 'quests'}
            onClick={() => setActiveTab('quests')}
          />

          <AdminTabButton
            icon={Sword}
            label="Raid Administration"
            isActive={activeTab === 'raids'}
            onClick={() => setActiveTab('raids')}
          />

          <AdminTabButton
            icon={Users}
            label="Guild Administration"
            isActive={activeTab === 'guilds'}
            onClick={() => setActiveTab('guilds')}
          />
        </div>
      </div>

      <div className="gradient-box p-6">
        {activeTab === 'quests' && <QuestAdmin />}
        {activeTab === 'raids' && <RaidAdmin />}
        {activeTab === 'guilds' && <GuildAdmin />}
      </div>
    </div>
  );
};