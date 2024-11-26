import { EventEmitter } from 'events';
import { Cache } from '../utils/cache';
import { scaleConfig } from '../config/scale';

export class StateManager {
  private static instance: StateManager | null = null;
  private emitter: EventEmitter;
  private cache: Cache;
  private syncInterval: number = 1000; // Sync every second
  private lastSync: number = 0;
  private pendingUpdates: Map<string, any> = new Map();

  private constructor() {
    this.emitter = new EventEmitter();
    this.emitter.setMaxListeners(100); // Increase max listeners for scaling
    this.cache = Cache.getInstance();
    this.setupAutoSync();
  }

  static getInstance(): StateManager {
    if (!StateManager.instance) {
      StateManager.instance = new StateManager();
    }
    return StateManager.instance;
  }

  private setupAutoSync() {
    setInterval(() => {
      const now = Date.now();
      if (now - this.lastSync >= this.syncInterval) {
        this.syncState();
        this.lastSync = now;
      }
    }, this.syncInterval);
  }

  private syncState() {
    // Process pending updates in batches
    if (this.pendingUpdates.size > 0) {
      const updates = Array.from(this.pendingUpdates.entries());
      const batchSize = scaleConfig.batch.leaderboardUpdate;
      
      for (let i = 0; i < updates.length; i += batchSize) {
        const batch = updates.slice(i, i + batchSize);
        batch.forEach(([key, value]) => {
          this.cache.set(key, value, scaleConfig.cache.player.profile);
          this.pendingUpdates.delete(key);
        });
      }
    }

    this.emitter.emit('stateSync');
  }

  public subscribe(event: string, callback: (...args: any[]) => void) {
    if (this.emitter.listenerCount(event) < scaleConfig.performance.maxWebSocketConnections) {
      this.emitter.on(event, callback);
      return () => this.emitter.off(event, callback);
    } else {
      console.warn(`Max listeners (${scaleConfig.performance.maxWebSocketConnections}) reached for event: ${event}`);
      return () => {};
    }
  }

  public publish(event: string, data?: any) {
    // Add to pending updates for batch processing
    this.pendingUpdates.set(event, data);
    
    // If we have enough updates, trigger a sync
    if (this.pendingUpdates.size >= scaleConfig.batch.leaderboardUpdate) {
      this.syncState();
    }

    this.lastSync = Date.now();
    localStorage.setItem('lastStateUpdate', Date.now().toString());
  }

  public getLastUpdate(): number {
    return parseInt(localStorage.getItem('lastStateUpdate') || '0');
  }

  public clearCache() {
    this.cache.clear();
    this.pendingUpdates.clear();
    this.lastSync = 0;
  }
}

export const stateManager = StateManager.getInstance();