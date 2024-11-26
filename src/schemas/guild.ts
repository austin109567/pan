import { Timestamp } from 'firebase/firestore';

export interface Guild {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  members: string[];
  leaders: string[];
  totalXp: number;
  dateCreated: Timestamp;
  archetype: GuildArchetype;
  isCore: boolean;
  isDeleted?: boolean;
  bank?: GuildBank;
  questLimits?: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  membershipRequests?: GuildMembershipRequest[];
  lastUpdated: Timestamp;
}

export interface GuildBank {
  address: string;
  balance: number;
  weeklyReward: number;
  lastRewardDate: Timestamp;
  transactions: GuildTransaction[];
}

export interface GuildTransaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'reward';
  amount: number;
  wallet: string;
  timestamp: Timestamp;
  signature: string;
}

export interface GuildMembershipRequest {
  wallet: string;
  message: string;
  timestamp: Timestamp;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: Timestamp;
}