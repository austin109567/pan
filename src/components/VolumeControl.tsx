import { FC } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useAudio } from '../contexts/AudioContext';

export const VolumeControl: FC = () => {
  const { volume, setVolume, isMuted, toggleMute } = useAudio();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 glass-panel p-2">
      <button
        onClick={toggleMute}
        className="p-2 hover:bg-primary-main/20 rounded-lg transition-colors"
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5 text-primary-main" />
        ) : (
          <Volume2 className="w-5 h-5 text-primary-main" />
        )}
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={(e) => setVolume(parseFloat(e.target.value))}
        className="w-24 h-1 bg-primary-main/30 rounded-lg appearance-none cursor-pointer 
          [&::-webkit-slider-thumb]:appearance-none 
          [&::-webkit-slider-thumb]:w-3 
          [&::-webkit-slider-thumb]:h-3 
          [&::-webkit-slider-thumb]:rounded-full 
          [&::-webkit-slider-thumb]:bg-primary-main
          [&::-webkit-slider-thumb]:hover:bg-primary-main/80
          [&::-webkit-slider-thumb]:transition-colors
          [&::-webkit-slider-thumb]:shadow-glow
          dark:[&::-webkit-slider-thumb]:shadow-glow-light"
      />
    </div>
  );
};