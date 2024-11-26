import { QuestSubmission } from '../types/quest';

// Rate limiting configuration
export const RATE_LIMITS = {
  global: {
    requests: 1000,
    windowMs: 60 * 1000 // 1 minute
  },
  quest: {
    submissions: 10,
    windowMs: 60 * 1000 // 1 minute
  },
  nft: {
    operations: 100,
    windowMs: 60 * 1000 // 1 minute
  }
};

// Input validation
export const validateQuestSubmission = (submission: QuestSubmission): boolean => {
  if (!submission.questId || !submission.wallet) return false;
  if (submission.screenshot && submission.screenshot.size > 2 * 1024 * 1024) return false;
  if (submission.url && !isValidUrl(submission.url)) return false;
  return true;
};

// URL validation
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// XSS prevention
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};