import { FC, useEffect, useState } from 'react';
import { X, User, Star } from 'lucide-react';
import { guildService } from '../../services/guildService';
import { GuildMember } from '../../types/guild';
import { LevelDisplay } from '../LevelDisplay';

interface GuildMembersModalProps {
  guildId: string;
  onClose: () => void;
}

export const GuildMembersModal: FC<GuildMembersModalProps> = ({ guildId, onClose }) => {
  const [members, setMembers] = useState<GuildMember[]>([]);
  const [loading, setLoading] = useState(true);
  const guild = guildService.getGuildById(guildId);

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const guildMembers = await guildService.getGuildMembers(guildId);
        setMembers(guildMembers);
      } catch (error) {
        console.error('Failed to load guild members:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMembers();
  }, [guildId]);

  if (!guild) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-3xl bg-[#1A1B23] rounded-xl border border-primary-main/20 shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-primary-main/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg overflow-hidden border border-primary-main/20">
              {guild.imageUrl ? (
                <img
                  src={guild.imageUrl}
                  alt={guild.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-primary-main/10 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary-main" />
                </div>
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{guild.name}</h3>
              <p className="text-sm text-neutral-lightGray">{members.length} Members</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-lightGray hover:text-white transition-colors rounded-lg hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Member List */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-main"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {members.map((member) => (
                <div
                  key={member.wallet}
                  className="flex items-center gap-4 p-4 bg-black/40 rounded-lg border border-primary-main/20"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-primary-main/20">
                    {member.profilePicture ? (
                      <img
                        src={member.profilePicture}
                        alt={member.username || 'Member'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary-main/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary-main" />
                      </div>
                    )}
                  </div>

                  <div className="flex-grow min-w-0">
                    <h4 className="text-white font-medium truncate">
                      {member.username || `${member.wallet.slice(0, 4)}...${member.wallet.slice(-4)}`}
                    </h4>
                  </div>

                  <div className="flex items-center gap-4">
                    <LevelDisplay xp={member.xp} size="sm" />
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-primary-main" />
                      <span className="text-white">{member.xp.toLocaleString()} XP</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};