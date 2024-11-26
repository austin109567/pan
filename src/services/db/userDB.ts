import { doc, getDoc, setDoc, updateDoc, query, collection, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { UserProfile, UserStats, UserInventory } from '../../schemas/user';
import { Cache } from '../../utils/cache';
import { CACHE_DURATION } from '../../config/cache';

const cache = Cache.getInstance();
const USERS_COLLECTION = 'users';

export const userDB = {
  async getProfile(wallet: string): Promise<UserProfile | null> {
    // Check cache first
    const cached = cache.get<UserProfile>(`user:${wallet}`);
    if (cached) return cached;

    try {
      const docRef = doc(db, USERS_COLLECTION, wallet);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data() as UserProfile;
        cache.set(`user:${wallet}`, data, CACHE_DURATION.player.profile);
        return data;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to get user profile:', error);
      return null;
    }
  },

  async createProfile(profile: UserProfile): Promise<boolean> {
    try {
      await setDoc(doc(db, USERS_COLLECTION, profile.wallet), profile);
      cache.set(`user:${profile.wallet}`, profile, CACHE_DURATION.player.profile);
      return true;
    } catch (error) {
      console.error('Failed to create user profile:', error);
      return false;
    }
  },

  async updateProfile(wallet: string, updates: Partial<UserProfile>): Promise<boolean> {
    try {
      await updateDoc(doc(db, USERS_COLLECTION, wallet), updates);
      cache.clear(); // Clear cache since we don't know what changed
      return true;
    } catch (error) {
      console.error('Failed to update user profile:', error);
      return false;
    }
  },

  async getStats(wallet: string): Promise<UserStats | null> {
    const cached = cache.get<UserStats>(`stats:${wallet}`);
    if (cached) return cached;

    try {
      const docRef = doc(db, USERS_COLLECTION, wallet, 'stats', 'current');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data() as UserStats;
        cache.set(`stats:${wallet}`, data, CACHE_DURATION.player.stats);
        return data;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to get user stats:', error);
      return null;
    }
  },

  async updateStats(wallet: string, updates: Partial<UserStats>): Promise<boolean> {
    try {
      await updateDoc(doc(db, USERS_COLLECTION, wallet, 'stats', 'current'), updates);
      cache.clear();
      return true;
    } catch (error) {
      console.error('Failed to update user stats:', error);
      return false;
    }
  },

  async getInventory(wallet: string): Promise<UserInventory[]> {
    const cached = cache.get<UserInventory[]>(`inventory:${wallet}`);
    if (cached) return cached;

    try {
      const q = query(collection(db, USERS_COLLECTION, wallet, 'inventory'));
      const querySnapshot = await getDocs(q);
      
      const inventory = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserInventory[];

      cache.set(`inventory:${wallet}`, inventory, CACHE_DURATION.player.profile);
      return inventory;
    } catch (error) {
      console.error('Failed to get user inventory:', error);
      return [];
    }
  },

  async addToInventory(wallet: string, item: UserInventory): Promise<boolean> {
    try {
      await setDoc(
        doc(db, USERS_COLLECTION, wallet, 'inventory', item.nftMint),
        item
      );
      cache.clear();
      return true;
    } catch (error) {
      console.error('Failed to add item to inventory:', error);
      return false;
    }
  },

  async searchUsers(query: string, limit: number = 10): Promise<UserProfile[]> {
    try {
      const q = query.toLowerCase();
      const usersQuery = query(
        collection(db, USERS_COLLECTION),
        where('username', '>=', q),
        where('username', '<=', q + '\uf8ff')
      );
      
      const querySnapshot = await getDocs(usersQuery);
      return querySnapshot.docs
        .map(doc => doc.data() as UserProfile)
        .slice(0, limit);
    } catch (error) {
      console.error('Failed to search users:', error);
      return [];
    }
  }
};