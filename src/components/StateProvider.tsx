import React, { useEffect } from 'react';
import { useStateSync } from '../hooks/useStateSync';
import { playerService } from '../services/playerService';
import { guildService } from '../services/guildService';

interface StateProviderProps {
  children: React.ReactNode;
}

export const StateProvider: React.FC<StateProviderProps> = ({ children }) => {
  // Sync player state
  useStateSync('playerStateUpdate', () => {
    playerService.loadState();
  });

  // Sync guild state
  useStateSync('guildStateUpdate', () => {
    guildService.loadState();
  });

  // Check for updates periodically
  useEffect(() => {
    const interval = setInterval(() => {
      playerService.loadState();
      guildService.loadState();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <>{children}</>;
}