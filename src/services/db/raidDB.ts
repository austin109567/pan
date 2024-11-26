import { doc, getDoc, setDoc, updateDoc, query, collection, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { Raid, RaidParticipant } from '../../schemas/raid';
import { Cache } from '../../utils/cache';
import { CACHE_DURATION } from '../../config/cache';

const cache = Cache.getInstance();
const RAIDS_COLLECTION = 'raids';

export const raidDB = {
  async getRaid(raidId: string): Promise<Raid | null> {
    const cached = cache.get<Raid>(`raid:${raidId}`);
    if (cached) return cached;

    try {
      const docRef = doc(db, RAIDS_COLLECTION, raidId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data() as Raid;
        cache.set(`raid:${raidId}`, data, CACHE_DURATION.raid.active);
        return data;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to get raid:', error);
      return null;
    }
  },

  async createRaid(raid: Raid): Promise<boolean> {
    try {
      await setDoc(doc(db, RAIDS_COLLECTION, raid.id), raid);
      cache.set(`raid:${raid.id}`, raid, CACHE_DURATION.raid.active);
      return true;
    } catch (error) {
      console.error('Failed to create raid:', error);
      return false;
    }
  },

  async updateRaid(raidId: string, updates: Partial<Raid>): Promise<boolean> {
    try {
      await updateDoc(doc(db, RAIDS_COLLECTION, raidId), updates);
      cache.clear();
      return true;
    } catch (error) {
      console.error('Failed to update raid:', error);
      return false;
    }
  },

  async getActiveRaids(): Promise<Raid[]> {
    const cacheKey = 'raids:active';
    const cached = cache.get<Raid[]>(cacheKey);
    if (cached) return cached;

    try {
      const now = Timestamp.now();
      const raidsQuery = query(
        collection(db, RAIDS_COLLECTION),
        where('status', '==', 'active'),
        where('endTime', '>', now)
      );
      
      const querySnapshot = await getDocs(raidsQuery);
      const raids = querySnapshot.docs.map(doc => doc.data() as Raid);
      
      cache.set(cacheKey, raids, CACHE_DURATION.raid.active);
      return raids;
    } catch (error) {
      console.error('Failed to get active raids:', error);
      return [];
    }
  },

  async joinRaid(
    raidId: string,
    participant: RaidParticipant
  ): Promise<boolean> {
    try {
      const participantDoc = doc(
        db,
        RAIDS_COLLECTION,
        raidId,
        'participants',
        participant.wallet
      );
      
      await setDoc(participantDoc, participant);
      
      // Update raid participants count
      await updateDoc(doc(db, RAIDS_COLLECTION, raidId), {
        'participants': arrayUnion(participant)
      });
      
      cache.clear();
      return true;
    } catch (error) {
      console.error('Failed to join raid:', error);
      return false;
    }
  },

  async getRaidParticipants(raidId: string): Promise<RaidParticipant[]> {
    try {
      const participantsQuery = query(
        collection(db, RAIDS_COLLECTION, raidId, 'participants')
      );
      
      const querySnapshot = await getDocs(participantsQuery);
      return querySnapshot.docs.map(doc => doc.data() as RaidParticipant);
    } catch (error) {
      console.error('Failed to get raid participants:', error);
      return [];
    }
  },

  async updateParticipant(
    raidId: string,
    wallet: string,
    updates: Partial<RaidParticipant>
  ): Promise<boolean> {
    try {
      await updateDoc(
        doc(db, RAIDS_COLLECTION, raidId, 'participants', wallet),
        updates
      );
      cache.clear();
      return true;
    } catch (error) {
      console.error('Failed to update participant:', error);
      return false;
    }
  }
};