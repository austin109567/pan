import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Quest } from '../types/quest';
import { questService } from '../services/questService';

export function useQuests(type?: 'daily' | 'weekly' | 'monthly') {
  const { publicKey } = useWallet();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuests = () => {
      const allQuests = questService.getQuests(type);
      setQuests(allQuests);
      setLoading(false);
    };

    loadQuests();
    // In a real implementation, we would set up WebSocket or polling here
    const interval = setInterval(loadQuests, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, [type]);

  const submitQuestProof = async (questId: string, proof: { url: string; screenshot?: File }) => {
    if (!publicKey) return false;

    return questService.submitQuestProof(questId, publicKey.toString(), proof);
  };

  return {
    quests,
    loading,
    submitQuestProof
  };
}