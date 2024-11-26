import { FC, useState } from 'react';
import { X } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { guildService } from '../../services/guildService';
import { Guild } from '../../types/guild';

interface GuildJoinModalProps {
  guild: Guild;
  onClose: () => void;
  onSubmitted: () => void;
}

export const GuildJoinModal: FC<GuildJoinModalProps> = ({ guild, onClose, onSubmitted }) => {
  const { publicKey } = useWallet();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!publicKey) return;
    if (!message.trim()) {
      setError('Please enter a message');
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await guildService.submitMembershipRequest(
        guild.id,
        publicKey.toString(),
        message.trim()
      );
      
      if (success) {
        onSubmitted();
      } else {
        setError('Failed to submit request. Please try again.');
      }
    } catch (err) {
      setError('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-[#1A1B23] rounded-xl border border-primary-main/20 shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-primary-main/20">
          <h3 className="text-xl font-bold text-white">Join {guild.name}</h3>
          <button
            onClick={onClose}
            className="p-2 text-neutral-lightGray hover:text-white transition-colors rounded-lg hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-lightGray mb-2">
              Message to Guild Leaders
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us why you want to join this guild..."
              className="w-full px-4 py-3 bg-black/40 border border-primary-main/20 rounded-lg text-white placeholder-neutral-lightGray focus:outline-none focus:border-primary-main/40 min-h-[100px]"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full px-4 py-3 bg-primary-main text-white rounded-lg hover:bg-primary-main/90 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </div>
    </div>
  );
};