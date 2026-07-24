import React from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { usePlayer, type PlayerTrack } from '../context/player';

interface QueueDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const QueueDrawer: React.FC<QueueDrawerProps> = ({ isOpen, onClose }) => {
  const { queue, currentIndex, track, playQueue, reorderQueue } = usePlayer();

  const handleReorder = (newQueue: PlayerTrack[]) => {
    // Find the new index of the currently active track
    const newCurrentIndex = newQueue.indexOf(track);
    reorderQueue(newQueue, newCurrentIndex !== -1 ? newCurrentIndex : currentIndex);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20, transition: { duration: 0.2 } }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          className="fixed bottom-[100px] right-4 z-50 w-[calc(100vw-32px)] sm:w-[350px] overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container-high/95 shadow-2xl backdrop-blur-xl"
        >
      <div className="flex items-center justify-between border-b border-outline-variant/20 p-md">
        <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Queue</h3>
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface hover:text-on-surface"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      <div className="no-scrollbar max-h-[400px] overflow-y-auto p-xs">
        {queue.length === 0 ? (
          <div className="p-md text-center text-sm text-on-surface-variant">
            Queue is empty.
          </div>
        ) : (
          <Reorder.Group values={queue} onReorder={handleReorder} axis="y" className="flex flex-col gap-1 p-0 m-0 list-none">
            {queue.map((item, index) => {
              const isPlaying = index === currentIndex;
              // Add a stable key (using id or fallback to stringified track)
              const trackKey = typeof item.id !== 'undefined' ? item.id.toString() + index : item.title + index;
              return (
                <Reorder.Item
                  key={trackKey}
                  value={item}
                  className={`group relative flex cursor-pointer items-center gap-md rounded-lg p-sm transition-colors ${
                    isPlaying ? 'bg-primary-container/20' : 'hover:bg-surface-container-highest bg-surface-container-high/40'
                  }`}
                  style={{ touchAction: 'none' }} // Ensure scrolling doesn't interfere with dragging
                >
                  <div className="flex cursor-grab flex-col items-center justify-center p-1 text-on-surface-variant opacity-30 transition-opacity hover:opacity-100 active:cursor-grabbing">
                    <span className="material-symbols-outlined text-[20px]">drag_indicator</span>
                  </div>
                  <div 
                    onClick={() => playQueue(queue, index)}
                    className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                    {!isPlaying && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                        <span
                          className="material-symbols-outlined text-white"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          play_arrow
                        </span>
                      </div>
                    )}
                    {isPlaying && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <span className="material-symbols-outlined text-primary text-[18px]">
                          equalizer
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div 
                    onClick={() => playQueue(queue, index)}
                    className="flex min-w-0 flex-1 flex-col"
                  >
                    <span
                      className={`truncate font-label-md text-label-md ${
                        isPlaying ? 'font-bold text-primary' : 'text-on-surface'
                      }`}
                    >
                      {item.title}
                    </span>
                    <span className="truncate font-label-sm text-label-sm text-on-surface-variant">
                      {item.artist}
                    </span>
                  </div>
                </Reorder.Item>
              );
            })}
          </Reorder.Group>
          )}
        </div>
      </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QueueDrawer;
