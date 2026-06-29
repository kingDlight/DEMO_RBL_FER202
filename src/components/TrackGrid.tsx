import React from 'react';
import { Row, Col } from 'react-bootstrap';
import TrackCard, { type Track } from './TrackCard';

interface TrackGridProps {
  tracks: Track[];
  onPlay: (track: Track) => void;
  onAddToCart: (track: Track) => void;
}

const TrackGrid: React.FC<TrackGridProps> = ({ tracks, onPlay, onAddToCart }) => {
  if (!tracks || tracks.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5 bg-dark rounded-3 border border-secondary border-dashed">
        <p className="text-secondary fs-5 mb-0">Không có bài hát nào</p>
      </div>
    );
  }

  return (
    <Row xs={1} sm={2} md={3} lg={4} xl={5} className="g-4">
      {tracks.map((track) => (
        <Col key={track.id} className="d-flex justify-content-center">
          <TrackCard track={track} onPlay={onPlay} onAddToCart={onAddToCart} />
        </Col>
      ))}
    </Row>
  );
};

export default TrackGrid;
