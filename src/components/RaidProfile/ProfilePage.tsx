import React, { FC, useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { playerService } from '../../services/playerService';
import { Player } from '../../types/Player';
import { ProfileUpload } from './ProfileUpload';
import { ContentBox } from '../ContentBox';
import { LevelDisplay } from '../LevelDisplay';

export const ProfilePage: FC = () => {
  const formatWalletAddress = (wallet: string | undefined | null) => {
    if (!wallet) return 'Not Connected';
    if (typeof wallet !== 'string') return 'Invalid Wallet';
    return `${wallet.slice(0, 4)}...${wallet.slice(-4)}`;
  };

  const { publicKey } = useWallet();
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshPlayerData = async () => {
    if (publicKey) {
      try {
        const updatedPlayer = await playerService.getPlayer(publicKey.toString());
        if (updatedPlayer) {
          setPlayer(updatedPlayer);
        }
      } catch (error) {
        console.error('Error refreshing player data:', error);
      }
    }
  };

  useEffect(() => {
    const loadPlayerData = async () => {
      if (publicKey) {
        try {
          const playerData = await playerService.getPlayer(publicKey.toString());
          setPlayer(playerData);
        } catch (error) {
          console.error('Error loading player data:', error);
        }
      }
      setLoading(false);
    };

    loadPlayerData();
  }, [publicKey]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!player || !publicKey) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          Profile Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-center">
          Please connect your wallet to view your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <ContentBox title="Raid Profile">
        <div className="flex flex-col md:flex-row items-start gap-8">
          {/* Profile Picture Section */}
          <div className="w-full md:w-1/3">
            <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
              <ProfileUpload
                currentImageUrl={player.profile_picture}
                walletAddress={player.wallet}
                onUploadSuccess={refreshPlayerData}
              />
            </div>
          </div>

          {/* Profile Info Section */}
          <div className="flex-1 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {player.username || formatWalletAddress(player.wallet)}
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                {formatWalletAddress(player.wallet)}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Stats */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Stats
                </h2>
                <div className="space-y-2">
                  <LevelDisplay xp={player.xp} />
                  <p>Quests Completed: {player.quests_completed}</p>
                  <p>Raid Bosses Defeated: {player.raid_bosses_defeated}</p>
                  <p>Total Raids: {player.total_raids_participated}</p>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Details
                </h2>
                <div className="space-y-2">
                  <p>Archetype: {player.archetype}</p>
                  <p>Member Since: {new Date(player.date_joined).toLocaleDateString()}</p>
                  <p>Last Active: {new Date(player.last_login).toLocaleDateString()}</p>
                  {player.discord_handle && (
                    <p>Discord: {player.discord_handle}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ContentBox>

      {/* Achievements Section */}
      <ContentBox title="Achievements">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {player.achievements && player.achievements.length > 0 ? (
            player.achievements.map((achievement, index) => (
              <div
                key={index}
                className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
              >
                <h3 className="font-semibold">{achievement}</h3>
              </div>
            ))
          ) : (
            <p className="col-span-3 text-center text-gray-500">
              No achievements yet. Complete quests and raids to earn achievements!
            </p>
          )}
        </div>
      </ContentBox>
    </div>
  );
};