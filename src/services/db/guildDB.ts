import { doc, getDoc, setDoc, updateDoc, query, collection, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Guild, GuildMembershipRequest } from '../../schemas/guild';
import { Cache } from '../../utils/cache';
import { CACHE_DURATION } from '../../config/cache';

const cache = Cache.getInstance();
const GUILDS_COLLECTION = 'guilds';

export const guildDB = {
  async getGuild(guildId: string): Promise<Guild | null> {
    const cached = cache.get<Guild>(`guild:${guildId}`);
    if (cached) return cached;

    try {
      const docRef = doc(db, GUILDS_COLLECTION, guildId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data() as Guild;
        cache.set(`guild:${guildId}`, data, CACHE_DURATION.guild.info);
        return data;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to get guild:', error);
      return null;
    }
  },

  async createGuild(guild: Guild): Promise<boolean> {
    try {
      await setDoc(doc(db, GUILDS_COLLECTION, guild.id), guild);
      cache.set(`guild:${guild.id}`, guild, CACHE_DURATION.guild.info);
      return true;
    } catch (error) {
      console.error('Failed to create guild:', error);
      return false;
    }
  },

  async updateGuild(guildId: string, updates: Partial<Guild>): Promise<boolean> {
    try {
      await updateDoc(doc(db, GUILDS_COLLECTION, guildId), updates);
      cache.clear();
      return true;
    } catch (error) {
      console.error('Failed to update guild:', error);
      return false;
    }
  },

  async getGuildsByArchetype(archetype: string): Promise<Guild[]> {
    const cacheKey = `guilds:archetype:${archetype}`;
    const cached = cache.get<Guild[]>(cacheKey);
    if (cached) return cached;

    try {
      const guildsQuery = query(
        collection(db, GUILDS_COLLECTION),
        where('archetype', '==', archetype),
        where('isDeleted', '==', false)
      );
      
      const querySnapshot = await getDocs(guildsQuery);
      const guilds = querySnapshot.docs.map(doc => doc.data() as Guild);
      
      cache.set(cacheKey, guilds, CACHE_DURATION.guild.info);
      return guilds;
    } catch (error) {
      console.error('Failed to get guilds by archetype:', error);
      return [];
    }
  },

  async getGuildMembers(guildId: string): Promise<string[]> {
    const cached = cache.get<string[]>(`guild:${guildId}:members`);
    if (cached) return cached;

    try {
      const guildDoc = await getDoc(doc(db, GUILDS_COLLECTION, guildId));
      if (!guildDoc.exists()) return [];
      
      const members = guildDoc.data().members || [];
      cache.set(`guild:${guildId}:members`, members, CACHE_DURATION.guild.members);
      return members;
    } catch (error) {
      console.error('Failed to get guild members:', error);
      return [];
    }
  },

  async submitMembershipRequest(
    guildId: string,
    request: GuildMembershipRequest
  ): Promise<boolean> {
    try {
      const requestDoc = doc(
        db,
        GUILDS_COLLECTION,
        guildId,
        'membershipRequests',
        request.wallet
      );
      
      await setDoc(requestDoc, request);
      return true;
    } catch (error) {
      console.error('Failed to submit membership request:', error);
      return false;
    }
  },

  async getMembershipRequests(guildId: string): Promise<GuildMembershipRequest[]> {
    try {
      const requestsQuery = query(
        collection(db, GUILDS_COLLECTION, guildId, 'membershipRequests'),
        where('status', '==', 'pending')
      );
      
      const querySnapshot = await getDocs(requestsQuery);
      return querySnapshot.docs.map(doc => doc.data() as GuildMembershipRequest);
    } catch (error) {
      console.error('Failed to get membership requests:', error);
      return [];
    }
  },

  async updateMembershipRequest(
    guildId: string,
    wallet: string,
    updates: Partial<GuildMembershipRequest>
  ): Promise<boolean> {
    try {
      await updateDoc(
        doc(db, GUILDS_COLLECTION, guildId, 'membershipRequests', wallet),
        updates
      );
      return true;
    } catch (error) {
      console.error('Failed to update membership request:', error);
      return false;
    }
  }
};