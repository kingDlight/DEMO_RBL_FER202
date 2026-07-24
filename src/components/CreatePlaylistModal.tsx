import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CreatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (title: string, description: string, cover?: string) => void;
}

export const CreatePlaylistModal: React.FC<CreatePlaylistModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cover, setCover] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setTitle('');
      setDescription('');
      setCover('');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onCreate(title.trim(), description.trim() || 'User created playlist', cover.trim() || undefined);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
            className="relative z-10 w-full max-w-[400px]"
          >
            <div className="overflow-hidden rounded-2xl border border-on-surface/10 bg-surface/90 shadow-2xl backdrop-blur-xl">
              <div className="border-b border-on-surface/10 px-xl py-lg">
                <h2 className="font-headline-sm text-headline-sm text-on-surface">Create New Playlist</h2>
              </div>

              <form onSubmit={handleSubmit} className="p-xl flex flex-col gap-lg">
                <div className="flex flex-col gap-xs">
                  <label htmlFor="playlist-title" className="font-label-md text-label-md text-on-surface-variant">
                    Playlist Name <span className="text-error">*</span>
                  </label>
                  <input
                    id="playlist-title"
                    ref={inputRef}
                    type="text"
                    required
                    className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high px-md py-sm font-body-md text-body-md text-on-surface outline-none placeholder:text-outline-variant focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="E.g., My Awesome Mix"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-xs">
                  <label htmlFor="playlist-desc" className="font-label-md text-label-md text-on-surface-variant">
                    Description (Optional)
                  </label>
                  <textarea
                    id="playlist-desc"
                    className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high px-md py-sm font-body-md text-body-md text-on-surface outline-none placeholder:text-outline-variant focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="Describe your playlist..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                  />
                </div>

                <div className="flex flex-col gap-xs">
                  <label htmlFor="playlist-cover" className="font-label-md text-label-md text-on-surface-variant">
                    Image URL (Optional)
                  </label>
                  <input
                    id="playlist-cover"
                    type="url"
                    className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high px-md py-sm font-body-md text-body-md text-on-surface outline-none placeholder:text-outline-variant focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="https://example.com/image.jpg"
                    value={cover}
                    onChange={(e) => setCover(e.target.value)}
                  />
                </div>

                <div className="mt-sm flex justify-end gap-md">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-full px-lg py-sm font-label-md text-label-md text-primary transition-colors hover:bg-primary/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!title.trim()}
                    className="rounded-full bg-primary px-lg py-sm font-label-md text-label-md text-on-primary shadow-sm transition-all hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
