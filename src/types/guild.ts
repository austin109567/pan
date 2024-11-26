import { GuildArchetype } from './player';

export interface GuildBank {
  address: string;
  balance: number;
  weeklyReward: number;
  lastRewardDate: number;
}

export interface Guild {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  members: string[];
  leaders: string[];
  totalXp: number;
  dateCreated: number;
  archetype: GuildArchetype;
  isCore: boolean;
  isDeleted?: boolean;
  bank?: GuildBank;
  questLimits?: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  membershipRequests?: string[];
}

export interface GuildStats {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  memberCount: number;
  totalXp: number;
  dailyXp: number;
  weeklyXp: number;
  monthlyXp: number;
  bankBalance?: number;
}

export interface GuildMember {
  wallet: string;
  username: string | null;
  profilePicture: string | null;
  experience: number;
  joinDate: number;
  isLeader: boolean;
}

export const CORE_GUILDS: Guild[] = [
  {
    id: 'aureus-coven',
    name: 'The Aureus Coven',
    description: 'Masters of financial wisdom and strategic wealth building.',
    imageUrl: '/assets/guilds/aureus-coven.jpg',
    archetype: 'Finance',
    isCore: true,
    leaders: [],
    members: [],
    totalXp: 0,
    dateCreated: Date.now(),
    questLimits: {
      daily: 5,
      weekly: 3,
      monthly: 1
    }
  },
  {
    id: 'emberseekers',
    name: 'The Emberseekers',
    description: 'Daring explorers guided by ancient flames.',
    imageUrl: '/assets/guilds/emberseekers.jpg',
    archetype: 'Adventurer',
    isCore: true,
    leaders: [],
    members: [],
    totalXp: 0,
    dateCreated: Date.now(),
    questLimits: {
      daily: 5,
      weekly: 3,
      monthly: 1
    }
  },
  {
    id: 'solacebound',
    name: 'The Solacebound',
    description: 'Guardians of peace and community welfare.',
    imageUrl: '/assets/guilds/solacebound.jpg',
    archetype: 'Philanthropist',
    isCore: true,
    leaders: [],
    members: [],
    totalXp: 0,
    dateCreated: Date.now(),
    questLimits: {
      daily: 5,
      weekly: 3,
      monthly: 1
    }
  },
  {
    id: 'revelkin',
    name: 'The Revelkin',
    description: 'Celebrants of joy and festive spirit.',
    imageUrl: '/assets/guilds/revelkin.jpg',
    archetype: 'PartyAnimal',
    isCore: true,
    leaders: [],
    members: [],
    totalXp: 0,
    dateCreated: Date.now(),
    questLimits: {
      daily: 5,
      weekly: 3,
      monthly: 1
    }
  }
];

export const DEFAULT_COMMUNITY_GUILDS: Guild[] = [
  {
    id: 'community-guild-1',
    name: 'Bamboo Brigade',
    description: 'Elite warriors who protect the sacred bamboo forests and train in ancient panda martial arts',
    imageUrl: '/assets/pandas/raidpanda.PNG',
    members: [],
    leaders: [],
    totalXp: 0,
    dateCreated: Date.now(),
    archetype: 'Adventurer',
    isCore: false
  },
  {
    id: 'community-guild-2',
    name: 'Mystic Moonwalkers',
    description: 'Spiritual pandas who harness the power of moonlight and ancient wisdom',
    imageUrl: '/assets/pandas/tiltedpanda.PNG',
    members: [],
    leaders: [],
    totalXp: 0,
    dateCreated: Date.now(),
    archetype: 'Philanthropist',
    isCore: false
  },
  {
    id: 'community-guild-3',
    name: 'Crypto Cubs',
    description: 'Tech-savvy pandas revolutionizing the bamboo economy through blockchain innovation',
    imageUrl: '/assets/pandas/happypanda.PNG',
    members: [],
    leaders: [],
    totalXp: 0,
    dateCreated: Date.now(),
    archetype: 'Finance',
    isCore: false
  },
  {
    id: 'community-guild-4',
    name: 'Party Pandas',
    description: 'The most energetic pandas around, known for their legendary bamboo festivals',
    imageUrl: '/assets/pandas/chillingpanda.PNG',
    members: [],
    leaders: [],
    totalXp: 0,
    dateCreated: Date.now(),
    archetype: 'PartyAnimal',
    isCore: false
  }
];