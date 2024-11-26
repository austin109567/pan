import { FC, useState, useEffect } from 'react';
import { Shield, Star, Users, TrendingUp, Search } from 'lucide-react';
import { guildService } from '../../services/guildService';
import { playerService } from '../../services/playerService';
import { Guild } from '../../types/guild';
import { GuildJoinModal } from './GuildJoinModal';
import { useWallet } from '@solana/wallet-adapter-react';
import { useNavigate } from 'react-router-dom';

type SortOption = 'xp' | 'members' | 'activity';

export const GuildList: FC = () => {
  const { publicKey } = useWallet();
  const navigate = useNavigate();
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [selectedGuild, setSelectedGuild] = useState<Guild | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('xp');
  const [searchQuery, setSearchQuery] = useState('');
  const [playerGuildId, setPlayerGuildId] = useState<string | null>(null);

  useEffect(() => {
    const loadGuilds = async () => {
      try {
        const communityGuilds = guildService.getCommunityGuilds();
        setGuilds(communityGuilds);
        
        // Get player's current guild
        if (publicKey) {
          const player = await playerService.getPlayer(publicKey.toString());
          setPlayerGuildId(player?.guild || null);
        }
      } catch (error) {
        console.error('Failed to load guilds:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGuilds();
    guildService.addListener(loadGuilds);
    playerService.addEventListener(loadGuilds);

    return () => {
      guildService.removeListener(loadGuilds);
      playerService.removeEventListener(loadGuilds);
    };
  }, [publicKey]);

  const handleRequestSubmitted = () => {
    setSelectedGuild(null);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleMyGuildClick = () => {
    navigate('/guild?tab=my-guild');
  };

  const sortGuilds = (guilds: Guild[]) => {
    const filteredGuilds = guilds.filter(guild =>
      guild.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guild.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return filteredGuilds.sort((a, b) => {
      switch (sortBy) {
        case 'xp':
          return b.totalXp - a.totalXp;
        case 'members':
          return (b.members?.length || 0) - (a.members?.length || 0);
        case 'activity':
          return b.totalXp - a.totalXp;
        default:
          return 0;
      }
    });
  };

  const sortedGuilds = sortGuilds(guilds);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-main"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Guild Features Section */}
      <div className="bg-black/30 p-6 rounded-xl border border-primary-main/20 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-primary-main">Guild Community Hub</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <Users className="text-primary-main" />
            <div>
              <h3 className="font-semibold">Guild Chat & Team Coordination</h3>
              <p className="text-sm text-neutral-lightGray">Real-time communication and team planning</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <TrendingUp className="text-primary-main" />
            <div>
              <h3 className="font-semibold">Guild Rankings & Raids</h3>
              <p className="text-sm text-neutral-lightGray">Compete in rankings and join epic raids</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Shield className="text-primary-main" />
            <div>
              <h3 className="font-semibold">Guild Treasury & Rewards</h3>
              <p className="text-sm text-neutral-lightGray">Shared resources and team achievements</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guilds..."
            className="w-full px-4 py-2 pl-10 bg-black/40 border border-primary-main/20 rounded-lg text-white placeholder-neutral-lightGray focus:outline-none focus:border-primary-main/40"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-lightGray" />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setSortBy('xp')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              sortBy === 'xp'
                ? 'bg-primary-main text-white'
                : 'bg-primary-main/20 text-neutral-lightGray hover:bg-primary-main/30'
            }`}
          >
            Total XP
          </button>
          <button
            onClick={() => setSortBy('members')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              sortBy === 'members'
                ? 'bg-primary-main text-white'
                : 'bg-primary-main/20 text-neutral-lightGray hover:bg-primary-main/30'
            }`}
          >
            Members
          </button>
          <button
            onClick={() => setSortBy('activity')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              sortBy === 'activity'
                ? 'bg-primary-main text-white'
                : 'bg-primary-main/20 text-neutral-lightGray hover:bg-primary-main/30'
            }`}
          >
            Activity
          </button>
        </div>
      </div>

      {/* Guild Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Example Guilds</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedGuilds.map((guild) => (
            <div
              key={guild.id}
              onClick={() => setSelectedGuild(guild)}
              className="bg-black/40 border border-primary-main/20 rounded-lg p-4 cursor-pointer hover:border-primary-main/40 transition-all duration-200 transform hover:scale-[1.02] max-w-[280px]"
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
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary-main" />
                    <span className="text-white">Level {Math.floor(guild.totalXp / 1000)}</span>
                  </div>
                </div>

                {/* Join/My Guild Button */}
                {guild.id === playerGuildId ? (
                  <button
                    onClick={handleMyGuildClick}
                    className="px-6 py-2 bg-primary-main/20 text-primary-main rounded-lg hover:bg-primary-main/30 transition-colors shadow-glow whitespace-nowrap"
                  >
                    My Guild
                  </button>
                ) : !playerGuildId && (
                  <button
                    onClick={() => setSelectedGuild(guild)}
                    className="px-6 py-2 bg-primary-main text-white rounded-lg hover:bg-primary-main/90 transition-colors shadow-glow whitespace-nowrap"
                  >
                    Request to Join
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {sortedGuilds.length === 0 && (
        <div className="text-center py-8 text-text-light-secondary dark:text-text-dark-secondary">
          No guilds found
        </div>
      )}

      {selectedGuild && (
        <GuildJoinModal
          guild={selectedGuild}
          onClose={() => setSelectedGuild(null)}
          onSubmitted={handleRequestSubmitted}
        />
      )}

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed bottom-4 right-4 px-6 py-3 bg-green-500 text-white rounded-lg shadow-lg animate-fade-in">
          Request submitted successfully!
        </div>
      )}
    </div>
  );
};