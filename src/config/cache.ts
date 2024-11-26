import { Cache } from '../utils/cache';

// Cache durations in milliseconds
export const CACHE_DURATION = {
  nft: {
    metadata: 5 * 60 * 1000,     // 5 minutes
    collection: 15 * 60 * 1000,  // 15 minutes
    userNFTs: 2 * 60 * 1000     // 2 minutes
  },
  player: {
    profile: 60 * 1000,         // 1 minute
    stats: 30 * 1000,          // 30 seconds
    leaderboard: 30 * 1000     // 30 seconds
  },
  guild: {
    info: 5 * 60 * 1000,       // 5 minutes
    members: 2 * 60 * 1000,    // 2 minutes
    leaderboard: 60 * 1000     // 1 minute
  },
  raid: {
    active: 30 * 1000,         // 30 seconds
    completed: 5 * 60 * 1000   // 5 minutes
  }
};

// Initialize cache with optimal settings
const initCache = () => {
  const cache = Cache.getInstance();
  cache.setMaxSize(100 * 1024 * 1024); // 100MB
  cache.enableCompression(true);
  return cache;
};

export { initCache };