import React from 'react';
import TrackCard, { type Track } from './TrackCard';

interface TrackGridProps {
  tracks: Track[];
  onPlay: (track: Track) => void;
  onAddToCart: (track: Track) => void;
}

const TrackGrid: React.FC<TrackGridProps> = ({ tracks, onPlay, onAddToCart }) => {
  // Xử lý empty state
  if (!tracks || tracks.length === 0) {
    return (
      <div className="flex justify-center items-center py-12 bg-[#1d1a24] rounded-xl border border-white/5 border-dashed">
        <p className="font-body-md text-[#ccc3d8] text-lg">Không có bài hát nào</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[24px]">
      {tracks.map((track) => (
        <div key={track.id} className="flex justify-center">
          <TrackCard track={track} onPlay={onPlay} onAddToCart={onAddToCart} />
        </div>
      ))}
    </div>
  );
};

export default TrackGrid;
