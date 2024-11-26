import { doc, getDoc, setDoc, updateDoc, query, collection, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { Quest, QuestSubmission } from '../../schemas/quest';
import { Cache } from '../../utils/cache';
import { CACHE_DURATION } from '../../config/cache';

const cache = Cache.getInstance();
const QUESTS_COLLECTION = 'quests';

export const questDB = {
  async getQuest(questId: string): Promise<Quest | null> {
    const cached = cache.get<Quest>(`quest:${questId}`);
    if (cached) return cached;

    try {
      const docRef = doc(db, QUESTS_COLLECTION, questId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data() as Quest;
        cache.set(`quest:${questId}`, data, CACHE_DURATION.player.profile);
        return data;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to get quest:', error);
      return null;
    }
  },

  async createQuest(quest: Quest): Promise<boolean> {
    try {
      await setDoc(doc(db, QUESTS_COLLECTION, quest.id), quest);
      cache.set(`quest:${quest.id}`, quest, CACHE_DURATION.player.profile);
      return true;
    } catch (error) {
      console.error('Failed to create quest:', error);
      return false;
    }
  },

  async updateQuest(questId: string, updates: Partial<Quest>): Promise<boolean> {
    try {
      await updateDoc(doc(db, QUESTS_COLLECTION, questId), updates);
      cache.clear();
      return true;
    } catch (error) {
      console.error('Failed to update quest:', error);
      return false;
    }
  },

  async getActiveQuests(type: 'daily' | 'weekly' | 'monthly'): Promise<Quest[]> {
    const cacheKey = `quests:${type}:active`;
    const cached = cache.get<Quest[]>(cacheKey);
    if (cached) return cached;

    try {
      const now = Timestamp.now();
      const questsQuery = query(
        collection(db, QUESTS_COLLECTION),
        where('type', '==', type),
        where('status', '==', 'available'),
        where('dateExpires', '>', now)
      );
      
      const querySnapshot = await getDocs(questsQuery);
      const quests = querySnapshot.docs.map(doc => doc.data() as Quest);
      
      cache.set(cacheKey, quests, CACHE_DURATION.player.profile);
      return quests;
    } catch (error) {
      console.error('Failed to get active quests:', error);
      return [];
    }
  },

  async submitQuest(submission: QuestSubmission): Promise<boolean> {
    try {
      const submissionDoc = doc(
        db,
        QUESTS_COLLECTION,
        submission.questId,
        'submissions',
        submission.wallet
      );
      
      await setDoc(submissionDoc, submission);
      
      // Update quest completion status
      await updateDoc(doc(db, QUESTS_COLLECTION, submission.questId), {
        completedBy: arrayUnion(submission.wallet)
      });
      
      cache.clear();
      return true;
    } catch (error) {
      console.error('Failed to submit quest:', error);
      return false;
    }
  },

  async getQuestSubmissions(questId: string): Promise<QuestSubmission[]> {
    try {
      const submissionsQuery = query(
        collection(db, QUESTS_COLLECTION, questId, 'submissions')
      );
      
      const querySnapshot = await getDocs(submissionsQuery);
      return querySnapshot.docs.map(doc => doc.data() as QuestSubmission);
    } catch (error) {
      console.error('Failed to get quest submissions:', error);
      return [];
    }
  },

  async getUserQuestSubmissions(wallet: string): Promise<QuestSubmission[]> {
    try {
      const submissions: QuestSubmission[] = [];
      const questsSnapshot = await getDocs(collection(db, QUESTS_COLLECTION));
      
      for (const questDoc of questsSnapshot.docs) {
        const submissionDoc = await getDoc(
          doc(db, QUESTS_COLLECTION, questDoc.id, 'submissions', wallet)
        );
        
        if (submissionDoc.exists()) {
          submissions.push(submissionDoc.data() as QuestSubmission);
        }
      }
      
      return submissions;
    } catch (error) {
      console.error('Failed to get user quest submissions:', error);
      return [];
    }
  }
};