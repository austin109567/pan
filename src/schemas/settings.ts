import { Timestamp } from 'firebase/firestore';

export interface SystemSettings {
  maintenance: {
    enabled: boolean;
    message: string;
    startTime?: Timestamp;
    endTime?: Timestamp;
  };
  features: {
    raids: boolean;
    quests: boolean;
    guilds: boolean;
    trading: boolean;
  };
  limits: {
    maxPlayersPerGuild: number;
    maxQuestsPerDay: number;
    maxRaidsPerDay: number;
    maxItemsPerInventory: number;
  };
  rewards: {
    questXp: {
      daily: number;
      weekly: number;
      monthly: number;
    };
    raidXp: {
      completion: number;
      bonus: number;
    };
  };
  version: string;
  lastUpdated: Timestamp;
}