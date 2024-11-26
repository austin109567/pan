import { Timestamp } from 'firebase/firestore';

export interface Leaderboard {
  id: string;
  type: 'daily' | 'weekly' | 'monthly' | 'all-time';
  category: 'xp' | 'quests' | 'raids';
  entries: LeaderboardEntry[];
  lastUpdated: Timestamp;
  nextUpdate: Timestamp;
}

export interface LeaderboardEntry {
  rank: number;
  wallet: string;
  username: string | null;
  profilePicture: string | null;
  score: number;
  guild: string | null;
  archetype: string | null;
  timestamp: Timestamp;
}

export interface LeaderboardSnapshot {
  id: string;
  leaderboardId: string;
  entries: LeaderboardEntry[];
  timestamp: Timestamp;
  type: 'daily' | 'weekly' | 'monthly';
}