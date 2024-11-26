import { Timestamp } from 'firebase/firestore';

export interface UserProfile {
  wallet: string;            // Primary key (wallet address or session key)
  username: string | null;   // Optional username
  handle: string | null;     // Social media handle
  profilePicture: string | null;
  experience: number;
  dateJoined: number;
  questsCompleted: number;
  raidBossesDefeated: number;
  lastQuestCompletionTime: number;
  showWallet: boolean;
  guild: string | null;      // Guild ID
  archetype: string | null;  // Player archetype
  discordHandle: string | null;
  sessionKey?: string;       // For guest accounts
  lastUpdated: Timestamp;
}

export interface UserStats {
  dailyXP: number;
  weeklyXP: number;
  monthlyXP: number;
  questsCompletedToday: number;
  questsCompletedWeek: number;
  questsCompletedMonth: number;
  lastQuestReset: Timestamp;
  lastWeeklyReset: Timestamp;
  lastMonthlyReset: Timestamp;
}

export interface UserInventory {
  nftMint: string;          // NFT mint address
  equipped: boolean;
  dateAcquired: Timestamp;
  metadata: {
    name: string;
    image: string;
    attributes: Array<{
      trait_type: string;
      value: string;
    }>;
  };
}