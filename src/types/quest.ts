export interface Quest {
  id: string;
  title: string;
  type: 'daily' | 'weekly' | 'monthly' | 'raid-boss';
  description: string;
  xpReward: number;
  dateCreated: number;
  dateAvailable: number;
  dateExpires: number;
  status: 'available' | 'completed' | 'expired';
  completedBy?: string[];
  isAutomatic?: boolean;
  proof?: {
    wallet: string;
    screenshot?: string;
    url: string;
    dateSubmitted: number;
  }[];
  imageUrl?: string;
  questUrl?: string;
  isRaidBoss?: boolean;
}

export interface QuestSubmission {
  screenshot?: File;
  url: string;
}