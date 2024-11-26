export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      players: {
        Row: {
          id: string
          wallet: string
          username: string | null
          handle: string | null
          profile_picture: string | null
          experience: number
          date_joined: string
          quests_completed: number
          raid_bosses_defeated: number
          last_quest_completion_time: string
          show_wallet: boolean
          guild: string | null
          archetype: string | null
          discord_handle: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['players']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['players']['Insert']>
      }
      raids: {
        Row: {
          id: string
          boss_name: string
          boss_health: number
          boss_max_health: number
          boss_defense: number
          state: string
          start_time: string
          end_time: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['raids']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['raids']['Insert']>
      }
      raid_participants: {
        Row: {
          id: string
          raid_id: string
          player_id: string
          join_time: string
          contribution: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['raid_participants']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['raid_participants']['Insert']>
      }
      quest_submissions: {
        Row: {
          id: string
          raid_id: string
          player_id: string
          quest_type: string
          submission_time: string
          verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['quest_submissions']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['quest_submissions']['Insert']>
      }
    }
  }
}
