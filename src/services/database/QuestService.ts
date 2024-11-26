import { doc, getDoc, setDoc, updateDoc, query, collection, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { Quest, QuestSubmission } from '../../types/quest';
import { Cache } from '../../utils/cache';
import { CACHE_DURATION } from '../../config/cache';
import { BatchProcessor } from './BatchProcessor';

export class QuestService {
  private static instance: QuestService;
  private cache: Cache;
  private batchProcessor: BatchProcessor;

  private constructor() {
    this.cache = Cache.getInstance();
    this.batchProcessor = BatchProcessor.getInstance();
  }

  static getInstance(): QuestService {
    if (!QuestService.instance) {
      QuestService.instance = new QuestService();
    }
    return QuestService.instance;
  }

  async getQuest(questId: string): Promise<Quest | null> {
    const cacheKey = `quest:${questId}`;
    const cached = this.cache.get<Quest>(cacheKey);
    if (cached) return cached;

    try {
      const docRef = doc(db, 'quests', questId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data() as Quest;
        this.cache.set(cacheKey, data, CACHE_DURATION.player.profile);
        return data;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to get quest:', error);
      return null;
    }
  }

  async getActiveQuests(type: 'daily' | 'weekly' | 'monthly'): Promise<Quest[]> {
    const cacheKey = `quests:${type}:active`;
    const cached = this.cache.get<Quest[]>(cacheKey);
    if (cached) return cached;

    try {
      const now = Timestamp.now();
      const questsQuery = query(
        collection(db, 'quests'),
        where('type', '==', type),
        where('status', '==', 'available'),
        where('dateExpires', '>', now)
      );
      
      const querySnapshot = await getDocs(questsQuery);
      const quests = querySnapshot.docs.map(doc => doc.data() as Quest);
      
      this.cache.set(cacheKey, quests, CACHE_DURATION.player.profile);
      return quests;
    } catch (error) {
      console.error('Failed to get active quests:', error);
      return [];
    }
  }

  async completeQuest(questId: string, wallet: string): Promise<boolean> {
    try {
      const quest = await this.getQuest(questId);
      if (!quest) return false;

      const completedBy = new Set(quest.completedBy || []);
      if (completedBy.has(wallet)) return false;

      completedBy.add(wallet);

      await this.batchProcessor.addOperation('update', doc(db, 'quests', questId), {
        completedBy: Array.from(completedBy)
      });

      // Update user stats
      await this.batchProcessor.addOperation('update', doc(db, 'users', wallet), {
        questsCompleted: increment(1),
        experience: increment(quest.xpReward),
        lastQuestCompletionTime: Timestamp.now()
      });

      await this.batchProcessor.processBatch();
      this.cache.delete(`quest:${questId}`);
      this.cache.delete(`user:${wallet}`);

      return true;
    } catch (error) {
      console.error('Failed to complete quest:', error);
      return false;
    }
  }

  async batchUpdateQuests(updates: { questId: string; updates: Partial<Quest> }[]): Promise<boolean> {
    try {
      updates.forEach(({ questId, updates }) => {
        const ref = doc(db, 'quests', questId);
        this.batchProcessor.addOperation('update', ref, updates);
        this.cache.delete(`quest:${questId}`);
      });

      await this.batchProcessor.processBatch();
      return true;
    } catch (error) {
      console.error('Failed to batch update quests:', error);
      return false;
    }
  }
}