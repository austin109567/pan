import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import bs58 from 'bs58';
import { playerService } from '../services/playerService';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  isAuthenticated: boolean;
  userId: string | null;
  isLoading: boolean;
  isAdmin: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { publicKey, signMessage, disconnect } = useWallet();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is admin
  useEffect(() => {
    if (publicKey) {
      const adminWallet = import.meta.env.VITE_ADMIN_WALLET_ADDRESS;
      setIsAdmin(publicKey.toString() === adminWallet);
    } else {
      setIsAdmin(false);
    }
  }, [publicKey]);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const isAuthed = !!session && !!publicKey;
        console.log('Session check:', { session, publicKey: publicKey?.toString(), isAuthed });
        setIsAuthenticated(isAuthed);
        setUserId(session?.user?.id || null);
      } catch (error) {
        console.error('Session check error:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const isAuthed = !!session && !!publicKey;
      console.log('Auth state change:', { event, session, publicKey: publicKey?.toString(), isAuthed });
      setIsAuthenticated(isAuthed);
      setUserId(session?.user?.id || null);
    });

    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [publicKey]);

  const signIn = async () => {
    if (!publicKey || !signMessage) {
      throw new Error('Wallet not connected');
    }

    try {
      setIsLoading(true);
      const message = new TextEncoder().encode('Sign in to RaidRally');
      const signature = await signMessage(message);
      const signatureBase58 = bs58.encode(signature);
      const publicKeyBase58 = publicKey.toBase58();
      const email = `${publicKeyBase58}@raidrally.io`;

      console.log('Starting authentication...', { publicKeyBase58 });

      // Try to sign in with existing session first
      const { data: { session: existingSession } } = await supabase.auth.getSession();

      if (existingSession) {
        console.log('Using existing session:', existingSession);
        setIsAuthenticated(true);
        setUserId(existingSession.user?.id || null);
        return;
      }

      // Try to sign in directly first
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: signatureBase58.slice(0, 72)
      });

      if (!signInError && signInData.session) {
        console.log('Successfully signed in with existing credentials');
        setIsAuthenticated(true);
        setUserId(signInData.session.user.id);
        return;
      }

      // If sign in failed, try to create new user
      console.log('Creating new user...');
      const { data: { user }, error: createError } = await supabase.auth.admin.createUser({
        email,
        password: signatureBase58.slice(0, 72),
        email_confirm: true,
        user_metadata: { wallet_address: publicKeyBase58 }
      });

      if (createError) {
        // If user already exists but we couldn't sign in, there might be an issue with the password
        if (createError.message.includes('already been registered')) {
          console.log('User exists but password may be different, updating password...');
          const { error: updateError } = await supabase.auth.admin.updateUserById(
            existingUser?.id || '',
            { password: signatureBase58.slice(0, 72) }
          );
          if (updateError) throw updateError;
        } else {
          throw createError;
        }
      }

      // Try signing in again after user creation or password update
      const { data: { session }, error: finalSignInError } = await supabase.auth.signInWithPassword({
        email,
        password: signatureBase58.slice(0, 72)
      });

      if (finalSignInError) throw finalSignInError;

      if (!session) {
        throw new Error('Failed to create session');
      }

      console.log('Session established:', session);
      setIsAuthenticated(true);
      setUserId(session.user.id);

      // Create or update player record
      try {
        await playerService.createOrUpdatePlayer({
          walletAddress: publicKeyBase58,
          userId: session.user.id
        });
      } catch (error) {
        console.error('Error updating player:', error);
      }

    } catch (error) {
      console.error('Authentication failed:', error);
      setIsAuthenticated(false);
      setUserId(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      await disconnect();
      setIsAuthenticated(false);
      setUserId(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, isLoading, isAdmin, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};