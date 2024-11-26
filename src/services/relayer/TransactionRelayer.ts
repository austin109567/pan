import { Transaction, Connection, PublicKey } from '@solana/web3.js';
import { scaleConfig } from '../../config/scale';
import { logError } from '../../config/monitoring';
import { Cache } from '../../utils/cache';

export class TransactionRelayer {
  private static instance: TransactionRelayer;
  private endpoints: string[];
  private currentEndpoint: number;
  private cache: Cache;
  private failedEndpoints: Set<number>;

  private constructor() {
    this.endpoints = [
      `https://rpc.helius.xyz/?api-key=${import.meta.env.VITE_HELIUS_API_KEY}`,
      // Add additional relayer endpoints for load balancing
    ];
    this.currentEndpoint = 0;
    this.cache = Cache.getInstance();
    this.failedEndpoints = new Set();
  }

  static getInstance(): TransactionRelayer {
    if (!TransactionRelayer.instance) {
      TransactionRelayer.instance = new TransactionRelayer();
    }
    return TransactionRelayer.instance;
  }

  private getNextEndpoint(): string {
    // Reset if all endpoints have failed
    if (this.failedEndpoints.size === this.endpoints.length) {
      this.failedEndpoints.clear();
    }

    // Find next working endpoint
    while (this.failedEndpoints.has(this.currentEndpoint)) {
      this.currentEndpoint = (this.currentEndpoint + 1) % this.endpoints.length;
    }

    return this.endpoints[this.currentEndpoint];
  }

  async sendTransaction(transaction: Transaction, feePayer?: PublicKey): Promise<string> {
    const endpoint = this.getNextEndpoint();
    
    try {
      const connection = new Connection(endpoint);
      
      // If no fee payer provided, use relayer's
      if (!feePayer) {
        const response = await fetch(`${endpoint}/relayer/feePayer`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        const { publicKey } = await response.json();
        feePayer = new PublicKey(publicKey);
      }

      // Set fee payer and recent blockhash
      transaction.feePayer = feePayer;
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;

      // Send to relayer
      const serializedTx = transaction.serialize().toString('base64');
      const response = await fetch(`${endpoint}/relayer/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transaction: serializedTx })
      });

      if (!response.ok) {
        throw new Error(`Relayer error: ${response.statusText}`);
      }

      const { signature } = await response.json();
      
      // Wait for confirmation with retry logic
      let retries = 3;
      while (retries > 0) {
        try {
          const confirmation = await connection.confirmTransaction(signature);
          if (confirmation.value.err) {
            throw new Error(`Transaction failed: ${confirmation.value.err}`);
          }
          return signature;
        } catch (error) {
          retries--;
          if (retries === 0) throw error;
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      throw new Error('Transaction confirmation failed after retries');
    } catch (error) {
      // Mark endpoint as failed
      this.failedEndpoints.add(this.currentEndpoint);
      this.currentEndpoint = (this.currentEndpoint + 1) % this.endpoints.length;

      logError(error as Error, {
        component: 'TransactionRelayer',
        method: 'sendTransaction',
        endpoint
      });
      throw error;
    }
  }

  async getTransactionStatus(signature: string): Promise<'success' | 'failed' | 'pending'> {
    const endpoint = this.getNextEndpoint();
    
    try {
      const connection = new Connection(endpoint);
      const status = await connection.getSignatureStatus(signature);
      
      if (!status || !status.value) return 'pending';
      if (status.value.err) return 'failed';
      return 'success';
    } catch (error) {
      logError(error as Error, {
        component: 'TransactionRelayer',
        method: 'getTransactionStatus',
        signature
      });
      return 'pending';
    }
  }
}