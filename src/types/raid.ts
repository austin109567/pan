interface RaidQuest {
  id: string;
  description: string;
  xpReward: number;
  completedBy: string[]; // Wallet addresses
}

export interface RaidBoss {
  id: string;
  name: string;
  level: number;
  health: number;
  maxHealth: number;
  defense: number;
  imageUrl: string;
  twitterHandle: string;
  description: string;
  quests: RaidQuest[];
  rewards: {
    xp: number;
    bonusXp: number;
  };
}

export interface RaidParticipant {
  wallet: string;
  nftId: string;
  questsCompleted: number;
  lastQuestCompletionTime: number;
}

export interface RaidState {
  id: string;
  boss: RaidBoss;
  participants: RaidParticipant[];
  startTime: number;
  endTime: number;
  status: 'preparing' | 'active' | 'completed' | 'failed';
  questCompletions: number;
}

export interface RaidReward {
  wallet: string;
  xp: number;
  bonusXp?: number;
  rank: number;
}

export interface QuestSubmission {
  screenshot?: File;
  url: string;
}