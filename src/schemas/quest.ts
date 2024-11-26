import { Timestamp } from 'firebase/firestore';

export interface Quest {
  id: string;
  type: 'daily' | 'weekly' | 'monthly' | 'raid-boss';
  title: string;
  description: string;
  xpReward: number;
  dateCreated: Timestamp;
  dateAvailable: Timestamp;
  dateExpires: Timestamp;
  status: 'available' | 'completed' | 'expired';
  completedBy: string[];
  isAutomatic?: boolean;
  imageUrl?: string;
  questUrl?: string;
  requirements?: {
    level?: number;
    guild?: string;
    archetype?: string;
  };
}

export interface QuestSubmission {
  questId: string;
  wallet: string;
  timestamp: Timestamp;
  screenshot?: string;
  url: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: Timestamp;
  rewardClaimed: boolean;
  claimedAt?: Timestamp;
}