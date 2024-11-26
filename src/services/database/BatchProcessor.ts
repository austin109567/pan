import { 
  writeBatch, 
  DocumentReference,
  DocumentData,
  Firestore
} from 'firebase/firestore';
import { db } from '../../config/database';
import { batchSize } from '../../config/database';

export class BatchProcessor {
  private static instance: BatchProcessor;
  private db: Firestore;
  private pendingOperations: Array<{
    type: 'set' | 'update' | 'delete';
    ref: DocumentReference;
    data?: DocumentData;
  }>;

  private constructor() {
    this.db = db;
    this.pendingOperations = [];
  }

  static getInstance(): BatchProcessor {
    if (!BatchProcessor.instance) {
      BatchProcessor.instance = new BatchProcessor();
    }
    return BatchProcessor.instance;
  }

  addOperation(
    type: 'set' | 'update' | 'delete',
    ref: DocumentReference,
    data?: DocumentData
  ): void {
    this.pendingOperations.push({ type, ref, data });

    if (this.pendingOperations.length >= batchSize.WRITE) {
      this.processBatch();
    }
  }

  async processBatch(): Promise<void> {
    if (this.pendingOperations.length === 0) return;

    const batches = [];
    let currentBatch = writeBatch(this.db);
    let operationCount = 0;

    for (const op of this.pendingOperations) {
      switch (op.type) {
        case 'set':
          currentBatch.set(op.ref, op.data!);
          break;
        case 'update':
          currentBatch.update(op.ref, op.data!);
          break;
        case 'delete':
          currentBatch.delete(op.ref);
          break;
      }

      operationCount++;

      if (operationCount === batchSize.WRITE) {
        batches.push(currentBatch);
        currentBatch = writeBatch(this.db);
        operationCount = 0;
      }
    }

    if (operationCount > 0) {
      batches.push(currentBatch);
    }

    try {
      await Promise.all(batches.map(batch => batch.commit()));
      this.pendingOperations = [];
    } catch (error) {
      console.error('Failed to process batch operations:', error);
      throw error;
    }
  }

  async flush(): Promise<void> {
    await this.processBatch();
  }

  clear(): void {
    this.pendingOperations = [];
  }
}