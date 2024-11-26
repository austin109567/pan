import { doc, getDoc, setDoc, updateDoc, query, collection, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { User } from '../../types/user';
import { Cache } from '../../utils/cache';
import { CACHE_DURATION } from '../../config/cache';
import { BatchProcessor } from './BatchProcessor';

export class UserService {
  private static instance: UserService;
  private cache: Cache;
  private batchProcessor: BatchProcessor;

  private constructor() {
    this.cache = Cache.getInstance();
    this.batchProcessor = BatchProcessor.getInstance();
  }

  static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  async getUser(wallet: string): Promise<User | null> {
    const cacheKey = `user:${wallet}`;
    const cached = this.cache.get<User>(cacheKey);
    if (cached) return cached;

    try {
      const docRef = doc(db, 'users', wallet);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data() as User;
        this.cache.set(cacheKey, data, CACHE_DURATION.player.profile);
        return data;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to get user:', error);
      return null;
    }
  }

  async createUser(user: User): Promise<boolean> {
    try {
      await setDoc(doc(db, 'users', user.wallet), user);
      this.cache.set(`user:${user.wallet}`, user, CACHE_DURATION.player.profile);
      return true;
    } catch (error) {
      console.error('Failed to create user:', error);
      return false;
    }
  }

  async updateUser(wallet: string, updates: Partial<User>): Promise<boolean> {
    try {
      await updateDoc(doc(db, 'users', wallet), updates);
      this.cache.delete(`user:${wallet}`);
      return true;
    } catch (error) {
      console.error('Failed to update user:', error);
      return false;
    }
  }

  async addToInventory(wallet: string, nftMint: string): Promise<boolean> {
    try {
      const user = await this.getUser(wallet);
      if (!user) return false;

      const inventory = new Set(user.inventory || []);
      inventory.add(nftMint);

      await this.updateUser(wallet, {
        inventory: Array.from(inventory)
      });

      return true;
    } catch (error) {
      console.error('Failed to add to inventory:', error);
      return false;
    }
  }

  async removeFromInventory(wallet: string, nftMint: string): Promise<boolean> {
    try {
      const user = await this.getUser(wallet);
      if (!user) return false;

      const inventory = new Set(user.inventory || []);
      inventory.delete(nftMint);

      await this.updateUser(wallet, {
        inventory: Array.from(inventory)
      });

      return true;
    } catch (error) {
      console.error('Failed to remove from inventory:', error);
      return false;
    }
  }

  async batchUpdateUsers(updates: { wallet: string; updates: Partial<User> }[]): Promise<boolean> {
    try {
      updates.forEach(({ wallet, updates }) => {
        const ref = doc(db, 'users', wallet);
        this.batchProcessor.addOperation('update', ref, updates);
        this.cache.delete(`user:${wallet}`);
      });

      await this.batchProcessor.processBatch();
      return true;
    } catch (error) {
      console.error('Failed to batch update users:', error);
      return false;
    }
  }

  async searchUsers(query: string, limit: number = 10): Promise<User[]> {
    try {
      const q = query.toLowerCase();
      const usersQuery = query(
        collection(db, 'users'),
        where('username', '>=', q),
        where('username', '<=', q + '\uf8ff')
      );
      
      const querySnapshot = await getDocs(usersQuery);
      return querySnapshot.docs
        .map(doc => doc.data() as User)
        .slice(0, limit);
    } catch (error) {
      console.error('Failed to search users:', error);
      return [];
    }
  }
}