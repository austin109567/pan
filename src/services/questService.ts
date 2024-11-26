import { Quest } from '../types/quest';
import { questPoolService } from './questPoolService';
import { playerService } from './playerService';
import { submissionService } from './submissionService';
import { supabase } from './supabaseClient';

class QuestService {
  private static instance: QuestService;
  private quests: Map<string, Quest> = new Map();
  private refreshInterval: NodeJS.Timer | null = null;

  private constructor() {
    this.setupQuestRotation();
  }

  static getInstance(): QuestService {
    if (!QuestService.instance) {
      QuestService.instance = new QuestService();
    }
    return QuestService.instance;
  }

  private save(): void {
    localStorage.setItem('quests', JSON.stringify(Object.fromEntries(this.quests)));
  }

  private setupQuestRotation(): void {
    // Check every minute for quest rotation
    this.refreshInterval = setInterval(async () => {
      const now = new Date();
      const cst = new Date(now.toLocaleString('en-US', { timeZone: 'America/Chicago' }));
      
      // Check if it's 6 AM CST
      if (cst.getHours() === 6 && cst.getMinutes() === 0) {
        // Daily rotation
        await this.rotateQuests('daily');

        // Weekly rotation (on Sunday)
        if (cst.getDay() === 0) {
          await this.rotateQuests('weekly');
        }

        // Monthly rotation (on the 1st)
        if (cst.getDate() === 1) {
          await this.rotateQuests('monthly');
        }
      }
    }, 60000); // Check every minute
  }

  private async rotateQuests(type: 'daily' | 'weekly' | 'monthly'): Promise<void> {
    try {
      // Get new quests from the pool
      const newQuests = await questPoolService.getRandomQuests(type, 3);
      
      // Update quests in the database
      const { error } = await supabase
        .from('quests')
        .upsert(newQuests.map(quest => ({
          ...quest,
          type,
          dateCreated: new Date().toISOString()
        })));

      if (error) {
        console.error(`Error upserting ${type} quests:`, error);
        return;
      }

      // Update local cache
      newQuests.forEach(quest => {
        this.quests.set(quest.id, quest);
      });

      this.save();
    } catch (error) {
      console.error(`Error rotating ${type} quests:`, error);
    }
  }

  async getQuests(type?: 'all' | 'daily' | 'weekly' | 'monthly'): Promise<Quest[]> {
    try {
      let query = supabase.from('quests').select('*');
      
      if (type && type !== 'all') {
        query = query.eq('type', type);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      // Transform dates to timestamps and ensure proper typing
      return (data || []).map(quest => ({
        ...quest,
        dateCreated: Date.parse(quest.dateCreated) || Date.now(),
        dateAvailable: Date.parse(quest.dateAvailable) || Date.now(),
        dateExpires: Date.parse(quest.dateExpires) || Date.now() + (
          quest.type === 'daily' ? 24 * 60 * 60 * 1000 :
          quest.type === 'weekly' ? 7 * 24 * 60 * 60 * 1000 :
          30 * 24 * 60 * 60 * 1000
        ),
        completedBy: quest.completedBy || [],
        xpReward: Number(quest.xpReward) || 0,
      }));
    } catch (error) {
      console.error('Error fetching quests:', error);
      return [];
    }
  }

  async getQuestById(id: string): Promise<Quest | null> {
    try {
      // First try to get from local cache
      const cachedQuest = this.quests.get(id);
      if (cachedQuest) {
        return cachedQuest;
      }

      // If not in cache, fetch from database
      const { data, error } = await supabase
        .from('quests')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching quest:', error);
        return null;
      }

      if (!data) {
        console.warn(`No quest found with id: ${id}`);
        return null;
      }

      // Parse and format the quest data
      const quest: Quest = {
        id: data.id,
        title: data.title,
        description: data.description,
        type: data.type,
        dateCreated: new Date(data.date_created).getTime(),
        dateAvailable: new Date(data.date_available).getTime(),
        dateExpires: new Date(data.date_expires).getTime(),
        completedBy: data.completed_by || [],
        xpReward: Number(data.xp_reward) || 0,
        status: data.status
      };

      // Cache the quest
      this.quests.set(id, quest);
      
      return quest;
    } catch (error) {
      console.error('Error fetching quest:', error);
      return null;
    }
  }

  async submitQuestProof(questId: string, walletAddress: string, submission: { url: string; screenshot?: File }): Promise<boolean> {
    try {
      const quest = await this.getQuestById(questId);
      if (!quest) {
        console.error('Quest not found');
        return false;
      }

      const completedBy = quest.completedBy || [];
      if (completedBy.includes(walletAddress)) {
        console.error('Quest already completed by this wallet');
        return false;
      }

      // Submit the proof to admin
      const success = await submissionService.addSubmission({
        wallet: walletAddress,
        questId: questId,
        proofLink: submission.url,
        submissionDate: new Date().toISOString()
      });

      if (!success) {
        console.error('Error submitting proof');
        return false;
      }

      // Don't update quest completion until admin approves
      return true;
    } catch (error) {
      console.error('Error submitting quest proof:', error);
      return false;
    }
  }

  async createQuest(questData: Omit<Quest, 'id'>): Promise<Quest> {
    try {
      const { data, error } = await supabase
        .from('quests')
        .insert([{
          title: questData.title,
          type: questData.type,
          description: questData.description,
          xp_reward: questData.xpReward,
          image_url: questData.imageUrl,
          status: questData.status || 'available',
          date_created: new Date(questData.dateCreated).toISOString(),
          date_available: new Date(questData.dateAvailable).toISOString(),
          date_expires: new Date(questData.dateExpires).toISOString(),
          completed_by: questData.completedBy || []
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      const newQuest: Quest = {
        id: data.id,
        title: data.title,
        type: data.type,
        description: data.description,
        xpReward: Number(data.xp_reward),
        imageUrl: data.image_url,
        status: data.status,
        dateCreated: new Date(data.date_created).getTime(),
        dateAvailable: new Date(data.date_available).getTime(),
        dateExpires: new Date(data.date_expires).getTime(),
        completedBy: data.completed_by || []
      };

      // Add to local cache
      this.quests.set(newQuest.id, newQuest);
      return newQuest;
    } catch (error) {
      console.error('Error creating quest:', error);
      throw error;
    }
  }

  dispose(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }
}

export const questService = QuestService.getInstance();