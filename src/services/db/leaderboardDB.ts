import { doc, getDoc, setDoc, query, collection, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { Leaderboard, LeaderboardEntry } from '../../schemas/leaderboard';
import { Cache } from '../../utils/cache';
import { CACHE_DURATION } from '../../config/cache';

const cache = Cache.getInstance();
const LEADERBOARDS_COLLECTION = 'leaderboards';

export const leaderboardDB = {
  async getLeaderboard(
    type: 'daily' | 'weekly' | 'monthly' | 'all-time',
    category: 'xp' | 'quests' | 'raids'
  ): Promise<Leaderboard | null> {
    const cacheKey = `leaderboard:${type}:${category}`;
    const cached = cache.get<Leaderboard>(cacheKey);
    if (cached) return cached;

    try {
      const docRef = doc(db, LEADERBOARDS_COLLECTION, `${type}_${category}`);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data() as Leaderboard;
        cache.set(cacheKey, data, CACHE_DURATION.player.leaderboard);
        return data;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to get leaderboard:', error);
      return null;
    }
  },

  async updateLeaderboard(leaderboard: Leaderboard): Promise<boolean> {
    try {
      await setDoc(
        doc(db, LEADERBOARDS_COLLECTION, `${leaderboard.type}_${leaderboard.category}`),
        leaderboard
      );
      cache.clear();
      return true;
    } catch (error) {
      console.error('Failed to update leaderboard:', error);
      return false;
    }
  },

  async getTopPlayers(
    type: 'daily' | 'weekly' | 'monthly' | 'all-time',
    category: 'xp' | 'quests' | 'raids',
    count: number = 100
  ): Promise<LeaderboardEntry[]> {
    const cacheKey = `leaderboard:${type}:${category}:top${count}`;
    const cached = cache.get<LeaderboardEntry[]>(cacheKey);
    if (cached) return cached;

    try {
      const entriesQuery = query(
        collection(db, LEADERBOARDS_COLLECTION, `${type}_${category}`, 'entries'),
        orderBy('score', 'desc'),
        limit(count)
      );
      
      const querySnapshot = await getDocs(entriesQuery);
      const entries = querySnapshot.docs.map(doc => doc.data() as LeaderboardEntry);
      
      cache.set(cacheKey, entries, CACHE_DURATION.player.leaderboard);
      return entries;
    } catch (error) {
      console.error('Failed to get top players:', error);
      return [];
    }
  },

  async getPlayerRank(
    type: 'daily' | 'weekly' | 'monthly' | 'all-time',
    category: 'xp' | 'quests' | 'raids',
    wallet: string
  ): Promise<number> {
    try {
      const entriesQuery = query(
        collection(db, LEADERBOARDS_COLLECTION, `${type}_${category}`, 'entries'),
        where('wallet', '==', wallet)
      );
      
      const querySnapshot = await getDocs(entriesQuery);
      if (querySnapshot.empty) return 0;
      
      return querySnapshot.docs[0].data().rank;
    } catch (error) {
      console.error('Failed to get player rank:', error);
      return 0;
    }
  },

  async getGuildLeaderboard(
    type: 'daily' | 'weekly' | 'monthly' | 'all-time'
  ): Promise<LeaderboardEntry[]> {
    const cacheKey = `leaderboard:guilds:${type}`;
    const cached = cache.get<LeaderboardEntry[]>(cacheKey);
    if (cached) return cached;

    try {
      const entriesQuery = query(
        collection(db, LEADERBOARDS_COLLECTION, `${type}_guilds`, 'entries'),
        orderBy('score', 'desc'),
        limit(100)
      );
      
      const querySnapshot = await getDocs(entriesQuery);
      const entries = querySnapshot.docs.map(doc => doc.data() as LeaderboardEntry);
      
      cache.set(cacheKey, entries, CACHE_DURATION.guild.leaderboard);
      return entries;
    } catch (error) {
      console.error('Failed to get guild leaderboard:', error);
      return [];
    }
  }
};