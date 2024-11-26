import { FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { ConnectPrompt } from '../ConnectPrompt';
import { GuildList } from './GuildList';
import { MyGuild } from './MyGuild';
import { GuildManagement } from './GuildManagement';
import { Archetypes } from './Archetypes';
import { guildService } from '../../services/guildService';
import { playerService } from '../../services/playerService';
import { ContentBox } from '../ContentBox';
import { GlassPanel } from '../GlassPanel';

export const Guild: FC = () => {
  const { connected, publicKey } = useWallet();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'archetypes' | 'all-guilds' | 'my-guild' | 'manage'>('archetypes');
  const [isGuildLeader, setIsGuildLeader] = useState(false);
  const [playerGuildId, setPlayerGuildId] = useState<string | null>(null);

  useEffect(() => {
    if (publicKey) {
      const player = playerService.getPlayer(publicKey.toString());
      setPlayerGuildId(player?.guild || null);
      setIsGuildLeader(guildService.isGuildLeader(publicKey.toString()));
    }
  }, [publicKey]);

  if (!connected) {
    return <ConnectPrompt />;
  }

  return (
    <div className="space-y-8">
      <ContentBox title="Guild System">
        <p className="text-text-light-secondary dark:text-text-dark-secondary mb-6">
          Join a guild and compete with other raiders
        </p>

        {/* Tab Selection */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab('archetypes')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'archetypes'
                ? 'bg-primary-main text-white shadow-glow'
                : 'bg-primary-main/20 text-text-light-primary dark:text-white hover:bg-primary-main/30'
            }`}
          >
            Archetypes
          </button>

          <button
            onClick={() => setActiveTab('all-guilds')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'all-guilds'
                ? 'bg-primary-main text-white shadow-glow'
                : 'bg-primary-main/20 text-text-light-primary dark:text-white hover:bg-primary-main/30'
            }`}
          >
            All Guilds
          </button>

          <button
            onClick={() => setActiveTab('my-guild')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'my-guild'
                ? 'bg-primary-main text-white shadow-glow'
                : 'bg-primary-main/20 text-text-light-primary dark:text-white hover:bg-primary-main/30'
            }`}
          >
            My Guild
          </button>

          {isGuildLeader && (
            <button
              onClick={() => setActiveTab('manage')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'manage'
                  ? 'bg-primary-main text-white shadow-glow'
                  : 'bg-primary-main/20 text-text-light-primary dark:text-white hover:bg-primary-main/30'
              }`}
            >
              Manage Guild
            </button>
          )}
        </div>

        {/* Content */}
        <GlassPanel>
          {activeTab === 'archetypes' && <Archetypes />}
          {activeTab === 'all-guilds' && <GuildList />}
          {activeTab === 'my-guild' && (
            <MyGuild 
              onBrowseGuilds={() => setActiveTab('all-guilds')} 
            />
          )}
          {activeTab === 'manage' && isGuildLeader && publicKey && (
            <GuildManagement wallet={publicKey.toString()} />
          )}
        </GlassPanel>
      </ContentBox>
    </div>
  );
};