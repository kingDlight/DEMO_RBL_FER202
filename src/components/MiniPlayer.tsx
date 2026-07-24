import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayer } from '../context/player';

interface MiniPlayerProps {
  isOpen: boolean;
  onClose: () => void;
}

const filledIconStyle = { fontVariationSettings: "'FILL' 1" } as React.CSSProperties;

const MiniPlayer: React.FC<MiniPlayerProps> = ({ isOpen, onClose }) => {
  const { track, isPlaying, isLoading, togglePlay, playNext, playPrevious, progress, seekTo } = usePlayer();
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = (x / rect.width) * 100;
    seekTo(percent);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          drag
          dragConstraints={{ left: 0, right: window.innerWidth - 300, top: 0, bottom: window.innerHeight - 100 }}
          dragElastic={0.1}
          dragMomentum={false}
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="fixed bottom-24 right-8 z-50 flex w-[280px] cursor-move flex-col overflow-hidden rounded-2xl border border-outline-variant/20 bg-surface-container-highest/90 shadow-2xl backdrop-blur-2xl"
        >
          {/* Cover Art Background & Controls */}
          <div className="relative aspect-square w-full">
            <img
              src={track.image}
              alt={track.title}
              className="h-full w-full object-cover transition-transform duration-700"
              style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
            />
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className={`absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-opacity ${
                isHovered ? 'opacity-100' : 'opacity-0'
              } hover:bg-black/60`}
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Playback Controls Overlay */}
            <div className={`absolute inset-0 flex items-center justify-center gap-md transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
              <button
                onClick={playPrevious}
                className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-transform hover:bg-white/20 hover:scale-110"
              >
                <span className="material-symbols-outlined text-[24px]" style={filledIconStyle}>
                  skip_previous
                </span>
              </button>
              <button
                onClick={togglePlay}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-on-primary shadow-lg transition-transform hover:scale-105 disabled:opacity-70 disabled:hover:scale-100"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="material-symbols-outlined text-[32px] animate-spin">progress_activity</span>
                ) : (
                  <span className="material-symbols-outlined text-[32px]" style={filledIconStyle}>
                    {isPlaying ? 'pause' : 'play_arrow'}
                  </span>
                )}
              </button>
              <button
                onClick={playNext}
                className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-transform hover:bg-white/20 hover:scale-110"
              >
                <span className="material-symbols-outlined text-[24px]" style={filledIconStyle}>
                  skip_next
                </span>
              </button>
            </div>

            {/* Track Info (bottom of image) */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h4 className="truncate font-label-lg text-label-lg font-bold text-white drop-shadow-md">
                {track.title}
              </h4>
              <p className="truncate font-label-sm text-label-sm text-white/80 drop-shadow-md">
                {track.artist}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div 
            ref={containerRef}
            onClick={handleSeek}
            className="group relative h-2 w-full cursor-pointer bg-surface-variant/50"
          >
            <div
              className="absolute left-0 top-0 h-full bg-primary transition-all duration-100 group-hover:bg-primary-fixed"
              style={{ width: `${progress}%` }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MiniPlayer;
