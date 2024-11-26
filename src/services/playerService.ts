import { Player } from '../types/player';
import { supabase, supabaseAdmin } from '../lib/supabase';
import { PublicKey } from '@solana/web3.js';

// Use supabaseAdmin for admin operations
const serviceClient = supabaseAdmin;

export interface PFPTraits {
  selectedTraits: Record<number, number>;
}

export class PlayerService {
  private listeners: Array<(data: any) => void> = [];
  private readonly PFP_STORAGE_KEY = 'player_pfp_traits';
  
  addEventListener(callback: (data: any) => void) {
    this.listeners.push(callback);
  }

  removeEventListener(callback: (data: any) => void) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  private emit(data: any) {
    this.listeners.forEach(listener => listener(data));
  }

  private validateWalletAddress(address: string): string | null {
    try {
      if (address.includes('-') || address.startsWith('guest_')) {
        return address;
      }
      
      const pubKey = new PublicKey(address);
      return pubKey.toString();
    } catch (error) {
      console.error('Invalid wallet address:', error);
      return null;
    }
  }

  private async retryOperation<T>(operation: () => Promise<T>, maxRetries: number = 3): Promise<T> {
    let lastError: any;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error: any) {
        lastError = error;
        if (error?.code === 'PGRST116' || error?.code?.includes('auth')) {
          break; // Don't retry auth or not found errors
        }
        console.warn(`Operation failed (attempt ${attempt}/${maxRetries}):`, error);
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, attempt * 1000));
        }
      }
    }
    throw lastError;
  }

  private getPFPTraits(): Record<string, PFPTraits> {
    try {
      const stored = localStorage.getItem(this.PFP_STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error reading PFP traits:', error);
      return {};
    }
  }

  private savePFPTraits(traits: Record<string, PFPTraits>): void {
    try {
      localStorage.setItem(this.PFP_STORAGE_KEY, JSON.stringify(traits));
    } catch (error) {
      console.error('Error saving PFP traits:', error);
    }
  }

  async getPlayer(wallet: string): Promise<Player | null> {
    try {
      const validWallet = this.validateWalletAddress(wallet);
      if (!validWallet) {
        return null;
      }

      const { data, error } = await this.retryOperation(async () => {
        return await supabase
          .from('players')
          .select('*')
          .eq('wallet_address', validWallet)
          .maybeSingle();
      });

      if (error) {
        throw error;
      }

      // If player exists, check for PFP traits
      if (data) {
        const pfpTraits = this.getPFPTraits();
        if (pfpTraits[validWallet]) {
          (data as any).pfp_traits = pfpTraits[validWallet];
        }
      }

      return data as Player;
    } catch (error) {
      console.error('Error getting player:', error);
      return null;
    }
  }

  async createOrUpdatePlayer(params: { walletAddress: string; userId: string }): Promise<Player | null> {
    try {
      const validWallet = this.validateWalletAddress(params.walletAddress);
      if (!validWallet) {
        throw new Error('Invalid wallet address');
      }

      // First check if player exists
      const { data: existingPlayer } = await supabase
        .from('players')
        .select('*')
        .eq('wallet_address', validWallet)
        .maybeSingle();

      // If player exists, only update if it's been more than a day since last update
      if (existingPlayer) {
        const lastUpdate = new Date(existingPlayer.updated_at || 0);
        const now = new Date();
        const daysSinceUpdate = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24);
        
        if (daysSinceUpdate < 1) {
          return existingPlayer;
        }
      }

      const playerData = {
        wallet_address: validWallet,
        user_id: params.userId,
        xp: existingPlayer?.xp || 0,
        quests_completed: existingPlayer?.quests_completed || 0,
        raid_bosses_defeated: existingPlayer?.raid_bosses_defeated || 0,
        show_wallet: existingPlayer?.show_wallet ?? true,
        date_joined: existingPlayer?.date_joined || new Date().toISOString(),
        last_quest_completion_time: existingPlayer?.last_quest_completion_time || null,
        archetype: existingPlayer?.archetype || null,
        discord_handle: existingPlayer?.discord_handle || null,
        updated_at: new Date().toISOString()
      };

      const { data: player, error } = await supabase
        .from('players')
        .upsert(playerData, { onConflict: 'wallet_address' })
        .select()
        .single();

      if (error) {
        console.error('Error upserting player:', error);
        return null;
      }

      return player;
    } catch (error) {
      console.error('Error in createOrUpdatePlayer:', error);
      return null;
    }
  }

  async updatePlayerStats(wallet: string, stats: { xp?: number; quests_completed?: number }): Promise<Player | null> {
    try {
      const validWallet = this.validateWalletAddress(wallet);
      if (!validWallet) {
        throw new Error('Invalid wallet address');
      }

      // First try to get the current player
      const { data: existingPlayer, error: fetchError } = await serviceClient
        .from('players')
        .select('*')
        .eq('wallet_address', validWallet)
        .single();

      if (fetchError) {
        console.error('Error fetching player:', fetchError);
        throw fetchError;
      }

      // If player doesn't exist, create a new one
      if (!existingPlayer) {
        const newPlayer = {
          wallet_address: validWallet,
          xp: stats.xp || 0,
          quests_completed: stats.quests_completed || 0,
          date_joined: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { data: createdPlayer, error: createError } = await serviceClient
          .from('players')
          .insert([newPlayer])
          .select()
          .single();

        if (createError) {
          console.error('Error creating player:', createError);
          throw createError;
        }

        return createdPlayer;
      }

      // Update existing player
      const updates = {
        xp: stats.xp !== undefined ? stats.xp : existingPlayer.xp,
        quests_completed: stats.quests_completed !== undefined ? stats.quests_completed : existingPlayer.quests_completed,
        updated_at: new Date().toISOString()
      };

      const { data: updatedPlayer, error: updateError } = await serviceClient
        .from('players')
        .update(updates)
        .eq('wallet_address', validWallet)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating player:', updateError);
        throw updateError;
      }

      return updatedPlayer;
    } catch (error) {
      console.error('Error in updatePlayerStats:', error);
      throw error;
    }
  }

  async updatePlayerPFP(wallet: string, traits: PFPTraits): Promise<Player | null> {
    try {
      const validWallet = this.validateWalletAddress(wallet);
      if (!validWallet) {
        throw new Error('Invalid wallet address');
      }

      // First check if player exists
      const existingPlayer = await this.getPlayer(validWallet);
      if (!existingPlayer) {
        // Create player first with default values
        const newPlayer = await this.createOrUpdatePlayer(validWallet);
        if (!newPlayer) {
          throw new Error('Failed to create player profile');
        }
      }

      // Store PFP traits in localStorage
      const allPFPTraits = this.getPFPTraits();
      allPFPTraits[validWallet] = traits;
      this.savePFPTraits(allPFPTraits);

      // Return the updated player
      const updatedPlayer = await this.getPlayer(validWallet);
      if (!updatedPlayer) {
        throw new Error('Failed to update player PFP');
      }

      this.emit(updatedPlayer);
      return updatedPlayer;
    } catch (error) {
      console.error('Error updating player PFP:', error);
      throw error;
    }
  }

  async getPlayerPFP(wallet: string): Promise<PFPTraits | null> {
    const validWallet = this.validateWalletAddress(wallet);
    if (!validWallet) {
      return null;
    }

    const pfpTraits = this.getPFPTraits();
    return pfpTraits[validWallet] || null;
  }

  async getLeaderboard(): Promise<Player[]> {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .order('xp', { ascending: false })
        .limit(100);

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      throw error;
    }
  }
}

export const playerService = new PlayerService();