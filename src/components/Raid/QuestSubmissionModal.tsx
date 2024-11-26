import { FC, useState } from 'react';
import { X, Upload, Link } from 'lucide-react';
import { Quest } from '../../types/Quest';
import { useWallet } from '@solana/wallet-adapter-react';
import { playerService } from '../../services/playerService';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

interface QuestSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (submission: { url: string; screenshot?: File }) => Promise<void>;
  quest: Quest | null;
}

export const QuestSubmissionModal: FC<QuestSubmissionModalProps> = ({ 
  isOpen,
  onClose, 
  onSubmit,
  quest
}) => {
  const { publicKey } = useWallet();
  const { isAuthenticated, signIn } = useAuth();
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!isOpen || !quest) return null;

  const player = publicKey ? playerService.getPlayer(publicKey.toString()) : null;

  const handleSubmit = async () => {
    if (!url) {
      setError('URL is required');
      return;
    }

    if (!isAuthenticated) {
      try {
        await signIn();
      } catch (error) {
        console.error('Authentication failed:', error);
        setError('Please sign in with your wallet first');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        screenshot: screenshot || undefined,
        url
      });
      setShowSuccess(true);
      setTimeout(() => {
        onClose();
        setShowSuccess(false);
        setUrl('');
        setScreenshot(null);
        setError('');
      }, 2000);
    } catch (error) {
      console.error('Failed to submit quest:', error);
      setError('Failed to submit quest. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-md sm:max-w-lg bg-gradient-to-br from-primary-500/30 via-sand-200/30 to-transparent
          border border-primary-500/40 dark:border-primary-500/30
          shadow-2xl shadow-primary-500/30
          hover:shadow-primary-500/50 hover:border-primary-500/50
          dark:from-primary-950 dark:via-background-900 dark:to-background-950
          backdrop-blur-md rounded-xl p-4 md:p-6 transition-all duration-300"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-sand-600 hover:text-primary-500 transition-colors rounded-lg hover:bg-primary-500/10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-2">{quest.title}</h2>
          <p className="text-sm text-sand-200/80">{quest.description}</p>
        </div>

        {showSuccess ? (
          <div className="text-center py-6">
            <div className="text-base sm:text-lg font-medium mb-2 text-green-400">
              Quest Submitted!
            </div>
            <p className="text-sm text-sand-400">
              Your submission is being reviewed. You'll receive XP once approved.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-sand-200/80 mb-2">
                Proof URL
              </label>
              <div className="flex gap-2 w-full">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter URL"
                  className="flex-1 min-w-0 bg-background-900/50 border border-primary-500/30 rounded-lg px-3 py-2 text-sm text-white placeholder-sand-200/50 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                />
                <button 
                  type="button"
                  className="shrink-0 p-2 bg-background-900/50 border border-primary-500/30 rounded-lg hover:bg-background-800/50 transition-colors"
                >
                  <Link className="w-4 h-4 text-primary-500" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-sand-200/80 mb-2">
                Screenshot (Optional)
              </label>
              <div className="w-full">
                <label className="w-full flex flex-col items-center px-3 py-4 bg-background-900/50 text-sand-200/80 rounded-lg tracking-wide border border-primary-500/30 cursor-pointer hover:bg-background-800/50 transition-colors">
                  <Upload className="w-6 h-6 mb-2 text-primary-500" />
                  <span className="text-xs text-center break-all px-2">
                    {screenshot ? screenshot.name : "Click to upload screenshot"}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
                  />
                </label>
              </div>
            </div>

            {error && (
              <div className="text-xs text-red-500">{error}</div>
            )}

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full px-4 py-2 text-sm bg-primary-500/90 text-white rounded-lg hover:bg-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit Quest"}
              </button>
              <button
                onClick={onClose}
                className="w-full px-4 py-2 text-sm text-sand-200/80 hover:text-white transition-colors border border-primary-500/30 rounded-lg hover:bg-background-800/50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};