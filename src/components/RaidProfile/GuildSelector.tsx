import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { playerService } from '../../services/playerService';
import { CORE_GUILDS } from '../../types/guild';

interface GuildSelectorProps {
  wallet: string;
}

export const GuildSelector: FC<GuildSelectorProps> = ({ wallet }) => {
  const navigate = useNavigate();
  const player = playerService.getPlayer(wallet);
  const hasArchetype = player?.archetype !== null;

  return (
    <div className="gradient-box p-6">
      {hasArchetype ? (
        <div className="text-center">
          <h3 className="text-xl font-bold text-white mb-4">
            Your Archetype: {player?.archetype}
          </h3>
          <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-primary-main mb-6">
            <img
              src={CORE_GUILDS.find(g => g.archetype === player?.archetype)?.imageUrl}
              alt={player?.archetype}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-neutral-lightGray">
            {CORE_GUILDS.find(g => g.archetype === player?.archetype)?.description}
          </p>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-text-light-secondary dark:text-neutral-lightGray mb-4">
            Choose your archetype to begin your journey
          </p>
          <button
            onClick={() => navigate('/profile/pack')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary-main text-white rounded-xl text-lg font-semibold transition-all transform hover:scale-105 hover:bg-primary-main/90 shadow-glow"
          >
            Choose Your Panda Pack
          </button>
        </div>
      )}
    </div>
  );
};