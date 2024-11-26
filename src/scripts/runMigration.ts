import { migrateData, clearLocalStorage } from './migrateToSupabase';

async function runMigration() {
  console.log('Starting migration process...');
  
  try {
    const success = await migrateData();
    
    if (success) {
      console.log('Migration completed successfully!');
      console.log('Clearing localStorage...');
      clearLocalStorage();
      console.log('Migration process finished.');
    } else {
      console.error('Migration failed. Please check the logs for details.');
    }
  } catch (error) {
    console.error('Migration failed with error:', error);
  }
}

runMigration();
