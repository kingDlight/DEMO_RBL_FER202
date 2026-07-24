import { createContext, useContext } from 'react';
import { localMusicTracks, toPlayerTrack } from '../data/localMusic';

export type PlayerTrack = {
  id?: number | string;
  title: string;
  artist: string;
  album?: string;
  duration?: string;
  durationSeconds?: number;
  image: string;
  audioUrl?: string;
  lyrics?: { time: number; text: string }[];
  rawMetadata?: any;
};

export type PlaybackOptions = {
  elapsed?: string;
  progress?: number;
  volume?: number;
};

export type RepeatMode = 'off' | 'all' | 'one';

export type PlayerContextValue = {
  track: PlayerTrack;
  queue: PlayerTrack[];
  currentIndex: number;
  elapsed: string;
  durationStr: string;
  progress: number;
  volume: number;
  isPlaying: boolean;
  isLoading: boolean;
  hasActiveTrack: boolean;
  shuffle: boolean;
  repeat: RepeatMode;
  currentTime: number;
  playTrack: (track: PlayerTrack, options?: PlaybackOptions) => void;
  playQueue: (tracks: PlayerTrack[], startIndex?: number) => void;
  addToQueue: (track: PlayerTrack) => void;
  reorderQueue: (newQueue: PlayerTrack[], newCurrentIndex: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  togglePlay: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  setVolume: (volume: number) => void;
  seekTo: (percent: number) => void;
  analyserNode?: AnalyserNode;
  audioContext?: AudioContext;
  eqBands: number[];
  setEQBand: (index: number, value: number) => void;
  eqPreset: string;
  setEQPreset: (preset: string) => void;
  isEQEnabled: boolean;
  setIsEQEnabled: (enabled: boolean) => void;
  sleepTimeRemaining: number | null;
  setSleepTimer: (minutes: number | null) => void;
};

export const defaultPlayerTrack: PlayerTrack = {
  ...toPlayerTrack(localMusicTracks[0]),
};

export const clampPercent = (value: number) => Math.min(100, Math.max(0, value));

export const PlayerContext = createContext<PlayerContextValue | undefined>(undefined);

export const usePlayer = () => {
  const context = useContext(PlayerContext);

  if (!context) {
    throw new Error('usePlayer must be used within PlayerProvider');
  }

  return context;
};
