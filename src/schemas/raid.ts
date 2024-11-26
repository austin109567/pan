import { Timestamp } from 'firebase/firestore';

export interface Raid {
  id: string;
  boss: RaidBoss;
  participants: RaidParticipant[];
  startTime: Timestamp;
  endTime: Timestamp;
  status: 'preparing' | 'active' | 'completed' | 'failed';
  questCompletions: number;
  rewards: {
    xp: number;
    bonusXp: number;
    items?: string[];
  };
  lastUpdated: Timestamp;
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
}

export interface RaidQuest {
  id: string;
  description: string;
  xpReward: number;
  completedBy: string[];
  requirements?: {
    level?: number;
    guild?: string;
    archetype?: string;
  };
}

export interface RaidParticipant {
  wallet: string;
  nftId: string;
  questsCompleted: number;
  lastQuestCompletionTime: Timestamp;
  joinedAt: Timestamp;
  status: 'active' | 'inactive';
}