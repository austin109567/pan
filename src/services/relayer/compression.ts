import * as snappy from 'snappy';
import { encode as encodeBase64, decode as decodeBase64 } from 'base64-arraybuffer';
import { logError } from '../../config/monitoring';

export class CompressionService {
  private static instance: CompressionService;

  private constructor() {}

  static getInstance(): CompressionService {
    if (!CompressionService.instance) {
      CompressionService.instance = new CompressionService();
    }
    return CompressionService.instance;
  }

  async compressData(data: any): Promise<string> {
    try {
      const jsonString = JSON.stringify(data);
      const buffer = Buffer.from(jsonString);
      const compressed = await snappy.compress(buffer);
      return encodeBase64(compressed);
    } catch (error) {
      logError(error as Error, {
        component: 'CompressionService',
        method: 'compressData'
      });
      throw error;
    }
  }

  async decompressData(compressed: string): Promise<any> {
    try {
      const buffer = Buffer.from(decodeBase64(compressed));
      const decompressed = await snappy.uncompress(buffer);
      const jsonString = decompressed.toString();
      return JSON.parse(jsonString);
    } catch (error) {
      logError(error as Error, {
        component: 'CompressionService',
        method: 'decompressData'
      });
      throw error;
    }
  }

  async compressTransaction(transaction: any): Promise<string> {
    try {
      const serialized = transaction.serialize();
      const compressed = await snappy.compress(serialized);
      return encodeBase64(compressed);
    } catch (error) {
      logError(error as Error, {
        component: 'CompressionService',
        method: 'compressTransaction'
      });
      throw error;
    }
  }

  async decompressTransaction(compressed: string): Promise<Buffer> {
    try {
      const buffer = Buffer.from(decodeBase64(compressed));
      return await snappy.uncompress(buffer);
    } catch (error) {
      logError(error as Error, {
        component: 'CompressionService',
        method: 'decompressTransaction'
      });
      throw error;
    }
  }
}