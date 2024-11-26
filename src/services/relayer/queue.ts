import { Transaction } from '@solana/web3.js';
import { scaleConfig } from '../../config/scale';
import { logError } from '../../config/monitoring';

interface QueuedTransaction {
  id: string;
  transaction: Transaction;
  priority: number;
  timestamp: number;
  retries: number;
}

export class TransactionQueue {
  private static instance: TransactionQueue;
  private queue: QueuedTransaction[];
  private processing: boolean;
  private maxRetries: number;

  private constructor() {
    this.queue = [];
    this.processing = false;
    this.maxRetries = scaleConfig.limits.transaction.maxRetries;
    this.startProcessing();
  }

  static getInstance(): TransactionQueue {
    if (!TransactionQueue.instance) {
      TransactionQueue.instance = new TransactionQueue();
    }
    return TransactionQueue.instance;
  }

  async enqueue(
    transaction: Transaction,
    priority: number = 0
  ): Promise<string> {
    const id = Math.random().toString(36).substring(7);
    
    this.queue.push({
      id,
      transaction,
      priority,
      timestamp: Date.now(),
      retries: 0
    });

    // Sort by priority and timestamp
    this.queue.sort((a, b) => {
      if (a.priority !== b.priority) {
        return b.priority - a.priority;
      }
      return a.timestamp - b.timestamp;
    });

    return id;
  }

  private async startProcessing(): Promise<void> {
    if (this.processing) return;
    this.processing = true;

    while (true) {
      try {
        if (this.queue.length === 0) {
          await new Promise(resolve => setTimeout(resolve, 100));
          continue;
        }

        const item = this.queue[0];
        
        try {
          const relayer = TransactionRelayer.getInstance();
          await relayer.sendTransaction(item.transaction);
          this.queue.shift(); // Remove processed transaction
        } catch (error) {
          if (item.retries < this.maxRetries) {
            item.retries++;
            // Move to end of same priority group
            this.queue.shift();
            this.queue.push(item);
          } else {
            logError(error as Error, {
              component: 'TransactionQueue',
              method: 'processTransaction',
              transactionId: item.id
            });
            this.queue.shift(); // Remove failed transaction
          }
        }
      } catch (error) {
        logError(error as Error, {
          component: 'TransactionQueue',
          method: 'startProcessing'
        });
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }

  getQueueLength(): number {
    return this.queue.length;
  }

  getTransactionStatus(id: string): 'queued' | 'processing' | 'not_found' {
    const index = this.queue.findIndex(item => item.id === id);
    if (index === -1) return 'not_found';
    if (index === 0) return 'processing';
    return 'queued';
  }
}