export const relayerConfig = {
  endpoints: {
    primary: import.meta.env.VITE_HELIUS_RPC_URL,
    fallback: [
      'https://api.mainnet-beta.solana.com',
      'https://solana-api.projectserum.com'
    ]
  },
  
  retryPolicy: {
    maxAttempts: 3,
    baseDelay: 1000,
    maxDelay: 5000
  },
  
  rateLimit: {
    transactions: {
      perSecond: 50,
      burstSize: 100
    },
    queries: {
      perSecond: 100,
      burstSize: 200
    }
  },
  
  compression: {
    enabled: true,
    minSize: 1024, // Only compress data larger than 1KB
    algorithm: 'snappy'
  },
  
  queue: {
    maxSize: 1000,
    priorityLevels: {
      high: 2,
      normal: 1,
      low: 0
    },
    timeoutMs: 30000
  },
  
  monitoring: {
    errorThreshold: 0.1, // 10% error rate triggers alert
    latencyThreshold: 2000, // Alert if latency exceeds 2s
    metricsInterval: 60000 // Report metrics every minute
  }
};