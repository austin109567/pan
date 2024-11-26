// Level calculation utility
export const calculateLevel = (xp: number): { level: number; currentLevelXp: number; nextLevelXp: number; progress: number } => {
  // Base XP required for level 2 is 200
  const BASE_XP = 200;
  // XP scaling factor (exponential growth)
  const SCALING_FACTOR = 1.8;
  
  let level = 1;
  let totalXpRequired = 0;
  let nextLevelXp = BASE_XP;

  // Calculate level based on XP
  while (xp >= totalXpRequired + nextLevelXp) {
    totalXpRequired += nextLevelXp;
    level++;
    nextLevelXp = Math.floor(BASE_XP * Math.pow(SCALING_FACTOR, level - 1));
  }

  // Calculate XP progress in current level
  const currentLevelXp = xp - totalXpRequired;
  const progress = (currentLevelXp / nextLevelXp) * 100;

  return {
    level,
    currentLevelXp,
    nextLevelXp,
    progress
  };
};