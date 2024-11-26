import { FC, useEffect, useState } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/wallet.css';

type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'authenticating' | 'error';

export const WalletConnect: FC = () => {
  const { connected } = useWallet();
  const { isAuthenticated, isLoading, error: authError } = useAuth();
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');

  useEffect(() => {
    if (!connected) {
      setConnectionState('disconnected');
    } else if (isLoading) {
      setConnectionState('authenticating');
    } else if (isAuthenticated) {
      setConnectionState('connected');
    } else if (authError) {
      setConnectionState('error');
    }
  }, [connected, isLoading, isAuthenticated, authError]);

  return (
    <div className="wallet-connect">
      <WalletMultiButton />
      {authError && (
        <div className="error-message">
          {authError.message}
        </div>
      )}
      {connectionState === 'authenticating' && (
        <div className="status-message">
          Authenticating...
        </div>
      )}
    </div>
  );
};

export default WalletConnect;