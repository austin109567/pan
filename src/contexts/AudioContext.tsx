import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

interface AudioContextType {
  isPlaying: boolean;
  volume: number;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  hasScrolled: boolean;
  setHasScrolled: (hasScrolled: boolean) => void;
}

const AudioContext = createContext<AudioContextType>({
  isPlaying: false,
  volume: 0.5,
  togglePlay: () => {},
  setVolume: () => {},
  hasScrolled: false,
  setHasScrolled: () => {},
});

export const useAudio = () => useContext(AudioContext);

interface AudioProviderProps {
  children: React.ReactNode;
}

export const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(() => {
    return parseFloat(localStorage.getItem('audioVolume') || '0.1');
  });
  const [hasScrolled, setHasScrolled] = useState(false);
  const [hasPlayedBefore, setHasPlayedBefore] = useState(() => {
    return localStorage.getItem('hasPlayedBefore') === 'true';
  });

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio('/assets/music/music.mp3');
    audio.loop = true;
    audio.volume = volume;
    audioRef.current = audio;

    // Clean up on unmount
    return () => {
      if (audio) {
        audio.pause();
        audio.src = '';
      }
    };
  }, []);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      localStorage.setItem('audioVolume', volume.toString());
    }
  }, [volume]);

  // Handle visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!audioRef.current) return;

      if (document.hidden) {
        audioRef.current.pause();
      } else if (isPlaying) {
        audioRef.current.play().catch(console.error);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isPlaying]);

  // Handle scroll detection for first-time visitors
  useEffect(() => {
    if (!hasPlayedBefore && hasScrolled && !isPlaying && audioRef.current) {
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setHasPlayedBefore(true);
            localStorage.setItem('hasPlayedBefore', 'true');
          })
          .catch(error => {
            console.error('Auto-play error:', error);
            // Reset states if autoplay fails
            setIsPlaying(false);
            setHasPlayedBefore(false);
          });
      }
    }
  }, [hasScrolled, hasPlayedBefore, isPlaying]);

  // Update audio playback state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Playback error:', error);
          setIsPlaying(false);
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
  };

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        volume,
        togglePlay,
        setVolume: handleVolumeChange,
        hasScrolled,
        setHasScrolled,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};