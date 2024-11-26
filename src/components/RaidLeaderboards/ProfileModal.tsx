import { FC, useEffect, useState } from 'react';
import { Star, TrendingUp, Trophy, Sword, X } from 'lucide-react';
import { Player } from '../../types/player';
import { motion, AnimatePresence } from 'framer-motion';
import { playerService } from '../../services/playerService';

interface ProfileModalProps {
  isOpen: boolean;
  wallet: string;
  onClose: () => void;
}

const StatCard: FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
}> = ({ icon, label, value }) => (
  <div className="bg-white/80 dark:bg-black/40 backdrop-blur-sm rounded-lg p-3 border border-sand-300/20 dark:border-sand-200/10">
    <div className="flex items-center gap-1.5 mb-1">
      <div className="p-1 rounded-md bg-primary-500/10">
        {icon}
      </div>
      <h4 className="text-xs font-medium text-sand-900 dark:text-white">{label}</h4>
    </div>
    <p className="text-base font-bold truncate bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-400">
      {typeof value === 'number' ? value.toLocaleString() : value}
    </p>
  </div>
);

export const ProfileModal: FC<ProfileModalProps> = ({ isOpen, wallet, onClose }) => {
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        setLoading(true);
        const data = await playerService.getPlayer(wallet);
        setPlayer(data);
      } catch (err) {
        console.error('Error fetching player:', err);
        setError('Failed to load player data');
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && wallet) {
      fetchPlayer();
    }
  }, [isOpen, wallet]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-md bg-gradient-to-br from-primary-500/30 via-sand-200/30 to-transparent
          border border-primary-500/40 dark:border-primary-500/30
          shadow-xl shadow-primary-500/20
          dark:from-primary-950 dark:via-background-900 dark:to-background-950
          backdrop-blur-md rounded-lg p-4 transition-all duration-300"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1.5 text-sand-600 hover:text-primary-500 transition-colors rounded-lg hover:bg-primary-500/10"
        >
          <X className="w-4 h-4" />
        </button>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            <p className="mt-3 text-sm text-sand-600 dark:text-sand-400">Loading...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-sm text-red-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 px-3 py-1.5 text-sm bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : player ? (
          <>
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg overflow-hidden border border-sand-300/20 dark:border-sand-200/10 flex-shrink-0">
                {player.profilePicture ? (
                  <img
                    src={player.profilePicture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src="/assets/defaultpfp.png"
                    alt="Default Profile"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-bold text-sand-900 dark:text-white truncate">
                  {player.showWallet 
                    ? `${wallet.slice(0, 4)}...${wallet.slice(-4)}`
                    : player.username || player.handle || `${wallet.slice(0, 4)}...${wallet.slice(-4)}`}
                </h3>
                <p className="text-xs text-sand-600 dark:text-sand-400">
                  Joined {new Date(player.dateJoined).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-2">
              <StatCard
                icon={<TrendingUp className="w-3.5 h-3.5 text-primary-500" />}
                label="Rank"
                value={`#${player.rank || 'N/A'}`}
              />
              <StatCard
                icon={<Star className="w-3.5 h-3.5 text-primary-500" />}
                label="XP"
                value={player.experience}
              />
              <StatCard
                icon={<Trophy className="w-3.5 h-3.5 text-primary-500" />}
                label="Quests"
                value={player.questsCompleted}
              />
              <StatCard
                icon={<Sword className="w-3.5 h-3.5 text-primary-500" />}
                label="Level"
                value={player.level || 1}
              />
            </div>
          </>
        ) : null}
      </motion.div>
    </div>
  );
};