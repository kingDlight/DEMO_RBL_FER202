import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from 'react';
import {
  PlayerContext,
  clampPercent,
  defaultPlayerTrack,
  type PlaybackOptions,
  type PlayerTrack,
  type RepeatMode,
} from './player';
import { useUser } from './UserContext';
import { getAverageColor } from '../utils/colorExtractor';
import { fetchMetadataFromUrl } from '../utils/audioMetadata';
import { decodeFlacToAudioBuffer } from '../utils/flacDecoder';
import { audioBufferToWavBlob } from '../utils/audioBufferWav';

const AUDIO_URL = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

const blobUrlCache = new Map<string, string>();

export const PlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const [track, setTrack] = useState<PlayerTrack>(defaultPlayerTrack);
  const [queue, setQueue] = useState<PlayerTrack[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const trackRef = useRef(track);
  useEffect(() => {
    trackRef.current = track;
  }, [track]);
  
  const { addRecentlyPlayed } = useUser();
  const hasAddedToHistoryRef = useRef(false);

  const [elapsed, setElapsed] = useState('0:00');
  const [durationStr, setDurationStr] = useState('3:00');
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolumeState] = useState(80);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasActiveTrack, setHasActiveTrack] = useState(false);
  
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<RepeatMode>('all');
  
  const [sleepTimeRemaining, setSleepTimeRemaining] = useState<number | null>(null);
  const sleepTimerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  // Single Audio Engine
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const playbackSequenceRef = useRef(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const eqFiltersRef = useRef<BiquadFilterNode[]>([]);

  const [eqBands, setEQBandsState] = useState<number[]>(new Array(10).fill(0));
  const [eqPreset, setEQPreset] = useState<string>('Flat');
  const [isEQEnabled, setIsEQEnabled] = useState<boolean>(true);

  const getTrustedDuration = useCallback((activeAudio: HTMLAudioElement) => {
    let duration = activeAudio.duration;
    const currentTrack = trackRef.current;
    
    if (!Number.isFinite(duration) || duration <= 0) {
      if (currentTrack.durationSeconds) {
         duration = currentTrack.durationSeconds;
      } else if (currentTrack.duration) {
         const parts = currentTrack.duration.split(':');
         if (parts.length === 2) {
           duration = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
         }
      }
    }
    return duration;
  }, []);

  const loadAndPlayTrack = useCallback((nextTrack: PlayerTrack, nextIndex: number) => {
    playbackSequenceRef.current += 1;
    const currentSequence = playbackSequenceRef.current;

    const audio = audioRef.current;
    const gain = gainRef.current;

    if (!audio || !gain) return;

    hasAddedToHistoryRef.current = false;

    setTrack(nextTrack);
    setCurrentIndex(nextIndex);
    setIsLoading(true);
    setIsPlaying(false);
    setHasActiveTrack(true);

    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume().catch(console.error);
    }

    if (nextTrack.image) {
      getAverageColor(nextTrack.image).then(color => {
        document.documentElement.style.setProperty('--player-accent', color);
        document.documentElement.style.setProperty('--player-accent-soft', color.replace('rgb', 'rgba').replace(')', ', 0.2)'));
      });
    }

    const startPlayback = (audioSourceUrl: string) => {
      if (playbackSequenceRef.current !== currentSequence) {
        console.log(`[Audio] ❌ Sequence mismatch (Seq: ${currentSequence} vs Active: ${playbackSequenceRef.current}), aborting playback to prevent overlapping`);
        return; 
      }
      
      console.log(`[Audio] ▶️ Playing Track: ${nextTrack.title} (Seq: ${currentSequence})`);

      audio.removeAttribute('src');
      try { audio.load(); } catch (e) { /* ignore aborts */ }

      if (audioSourceUrl.startsWith('blob:')) {
        audio.removeAttribute('crossorigin');
      } else {
        audio.crossOrigin = 'anonymous';
      }
      
      audio.src = audioSourceUrl;
      audio.currentTime = 0;
      
      gain.gain.value = volume / 100;
      
      audio.play().then(() => {
        setIsLoading(false);
      }).catch((err) => {
        setIsLoading(false);
        if (err.name !== 'AbortError') console.error(err);
      });
    };

    const targetUrl = nextTrack.audioUrl || AUDIO_URL;
    
    // Load into RAM before playing
    console.log(`[Audio] 🔄 Fetching RAM Blob for Seq: ${currentSequence} - ${targetUrl}`);
    if (blobUrlCache.has(targetUrl)) {
      console.log(`[Audio] ✅ Found in Cache for Seq: ${currentSequence}`);
      const cachedUrl = blobUrlCache.get(targetUrl)!;
      startPlayback(cachedUrl);
      
      // Extract metadata dynamically from the cached RAM blob URL
      fetch(cachedUrl).then(res => res.blob()).then(blob => {
          import('../utils/audioMetadata').then(({ extractMetadataFromBlob }) => {
            extractMetadataFromBlob(blob).then(res => {
              if (playbackSequenceRef.current !== currentSequence) return;
              if (res.metadata || res.imageUrl) {
                setTrack(prev => {
                  const updates: Partial<PlayerTrack> = {
                    title: res.metadata?.common?.title || prev.title,
                    artist: res.metadata?.common?.artist || prev.artist,
                    album: res.metadata?.common?.album || prev.album,
                    image: res.imageUrl || prev.image,
                    rawMetadata: res.metadata || prev.rawMetadata,
                  };
                  if (res.metadata?.format?.duration) {
                     updates.durationSeconds = res.metadata.format.duration;
                     const dm = Math.floor(updates.durationSeconds / 60);
                     const ds = Math.floor(updates.durationSeconds % 60).toString().padStart(2, '0');
                     updates.duration = `${dm}:${ds}`;
                  }
                  return { ...prev, ...updates };
                });

                if (res.imageUrl) {
                  getAverageColor(res.imageUrl).then(color => {
                    document.documentElement.style.setProperty('--player-accent', color);
                    document.documentElement.style.setProperty('--player-accent-soft', color.replace('rgb', 'rgba').replace(')', ', 0.2)'));
                  }).catch(() => {});
                }
              }
            });
          });
      }).catch(console.error);
    } else {
      fetch(targetUrl)
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
          return res.blob();
        })
        .then(async blob => {
          if (playbackSequenceRef.current !== currentSequence) return;
          
          // Use WebAssembly Decoder for FLAC to bypass Chromium native FLAC decoder bugs
          if (targetUrl.toLowerCase().endsWith('.flac') && audioContextRef.current) {
             console.log(`[Audio] ⚡ Using WebAssembly Decoder for FLAC (Seq: ${currentSequence})`);
             try {
                const arrayBuffer = await blob.arrayBuffer();
                const uint8Array = new Uint8Array(arrayBuffer);
                const audioBuffer = await decodeFlacToAudioBuffer(
                  audioContextRef.current,
                  uint8Array,
                  nextTrack.durationSeconds
                );
                blob = audioBufferToWavBlob(audioBuffer);
             } catch (e) {
                console.error('[Audio RAM Cache] FLAC WASM decoding failed, falling back to native browser decoding:', e);
             }
          }
          
          if (playbackSequenceRef.current !== currentSequence) return;

          let blobType = blob.type;
          if (targetUrl.toLowerCase().endsWith('.opus')) blobType = 'audio/ogg';
          else if (targetUrl.toLowerCase().endsWith('.flac')) blobType = 'audio/flac';
          else if (targetUrl.toLowerCase().endsWith('.m4a')) blobType = 'audio/mp4';
          
          const typedBlob = new Blob([blob], { type: blobType || 'audio/mpeg' });
          const url = URL.createObjectURL(typedBlob);
          blobUrlCache.set(targetUrl, url);
          startPlayback(url);
          
          // Extract metadata dynamically from the RAM blob
          import('../utils/audioMetadata').then(({ extractMetadataFromBlob }) => {
            extractMetadataFromBlob(typedBlob).then(res => {
              if (playbackSequenceRef.current !== currentSequence) return;
              if (res.metadata || res.imageUrl) {
                setTrack(prev => {
                  const updates: Partial<PlayerTrack> = {
                    title: res.metadata?.common?.title || prev.title,
                    artist: res.metadata?.common?.artist || prev.artist,
                    album: res.metadata?.common?.album || prev.album,
                    image: res.imageUrl || prev.image,
                    rawMetadata: res.metadata || prev.rawMetadata,
                  };
                  if (res.metadata?.format?.duration) {
                     updates.durationSeconds = res.metadata.format.duration;
                     const dm = Math.floor(updates.durationSeconds / 60);
                     const ds = Math.floor(updates.durationSeconds % 60).toString().padStart(2, '0');
                     updates.duration = `${dm}:${ds}`;
                  }
                  return { ...prev, ...updates };
                });

                if (res.imageUrl) {
                  getAverageColor(res.imageUrl).then(color => {
                    document.documentElement.style.setProperty('--player-accent', color);
                    document.documentElement.style.setProperty('--player-accent-soft', color.replace('rgb', 'rgba').replace(')', ', 0.2)'));
                  }).catch(() => {});
                }
              }
            });
          });
        })
        .catch(err => {
          if (playbackSequenceRef.current !== currentSequence) return;
          console.error('[Audio RAM Cache] Failed to fetch audio into RAM. Error details:', err);
          setIsLoading(false);
          startPlayback(targetUrl); // Fallback to streaming url
        });
    }
  }, [volume]);

  const playNext = useCallback((isManual = true) => {
    if (queue.length === 0) return;
    
    let nextIndex = currentIndex + 1;
    if (shuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else if (nextIndex >= queue.length) {
      if (repeat === 'all') {
        nextIndex = 0;
      } else {
        setIsPlaying(false);
        setHasActiveTrack(false);
        setProgress(0);
        setElapsed('0:00');
        return; 
      }
    }
    
    loadAndPlayTrack(queue[nextIndex], nextIndex);
  }, [currentIndex, queue, repeat, shuffle, loadAndPlayTrack]);

  const playPrevious = useCallback(() => {
    if (queue.length === 0) return;
    
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
       audio.currentTime = 0;
       return;
    }
    
    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
      prevIndex = queue.length - 1; 
    }
    
    loadAndPlayTrack(queue[prevIndex], prevIndex);
  }, [currentIndex, queue, loadAndPlayTrack]);

  const getTrustedDurationRef = useRef(getTrustedDuration);
  const playNextRef = useRef(playNext);
  useEffect(() => {
    getTrustedDurationRef.current = getTrustedDuration;
    playNextRef.current = playNext;
  }, [getTrustedDuration, playNext]);

  useEffect(() => {
    console.log('[Audio Engine] 🚀 INITIALIZING SINGLE AUDIO ENGINE (Should only see this ONCE)');
    const audio = new Audio();
    audioRef.current = audio;

    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.8;
      
      const source = audioCtx.createMediaElementSource(audio);
      
      const gain = audioCtx.createGain();
      gain.gain.value = 0.8; // Default, gets overridden
      gainRef.current = gain;

      source.connect(gain);

      const frequencies = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
      const filters = frequencies.map((freq, index) => {
        const filter = audioCtx.createBiquadFilter();
        if (index === 0) {
          filter.type = 'lowshelf';
        } else if (index === frequencies.length - 1) {
          filter.type = 'highshelf';
        } else {
          filter.type = 'peaking';
          filter.Q.value = 1.0;
        }
        filter.frequency.value = freq;
        filter.gain.value = 0;
        return filter;
      });
      
      eqFiltersRef.current = filters;

      gain.connect(filters[0]);
      
      for (let i = 0; i < filters.length - 1; i++) {
        filters[i].connect(filters[i + 1]);
      }
      filters[filters.length - 1].connect(analyser);
      analyser.connect(audioCtx.destination);
      
      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;
    } catch (err) {
      console.warn('Web Audio API not supported', err);
    }
    
    return () => {
      audio.pause();
      audio.removeAttribute('src');
    };
  }, []); // Run ONCE on mount


  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      const duration = getTrustedDurationRef.current(audio);
      if (!duration || !Number.isFinite(duration) || duration <= 0) return;

      setCurrentTime(audio.currentTime);
      const percent = (audio.currentTime / duration) * 100;
      setProgress(percent);
      const mins = Math.floor(audio.currentTime / 60);
      const secs = Math.floor(audio.currentTime % 60).toString().padStart(2, '0');
      setElapsed(`${mins}:${secs}`);
      
      const dMins = Math.floor(duration / 60);
      const dSecs = Math.floor(duration % 60).toString().padStart(2, '0');
      setDurationStr(`${dMins}:${dSecs}`);
    };

    const handleEnded = () => {
      if (repeat === 'one') {
        audio.currentTime = 0;
        audio.play().catch(console.error);
      } else {
        playNextRef.current(true);
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [repeat]);

  // Track history
  useEffect(() => {
    if (currentTime > 5 && !hasAddedToHistoryRef.current) {
      hasAddedToHistoryRef.current = true;
      addRecentlyPlayed(track as any);
    }
  }, [currentTime, track, addRecentlyPlayed]);

  // Media Session API for OS notifications and hardware media keys
  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title || 'Unknown Title',
        artist: track.artist || 'Unknown Artist',
        album: track.album || 'Unknown Album',
        artwork: track.image ? [
          { src: track.image, sizes: '512x512', type: 'image/png' },
          { src: track.image, sizes: '256x256', type: 'image/png' }
        ] : []
      });
    }
  }, [track]);

  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
    }
  }, [isPlaying]);

  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', () => {
        if (audioContextRef.current?.state === 'suspended') {
          audioContextRef.current.resume();
        }
        setIsLoading(true);
        audioRef.current?.play().then(() => setIsLoading(false)).catch(console.error);
        setIsPlaying(true);
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        audioRef.current?.pause();
        setIsPlaying(false);
      });
      navigator.mediaSession.setActionHandler('previoustrack', () => playPrevious());
      navigator.mediaSession.setActionHandler('nexttrack', () => playNext(true));
    }
    return () => {
      if ('mediaSession' in navigator) {
        navigator.mediaSession.setActionHandler('play', null);
        navigator.mediaSession.setActionHandler('pause', null);
        navigator.mediaSession.setActionHandler('previoustrack', null);
        navigator.mediaSession.setActionHandler('nexttrack', null);
      }
    };
  }, [playNext, playPrevious]);

  const playTrack = useCallback((nextTrack: PlayerTrack, options: PlaybackOptions = {}) => {
    if (options.volume !== undefined) {
      const clamped = clampPercent(options.volume);
      setVolumeState(clamped);
      const gain = gainRef.current;
      if (gain && !isPlaying) gain.gain.value = clamped / 100;
    }
    
    setQueue([nextTrack]); 
    loadAndPlayTrack(nextTrack, 0);
  }, [isPlaying, loadAndPlayTrack]);

  const playQueue = useCallback((tracks: PlayerTrack[], startIndex = 0) => {
    if (tracks.length === 0) return;
    setQueue(tracks);
    loadAndPlayTrack(tracks[startIndex], startIndex);
  }, [loadAndPlayTrack]);
  
  const addToQueue = useCallback((nextTrack: PlayerTrack) => {
    setQueue(q => [...q, nextTrack]);
  }, []);

  const reorderQueue = useCallback((newQueue: PlayerTrack[], newCurrentIndex: number) => {
    setQueue(newQueue);
    setCurrentIndex(newCurrentIndex);
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      setHasActiveTrack(true);
      setIsLoading(true);
      audio.play().then(() => setIsLoading(false)).catch(console.error);
      setIsPlaying(true);
    }
  }, [isPlaying]);

  const toggleShuffle = useCallback(() => setShuffle(s => !s), []);
  const toggleRepeat = useCallback(() => {
    setRepeat(r => {
      if (r === 'off') return 'all';
      if (r === 'all') return 'one';
      return 'off';
    });
  }, []);

  const setVolume = useCallback((nextVolume: number) => {
    const clamped = clampPercent(nextVolume);
    setVolumeState(clamped);
    const gain = gainRef.current;
    if (gain) gain.gain.value = clamped / 100;
  }, []);

  const setEQBand = useCallback((index: number, value: number) => {
    const clamped = Math.max(-12, Math.min(12, value));
    setEQBandsState(prev => {
      const next = [...prev];
      next[index] = clamped;
      return next;
    });
    if (eqFiltersRef.current[index] && isEQEnabled) {
      eqFiltersRef.current[index].gain.value = clamped;
    }
  }, [isEQEnabled]);

  useEffect(() => {
    eqFiltersRef.current.forEach((filter, index) => {
      filter.gain.value = isEQEnabled ? eqBands[index] : 0;
    });
  }, [isEQEnabled, eqBands]);

  const setSleepTimer = useCallback((minutes: number | null) => {
    if (minutes === null) {
      setSleepTimeRemaining(null);
      if (sleepTimerIntervalRef.current) clearInterval(sleepTimerIntervalRef.current);
      return;
    }
    
    let secondsLeft = minutes * 60;
    setSleepTimeRemaining(secondsLeft);
    
    if (sleepTimerIntervalRef.current) clearInterval(sleepTimerIntervalRef.current);
    
    sleepTimerIntervalRef.current = setInterval(() => {
      secondsLeft -= 1;
      setSleepTimeRemaining(secondsLeft);
      
      if (secondsLeft <= 0) {
        if (sleepTimerIntervalRef.current) clearInterval(sleepTimerIntervalRef.current);
        setSleepTimeRemaining(null);
        const audio = audioRef.current;
        const gain = gainRef.current;
        if (audio && gain) {
          // Fade out and pause
          let vol = gain.gain.value;
          const step = vol / 50; 
          const fadeInt = setInterval(() => {
            if (vol - step > 0) {
              vol -= step;
              gain.gain.value = vol;
            } else {
              gain.gain.value = 0;
              audio.pause();
              setIsPlaying(false);
              clearInterval(fadeInt);
            }
          }, 100);
        } else {
           setIsPlaying(false);
        }
      }
    }, 1000);
  }, []);

  const seekTo = useCallback((percent: number) => {
    const audio = audioRef.current;
    if (audio) {
      const duration = getTrustedDuration(audio);

      if (Number.isFinite(duration) && duration > 0) {
        const clamped = clampPercent(percent);
        audio.currentTime = (clamped / 100) * duration;
        setProgress(clamped);
      }
    }
  }, [getTrustedDuration]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' || 
        document.activeElement?.tagName === 'TEXTAREA'
      ) return;

      switch(e.key.toLowerCase()) {
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'arrowright':
          playNext(true);
          break;
        case 'arrowleft':
          playPrevious();
          break;
        case 'm':
          {
             const gain = gainRef.current;
             if (gain) {
                const newVol = gain.gain.value > 0 ? 0 : volume / 100;
                gain.gain.value = newVol;
             }
          }
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, playNext, playPrevious, volume]);

  const value = useMemo(
    () => ({
      track,
      queue,
      currentIndex,
      elapsed,
      durationStr,
      progress,
      volume,
      isPlaying,
      isLoading,
      hasActiveTrack,
      shuffle,
      repeat,
      currentTime,
      playTrack,
      playQueue,
      addToQueue,
      reorderQueue,
      playNext: () => playNext(true),
      playPrevious,
      togglePlay,
      toggleShuffle,
      toggleRepeat,
      setVolume,
      seekTo,
      analyserNode: analyserRef.current || undefined,
      audioContext: audioContextRef.current || undefined,
      eqBands,
      setEQBand,
      eqPreset,
      setEQPreset,
      isEQEnabled,
      setIsEQEnabled,
      sleepTimeRemaining,
      setSleepTimer,
    }),
    [track, queue, currentIndex, elapsed, durationStr, progress, volume, isPlaying, isLoading, hasActiveTrack, shuffle, repeat, currentTime, playTrack, playQueue, addToQueue, reorderQueue, playNext, playPrevious, togglePlay, toggleShuffle, toggleRepeat, setVolume, seekTo, eqBands, setEQBand, eqPreset, isEQEnabled, sleepTimeRemaining, setSleepTimer],
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
};
