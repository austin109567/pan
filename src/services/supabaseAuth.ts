import { supabase } from './supabaseClient';
import { PublicKey } from '@solana/web3.js';
import bs58 from 'bs58';
import nacl from 'tweetnacl';
import { User } from '@supabase/supabase-js';

function generatePassword(signature: string): string {
  const encoder = new TextEncoder();
  const data = encoder.encode(signature);
  const hash = nacl.hash(data);
  return bs58.encode(hash).slice(0, 32);
}

// Handle rate limit with exponential backoff
async function handleRateLimit(error: any, attempt = 1): Promise<void> {
  const maxAttempts = 3;
  const baseDelay = 2000; // Start with 2 seconds
  const maxDelay = 10000; // Max 10 seconds

  if (attempt > maxAttempts) {
    throw new Error('Maximum retry attempts reached');
  }

  const delay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay);
  console.log(`Rate limited. Waiting ${delay/1000} seconds before retry...`);
  await new Promise(resolve => setTimeout(resolve, delay));
}

export async function signInWithWallet(wallet: string, signature: string, retryCount = 0): Promise<boolean> {
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 1000;

  try {
    console.log('Starting wallet sign in process...', { wallet, retryCount });

    // Check for existing session first
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      console.log('User already has an active session');
      return true;
    }

    // Verify signature
    try {
      console.log('Verifying Solana wallet signature...');
      const message = `Welcome to Pan Da Pan!\n\nPlease sign this message to verify your wallet ownership.\n\nWallet: ${wallet}`;
      const messageBytes = new TextEncoder().encode(message);
      const signatureBytes = bs58.decode(signature);
      const publicKeyBytes = new PublicKey(wallet).toBytes();

      const verified = nacl.sign.detached.verify(
        messageBytes,
        signatureBytes,
        publicKeyBytes
      );

      if (!verified) {
        throw new Error('Invalid signature');
      }
      console.log('Signature verified successfully');
    } catch (error) {
      console.error('Signature verification failed:', error);
      throw new Error('Signature verification failed');
    }

    const email = `${wallet.toLowerCase()}@pandapan.com`;
    const password = generatePassword(signature);

    // First try to sign up the user
    try {
      console.log('Attempting to create account...');
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { wallet_address: wallet },
          emailRedirectTo: window.location.origin
        }
      });

      if (signUpData.session) {
        console.log('Sign up successful');
        return true;
      }

      // If user exists, try to sign in
      if (signUpError?.message?.includes('User already registered')) {
        console.log('User exists, attempting sign in...');
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInData.session) {
          console.log('Sign in successful');
          return true;
        }

        if (signInError) {
          // If we get a rate limit error, wait and retry
          if (signInError.message.toLowerCase().includes('rate limit') && retryCount < MAX_RETRIES) {
            console.log(`Rate limited. Waiting ${RETRY_DELAY * Math.pow(2, retryCount)}ms before retry...`);
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * Math.pow(2, retryCount)));
            return signInWithWallet(wallet, signature, retryCount + 1);
          }

          // If we get an email confirmation error, try admin sign in
          if (signInError.message.includes('Email not confirmed')) {
            console.log('Email not confirmed, attempting alternative sign in...');
            try {
              // Try one more time with a delay
              await new Promise(resolve => setTimeout(resolve, 1000));
              const { data: finalData, error: finalError } = await supabase.auth.signInWithPassword({
                email,
                password,
              });

              if (finalData.session) {
                console.log('Alternative sign in successful');
                return true;
              }

              if (finalError) {
                console.error('Alternative sign in failed:', finalError);
                throw finalError;
              }
            } catch (error) {
              console.error('Alternative sign in failed:', error);
              throw error;
            }
          }

          throw signInError;
        }
      }

      // If we get here with a sign up error, throw it
      if (signUpError) {
        throw signUpError;
      }
    } catch (error: any) {
      // Final retry attempt for any error
      if (retryCount < MAX_RETRIES) {
        console.log(`Retrying authentication (attempt ${retryCount + 1}/${MAX_RETRIES})...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * Math.pow(2, retryCount)));
        return signInWithWallet(wallet, signature, retryCount + 1);
      }
      throw error;
    }

    return false;
  } catch (error) {
    console.error('Authentication failed:', error);
    throw error;
  }
}

export async function signOut(): Promise<void> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

export async function getUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export function onAuthStateChange(callback: (user: User | null) => void) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });
}
