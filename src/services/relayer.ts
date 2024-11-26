import { Transaction, Connection, PublicKey } from '@solana/web3.js';
import { scaleConfig } from '../config/scale';

const RELAYER_ENDPOINTS = [
  `https://rpc.helius.xyz/?api-key=${import.meta.env.VITE_HELIUS_API_KEY}`,
  // Add additional relayer endpoints for load balancing
];

let currentEndpointIndex = 0;
const failedEndpoints = new Set<number>();

const getNextEndpoint = () => {
  // Reset if all endpoints have failed
  if (failedEndpoints.size === RELAYER_ENDPOINTS.length) {
    failedEndpoints.clear();
  }

  // Find next working endpoint
  while (failedEndpoints.has(currentEndpointIndex)) {
    currentEndpointIndex = (currentEndpointIndex + 1) % RELAYER_ENDPOINTS.length;
  }

  return RELAYER_ENDPOINTS[currentEndpointIndex];
};

export const sendTransaction = async (
  transaction: Transaction,
  feePayer?: PublicKey
) => {
  const endpoint = getNextEndpoint();
  
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
    
    // Wait for confirmation
    const confirmation = await connection.confirmTransaction(signature);
    if (confirmation.value.err) {
      throw new Error(`Transaction failed: ${confirmation.value.err}`);
    }

    return signature;
  } catch (error) {
    // Mark endpoint as failed
    failedEndpoints.add(currentEndpointIndex);
    currentEndpointIndex = (currentEndpointIndex + 1) % RELAYER_ENDPOINTS.length;

    console.error('Transaction relay failed:', error);
    throw error;
  }
};