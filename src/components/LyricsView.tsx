import React, { useEffect, useRef } from 'react';
import { usePlayer } from '../context/player';
import AudioVisualizer from './AudioVisualizer';

interface LyricsViewProps {
  isOpen: boolean;
  onClose: () => void;
}

// Dummy lyrics specifically for the SoundHelix demo track (which is an instrumental anyway, but this is for demo)
const dummyLyrics = [
  { time: 5, text: '(Instrumental intro plays)' },
  { time: 15, text: 'The city lights are blinding...' },
  { time: 20, text: 'We drive into the night' },
  { time: 25, text: 'Leave everything behind us' },
  { time: 30, text: 'Into the neon lights' },
  { time: 40, text: '(Chorus)' },
  { time: 42, text: 'Oh, can you feel the resonance?' },
  { time: 47, text: 'Echoing through the atmosphere' },
  { time: 52, text: 'In this digital romance' },
  { time: 57, text: 'I just want to hold you near' },
  { time: 70, text: '(Synth solo)' },
  { time: 90, text: 'The morning sun is rising...' },
  { time: 95, text: 'But we are still awake' },
  { time: 100, text: 'This moment is forever' },
  { time: 105, text: 'It\'s ours to finally take' },
];

const LyricsView: React.FC<LyricsViewProps> = ({ isOpen, onClose }) => {
  const { track, currentTime } = usePlayer();
  const currentLyrics = track.lyrics || dummyLyrics;
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Find the active line index
  let activeIndex = -1;
  for (let i = 0; i < currentLyrics.length; i++) {
    if (currentTime >= currentLyrics[i].time) {
      activeIndex = i;
    } else {
      break;
    }
  }

  // Scroll active line into view
  useEffect(() => {
    if (isOpen && activeIndex !== -1 && containerRef.current) {
      const activeEl = containerRef.current.querySelector('.lyric-active');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [activeIndex, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-surface-dim/95 backdrop-blur-2xl transition-all">
      <div className="relative z-10 flex items-center justify-between p-xl pt-24">
        <div className="flex items-center gap-md">
          <img 
            src={track.image || 'https://placehold.co/300x300/1e1b4b/white?text=Track'} 
            alt={track.title} 
            className="h-16 w-16 rounded-md shadow-lg" 
            onError={(e) => {
              e.currentTarget.src = 'https://placehold.co/300x300/1e1b4b/white?text=Track';
            }}
          />
          <div className="flex flex-col">
            <span className="font-headline-md text-on-surface">{track.title}</span>
            <span className="font-label-md text-on-surface-variant">{track.artist}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-variant text-on-surface hover:bg-surface-container-high transition-colors"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>
      </div>

      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto px-xl pb-[120px] pt-md no-scrollbar"
      >
        <div className="mx-auto flex max-w-[800px] flex-col gap-xl text-center">
          {currentLyrics.map((line, index) => {
            const isActive = index === activeIndex;
            const isPassed = index < activeIndex;
            
            return (
              <p
                key={index}
                className={`transition-all duration-500 font-display font-bold text-[32px] md:text-[48px] ${
                  isActive 
                    ? 'lyric-active text-white scale-105 drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]' 
                    : isPassed 
                      ? 'text-on-surface-variant opacity-50' 
                      : 'text-on-surface-variant opacity-20'
                }`}
              >
                {line.text}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LyricsView;
