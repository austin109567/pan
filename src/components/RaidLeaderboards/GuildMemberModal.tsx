import { FC } from 'react';
import { X, Star } from 'lucide-react';
import { Guild } from '../../types/guild';
import { guildService } from '../../services/guildService';
import { ProfilePicture } from '../ProfilePicture';

interface GuildMemberModalProps {
  guild: Guild;
  onClose: () => void;
}

export const GuildMemberModal: FC<GuildMemberModalProps> = ({ guild, onClose }) => {
  const members = guildService.getGuildMembers(guild.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-neutral-charcoal/90 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl bg-[#1A1B23] rounded-xl border border-primary-neonGreen/20 shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-primary-neonGreen/20">
          <div className="flex items-center gap-4">
            <img
              src={guild.imageUrl}
              alt={guild.name}
              className="w-12 h-12 rounded-lg"
            />
            <div>
              <h3 className="text-xl font-bold text-white">{guild.name}</h3>
              <p className="text-sm text-neutral-lightGray">
                {members.length} Members
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-lightGray hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
          <div className="space-y-4">
            {members.map((member, index) => (
              <div
                key={member.wallet}
                className="flex items-center gap-4 p-4 bg-black/40 rounded-lg border border-primary-neonGreen/20"
              >
                <div className="w-8 h-8 flex items-center justify-center text-primary-neonGreen font-mono">
                  #{index + 1}
                </div>
                <ProfilePicture wallet={member.wallet} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">
                    {member.username || `${member.wallet.slice(0, 4)}...${member.wallet.slice(-4)}`}
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="w-3 h-3 text-primary-neonGreen" />
                    <span className="text-primary-neonGreen">
                      {member.experience.toLocaleString()} XP
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};