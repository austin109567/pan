import { FC, useState } from 'react';
import { Edit2, Check, X } from 'lucide-react';
import { playerService } from '../../services/playerService';

interface UsernameManagerProps {
  wallet: string;
}

export const UsernameManager: FC<UsernameManagerProps> = ({ wallet }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [error, setError] = useState('');
  
  const player = playerService.getPlayer(wallet);
  if (!player) return null;

  const handleSubmit = () => {
    if (!newUsername.trim()) {
      setError('Username cannot be empty');
      return;
    }

    if (playerService.isUsernameTaken(newUsername)) {
      setError('Username is already taken');
      return;
    }

    const success = playerService.setUsername(wallet, newUsername);
    if (success) {
      setIsEditing(false);
      setError('');
    } else {
      setError('Failed to update username');
    }
  };

  const handleToggleDisplay = () => {
    playerService.toggleDisplayMode(wallet);
  };

  return (
    <div className="space-y-4">
      {isEditing ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Enter new username"
              className="flex-1 px-3 py-2 bg-black/40 border border-primary-pink/20 rounded-lg text-white placeholder-neutral-lightGray focus:outline-none focus:border-primary-pink/40"
            />
            <button
              onClick={handleSubmit}
              className="p-2 text-green-400 hover:text-green-300 transition-colors rounded-lg hover:bg-green-400/5"
            >
              <Check className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setError('');
              }}
              className="p-2 text-red-400 hover:text-red-300 transition-colors rounded-lg hover:bg-red-400/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-white">
            {player.showWallet 
              ? `${wallet.slice(0, 4)}...${wallet.slice(-4)}`
              : player.username || `${wallet.slice(0, 4)}...${wallet.slice(-4)}`}
          </h2>
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-neutral-lightGray hover:text-white transition-colors rounded-lg hover:bg-white/5"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {player.username && (
        <button
          onClick={handleToggleDisplay}
          className="px-4 py-2 bg-primary-pink/20 text-primary-pink rounded-lg hover:bg-primary-pink/30 transition-colors text-sm"
        >
          {player.showWallet ? 'Use Username' : 'Use Wallet'}
        </button>
      )}
    </div>
  );
};