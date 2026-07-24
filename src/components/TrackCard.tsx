import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export interface Track {
  id: number;
  title: string;
  artist: string;
  album?: string;
  image: string;
  price: number;
  originalPrice: number;
  stock: number;
  category?: string;
  duration?: string;
  audioUrl?: string;
  lyrics?: { time: number; text: string }[];
}

interface TrackCardProps {
  track: Track;
  onPlay: (track: Track) => void;
}

const TrackCard: React.FC<TrackCardProps> = ({ track, onPlay }) => {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite, playlists, addTrackToPlaylist } = useUser();
  const [showPlaylistMenu, setShowPlaylistMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isLiked = isFavorite(track.id);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowPlaylistMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleGoToDetail = () => {
    navigate(`/tracks/${track.id}`);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(track);
  };

  return (
    <article
      className="flex h-full w-full flex-col overflow-hidden rounded-xl bg-surface-container-low transition-all duration-300 hover:-translate-y-1 hover:bg-surface-container hover:shadow-lg hover:shadow-primary/10"
    >
      <div className="group relative aspect-square cursor-pointer overflow-hidden" onClick={handleGoToDetail}>
        <img
          src={track.image}
          alt={track.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        <button
          className="absolute right-sm top-sm z-10 flex h-9 w-9 items-center justify-center rounded-full bg-surface/80 text-error backdrop-blur transition-colors hover:bg-surface"
          onClick={handleToggleFavorite}
          type="button"
          aria-label={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: isLiked ? "'FILL' 1" : "'FILL' 0" }}
          >
            favorite
          </span>
        </button>

        <div className="absolute right-sm top-12 z-20" ref={menuRef}>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full bg-surface/80 text-on-surface backdrop-blur transition-colors hover:bg-surface hover:text-primary"
            onClick={(e) => {
              e.stopPropagation();
              setShowPlaylistMenu(!showPlaylistMenu);
            }}
            type="button"
            title="Add to Playlist"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
          </button>
          
          {showPlaylistMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-outline-variant/20 bg-surface-container-high py-2 shadow-xl">
              <div className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                Add to Playlist
              </div>
              <div className="my-1 border-t border-outline-variant/20" />
              {playlists.length === 0 ? (
                <div className="px-4 py-2 text-sm text-on-surface-variant">No playlists</div>
              ) : (
                <div className="max-h-40 overflow-y-auto">
                  {playlists.map(p => (
                    <button
                      key={p.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        addTrackToPlaylist(p.id, track);
                        setShowPlaylistMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-on-surface hover:bg-surface-variant truncate"
                      title={p.title}
                    >
                      {p.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <button
            className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-on-secondary shadow-lg transition-all duration-200 hover:scale-110"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPlay(track);
            }}
            aria-label={`Play ${track.title}`}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              play_arrow
            </span>
          </button>
        </div>
      </div>

      <div className="flex grow flex-col p-md text-on-surface">
        {track.category && (
          <span className="mb-sm self-start rounded-md bg-on-surface/10 px-sm py-xs text-xs font-semibold text-on-surface-variant">
            {track.category}
          </span>
        )}

        <h3
          className="mb-xs cursor-pointer truncate text-base font-bold transition-colors hover:text-primary"
          onClick={handleGoToDetail}
          title={track.title}
        >
          {track.title}
        </h3>

        <p className="mb-md truncate text-sm text-on-surface-variant" title={track.artist}>
          {track.artist}
        </p>

        <div className="mt-auto">
          <div className="mb-md flex items-center justify-between gap-sm text-sm text-on-surface-variant">
            <span>{track.duration || '3:00'}</span>
            <span>Local music</span>
          </div>

          <button
            className="flex w-full items-center justify-center gap-sm rounded-lg bg-primary-container px-md py-sm font-label-md text-label-md text-on-primary-container transition-colors hover:bg-primary hover:text-on-primary"
            type="button"
            onClick={() => onPlay(track)}
          >
            <span className="material-symbols-outlined text-sm">play_arrow</span>
            Play Track
          </button>
        </div>
      </div>
    </article>
  );
};

export default TrackCard;
