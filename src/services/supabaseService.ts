import { supabase } from '../lib/supabase'
import type { Database } from '../types/database'
import type { Player } from '../types/player'
import type { RaidState, RaidBoss, RaidParticipant, QuestSubmission } from '../types/raid'

export class SupabaseService {
  // Player Methods
  async createPlayer(player: Omit<Player, 'id'>): Promise<Player | null> {
    const { data, error } = await supabase
      .from('players')
      .insert({
        wallet: player.wallet,
        username: player.username,
        handle: player.handle,
        profile_picture: player.profilePicture,
        experience: player.experience,
        date_joined: new Date(player.dateJoined).toISOString(),
        quests_completed: player.questsCompleted,
        raid_bosses_defeated: player.raidBossesDefeated,
        last_quest_completion_time: new Date(player.lastQuestCompletionTime).toISOString(),
        show_wallet: player.showWallet,
        guild: player.guild,
        archetype: player.archetype,
        discord_handle: player.discordHandle
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating player:', error)
      return null
    }

    return this.mapDatabasePlayerToPlayer(data)
  }

  async getPlayer(wallet: string): Promise<Player | null> {
    const { data, error } = await supabase
      .from('players')
      .select()
      .eq('wallet', wallet)
      .single()

    if (error) {
      console.error('Error fetching player:', error)
      return null
    }

    return this.mapDatabasePlayerToPlayer(data)
  }

  async updatePlayer(wallet: string, updates: Partial<Player>): Promise<Player | null> {
    const { data, error } = await supabase
      .from('players')
      .update({
        username: updates.username,
        handle: updates.handle,
        profile_picture: updates.profilePicture,
        experience: updates.experience,
        quests_completed: updates.questsCompleted,
        raid_bosses_defeated: updates.raidBossesDefeated,
        last_quest_completion_time: updates.lastQuestCompletionTime ? new Date(updates.lastQuestCompletionTime).toISOString() : undefined,
        show_wallet: updates.showWallet,
        guild: updates.guild,
        archetype: updates.archetype,
        discord_handle: updates.discordHandle
      })
      .eq('wallet', wallet)
      .select()
      .single()

    if (error) {
      console.error('Error updating player:', error)
      return null
    }

    return this.mapDatabasePlayerToPlayer(data)
  }

  // Raid Methods
  async createRaid(raid: RaidState): Promise<string | null> {
    const { data, error } = await supabase
      .from('raids')
      .insert({
        boss_name: raid.boss.name,
        boss_health: raid.boss.health,
        boss_max_health: raid.boss.maxHealth,
        boss_defense: raid.boss.defense,
        state: raid.state,
        start_time: new Date(raid.startTime).toISOString(),
        end_time: raid.endTime ? new Date(raid.endTime).toISOString() : null
      })
      .select('id')
      .single()

    if (error) {
      console.error('Error creating raid:', error)
      return null
    }

    return data.id
  }

  async getRaid(raidId: string): Promise<RaidState | null> {
    const { data: raidData, error: raidError } = await supabase
      .from('raids')
      .select('*')
      .eq('id', raidId)
      .single()

    if (raidError) {
      console.error('Error fetching raid:', raidError)
      return null
    }

    const { data: participantsData, error: participantsError } = await supabase
      .from('raid_participants')
      .select('*')
      .eq('raid_id', raidId)

    if (participantsError) {
      console.error('Error fetching raid participants:', participantsError)
      return null
    }

    const { data: questsData, error: questsError } = await supabase
      .from('quest_submissions')
      .select('*')
      .eq('raid_id', raidId)

    if (questsError) {
      console.error('Error fetching quest submissions:', questsError)
      return null
    }

    return this.mapDatabaseRaidToRaidState(raidData, participantsData, questsData)
  }

  // Helper methods for data mapping
  private mapDatabasePlayerToPlayer(data: Database['public']['Tables']['players']['Row']): Player {
    return {
      wallet: data.wallet,
      username: data.username,
      handle: data.handle,
      profilePicture: data.profile_picture,
      experience: data.experience,
      dateJoined: new Date(data.date_joined).getTime(),
      questsCompleted: data.quests_completed,
      raidBossesDefeated: data.raid_bosses_defeated,
      lastQuestCompletionTime: new Date(data.last_quest_completion_time).getTime(),
      showWallet: data.show_wallet,
      guild: data.guild,
      archetype: data.archetype,
      discordHandle: data.discord_handle
    }
  }

  private mapDatabaseRaidToRaidState(
    raidData: Database['public']['Tables']['raids']['Row'],
    participantsData: Database['public']['Tables']['raid_participants']['Row'][],
    questsData: Database['public']['Tables']['quest_submissions']['Row'][]
  ): RaidState {
    return {
      id: raidData.id,
      state: raidData.state as RaidState['state'],
      startTime: new Date(raidData.start_time).getTime(),
      endTime: raidData.end_time ? new Date(raidData.end_time).getTime() : null,
      boss: {
        name: raidData.boss_name,
        health: raidData.boss_health,
        maxHealth: raidData.boss_max_health,
        defense: raidData.boss_defense,
        quests: questsData.map(quest => ({
          type: quest.quest_type,
          completedBy: [quest.player_id]
        }))
      },
      participants: participantsData.map(participant => ({
        playerId: participant.player_id,
        joinTime: new Date(participant.join_time).getTime(),
        contribution: participant.contribution
      }))
    }
  }
}
