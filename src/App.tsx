import { FC, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { WalletContextProvider } from './components/WalletContextProvider';
import { AudioProvider } from './contexts/AudioContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ScrollToTop } from './components/ScrollToTop';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FloatingControls } from './components/FloatingControls';
import { useScrollEffect } from './hooks/useScrollEffect';
import { checkEnvVariables } from './utils/env';

// Route components
import { HomePage } from './components/HomePage/HomePage';
import { Gallery } from './components/Gallery';
import { Info } from './components/InfoPage/Info';
import { Settings } from './components/Settings';
import { Raid } from './components/Raid';
import { NFTBuilder } from './components/NFTBuilder';
import { AdminPanel } from './components/Admin';
import { RaidLeaderboards } from './components/RaidLeaderboards';
import { Guild } from './components/Guild';
import { RaidProfile } from './components/RaidProfile';
import { SubmissionsAdmin } from './components/Admin/SubmissionsAdmin';

import '@solana/wallet-adapter-react-ui/styles.css';

const AppContent: FC = () => {
  const { getParallaxStyle } = useScrollEffect();

  return (
    <div className="min-h-screen bg-gradient-to-b from-sand-50 to-sand-100 dark:from-background-900 dark:to-background-950">
      
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-30 dark:opacity-30
          [background-image:linear-gradient(rgba(249,115,22,0.3)_1px,transparent_1px),linear-gradient(to_right,rgba(249,115,22,0.3)_1px,transparent_1px)]
          dark:[background-image:linear-gradient(rgba(249,115,22,0.5)_1px,transparent_1px),linear-gradient(to_right,rgba(249,115,22,0.5)_1px,transparent_1px)]
          [background-size:50px_50px]
          [filter:drop-shadow(0_0_10px_rgba(249,115,22,0.2))]
          dark:[filter:drop-shadow(0_0_15px_rgba(249,115,22,0.3))]"
          style={getParallaxStyle(0.02)}>
        </div>
      </div>

      {/* App Container */}
      <div className="relative flex flex-col min-h-screen pt-[var(--header-height)] bg-white/30 dark:bg-black/30">
        <Header />
        <ScrollToTop />
        
        {/* Main Content Container */}
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
          {/* Content box with glass effect */}
          <div className="glass-panel rounded-3xl overflow-hidden bg-white/15 dark:bg-black/15 backdrop-blur-sm 
               border border-primary-500/30 dark:border-primary-500/20
               shadow-[0_0_15px_rgba(249,115,22,0.1)] dark:shadow-[0_0_20px_rgba(249,115,22,0.15)]">
            <div className="section-background" />
            <div className="p-6 sm:p-8 relative z-10">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/info" element={<Info />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/raid" element={<Raid />} />
                <Route path="/nft-builder" element={<NFTBuilder />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/admin/subs" element={<SubmissionsAdmin />} />
                <Route path="/leaderboards" element={<RaidLeaderboards />} />
                <Route path="/guild" element={<Guild />} />
                <Route path="/profile" element={<RaidProfile />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </div>
        </main>

        <Footer />
        <FloatingControls />
      </div>
    </div>
  );
};

export const App: FC = () => {
  useEffect(() => {
    // Check environment variables on app startup
    const envVars = checkEnvVariables();
    
    // Log environment status
    console.log('Environment Status:', {
      supabase: envVars.SUPABASE_URL && envVars.SUPABASE_KEY ? 'configured' : 'missing',
      solana: envVars.SOLANA_RPC && envVars.SOLANA_NETWORK ? 'configured' : 'missing',
      helius: envVars.HELIUS_API_KEY ? 'configured' : 'missing'
    });
  }, []);

  return (
    <ErrorBoundary>
      <WalletContextProvider>
        <AuthProvider>
          <ThemeProvider>
            <AudioProvider>
              <AppContent />
            </AudioProvider>
          </ThemeProvider>
        </AuthProvider>
      </WalletContextProvider>
    </ErrorBoundary>
  );
};