import {
  query,
  where,
  orderBy,
  limit,
  startAfter,
  QueryConstraint,
  CollectionReference,
  Query,
  DocumentData
} from 'firebase/firestore';
import { batchSize } from '../../config/database';

export class QueryBuilder<T = DocumentData> {
  private constraints: QueryConstraint[] = [];
  private collection: CollectionReference;

  constructor(collection: CollectionReference) {
    this.collection = collection;
  }

  where(field: string, operator: '<' | '<=' | '==' | '>=' | '>' | '!=', value: any): this {
    this.constraints.push(where(field, operator, value));
    return this;
  }

  orderBy(field: string, direction: 'asc' | 'desc' = 'asc'): this {
    this.constraints.push(orderBy(field, direction));
    return this;
  }

  limitTo(n: number = batchSize.QUERY): this {
    this.constraints.push(limit(n));
    return this;
  }

  startAfter(doc: any): this {
    this.constraints.push(startAfter(doc));
    return this;
  }

  build(): Query<T> {
    return query(this.collection, ...this.constraints) as Query<T>;
  }

  reset(): this {
    this.constraints = [];
    return this;
  }
}