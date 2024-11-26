import { FC, useState, useEffect } from 'react';
import { Save, Server, Key, AlertCircle } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { ConnectPrompt } from './ConnectPrompt';
import { ContentBox } from './ContentBox';

export const Settings: FC = () => {
  const { connected } = useWallet();
  const [rpcUrl, setRpcUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);
  const [useCustomEndpoint, setUseCustomEndpoint] = useState(false);

  useEffect(() => {
    const storedRpcUrl = localStorage.getItem('custom_rpc_url');
    const storedApiKey = localStorage.getItem('custom_api_key');
    
    if (storedRpcUrl && storedApiKey) {
      setRpcUrl(storedRpcUrl);
      setApiKey(storedApiKey);
      setUseCustomEndpoint(true);
    }
  }, []);

  const handleSave = () => {
    if (useCustomEndpoint && rpcUrl && apiKey) {
      localStorage.setItem('custom_rpc_url', rpcUrl);
      localStorage.setItem('custom_api_key', apiKey);
    } else {
      localStorage.removeItem('custom_rpc_url');
      localStorage.removeItem('custom_api_key');
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!connected) {
    return <ConnectPrompt />;
  }

  return (
    <div className="page-container">
      <div className="page-content">
        <ContentBox title="API Configuration">
          <div className="space-y-6">
            <div className="flex items-center gap-3 p-4 bg-primary-main/10 rounded-lg">
              <input
                type="checkbox"
                id="use-custom"
                checked={useCustomEndpoint}
                onChange={(e) => setUseCustomEndpoint(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <div>
                <label htmlFor="use-custom" className="font-medium">
                  Use Custom RPC Endpoint
                </label>
                <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                  Enable to use your own RPC endpoint and API key
                </p>
              </div>
            </div>

            {useCustomEndpoint && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">RPC URL</label>
                  <input
                    type="text"
                    value={rpcUrl}
                    onChange={(e) => setRpcUrl(e.target.value)}
                    className="w-full px-4 py-2 bg-background-dark/20 rounded-lg"
                    placeholder="https://your-rpc-endpoint.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">API Key</label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full px-4 py-2 bg-background-dark/20 rounded-lg"
                    placeholder="Your API key"
                  />
                </div>
              </div>
            )}

            <button
              onClick={handleSave}
              className="w-full px-4 py-2 bg-primary-main text-white rounded-lg hover:bg-primary-main/90 transition-colors"
            >
              {saved ? 'Settings Saved!' : 'Save Settings'}
            </button>
          </div>
        </ContentBox>
      </div>
    </div>
  );
};