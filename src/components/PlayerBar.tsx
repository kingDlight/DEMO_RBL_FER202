import React, { useState, useEffect, useRef } from 'react';
import { usePlayer } from '../context/player';
import { useUser } from '../context/UserContext';
import LyricsView from './LyricsView';
import QueueDrawer from './QueueDrawer';
import EqualizerModal from './EqualizerModal';
import MiniPlayer from './MiniPlayer';
import MetadataModal from './MetadataModal';
import { useToast } from '../context/ToastContext';

const filledIconStyle = { fontVariationSettings: "'FILL' 1" } as React.CSSProperties;

const PlayerBar: React.FC = () => {
  const { 
    track, elapsed, durationStr, progress, volume, isPlaying, isLoading, togglePlay,
    shuffle, repeat, playNext, playPrevious, toggleShuffle, toggleRepeat,
    setVolume,
    sleepTimeRemaining,
    setSleepTimer,
    seekTo
  } = usePlayer();
  const { toggleFavorite, isFavorite } = useUser();
  const { addToast } = useToast();
  
  const [isLyricsOpen, setIsLyricsOpen] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [showEQ, setShowEQ] = useState(false);
  const [showMiniPlayer, setShowMiniPlayer] = useState(false);
  const [showMetadata, setShowMetadata] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const [showSleepTimer, setShowSleepTimer] = useState(false);
  const sleepTimerMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isLyricsOpen) {
        setIsLyricsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLyricsOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sleepTimerMenuRef.current && !sleepTimerMenuRef.current.contains(e.target as Node)) {
        setShowSleepTimer(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    addToast('Link copied to clipboard!', 'success');
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 z-50 flex h-[90px] w-full items-center justify-between border-t border-outline-variant/10 bg-surface-dim/80 px-container-margin-mobile shadow-[0_-10px_40px_rgba(0,0,0,0.2)] backdrop-blur-3xl md:px-container-margin-desktop">
        {/* Track Info */}
        <div className="flex w-1/4 min-w-[200px] items-center gap-md">
          <div className="relative h-14 w-14 overflow-hidden rounded-lg shadow-md group">
             <img
               alt={track.title}
               className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
               src={track.image || 'https://placehold.co/300x300/1e1b4b/white?text=Track'}
               onError={(e) => {
                 e.currentTarget.src = 'https://placehold.co/300x300/1e1b4b/white?text=Track';
               }}
             />
             <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
          <div className="flex flex-col justify-center truncate">
            <span className="truncate font-label-lg text-label-lg font-bold text-on-surface hover:underline cursor-pointer">
              {track.title}
            </span>
            <span className="truncate font-body-sm text-body-sm text-on-surface-variant hover:underline cursor-pointer">
              {track.artist}
            </span>
          </div>
          <button 
            onClick={() => toggleFavorite(track as any)}
            className="ml-sm hidden h-8 w-8 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-on-surface/5 hover:text-primary sm:flex"
          >
            <span 
              className={`material-symbols-outlined text-[20px] ${isFavorite(track.id || '') ? 'text-error' : ''}`}
              style={{ fontVariationSettings: isFavorite(track.id || '') ? "'FILL' 1" : "'FILL' 0" }}
            >
              favorite
            </span>
          </button>
        </div>

        {/* Playback Controls */}
        <div className="flex max-w-[500px] flex-1 flex-col items-center justify-center gap-sm">
          <div className="flex items-center gap-xl">
            <button
              type="button"
              onClick={toggleShuffle}
              className={`transition-colors ${shuffle ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              <span className="material-symbols-outlined text-[22px]">shuffle</span>
            </button>
            <button
              type="button"
              onClick={playPrevious}
              className="text-on-surface-variant transition-colors hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-[26px]" style={filledIconStyle}>skip_previous</span>
            </button>
            
            <button
              className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-primary-container text-on-primary-container shadow-lg transition-transform hover:scale-105 hover:bg-primary-fixed disabled:opacity-70 disabled:hover:scale-100"
              onClick={togglePlay}
              type="button"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="material-symbols-outlined text-[24px] animate-spin">progress_activity</span>
              ) : (
                <span className="material-symbols-outlined text-[24px]" style={filledIconStyle}>
                  {isPlaying ? 'pause' : 'play_arrow'}
                </span>
              )}
            </button>
            
            <button
              type="button"
              onClick={playNext}
              className="text-on-surface-variant transition-colors hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-[26px]" style={filledIconStyle}>skip_next</span>
            </button>
            <button
              type="button"
              onClick={toggleRepeat}
              className={`transition-colors ${repeat !== 'off' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              <span className="material-symbols-outlined text-[22px]">
                {repeat === 'one' ? 'repeat_one' : 'repeat'}
              </span>
            </button>
          </div>
          
          <div className="flex w-full items-center gap-sm px-md">
            <span className="w-10 text-right font-mono text-[11px] text-on-surface-variant/80">
              {elapsed}
            </span>
            <div 
              className="group relative flex h-1 flex-1 cursor-pointer items-center"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const percent = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
                seekTo(percent);
              }}
            >
              <div className="absolute h-full w-full rounded-full bg-outline-variant/30" />
              <div
                className="absolute h-full rounded-full bg-primary transition-all duration-100 group-hover:bg-primary-fixed"
                style={{ width: `${progress}%` }}
              />
              <div 
                className="absolute h-3 w-3 rounded-full bg-white shadow-md opacity-0 transition-opacity group-hover:opacity-100" 
                style={{ left: `calc(${progress}% - 6px)` }}
              />
            </div>
            <span className="w-10 font-mono text-[11px] text-on-surface-variant/80">
              {durationStr !== 'NaN:NaN' ? durationStr : '0:00'}
            </span>
          </div>
        </div>

        {/* Extra Controls */}
        <div className="flex w-1/4 min-w-[200px] justify-end items-center gap-md">
          {/* Sleep Timer */}
          <div className="relative" ref={sleepTimerMenuRef}>
            <button
              onClick={() => setShowSleepTimer(!showSleepTimer)}
              className={`hidden h-10 px-2 items-center justify-center gap-1 rounded-full transition-colors md:flex ${
                sleepTimeRemaining !== null ? 'text-primary bg-primary/10' : 'text-on-surface-variant hover:text-on-surface'
              }`}
              title="Sleep Timer"
            >
              <span className="material-symbols-outlined text-[20px]">timer</span>
              {sleepTimeRemaining !== null && (
                <span className="text-xs font-medium">
                  {Math.floor(sleepTimeRemaining / 60)}:{(sleepTimeRemaining % 60).toString().padStart(2, '0')}
                </span>
              )}
            </button>
            {showSleepTimer && (
              <div className="absolute bottom-full right-0 mb-2 w-48 rounded-xl border border-outline-variant/20 bg-surface-container-high py-2 shadow-xl">
                <div className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  Sleep Timer
                </div>
                {[15, 30, 45, 60].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => {
                      setSleepTimer(mins);
                      setShowSleepTimer(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-on-surface hover:bg-surface-variant"
                  >
                    {mins} Minutes
                  </button>
                ))}
                <div className="my-1 border-t border-outline-variant/20" />
                <button
                  onClick={() => {
                    setSleepTimer(null);
                    setShowSleepTimer(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-error hover:bg-surface-variant"
                >
                  Turn Off
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setShowMiniPlayer(true)}
            className="hidden h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:text-on-surface md:flex"
            title="Mini Player"
          >
            <span className="material-symbols-outlined text-[20px]">picture_in_picture_alt</span>
          </button>
          <button
            onClick={() => setShowEQ(true)}
            className="hidden h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:text-on-surface md:flex"
            title="Equalizer"
          >
            <span className="material-symbols-outlined text-[20px]">graphic_eq</span>
          </button>
          <button 
            type="button"
            onClick={() => setIsQueueOpen(!isQueueOpen)}
            className={`transition-colors ${isQueueOpen ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
            title="Queue"
          >
            <span className="material-symbols-outlined text-[20px]">queue_music</span>
          </button>
          <button 
            type="button"
            onClick={handleShare}
            className="text-on-surface-variant transition-colors hover:text-on-surface"
            title="Share"
          >
            <span className="material-symbols-outlined text-[20px]">share</span>
          </button>
          <button 
            type="button"
            onClick={() => setIsLyricsOpen(true)}
            className={`transition-colors ${isLyricsOpen ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
            title="Lyrics"
          >
            <span className="material-symbols-outlined text-[20px]">mic</span>
          </button>
          
          <button 
            type="button"
            onClick={() => setShowMetadata(true)}
            className={`transition-colors ${showMetadata ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
            title="Track Info"
          >
            <span className="material-symbols-outlined text-[20px]">info</span>
          </button>
          
          <div 
            className="relative flex items-center"
            onMouseEnter={() => setShowVolume(true)}
            onMouseLeave={() => setShowVolume(false)}
          >
            <button className="text-on-surface-variant transition-colors hover:text-on-surface">
              <span className="material-symbols-outlined text-[20px]">
                {volume === 0 ? 'volume_off' : volume < 50 ? 'volume_down' : 'volume_up'}
              </span>
            </button>
            
            <div className={`absolute bottom-full left-1/2 mb-2 flex h-24 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-surface-container-high py-3 shadow-xl transition-all duration-200 ${showVolume ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-2 invisible'}`}>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="absolute left-1/2 top-1/2 h-1 w-20 -translate-x-1/2 -translate-y-1/2 -rotate-90 appearance-none bg-transparent [&::-webkit-slider-runnable-track]:h-1 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-outline-variant/30 [&::-webkit-slider-thumb]:mt-[-4px] [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
              />
            </div>
          </div>
        </div>
      </div>

      <LyricsView isOpen={isLyricsOpen} onClose={() => setIsLyricsOpen(false)} />
      <QueueDrawer isOpen={isQueueOpen} onClose={() => setIsQueueOpen(false)} />
      <EqualizerModal isOpen={showEQ} onClose={() => setShowEQ(false)} />
      <MiniPlayer isOpen={showMiniPlayer} onClose={() => setShowMiniPlayer(false)} />
      <MetadataModal isOpen={showMetadata} onClose={() => setShowMetadata(false)} />
    </>
  );
};

export default PlayerBar;
