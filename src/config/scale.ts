export const scaleConfig = {
  performance: {
    maxWebSocketConnections: 1000,
    maxConcurrentRequests: 100,
    maxCacheSize: 100 * 1024 * 1024, // 100MB
    requestTimeout: 30000 // 30 seconds
  },

  cache: {
    player: {
      profile: 300000,    // 5 minutes
      inventory: 60000,   // 1 minute
      quests: 120000,    // 2 minutes
    },
    guild: {
      info: 600000,      // 10 minutes
      members: 300000,   // 5 minutes
    },
    leaderboard: 60000,  // 1 minute
    transaction: 300000  // 5 minutes
  },

  batch: {
    leaderboardUpdate: 50,   // Update leaderboard in batches of 50
    questUpdate: 100,        // Process quest updates in batches of 100
    inventoryUpdate: 200,    // Process inventory updates in batches of 200
    transactionBatch: 25     // Process transactions in batches of 25
  },

  limits: {
    maxPlayersPerGuild: 1000,
    maxQuestsPerPlayer: 50,
    maxItemsPerInventory: 1000,
    maxConcurrentRaids: 10,
    
    rateLimit: {
      windowMs: 60000,      // 1 minute window
      maxRequests: {
        global: 1000,       // 1000 requests per minute per IP
        auth: 30,           // 30 auth requests per minute
        quest: 10,          // 10 quest submissions per minute
        transaction: 50     // 50 transactions per minute
      }
    },

    transaction: {
      maxRetries: 3,
      maxPending: 100,
      maxBatchSize: 25
    }
  },

  monitoring: {
    errorThreshold: 0.05,    // 5% error rate threshold
    latencyThreshold: 1000,  // 1 second latency threshold
    metricsInterval: 60000   // Report metrics every minute
  }
};