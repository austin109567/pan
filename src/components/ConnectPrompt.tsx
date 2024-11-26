import { FC } from 'react';
import { Wallet } from 'lucide-react';
import { WalletConnect as WalletConnectComponent } from './WalletConnect';
import { GlassPanel } from './GlassPanel';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const ConnectPrompt: FC = () => {
  const { signInAsGuest } = useAuth();
  const navigate = useNavigate();

  const handleGuestLogin = async () => {
    const success = await signInAsGuest();
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <GlassPanel className="max-w-md mx-auto p-8">
        <div className="w-16 h-16 bg-primary-main/10 rounded-full flex items-center justify-center mb-6 mx-auto">
          <Wallet className="w-8 h-8 text-primary-main" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">
          Connect to Play
        </h2>
        <p className="text-text-light-secondary dark:text-text-dark-secondary mb-8">
          Connect your wallet to access exclusive features and start your raiding adventure!
        </p>
        <div className="space-y-4">
          <WalletConnectComponent />
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-primary-main/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background-dark text-text-dark-secondary">or</span>
            </div>
          </div>
          <button
            onClick={handleGuestLogin}
            className="w-full px-4 py-2 bg-primary-main/20 text-primary-main rounded-lg hover:bg-primary-main/30 transition-colors"
          >
            Continue as Guest
          </button>
        </div>
      </GlassPanel>
    </div>
  );
};