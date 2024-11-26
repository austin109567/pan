import { doc, getDoc, setDoc, updateDoc, query, collection, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Guild } from '../../types/guild';
import { Cache } from '../../utils/cache';
import { CACHE_DURATION } from '../../config/cache';
import { BatchProcessor } from './BatchProcessor';

export class GuildService {
  private static instance: GuildService;
  private cache: Cache;
  private batchProcessor: BatchProcessor;

  private constructor() {
    this.cache = Cache.getInstance();
    this.batchProcessor = BatchProcessor.getInstance();
  }

  static getInstance(): GuildService {
    if (!GuildService.instance) {
      GuildService.instance = new GuildService();
    }
    return GuildService.instance;
  }

  async getGuild(guildId: string): Promise<Guild | null> {
    const cacheKey = `guild:${guildId}`;
    const cached = this.cache.get<Guild>(cacheKey);
    if (cached) return cached;

    try {
      const docRef = doc(db, 'guilds', guildId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data() as Guild;
        this.cache.set(cacheKey, data, CACHE_DURATION.guild.info);
        return data;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to get guild:', error);
      return null;
    }
  }

  async addMember(guildId: string, wallet: string): Promise<boolean> {
    try {
      const guild = await this.getGuild(guildId);
      if (!guild) return false;

      const members = new Set(guild.members);
      if (members.has(wallet)) return false;

      members.add(wallet);

      await this.batchProcessor.addOperation('update', doc(db, 'guilds', guildId), {
        members: Array.from(members)
      });

      // Update user's guild
      await this.batchProcessor.addOperation('update', doc(db, 'users', wallet), {
        guild: guildId
      });

      await this.batchProcessor.processBatch();
      this.cache.delete(`guild:${guildId}`);
      this.cache.delete(`user:${wallet}`);

      return true;
    } catch (error) {
      console.error('Failed to add member to guild:', error);
      return false;
    }
  }

  async removeMember(guildId: string, wallet: string): Promise<boolean> {
    try {
      const guild = await this.getGuild(guildId);
      if (!guild) return false;

      const members = new Set(guild.members);
      if (!members.has(wallet)) return false;

      members.delete(wallet);

      await this.batchProcessor.addOperation('update', doc(db, 'guilds', guildId), {
        members: Array.from(members)
      });

      // Update user's guild
      await this.batchProcessor.addOperation('update', doc(db, 'users', wallet), {
        guild: null
      });

      await this.batchProcessor.processBatch();
      this.cache.delete(`guild:${guildId}`);
      this.cache.delete(`user:${wallet}`);

      return true;
    } catch (error) {
      console.error('Failed to remove member from guild:', error);
      return false;
    }
  }

  async updateGuildXP(guildId: string, xpChange: number): Promise<boolean> {
    try {
      await updateDoc(doc(db, 'guilds', guildId), {
        totalXp: increment(xpChange)
      });
      this.cache.delete(`guild:${guildId}`);
      return true;
    } catch (error) {
      console.error('Failed to update guild XP:', error);
      return false;
    }
  }

  async batchUpdateGuilds(updates: { guildId: string; updates: Partial<Guild> }[]): Promise<boolean> {
    try {
      updates.forEach(({ guildId, updates }) => {
        const ref = doc(db, 'guilds', guildId);
        this.batchProcessor.addOperation('update', ref, updates);
        this.cache.delete(`guild:${guildId}`);
      });

      await this.batchProcessor.processBatch();
      return true;
    } catch (error) {
      console.error('Failed to batch update guilds:', error);
      return false;
    }
  }
}