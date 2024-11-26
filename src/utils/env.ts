// Utility to check environment variables
export const checkEnvVariables = () => {
  const envVars = {
    SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL?.trim(),
    SUPABASE_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY?.trim(),
    SOLANA_RPC: import.meta.env.VITE_SOLANA_RPC_URL?.trim(),
    SOLANA_NETWORK: import.meta.env.VITE_SOLANA_NETWORK?.trim(),
    HELIUS_API_KEY: import.meta.env.VITE_HELIUS_API_KEY?.trim()
  };

  // Validate Supabase configuration
  if (!envVars.SUPABASE_URL || !envVars.SUPABASE_URL.startsWith('https://')) {
    console.error('Invalid SUPABASE_URL:', envVars.SUPABASE_URL);
    throw new Error('Invalid SUPABASE_URL format');
  }

  if (!envVars.SUPABASE_KEY || !envVars.SUPABASE_KEY.includes('eyJ')) {
    console.error('Invalid SUPABASE_KEY format');
    throw new Error('Invalid SUPABASE_KEY format');
  }

  // Validate Solana configuration
  if (!envVars.SOLANA_RPC || !envVars.SOLANA_RPC.startsWith('https://')) {
    console.error('Invalid SOLANA_RPC:', envVars.SOLANA_RPC);
    throw new Error('Invalid SOLANA_RPC format');
  }

  if (!envVars.SOLANA_NETWORK || !['mainnet-beta', 'testnet', 'devnet'].includes(envVars.SOLANA_NETWORK)) {
    console.error('Invalid SOLANA_NETWORK:', envVars.SOLANA_NETWORK);
    throw new Error('Invalid SOLANA_NETWORK format');
  }

  // Log environment status in development
  if (import.meta.env.DEV) {
    console.log('Environment Variables Status:', {
      SUPABASE_URL: envVars.SUPABASE_URL ? 'configured' : 'missing',
      SUPABASE_KEY: envVars.SUPABASE_KEY ? 'configured' : 'missing',
      SOLANA_RPC: envVars.SOLANA_RPC ? 'configured' : 'missing',
      SOLANA_NETWORK: envVars.SOLANA_NETWORK || 'missing',
      HELIUS_API_KEY: envVars.HELIUS_API_KEY ? 'configured' : 'missing'
    });
  }

  return envVars;
};
