import { Quest, QuestPool } from '../types/quest';

class QuestPoolService {
  private static instance: QuestPoolService;
  private questPool: QuestPool = {
    daily: [
      {
        id: 'daily-1',
        type: 'daily',
        description: 'Share a meme in the Discord community',
        xpReward: 100,
        isAutomatic: true
      },
      // Add more daily quests to reach 15 total
    ],
    weekly: [
      {
        id: 'weekly-1',
        type: 'weekly',
        description: 'Create a guide for new raiders',
        xpReward: 500,
        isAutomatic: true
      },
      // Add more weekly quests to reach 10 total
    ],
    monthly: [
      {
        id: 'monthly-1',
        type: 'monthly',
        description: 'Complete all weekly quests',
        xpReward: 2000,
        isAutomatic: true
      },
      // Add more monthly quests to reach 5 total
    ]
  };

  private constructor() {
    this.loadQuestPool();
    this.setupAutoRefresh();
  }

  static getInstance(): QuestPoolService {
    if (!QuestPoolService.instance) {
      QuestPoolService.instance = new QuestPoolService();
    }
    return QuestPoolService.instance;
  }

  private loadQuestPool(): void {
    const savedPool = localStorage.getItem('questPool');
    if (savedPool) {
      this.questPool = JSON.parse(savedPool);
    }
  }

  private save(): void {
    localStorage.setItem('questPool', JSON.stringify(this.questPool));
  }

  private setupAutoRefresh(): void {
    const checkAndRefresh = () => {
      const now = new Date();
      const sixAM = new Date(now);
      sixAM.setHours(6, 0, 0, 0);

      // If it's past 6 AM, set for next day
      if (now > sixAM) {
        sixAM.setDate(sixAM.getDate() + 1);
      }

      const timeUntilRefresh = sixAM.getTime() - now.getTime();

      setTimeout(() => {
        this.refreshQuests();
        // Set up next refresh
        setInterval(this.refreshQuests.bind(this), 24 * 60 * 60 * 1000);
      }, timeUntilRefresh);
    };

    checkAndRefresh();
  }

  private refreshQuests(): void {
    const now = new Date();
    const isWeeklyRefresh = now.getDay() === 0; // Sunday
    const isMonthlyRefresh = now.getDate() === 1;

    // Daily refresh
    this.deployDailyQuests();

    // Weekly refresh (Sundays)
    if (isWeeklyRefresh) {
      this.deployWeeklyQuests();
    }

    // Monthly refresh (1st of month)
    if (isMonthlyRefresh) {
      this.deployMonthlyQuests();
    }

    this.save();
  }

  private deployDailyQuests(): void {
    const now = new Date();
    const expires = new Date(now);
    expires.setDate(expires.getDate() + 1);
    expires.setHours(6, 0, 0, 0);

    this.questPool.daily.forEach(quest => {
      if (quest.isAutomatic) {
        quest.dateAvailable = now.getTime();
        quest.dateExpires = expires.getTime();
        quest.status = 'available';
        quest.completedBy = [];
      }
    });
  }

  private deployWeeklyQuests(): void {
    const now = new Date();
    const expires = new Date(now);
    expires.setDate(expires.getDate() + 7);
    expires.setHours(6, 0, 0, 0);

    this.questPool.weekly.forEach(quest => {
      if (quest.isAutomatic) {
        quest.dateAvailable = now.getTime();
        quest.dateExpires = expires.getTime();
        quest.status = 'available';
        quest.completedBy = [];
      }
    });
  }

  private deployMonthlyQuests(): void {
    const now = new Date();
    const expires = new Date(now);
    expires.setMonth(expires.getMonth() + 1);
    expires.setDate(1);
    expires.setHours(6, 0, 0, 0);

    this.questPool.monthly.forEach(quest => {
      if (quest.isAutomatic) {
        quest.dateAvailable = now.getTime();
        quest.dateExpires = expires.getTime();
        quest.status = 'available';
        quest.completedBy = [];
      }
    });
  }

  getActiveQuests(type: 'daily' | 'weekly' | 'monthly'): Quest[] {
    return this.questPool[type].filter(quest => 
      quest.status === 'available' && 
      quest.dateExpires > Date.now()
    );
  }

  updateQuest(type: 'daily' | 'weekly' | 'monthly', questId: string, updates: Partial<Quest>): boolean {
    const questIndex = this.questPool[type].findIndex(q => q.id === questId);
    if (questIndex === -1) return false;

    this.questPool[type][questIndex] = {
      ...this.questPool[type][questIndex],
      ...updates
    };

    this.save();
    return true;
  }
}

export const questPoolService = QuestPoolService.getInstance();