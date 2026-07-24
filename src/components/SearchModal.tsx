import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Track } from './TrackCard';
import * as trackService from '../services/trackService';
import { usePlayer } from '../context/player';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Track[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { playTrack } = usePlayer();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const data = await trackService.getTracks();
        const filtered = data.filter(
          (t) =>
            t.title.toLowerCase().includes(query.toLowerCase()) ||
            t.artist.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered.slice(0, 5)); // show top 5
      } catch (err) {
        console.error('Search failed', err);
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(fetchResults, 300); // debounce
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handlePlay = (track: Track) => {
    playTrack({
      id: track.id,
      title: track.title,
      artist: track.artist,
      duration: track.duration || '3:00',
      image: track.image || 'https://placehold.co/300x300/1e1b4b/white?text=Track',
      audioUrl: track.audioUrl,
      lyrics: track.lyrics,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh]">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={onClose} 
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="relative z-10 w-full max-w-[672px]"
          >
        <div className="overflow-hidden rounded-2xl border border-on-surface/10 bg-surface/90 shadow-2xl backdrop-blur-xl">
          {/* Search Input */}
          <div className="flex items-center border-b border-on-surface/10 px-md py-sm">
            <span className="material-symbols-outlined text-2xl text-outline mr-sm">search</span>
            <input
              ref={inputRef}
              type="text"
              className="flex-1 bg-transparent px-sm py-md font-body-lg text-body-lg text-on-surface outline-none placeholder:text-outline-variant"
              placeholder="Search for songs, artists..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              className="rounded-md bg-surface-container-high px-sm py-xs font-label-sm text-label-sm text-on-surface-variant transition-colors hover:bg-on-surface/10 hover:text-on-surface"
              onClick={onClose}
            >
              ESC
            </button>
          </div>

          {/* Results Area */}
          <div className="max-h-[60vh] overflow-y-auto p-sm">
            {isSearching ? (
              <div className="py-xl text-center font-body-md text-on-surface-variant">
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
              </div>
            ) : query && results.length === 0 ? (
              <div className="py-xl text-center font-body-md text-on-surface-variant">
                No results found for "{query}"
              </div>
            ) : results.length > 0 ? (
              <div className="flex flex-col gap-xs">
                <h3 className="mb-xs px-sm text-label-sm text-outline">Songs</h3>
                {results.map((track) => (
                  <div
                    key={track.id}
                    className="group flex cursor-pointer items-center justify-between rounded-lg p-sm transition-colors hover:bg-on-surface/5"
                    onClick={() => handlePlay(track)}
                  >
                    <div className="flex items-center gap-md">
                      <div className="relative h-12 w-12 overflow-hidden rounded-md">
                        <img
                          src={track.image || 'https://placehold.co/300x300/1e1b4b/white?text=Track'}
                          alt={track.title}
                          className="h-full w-full object-cover"
                        />
                        <button
                          className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlay(track);
                          }}
                        >
                          <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
                            play_arrow
                          </span>
                        </button>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-label-lg text-on-surface">{track.title}</span>
                        <span className="font-body-sm text-on-surface-variant">{track.artist}</span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-outline-variant opacity-0 transition-opacity group-hover:opacity-100">
                      play_arrow
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-xl text-center">
                <div className="mb-md flex justify-center">
                  <span className="material-symbols-outlined text-4xl text-outline-variant/30">search</span>
                </div>
                <p className="font-body-md text-on-surface-variant">Start typing to search for music</p>
              </div>
            )}
            </div>
          </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
