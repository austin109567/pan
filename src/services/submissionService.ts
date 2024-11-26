import { supabase, supabaseAdmin } from '../lib/supabase';
import { PlayerService } from './playerService';
import { questService } from './questService';

// Use admin client for admin operations
const serviceClient = supabaseAdmin;
const playerService = new PlayerService();

export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

export interface QuestSubmission {
  id: string;
  quest_id: string;
  wallet_address: string;
  status: SubmissionStatus;
  proof_url: string;
  submission_date: string;
  updated_at?: string;
  quest?: {
    id: string;
    title: string;
    description: string;
    xp_reward: number;
    type: string;
  };
}

export class SubmissionService {
  private static instance: SubmissionService;
  private subscribers: ((submission: QuestSubmission) => void)[] = [];

  private constructor() {}

  static getInstance(): SubmissionService {
    if (!SubmissionService.instance) {
      SubmissionService.instance = new SubmissionService();
    }
    return SubmissionService.instance;
  }

  subscribe(callback: (submission: QuestSubmission) => void) {
    this.subscribers.push(callback);
  }

  private emit(submission: QuestSubmission) {
    this.subscribers.forEach(callback => callback(submission));
  }

  async approveSubmission(submissionId: string, xpReward: number): Promise<QuestSubmission | null> {
    try {
      // First get the submission to verify it exists and get the wallet
      const { data: submission, error: fetchError } = await serviceClient
        .from('submissions')
        .select('*')
        .eq('id', submissionId)
        .single();

      if (fetchError) {
        console.error('Error fetching submission:', fetchError);
        throw fetchError;
      }

      if (!submission) {
        throw new Error('Submission not found');
      }

      // Update submission status
      const { data: updatedSubmission, error: updateError } = await serviceClient
        .from('submissions')
        .update({
          status: 'approved',
          updated_at: new Date().toISOString(),
          xp_reward: xpReward
        })
        .eq('id', submissionId)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating submission:', updateError);
        throw updateError;
      }

      if (!updatedSubmission) {
        throw new Error('Failed to update submission');
      }

      // Get current quest data
      const { data: quest, error: questError } = await serviceClient
        .from('quests')
        .select('completedBy')
        .eq('id', submission.quest_id)
        .single();

      if (questError) {
        console.error('Error fetching quest:', questError);
        throw questError;
      }

      // Update quest's completedBy array
      const completedBy = new Set(quest?.completedBy || []);
      completedBy.add(submission.wallet_address);

      const { error: questUpdateError } = await serviceClient
        .from('quests')
        .update({
          completedBy: Array.from(completedBy)
        })
        .eq('id', submission.quest_id);

      if (questUpdateError) {
        console.error('Error updating quest completedBy:', questUpdateError);
        throw questUpdateError;
      }

      // Award XP to player
      try {
        await playerService.updatePlayerStats(submission.wallet_address, {
          experience: xpReward,
          questsCompleted: 1
        });
      } catch (playerError) {
        console.error('Error updating player stats:', playerError);
        // Revert submission status if player update fails
        await serviceClient
          .from('submissions')
          .update({
            status: 'pending',
            updated_at: new Date().toISOString(),
            xp_reward: 0
          })
          .eq('id', submissionId)
          .select()
          .single();
        throw playerError;
      }

      this.emit(updatedSubmission);
      return updatedSubmission;
    } catch (error) {
      console.error('Error in approveSubmission:', error);
      throw error;
    }
  }

  async rejectSubmission(submissionId: string, reason: string): Promise<QuestSubmission | null> {
    try {
      const { data: updatedSubmission, error } = await serviceClient
        .from('submissions')
        .update({
          status: 'rejected',
          rejection_reason: reason,
          updated_at: new Date().toISOString()
        })
        .eq('id', submissionId)
        .select()
        .single();

      if (error) {
        console.error('Error rejecting submission:', error);
        throw error;
      }

      if (!updatedSubmission) {
        throw new Error('Failed to update submission');
      }

      this.emit(updatedSubmission);
      return updatedSubmission;
    } catch (error) {
      console.error('Error in rejectSubmission:', error);
      throw error;
    }
  }

  async updateSubmissionStatus(submissionId: string, status: 'approved' | 'rejected'): Promise<QuestSubmission | null> {
    try {
      // First get the submission to get quest info
      const { data: submission, error: fetchError } = await serviceClient
        .from('submissions')
        .select(`
          *,
          quest:quests (
            id,
            title,
            description,
            xp_reward,
            completed_by,
            type
          )
        `)
        .eq('id', submissionId)
        .single();

      if (fetchError || !submission) {
        console.error('Error fetching submission:', fetchError);
        return null;
      }

      // Update submission status
      const { data: updatedSubmission, error: updateError } = await serviceClient
        .from('submissions')
        .update({ status })
        .eq('id', submissionId)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating submission:', updateError);
        return null;
      }

      if (status === 'approved' && submission.quest) {
        // Start transaction for approval
        const { error: approvalError } = await serviceClient
          .rpc('approve_quest_submission', {
            p_submission_id: submissionId,
            p_quest_id: submission.quest_id,
            p_wallet_address: submission.wallet_address,
            p_xp_reward: submission.quest.xp_reward,
            p_quest_type: submission.quest.type
          });

        if (approvalError) {
          console.error('Error in approval transaction:', approvalError);
          return null;
        }
      }

      this.emit(updatedSubmission);
      return updatedSubmission;
    } catch (error) {
      console.error('Error updating submission status:', error);
      throw error;
    }
  }

  async deleteSubmission(submissionId: string): Promise<void> {
    try {
      const { error } = await serviceClient
        .from('submissions')
        .delete()
        .eq('id', submissionId);

      if (error) {
        console.error('Error deleting submission:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in deleteSubmission:', error);
      throw error;
    }
  }

  async getSubmissionPage(page: number): Promise<{
    submissions: QuestSubmission[];
    totalSubmissions: number;
    totalPages: number;
  }> {
    try {
      const pageSize = 10;
      const start = (page - 1) * pageSize;
      const end = start + pageSize - 1;

      // First get the count
      const { count, error: countError } = await serviceClient
        .from('submissions')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        console.error('Error getting submission count:', countError);
        throw countError;
      }

      // Then get the page of submissions
      const { data: submissions, error: fetchError } = await serviceClient
        .from('submissions')
        .select(`
          id,
          quest_id,
          wallet_address,
          status,
          proof_url,
          submission_date,
          updated_at,
          quests!inner (
            id,
            title,
            description,
            xp_reward
          )
        `)
        .order('submission_date', { ascending: false })
        .range(start, end);

      if (fetchError) {
        console.error('Error fetching submissions:', fetchError);
        throw fetchError;
      }

      // Transform the data to match our interface
      const transformedSubmissions = submissions?.map(sub => ({
        id: sub.id,
        quest_id: sub.quest_id,
        wallet_address: sub.wallet_address,
        status: sub.status as SubmissionStatus,
        proof_url: sub.proof_url,
        submission_date: sub.submission_date,
        updated_at: sub.updated_at,
        quest: sub.quests
      })) || [];

      const totalSubmissions = count || 0;
      const totalPages = Math.ceil(totalSubmissions / pageSize);

      return {
        submissions: transformedSubmissions,
        totalSubmissions,
        totalPages,
      };
    } catch (error) {
      console.error('Error in getSubmissionPage:', error);
      throw error;
    }
  }

  async addSubmission(submission: {
    wallet: string;
    questId: string;
    proofLink: string;
    submissionDate: string;
  }): Promise<boolean> {
    try {
      // Get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (!session) {
        console.error('No active session');
        return false;
      }

      // Get quest details first
      const { data: quest, error: questError } = await serviceClient
        .from('quests')
        .select('*')
        .eq('id', submission.questId)
        .single();

      if (questError || !quest) {
        console.error('Error fetching quest:', questError);
        return false;
      }

      // Check if quest is on cooldown
      const { data: cooldownCheck, error: cooldownError } = await serviceClient
        .rpc('is_quest_on_cooldown', {
          p_quest_id: submission.questId,
          p_wallet_address: submission.wallet,
          p_quest_type: quest.type
        });

      if (cooldownError) {
        console.error('Error checking quest cooldown:', cooldownError);
        return false;
      }

      if (cooldownCheck) {
        console.error('Quest is still on cooldown');
        return false;
      }

      // Start transaction
      const { data: result, error: transactionError } = await serviceClient
        .rpc('submit_quest', {
          p_quest_id: submission.questId,
          p_wallet_address: submission.wallet,
          p_proof_url: submission.proofLink,
          p_submission_date: submission.submissionDate
        });

      if (transactionError) {
        console.error('Error in quest submission transaction:', transactionError);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Failed to save submission:', error);
      return false;
    }
  }

  async getPendingSubmissions(): Promise<QuestSubmission[]> {
    try {
      const { data: submissions, error } = await serviceClient
        .from('submissions')
        .select()
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching pending submissions:', error);
        throw error;
      }

      return submissions || [];
    } catch (error) {
      console.error('Error in getPendingSubmissions:', error);
      throw error;
    }
  }
}

export const submissionService = SubmissionService.getInstance();