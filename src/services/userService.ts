interface UserStats {
  wallet: string;
  xp: number;
  questsCompleted: number;
  raidsParticipated: number;
  lastQuestCompletionTime: number;
}

class UserService {
  private static instance: UserService;
  private userStats: Map<string, UserStats> = new Map();

  private constructor() {}

  static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  getUserStats(wallet: string): UserStats {
    if (!this.userStats.has(wallet)) {
      this.userStats.set(wallet, {
        wallet,
        xp: 0,
        questsCompleted: 0,
        raidsParticipated: 0,
        lastQuestCompletionTime: 0
      });
    }
    return this.userStats.get(wallet)!;
  }

  addXP(wallet: string, amount: number): void {
    const stats = this.getUserStats(wallet);
    stats.xp += amount;
    this.userStats.set(wallet, stats);
  }

  incrementQuestsCompleted(wallet: string): void {
    const stats = this.getUserStats(wallet);
    stats.questsCompleted += 1;
    stats.lastQuestCompletionTime = Date.now();
    this.userStats.set(wallet, stats);
  }

  incrementRaidsParticipated(wallet: string): void {
    const stats = this.getUserStats(wallet);
    stats.raidsParticipated += 1;
    this.userStats.set(wallet, stats);
  }

  getLeaderboard(): UserStats[] {
    return Array.from(this.userStats.values())
      .sort((a, b) => b.xp - a.xp)
      .slice(0, 100);
  }
}

export const userService = UserService.getInstance();