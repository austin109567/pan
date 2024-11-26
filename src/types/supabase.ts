export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      guilds: {
        Row: {
          created_at: string | null
          description: string | null
          experience: number | null
          id: string
          leader_id: string | null
          level: number | null
          max_members: number | null
          members_count: number | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          experience?: number | null
          id?: string
          leader_id?: string | null
          level?: number | null
          max_members?: number | null
          members_count?: number | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          experience?: number | null
          id?: string
          leader_id?: string | null
          level?: number | null
          max_members?: number | null
          members_count?: number | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "guilds_leader_id_fkey"
            columns: ["leader_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      players: {
        Row: {
          archetype: string | null
          created_at: string | null
          date_joined: string | null
          discord_handle: string | null
          experience: number | null
          guild_id: string | null
          id: string
          last_nonce: string | null
          last_quest_completion_time: string | null
          last_signature: string | null
          last_signed_message: string | null
          level: number | null
          quests_completed: number | null
          raid_bosses_defeated: number | null
          show_wallet: boolean | null
          status: Database["public"]["Enums"]["user_status"] | null
          updated_at: string | null
          username: string | null
          wallet: string
        }
        Insert: {
          archetype?: string | null
          created_at?: string | null
          date_joined?: string | null
          discord_handle?: string | null
          experience?: number | null
          guild_id?: string | null
          id?: string
          last_nonce?: string | null
          last_quest_completion_time?: string | null
          last_signature?: string | null
          last_signed_message?: string | null
          level?: number | null
          quests_completed?: number | null
          raid_bosses_defeated?: number | null
          show_wallet?: boolean | null
          status?: Database["public"]["Enums"]["user_status"] | null
          updated_at?: string | null
          username?: string | null
          wallet: string
        }
        Update: {
          archetype?: string | null
          created_at?: string | null
          date_joined?: string | null
          discord_handle?: string | null
          experience?: number | null
          guild_id?: string | null
          id?: string
          last_nonce?: string | null
          last_quest_completion_time?: string | null
          last_signature?: string | null
          last_signed_message?: string | null
          level?: number | null
          quests_completed?: number | null
          raid_bosses_defeated?: number | null
          show_wallet?: boolean | null
          status?: Database["public"]["Enums"]["user_status"] | null
          updated_at?: string | null
          username?: string | null
          wallet?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_guild"
            columns: ["guild_id"]
            isOneToOne: false
            referencedRelation: "guilds"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          last_nonce: string | null
          last_signature: string | null
          last_signed_message: string | null
          updated_at: string
          wallet_address: string
        }
        Insert: {
          created_at?: string
          id: string
          last_nonce?: string | null
          last_signature?: string | null
          last_signed_message?: string | null
          updated_at?: string
          wallet_address: string
        }
        Update: {
          created_at?: string
          id?: string
          last_nonce?: string | null
          last_signature?: string | null
          last_signed_message?: string | null
          updated_at?: string
          wallet_address?: string
        }
        Relationships: []
      }
      quest_submissions: {
        Row: {
          created_at: string | null
          id: string
          player_id: string | null
          proof_url: string | null
          quest_id: string | null
          screenshot_url: string | null
          status: string | null
          updated_at: string | null
          verified: boolean | null
          verified_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          player_id?: string | null
          proof_url?: string | null
          quest_id?: string | null
          screenshot_url?: string | null
          status?: string | null
          updated_at?: string | null
          verified?: boolean | null
          verified_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          player_id?: string | null
          proof_url?: string | null
          quest_id?: string | null
          screenshot_url?: string | null
          status?: string | null
          updated_at?: string | null
          verified?: boolean | null
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quest_submissions_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quest_submissions_quest_id_fkey"
            columns: ["quest_id"]
            isOneToOne: false
            referencedRelation: "quests"
            referencedColumns: ["id"]
          },
        ]
      }
      quests: {
        Row: {
          completed_by: string[] | null
          created_at: string | null
          date_available: string | null
          date_expires: string | null
          description: string
          id: string
          image_url: string | null
          is_automatic: boolean | null
          is_raid_boss: boolean | null
          quest_url: string | null
          requirements: Json | null
          status: Database["public"]["Enums"]["quest_status"] | null
          title: string
          type: Database["public"]["Enums"]["quest_type"]
          updated_at: string | null
          xp_reward: number
        }
        Insert: {
          completed_by?: string[] | null
          created_at?: string | null
          date_available?: string | null
          date_expires?: string | null
          description: string
          id?: string
          image_url?: string | null
          is_automatic?: boolean | null
          is_raid_boss?: boolean | null
          quest_url?: string | null
          requirements?: Json | null
          status?: Database["public"]["Enums"]["quest_status"] | null
          title: string
          type: Database["public"]["Enums"]["quest_type"]
          updated_at?: string | null
          xp_reward: number
        }
        Update: {
          completed_by?: string[] | null
          created_at?: string | null
          date_available?: string | null
          date_expires?: string | null
          description?: string
          id?: string
          image_url?: string | null
          is_automatic?: boolean | null
          is_raid_boss?: boolean | null
          quest_url?: string | null
          requirements?: Json | null
          status?: Database["public"]["Enums"]["quest_status"] | null
          title?: string
          type?: Database["public"]["Enums"]["quest_type"]
          updated_at?: string | null
          xp_reward?: number
        }
        Relationships: []
      }
      raid_participants: {
        Row: {
          created_at: string | null
          damage_dealt: number | null
          id: string
          joined_at: string | null
          player_id: string | null
          raid_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          damage_dealt?: number | null
          id?: string
          joined_at?: string | null
          player_id?: string | null
          raid_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          damage_dealt?: number | null
          id?: string
          joined_at?: string | null
          player_id?: string | null
          raid_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "raid_participants_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "raid_participants_raid_id_fkey"
            columns: ["raid_id"]
            isOneToOne: false
            referencedRelation: "raids"
            referencedColumns: ["id"]
          },
        ]
      }
      raids: {
        Row: {
          created_at: string | null
          current_health: number
          description: string
          difficulty: number
          end_time: string | null
          id: string
          name: string
          start_time: string | null
          status: string | null
          total_health: number
          updated_at: string | null
          xp_reward: number
        }
        Insert: {
          created_at?: string | null
          current_health: number
          description: string
          difficulty: number
          end_time?: string | null
          id?: string
          name: string
          start_time?: string | null
          status?: string | null
          total_health: number
          updated_at?: string | null
          xp_reward: number
        }
        Update: {
          created_at?: string | null
          current_health?: number
          description?: string
          difficulty?: number
          end_time?: string | null
          id?: string
          name?: string
          start_time?: string | null
          status?: string | null
          total_health?: number
          updated_at?: string | null
          xp_reward?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      complete_quest: {
        Args: {
          p_quest_id: string
          p_player_id: string
        }
        Returns: boolean
      }
      verify_wallet_signature: {
        Args: {
          wallet_address: string
          message: string
          signature: string
        }
        Returns: boolean
      }
    }
    Enums: {
      quest_status: "available" | "completed" | "expired"
      quest_type: "daily" | "weekly" | "monthly" | "raid-boss"
      user_status: "active" | "inactive" | "banned"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

