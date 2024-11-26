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
  };
}

export interface QuestSubmissionRecord {
  id: string;
  quest_id: string;
  wallet_address: string;
  status: SubmissionStatus;
  proof_url: string;
  submission_date: string;
  updated_at?: string;
  quest: {
    id: string;
    title: string;
    description: string;
    xp_reward: number;
  };
}

export interface SubmissionPage {
  submissions: QuestSubmission[];
  currentPage: number;
  totalPages: number;
  totalSubmissions: number;
}