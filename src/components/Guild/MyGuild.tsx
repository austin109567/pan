import { FC, useState, useEffect } from 'react';
import { Trophy, Star, Users, Crown, Shield, TrendingUp } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { guildService } from '../../services/guildService';
import { playerService } from '../../services/playerService';
import { calculateLevel } from '../../utils/levelCalculator';
import { ProfilePicture } from '../ProfilePicture';
import { Guild } from '../../types/guild';

interface MyGuildProps {
  onBrowseGuilds: () => void;
}

export const MyGuild: FC<MyGuildProps> = ({ onBrowseGuilds }) => {
  const { publicKey } = useWallet();
  const [guild, setGuild] = useState<Guild | null>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadGuildData = async () => {
      if (!publicKey) return;

      setIsLoading(true);
      try {
        const player = playerService.getPlayer(publicKey.toString());
        if (player?.guild) {
          const playerGuild = guildService.getGuildById(player.guild);
          if (playerGuild) {
            setGuild(playerGuild);
            const guildMembers = guildService.getGuildMembers(playerGuild.id);
            setMembers(guildMembers);
          }
        }
      } catch (error) {
        console.error('Error loading guild data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadGuildData();

    // Set up interval to refresh data
    const interval = setInterval(loadGuildData, 5000);

    return () => clearInterval(interval);
  }, [publicKey]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-main"></div>
      </div>
    );
  }

  if (!publicKey) return null;

  const player = playerService.getPlayer(publicKey.toString());
  if (!player?.guild || !guild) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-white mb-4">No Guild</h3>
        <p className="text-text-light-secondary dark:text-text-dark-secondary mb-6">
          You are not currently a member of any guild.
        </p>
        <button
          onClick={onBrowseGuilds}
          className="px-6 py-3 bg-primary-main text-white rounded-lg hover:bg-primary-main/90 transition-colors shadow-glow"
        >
          Browse Guilds
        </button>
      </div>
    );
  }

  const totalXp = members.reduce((sum, member) => {
    const player = playerService.getPlayer(member.wallet_address);
    return sum + (player?.xp || 0);
  }, 0);

  const averageLevel = Math.floor(
    members.reduce((sum, member) => {
      const player = playerService.getPlayer(member.wallet_address);
      if (!player) return sum;
      const { level } = calculateLevel(player.xp);
      return sum + level;
    }, 0) / (members.length || 1)
  );

  const isGuildLeader = guild.leaders?.includes(publicKey.toString());

  return (
    <div className="space-y-8">
      {/* Guild Header */}
      <div className="flex flex-col md:flex-row items-start gap-6">
        <div className="w-32 h-32 rounded-lg overflow-hidden border border-primary-main/20 flex-shrink-0">
          {guild.imageUrl ? (
            <img
              src={guild.imageUrl}
              alt={guild.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-primary-main/10 flex items-center justify-center">
              <Shield className="w-12 h-12 text-primary-main" />
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-2xl font-bold text-white">{guild.name}</h2>
            {isGuildLeader && (
              <span className="px-2 py-1 bg-primary-main/20 text-primary-main text-sm rounded-full">
                Guild Leader
              </span>
            )}
          </div>
          <p className="text-text-light-secondary dark:text-text-dark-secondary mb-4">
            {guild.description}
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary-main" />
              <span className="text-white">{members.length} Members</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-primary-main" />
              <span className="text-white">{totalXp.toLocaleString()} XP</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary-main" />
              <span className="text-white">Average Level {averageLevel}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Member List */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Members</h3>
        <div className="space-y-4">
          {members.map(member => {
            const memberPlayer = playerService.getPlayer(member.wallet_address);
            if (!memberPlayer) return null;

            const { level } = calculateLevel(memberPlayer.xp);
            const isGuildLeader = guild.leaders?.includes(member.wallet_address);

            return (
              <div
                key={member.wallet_address}
                className="flex items-center gap-4 p-4 bg-black/40 rounded-lg border border-primary-main/20"
              >
                <ProfilePicture wallet={member.wallet_address} size="md" />
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-white font-medium truncate">
                      {memberPlayer.username || `${member.wallet_address.slice(0, 4)}...${member.wallet_address.slice(-4)}`}
                    </h4>
                    {isGuildLeader && (
                      <Crown className="w-4 h-4 text-primary-main" />
                    )}
                  </div>
                  <p className="text-sm text-neutral-lightGray">
                    Joined {new Date(memberPlayer.dateJoined).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-white">Level {level}</div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-primary-main" />
                    <span className="text-white">{memberPlayer.xp.toLocaleString()} XP</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};