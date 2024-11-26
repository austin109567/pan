import { FC, useState } from 'react';
import { Users, X, Star, Crown } from 'lucide-react';
import { GuildQuestions } from './GuildQuestions';
import { Guild } from '../../types/guild';
import { playerService } from '../../services/playerService';
import { guildService } from '../../services/guildService';

interface GuildInfoModalProps {
  guild: Guild;
  onClose: () => void;
}

const GuildInfoModal: FC<GuildInfoModalProps> = ({ guild, onClose }) => {
  const members = guildService.getGuildMembers(guild.id);
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-neutral-charcoal/90 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl bg-[#1A1B23] rounded-xl border border-primary-pink/20 shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-primary-pink/20">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg overflow-hidden border border-primary-pink/20">
              <img
                src={guild.imageUrl}
                alt={guild.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{guild.name}</h3>
              <p className="text-sm text-neutral-lightGray">
                {members.length} Members
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-lightGray hover:text-white transition-colors rounded-lg hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <p className="text-neutral-lightGray">{guild.description}</p>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Top Members</h4>
            <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar">
              {members.slice(0, 5).map((member, index) => (
                <div
                  key={member.wallet}
                  className="flex items-center gap-4 p-4 bg-black/40 rounded-lg border border-primary-pink/20"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-primary-pink/20">
                    {member.profilePicture ? (
                      <img
                        src={member.profilePicture}
                        alt={member.username || 'Member'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src="/assets/defaultpfp.png"
                        alt="Default Profile"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">
                      {member.username || `${member.wallet.slice(0, 4)}...${member.wallet.slice(-4)}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-primary-pink" />
                    <span className="text-primary-pink">
                      {member.experience.toLocaleString()} XP
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface GuildSelectorProps {
  wallet: string;
}

export const GuildSelector: FC<GuildSelectorProps> = ({ wallet }) => {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [showGuildInfo, setShowGuildInfo] = useState(false);
  const player = playerService.getPlayer(wallet);
  const guild = player?.guild ? guildService.getGuildById(player.guild) : null;

  const handleGuildAssigned = (assignedGuild: Guild) => {
    playerService.setGuild(wallet, assignedGuild.id);
    setShowQuestionnaire(false);
  };

  return (
    <div className="feature-box text-center">
      <div className="flex items-center justify-center gap-3 mb-6">
        <Users className="w-5 h-5 text-primary-pink" />
        <h2 className="text-xl font-bold text-text-light-primary dark:text-white">Panda Pack</h2>
      </div>

      <div>
        {guild ? (
          <button
            onClick={() => setShowGuildInfo(true)}
            className="w-full flex flex-col items-center gap-4 hover:bg-primary-pink/5 p-4 rounded-xl transition-colors"
          >
            <div className="w-24 h-24 rounded-lg overflow-hidden border border-primary-pink/20">
              <img
                src={guild.imageUrl}
                alt={guild.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-primary-pink/10 rounded-full">
                  <Crown className="w-4 h-4 text-primary-pink" />
                  <span className="text-sm text-primary-pink font-medium">
                    Guild Member #{guildService.getGuildMembers(guild.id).findIndex(m => m.wallet === wallet) + 1} of {guildService.getGuildMembers(guild.id).length}
                  </span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-text-light-primary dark:text-white mb-1">
                {guild.name}
              </h3>
              <p className="text-sm text-text-light-secondary dark:text-neutral-lightGray">
                {guild.description}
              </p>
            </div>
          </button>
        ) : (
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              {playerRank && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-primary-pink/10 rounded-full">
                  <Crown className="w-4 h-4 text-primary-pink" />
                  <span className="text-sm text-primary-pink font-medium">
                    Rank #{playerRank.rank} of {playerRank.totalMembers}
                  </span>
                </div>
              )}
            </div>
            <p className="text-text-light-secondary dark:text-neutral-lightGray mb-4">
              Join a Panda Pack to unlock exclusive rewards and community features
            </p>
            <button
              onClick={() => setShowQuestionnaire(true)}
              className="px-6 py-3 bg-primary-pink text-white rounded-lg hover:bg-primary-pink/90 transition-colors shadow-lg shadow-primary-pink/20"
            >
              Choose Your Panda Pack
            </button>
          </div>
        )}
      </div>

      {showQuestionnaire && !guild && (
        <GuildQuestions
          onComplete={handleGuildAssigned}
          onClose={() => setShowQuestionnaire(false)}
        />
      )}
      
      {showGuildInfo && guild && (
        <GuildInfoModal
          guild={guild}
          onClose={() => setShowGuildInfo(false)}
        />
      )}
    </div>
  );
};</content>