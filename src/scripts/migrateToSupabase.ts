import { supabase } from '../lib/supabase';
import type { Player } from '../types/player';
import type { RaidState } from '../types/raid';

export async function migrateData() {
  console.log('Starting data migration to Supabase...');
  
  try {
    // Migrate Players
    const playersData = localStorage.getItem('players_v1');
    if (playersData) {
      const players = Object.values(JSON.parse(playersData)) as Player[];
      console.log(`Found ${players.length} players to migrate`);
      
      for (const player of players) {
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
          .single();

        if (error) {
          console.error(`Failed to migrate player ${player.wallet}:`, error);
        } else {
          console.log(`Migrated player ${player.wallet}`);
        }
      }
    }

    // Migrate Raids
    const raidsData = localStorage.getItem('raids');
    if (raidsData) {
      const raids = Object.values(JSON.parse(raidsData)) as RaidState[];
      console.log(`Found ${raids.length} raids to migrate`);

      for (const raid of raids) {
        // Create raid entry
        const { data: raidData, error: raidError } = await supabase
          .from('raids')
          .insert({
            id: raid.id,
            boss_name: raid.boss.name,
            boss_health: raid.boss.health,
            boss_max_health: raid.boss.maxHealth,
            boss_defense: raid.boss.defense,
            state: raid.state,
            start_time: new Date(raid.startTime).toISOString(),
            end_time: raid.endTime ? new Date(raid.endTime).toISOString() : null
          })
          .select()
          .single();

        if (raidError) {
          console.error(`Failed to migrate raid ${raid.id}:`, raidError);
          continue;
        }

        // Migrate participants
        for (const participant of raid.participants) {
          const { error: participantError } = await supabase
            .from('raid_participants')
            .insert({
              raid_id: raid.id,
              player_id: participant.playerId,
              join_time: new Date(participant.joinTime).toISOString(),
              contribution: participant.contribution
            });

          if (participantError) {
            console.error(`Failed to migrate participant for raid ${raid.id}:`, participantError);
          }
        }

        // Migrate quest submissions
        for (const quest of raid.boss.quests) {
          for (const playerId of quest.completedBy) {
            const { error: questError } = await supabase
              .from('quest_submissions')
              .insert({
                raid_id: raid.id,
                player_id: playerId,
                quest_type: quest.type,
                submission_time: new Date().toISOString(),
                verified: true
              });

            if (questError) {
              console.error(`Failed to migrate quest submission for raid ${raid.id}:`, questError);
            }
          }
        }

        console.log(`Migrated raid ${raid.id} with participants and quests`);
      }
    }

    console.log('Migration completed successfully!');
    return true;
  } catch (error) {
    console.error('Migration failed:', error);
    return false;
  }
}

// Helper function to clear localStorage after successful migration
export function clearLocalStorage() {
  localStorage.removeItem('players_v1');
  localStorage.removeItem('raids');
  console.log('Cleared localStorage data');
}
