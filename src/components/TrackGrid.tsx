import React from 'react';
import TrackCard, { type Track } from './TrackCard';

interface TrackGridProps {
  tracks: Track[];
  onPlay: (track: Track) => void;
}

const TrackGrid: React.FC<TrackGridProps> = ({ tracks, onPlay }) => {
  if (!tracks || tracks.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-dashed border-outline-variant bg-surface-container-low py-12">
        <p className="text-lg text-on-surface-variant">Khong co bai hat nao</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-md sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {tracks.map((track) => (
        <div key={track.id} className="flex justify-center">
          <TrackCard track={track} onPlay={onPlay} />
        </div>
      ))}
    </div>
  );
};

export default TrackGrid;
