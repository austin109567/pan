import { supabase, supabaseAdmin } from '../lib/supabaseClient';

export interface RaidBoss {
  id: string;
  boss_name: string;
  boss_description: string;
  boss_image_url?: string;
  boss_twitter?: string;
  boss_health: number;
  boss_max_health: number;
  boss_defense: number;
  boss_xp_reward: number;
  state: 'preparing' | 'active' | 'completed' | 'failed';
  start_time: string;
  end_time?: string;
  created_at?: string;
  updated_at?: string;
}

export interface RaidQuest {
  id: string;
  raid_id: string;
  description: string;
  xp_reward: number;
  completed_by: string[];
}

export interface RaidParticipant {
  id: string;
  raid_id: string;
  player_id: string;
  join_time: string;
  contribution: number;
}

export class RaidService {
  async createRaidBoss(raidBoss: {
    boss_name: string;
    boss_description: string;
    boss_health: number;
    boss_max_health: number;
    boss_xp_reward: number;
    state: string;
  }): Promise<RaidBoss> {
    try {
      const { data, error } = await supabaseAdmin
        .from('raids')
        .insert([raidBoss])
        .select('*')
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error creating raid boss:', error);
      throw error;
    }
  }

  async getAllRaids(): Promise<RaidBoss[]> {
    try {
      const { data, error } = await supabase
        .from('raids')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching raids:', error);
      throw error;
    }
  }

  async getRaidById(raidId: string): Promise<RaidBoss | null> {
    try {
      const { data, error } = await supabase
        .from('raids')
        .select('*')
        .eq('id', raidId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching raid:', error);
      throw error;
    }
  }

  async addRaidQuest(quest: Omit<RaidQuest, 'id'>): Promise<RaidQuest> {
    try {
      const { data, error } = await supabaseAdmin
        .from('raid_quests')
        .insert([quest])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding raid quest:', error);
      throw error;
    }
  }

  async getRaidQuests(raidId: string): Promise<RaidQuest[]> {
    try {
      const { data, error } = await supabase
        .from('raid_quests')
        .select('*')
        .eq('raid_id', raidId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching raid quests:', error);
      throw error;
    }
  }

  async joinRaid(raidId: string, playerId: string): Promise<RaidParticipant> {
    try {
      const { data, error } = await supabase
        .from('raid_participants')
        .insert([{
          raid_id: raidId,
          player_id: playerId,
          contribution: 0
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error joining raid:', error);
      throw error;
    }
  }

  async updateRaidBoss(raidId: string, raidBoss: Partial<{
    boss_name: string;
    boss_description: string;
    boss_health: number;
    boss_max_health: number;
    boss_xp_reward: number;
    state: string;
  }>): Promise<void> {
    try {
      const { error } = await supabaseAdmin
        .from('raids')
        .update(raidBoss)
        .eq('id', raidId);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error updating raid boss:', error);
      throw error;
    }
  }

  async updateRaidBossHealth(raidId: string, newHealth: number): Promise<void> {
    try {
      const { error } = await supabaseAdmin
        .from('raids')
        .update({ boss_health: newHealth })
        .eq('id', raidId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating raid boss health:', error);
      throw error;
    }
  }

  async completeRaidQuest(questId: string, playerId: string): Promise<void> {
    try {
      const { data: quest, error: fetchError } = await supabase
        .from('raid_quests')
        .select('completed_by')
        .eq('id', questId)
        .single();

      if (fetchError) throw fetchError;

      const completedBy = quest.completed_by || [];
      if (completedBy.includes(playerId)) {
        throw new Error('Quest already completed by player');
      }

      const { error: updateError } = await supabaseAdmin
        .from('raid_quests')
        .update({
          completed_by: [...completedBy, playerId]
        })
        .eq('id', questId);

      if (updateError) throw updateError;
    } catch (error) {
      console.error('Error completing raid quest:', error);
      throw error;
    }
  }

  async updateParticipantContribution(
    raidId: string,
    playerId: string,
    contribution: number
  ): Promise<void> {
    try {
      const { error } = await supabaseAdmin
        .from('raid_participants')
        .update({ contribution })
        .eq('raid_id', raidId)
        .eq('player_id', playerId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating participant contribution:', error);
      throw error;
    }
  }

  async getCompletedRaids(): Promise<RaidBoss[]> {
    try {
      const { data, error } = await supabase
        .from('raids')
        .select('*')
        .eq('state', 'completed')
        .order('end_time', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching completed raids:', error);
      return [];
    }
  }
}

export const raidService = new RaidService();