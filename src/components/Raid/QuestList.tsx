import { FC, useState, useEffect, useMemo } from 'react';
import { Star, ScrollText, ChevronDown, Clock, Calendar, Trophy, LayoutGrid, Link } from 'lucide-react';
import { Quest } from '../../types/Quest';
import { QuestSubmissionModal } from './QuestSubmissionModal';
import { questService } from '../../services/questService';
import { submissionService, QuestSubmission } from '../../services/submissionService';
import { useWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

type QuestType = 'all' | 'daily' | 'weekly' | 'monthly';

export const QuestList: FC = () => {
  const { publicKey } = useWallet();
  const { isAuthenticated, signIn } = useAuth();
  const [activeTab, setActiveTab] = useState<QuestType>('all');
  const [quests, setQuests] = useState<Quest[]>([]);
  const [completedQuests, setCompletedQuests] = useState<Quest[]>([]);
  const [submittingQuest, setSubmittingQuest] = useState<Quest | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingSubmissions, setPendingSubmissions] = useState<QuestSubmission[]>([]);

  useEffect(() => {
    const loadQuests = async () => {
      if (!publicKey) {
        setQuests([]);
        setCompletedQuests([]);
        setPendingSubmissions([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const walletAddress = publicKey?.toString() || '';
        
        // Get available quests using the new database function
        const { data: availableQuests, error: availableError } = await supabase
          .rpc('get_available_quests', { 
            p_wallet_address: walletAddress,
            p_quest_type: activeTab === 'all' ? null : activeTab 
          });

        if (availableError) throw availableError;

        // Get completed quests
        const { data: allQuests, error: questError } = await supabase
          .from('quests')
          .select('*')
          .contains('completed_by', [walletAddress]);

        if (questError) throw questError;

        // Get pending submissions
        const { data: pendingData, error: pendingError } = await supabase
          .from('submissions')
          .select('*, quest:quests(*)')
          .eq('wallet_address', walletAddress)
          .eq('status', 'pending');

        if (pendingError) throw pendingError;

        // Filter and sort completed quests
        const completed = allQuests
          .filter(quest => quest.completedBy?.includes(walletAddress))
          .sort((a, b) => b.dateExpires - a.dateExpires);

        setQuests(availableQuests || []);
        setCompletedQuests(completed || []);
        setPendingSubmissions(pendingData || []);
      } catch (error) {
        console.error('Error loading quests:', error);
        setError('Failed to load quests. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadQuests();
  }, [publicKey, activeTab, refreshKey]);

  useEffect(() => {
    const loadPendingSubmissions = async () => {
      if (!publicKey) {
        setPendingSubmissions([]);
        return;
      }

      try {
        const submissions = await submissionService.getPendingSubmissions();
        setPendingSubmissions(submissions.filter(sub => sub.wallet_address === publicKey.toString()));
      } catch (error) {
        console.error('Error loading pending submissions:', error);
      }
    };

    loadPendingSubmissions();
  }, [publicKey, refreshKey]);

  const filteredQuests = useMemo(() => {
    let filtered = quests;
    if (activeTab !== 'all') {
      filtered = quests.filter(quest => quest.type === activeTab);
    }
    return filtered;
  }, [quests, activeTab]);

  const getVisibleQuests = () => {
    const filtered = filteredQuests;
    const limit = showAll ? filtered.length : (window.innerWidth < 768 ? 2 : 6);
    return filtered.slice(0, limit);
  };

  const handleSubmitProof = async (submission: QuestSubmission) => {
    if (!submittingQuest || !publicKey) return;

    if (!isAuthenticated) {
      try {
        await signIn();
      } catch (error) {
        console.error('Authentication failed:', error);
        setError('Please sign in with your wallet first');
        return;
      }
    }

    try {
      const success = await questService.submitQuestProof(
        submittingQuest.id,
        publicKey.toString(),
        submission
      );

      if (success) {
        setSubmittingQuest(null);
        setRefreshKey(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error submitting quest proof:', error);
      setError('Failed to submit quest proof. Please try again.');
    }
  };

  const filterOptions = [
    { label: 'All Time', value: 'all' },
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' }
  ];

  const renderPendingSubmissions = () => {
    if (pendingSubmissions.length === 0) return null;

    return (
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Pending Submissions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pendingSubmissions.map((submission) => (
            <motion.div
              key={submission.id}
              className="bg-sand-100 dark:bg-sand-800 rounded-lg p-4 shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="font-semibold mb-2">{submission.quest.title}</h3>
              <p className="text-sm text-sand-600 dark:text-sand-400 mb-2">
                Submitted: {new Date(submission.submission_date).toLocaleDateString()}
              </p>
              <div className="flex items-center gap-2 text-sm text-sand-500">
                <Link className="w-4 h-4" />
                <a href={submission.proof_url} target="_blank" rel="noopener noreferrer" className="hover:text-primary-500">
                  View Proof
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  if (!publicKey) {
    return (
      <div className="text-center py-8">
        <p className="text-neutral-lightGray">Please connect your wallet to view quests.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-sand-900 dark:text-sand-100">Quests</h2>
          <p className="text-sm text-sand-600 dark:text-sand-400">Complete quests to earn XP and rewards</p>
        </div>
        
        <div className="flex items-center gap-2 bg-sand-100 dark:bg-sand-800 p-1 rounded-lg">
          {filterOptions.map((option, index) => (
            <button
              key={option.value}
              onClick={() => setActiveTab(option.value as QuestType)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200
                ${activeTab === option.value
                  ? 'bg-primary-500 text-white'
                  : 'text-sand-600 dark:text-sand-400 hover:text-sand-900 dark:hover:text-sand-100'
                }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-sand-600 dark:text-sand-400">Loading quests...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <>
          {renderPendingSubmissions()}
          
          {quests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {getVisibleQuests().map((quest) => (
                <motion.div
                  key={quest.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative group"
                >
                  <div className="h-full p-6 rounded-xl
                    bg-gradient-to-br from-sand-100/80 via-sand-100/60 to-transparent
                    dark:from-black/40 dark:via-black/30 dark:to-transparent
                    border border-sand-300/50 dark:border-sand-200/10
                    hover:border-primary-500/30 dark:hover:border-primary-500/30
                    transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-sand-800 dark:text-sand-200 group-hover:text-primary-500 transition-colors">
                          {quest.title}
                        </h3>
                        <p className="text-sm text-sand-600 dark:text-sand-400 mt-1">
                          {quest.description}
                        </p>
                      </div>
                      <div className="flex items-center text-primary-500 bg-primary-500/10 px-2 py-1 rounded-lg">
                        <Star className="w-4 h-4 mr-1" />
                        <span className="text-sm font-medium">{quest.xpReward}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setSubmittingQuest(quest)}
                      className="w-full bg-primary-500 hover:bg-primary-600 text-white py-2.5 px-4 rounded-lg
                        transition-all duration-300 flex items-center justify-center gap-2
                        shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50"
                    >
                      <ScrollText className="w-4 h-4" />
                      Submit Proof
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-sand-600 dark:text-sand-400">
                No {activeTab !== 'all' ? activeTab : ''} quests available at the moment.
              </p>
            </div>
          )}

          {filteredQuests.length > (window.innerWidth < 768 ? 2 : 6) && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setShowAll(!showAll)}
                className="px-6 py-2.5 text-sm font-medium text-primary-500 hover:text-primary-600 dark:text-primary-400 
                  dark:hover:text-primary-300 transition-colors flex items-center gap-2"
              >
                {showAll ? (
                  <>
                    Show Less
                    <ChevronDown className="w-4 h-4 rotate-180" />
                  </>
                ) : (
                  <>
                    Show More
                    <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </>
      )}

      {completedQuests.length > 0 && (
        <div className="mt-8 space-y-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-sand-900 dark:text-sand-100">
              Completed Quests
            </h2>
            <p className="text-sm text-sand-600 dark:text-sand-400">
              Your successfully completed quests
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {completedQuests.map((quest) => (
              <motion.div
                key={quest.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative group"
              >
                <div className="h-full p-6 rounded-xl
                  bg-gradient-to-br from-sand-100/80 via-sand-100/60 to-transparent
                  dark:from-black/40 dark:via-black/30 dark:to-transparent
                  border border-sand-300/50 dark:border-sand-200/10
                  hover:border-primary-500/30 dark:hover:border-primary-500/30
                  transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-sand-800 dark:text-sand-200">
                        {quest.title}
                      </h3>
                      <p className="text-sm text-sand-600 dark:text-sand-400 mt-1">
                        {quest.description}
                      </p>
                    </div>
                    <div className="flex items-center text-green-500 bg-green-500/10 px-2 py-1 rounded-lg">
                      <Trophy className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">{quest.xpReward} XP</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-sand-600 dark:text-sand-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Completed {new Date(quest.dateExpires).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <LayoutGrid className="w-4 h-4" />
                      <span>{quest.type}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {submittingQuest && (
        <QuestSubmissionModal
          isOpen={!!submittingQuest}
          onClose={() => setSubmittingQuest(null)}
          onSubmit={handleSubmitProof}
          quest={submittingQuest}
        />
      )}
    </div>
  );
};