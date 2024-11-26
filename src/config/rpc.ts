import { Connection, Commitment } from '@solana/web3.js';

// RPC endpoints for load balancing
const RPC_ENDPOINTS = [
  import.meta.env.VITE_SOLANA_RPC_URL,
  `https://rpc.helius.xyz/?api-key=${import.meta.env.VITE_HELIUS_API_KEY}`
];

// Get random RPC endpoint
const getRandomRPC = () => {
  return RPC_ENDPOINTS[Math.floor(Math.random() * RPC_ENDPOINTS.length)];
};

// Create connection with retry logic
const createConnection = (commitment: Commitment = 'confirmed') => {
  const endpoint = getRandomRPC();
  return new Connection(endpoint, {
    commitment,
    wsEndpoint: endpoint.replace('https', 'wss'),
    confirmTransactionInitialTimeout: 60000
  });
};

// Monitor RPC performance
const monitorRPCCall = async (method: string, params: any[]) => {
  const start = performance.now();
  const connection = createConnection();
  
  try {
    const result = await connection.rpcRequest(method, params);
    const duration = performance.now() - start;
    console.debug(`RPC ${method} took ${duration}ms`);
    return result;
  } catch (error) {
    console.error(`RPC ${method} failed:`, error);
    throw error;
  }
};

export { createConnection, monitorRPCCall };