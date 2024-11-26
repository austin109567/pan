import { FC, useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { guildService } from '../../services/guildService';
import { Guild } from '../../types/guild';
import { AddGuildModal } from '../Admin/AddGuildModal';
import { Plus, Users, Star, Shield } from 'lucide-react';

interface GuildManagementProps {
  wallet: string;
}

export const GuildManagement: FC<GuildManagementProps> = ({ wallet }) => {
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGuilds = () => {
      try {
        const userGuilds = guildService.getCommunityGuilds()
          .filter(guild => guild.leaders?.includes(wallet));
        setGuilds(userGuilds);
      } catch (error) {
        console.error('Failed to load guilds:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGuilds();
    guildService.addListener(loadGuilds);

    return () => {
      guildService.removeListener(loadGuilds);
    };
  }, [wallet]);

  const handleAddGuild = (formData: {
    name: string;
    description: string;
    imageUrl?: string;
    archetype: any;
  }) => {
    const newGuild = guildService.createGuild({
      ...formData,
      leaders: [wallet],
      isCore: false
    });

    if (newGuild) {
      setShowAddModal(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-main"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Manage Your Guilds</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-main text-white rounded-lg hover:bg-primary-main/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create New Guild
        </button>
      </div>

      {guilds.length > 0 ? (
        <div className="space-y-4">
          {guilds.map((guild) => (
            <div
              key={guild.id}
              className="gradient-box p-6 hover:border-primary-main/40 transition-all"
            >
              <div className="flex items-center gap-6">
                {/* Guild Image */}
                <div className="w-16 h-16 rounded-lg overflow-hidden border border-primary-main/20">
                  {guild.imageUrl ? (
                    <img
                      src={guild.imageUrl}
                      alt={guild.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary-main/10 flex items-center justify-center">
                      <Shield className="w-8 h-8 text-primary-main" />
                    </div>
                  )}
                </div>

                {/* Guild Info */}
                <div className="flex-grow min-w-0">
                  <h3 className="text-lg font-medium text-white mb-2">{guild.name}</h3>
                  <p className="text-base text-text-light-secondary dark:text-text-dark-secondary leading-relaxed line-clamp-2">
                    {guild.description}
                  </p>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary-main" />
                    <span className="text-white">{guild.members?.length || 0} Members</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-primary-main" />
                    <span className="text-white">{guild.totalXp.toLocaleString()} XP</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-text-light-secondary dark:text-text-dark-secondary">
          You are not managing any guilds yet
        </div>
      )}

      {showAddModal && (
        <AddGuildModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddGuild}
        />
      )}
    </div>
  );
};