import { 
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  DocumentReference,
  DocumentData,
  QuerySnapshot
} from 'firebase/firestore';
import { db } from '../../config/database';
import { BatchProcessor } from './BatchProcessor';
import { QueryBuilder } from './QueryBuilder';
import { CacheManager } from './CacheManager';

export class DatabaseService<T extends DocumentData = DocumentData> {
  protected collectionName: string;
  protected batchProcessor: BatchProcessor;
  protected cache: CacheManager;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
    this.batchProcessor = BatchProcessor.getInstance();
    this.cache = CacheManager.getInstance();
  }

  protected getRef(id: string): DocumentReference<T> {
    return doc(db, this.collectionName, id) as DocumentReference<T>;
  }

  protected createQueryBuilder(): QueryBuilder<T> {
    return new QueryBuilder<T>(collection(db, this.collectionName));
  }

  async get(id: string): Promise<T | null> {
    // Check cache first
    const cached = this.cache.get<T>(id);
    if (cached) return cached;

    try {
      const docSnap = await getDoc(this.getRef(id));
      if (!docSnap.exists()) return null;

      const data = docSnap.data();
      this.cache.set(id, data);
      return data;
    } catch (error) {
      console.error(`Failed to get document ${id}:`, error);
      return null;
    }
  }

  async set(id: string, data: T): Promise<boolean> {
    try {
      await setDoc(this.getRef(id), data);
      this.cache.set(id, data);
      return true;
    } catch (error) {
      console.error(`Failed to set document ${id}:`, error);
      return false;
    }
  }

  async update(id: string, updates: Partial<T>): Promise<boolean> {
    try {
      await updateDoc(this.getRef(id), updates);
      this.cache.delete(id);
      return true;
    } catch (error) {
      console.error(`Failed to update document ${id}:`, error);
      return false;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await deleteDoc(this.getRef(id));
      this.cache.delete(id);
      return true;
    } catch (error) {
      console.error(`Failed to delete document ${id}:`, error);
      return false;
    }
  }

  async batchSet(items: { id: string; data: T }[]): Promise<boolean> {
    try {
      items.forEach(({ id, data }) => {
        this.batchProcessor.addOperation('set', this.getRef(id), data);
      });
      await this.batchProcessor.processBatch();
      return true;
    } catch (error) {
      console.error('Failed to batch set documents:', error);
      return false;
    }
  }

  async batchUpdate(items: { id: string; updates: Partial<T> }[]): Promise<boolean> {
    try {
      items.forEach(({ id, updates }) => {
        this.batchProcessor.addOperation('update', this.getRef(id), updates);
      });
      await this.batchProcessor.processBatch();
      return true;
    } catch (error) {
      console.error('Failed to batch update documents:', error);
      return false;
    }
  }

  async batchDelete(ids: string[]): Promise<boolean> {
    try {
      ids.forEach(id => {
        this.batchProcessor.addOperation('delete', this.getRef(id));
      });
      await this.batchProcessor.processBatch();
      return true;
    } catch (error) {
      console.error('Failed to batch delete documents:', error);
      return false;
    }
  }

  protected async executeQuery(query: QueryBuilder<T>): Promise<QuerySnapshot<T>> {
    try {
      return await getDocs(query.build());
    } catch (error) {
      console.error('Failed to execute query:', error);
      throw error;
    }
  }
}