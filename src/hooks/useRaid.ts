import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { RaidState, QuestSubmission } from '../types/raid';
import { raidService } from '../services/raidService';

export function useRaid() {
  const { publicKey } = useWallet();
  const [currentRaids, setCurrentRaids] = useState<RaidState[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRaids = async () => {
      try {
        const raids = await raidService.getAllRaids();
        setCurrentRaids(raids.filter(raid => raid.state === 'active'));
        setError(null);
      } catch (err) {
        console.error('Error loading raids:', err);
        setError('Failed to load raids');
      } finally {
        setLoading(false);
      }
    };

    loadRaids();
    const interval = setInterval(loadRaids, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const joinRaid = async (raidId: string, nftId: string) => {
    if (!publicKey) return false;
    try {
      return await raidService.joinRaid(raidId, publicKey.toString(), nftId);
    } catch (err) {
      console.error('Error joining raid:', err);
      return false;
    }
  };

  const completeQuest = async (raidId: string, questId: string, submission: QuestSubmission) => {
    if (!publicKey) return false;
    try {
      return await raidService.completeQuest(raidId, questId, publicKey.toString(), submission);
    } catch (err) {
      console.error('Error completing quest:', err);
      return false;
    }
  };

  return {
    currentRaids,
    loading,
    error,
    joinRaid,
    completeQuest
  };
}