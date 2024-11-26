import { EventEmitter } from 'events';
import { Guild, GuildArchetype, DEFAULT_COMMUNITY_GUILDS } from '../types/guild';
import { stateManager } from './StateManager';

class GuildService {
  private static instance: GuildService;
  private guilds: Map<string, Guild>;
  private membershipRequests: Map<string, { wallet: string; message: string; timestamp: number; }[]>;
  private emitter: EventEmitter;
  private lastSync: number = 0;

  private constructor() {
    this.guilds = new Map();
    this.membershipRequests = new Map();
    this.emitter = new EventEmitter();
    this.loadGuilds();
    this.setupAutoSync();
  }

  static getInstance(): GuildService {
    if (!GuildService.instance) {
      GuildService.instance = new GuildService();
    }
    return GuildService.instance;
  }

  private setupAutoSync() {
    setInterval(() => {
      this.loadState();
    }, 1000);
  }

  private syncState() {
    const guildData = {
      guilds: Array.from(this.guilds.entries()),
      requests: Array.from(this.membershipRequests.entries())
    };
    localStorage.setItem('guilds', JSON.stringify(guildData));
    stateManager.publish('guildStateUpdate', guildData);
    this.lastSync = Date.now();
    this.notifyListeners();
  }

  public loadState() {
    const lastUpdate = stateManager.getLastUpdate();
    if (lastUpdate > this.lastSync) {
      this.loadGuilds();
      this.notifyListeners();
      this.lastSync = Date.now();
    }
  }

  private loadGuilds(): void {
    try {
      const savedData = localStorage.getItem('guilds');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        this.guilds = new Map(parsed.guilds);
        this.membershipRequests = new Map(parsed.requests);
      } else {
        // Initialize with default community guilds if no saved data exists
        DEFAULT_COMMUNITY_GUILDS.forEach(guild => {
          this.guilds.set(guild.id, guild);
        });
        this.syncState();
      }
    } catch (error) {
      console.error('Failed to load guild data:', error);
      this.guilds = new Map();
      this.membershipRequests = new Map();
      
      // Initialize with defaults on error
      DEFAULT_COMMUNITY_GUILDS.forEach(guild => {
        this.guilds.set(guild.id, guild);
      });
      this.syncState();
    }
  }

  public createGuild(guildData: Omit<Guild, 'id' | 'members' | 'totalXp' | 'dateCreated'>): Guild {
    const newGuild: Guild = {
      ...guildData,
      id: `guild-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      members: [],
      totalXp: 0,
      dateCreated: Date.now()
    };

    this.guilds.set(newGuild.id, newGuild);
    this.syncState();
    return newGuild;
  }

  public addListener(callback: () => void): void {
    this.emitter.on('guildUpdate', callback);
  }

  public removeListener(callback: () => void): void {
    this.emitter.off('guildUpdate', callback);
  }

  private notifyListeners(): void {
    this.emitter.emit('guildUpdate');
  }

  public getGuildById(id: string): Guild | null {
    return this.guilds.get(id) || null;
  }

  public getGuildByArchetype(archetype: GuildArchetype): Guild | null {
    return Array.from(this.guilds.values()).find(g => g.archetype === archetype) || null;
  }

  public getCommunityGuilds(): Guild[] {
    return Array.from(this.guilds.values())
      .filter(guild => !guild.isCore && !guild.isDeleted);
  }

  public getGuildMembers(guildId: string): any[] {
    const guild = this.guilds.get(guildId);
    if (!guild || !Array.isArray(guild.members)) return [];
    return guild.members;
  }

  public updateGuild(guildId: string, updates: Partial<Guild>): boolean {
    const guild = this.guilds.get(guildId);
    if (!guild) return false;

    this.guilds.set(guildId, { ...guild, ...updates });
    this.syncState();
    return true;
  }

  public isGuildLeader(wallet: string): boolean {
    return Array.from(this.guilds.values()).some(guild => 
      Array.isArray(guild.leaders) && guild.leaders.includes(wallet)
    );
  }

  public submitMembershipRequest(guildId: string, wallet: string, message: string): boolean {
    const guild = this.guilds.get(guildId);
    if (!guild) return false;

    if (!this.membershipRequests.has(guildId)) {
      this.membershipRequests.set(guildId, []);
    }

    const requests = this.membershipRequests.get(guildId)!;
    requests.push({
      wallet,
      message,
      timestamp: Date.now()
    });

    this.syncState();
    return true;
  }

  public acceptMembershipRequest(guildId: string, wallet: string): boolean {
    const guild = this.guilds.get(guildId);
    if (!guild) return false;

    if (!Array.isArray(guild.members)) {
      guild.members = [];
    }

    if (!guild.members.includes(wallet)) {
      guild.members.push(wallet);
      
      // Remove the request
      const requests = this.membershipRequests.get(guildId) || [];
      this.membershipRequests.set(
        guildId,
        requests.filter(req => req.wallet !== wallet)
      );

      this.syncState();
      return true;
    }

    return false;
  }

  public getMembershipRequests(guildId: string) {
    return this.membershipRequests.get(guildId) || [];
  }
}

export const guildService = GuildService.getInstance();