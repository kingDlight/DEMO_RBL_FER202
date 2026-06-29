import React from 'react';
import { Container, Button } from 'react-bootstrap';

const Banner: React.FC = () => {
  return (
    <div className="auralis-banner shadow-lg text-white">
      <Container className="py-5 d-flex flex-column align-items-center position-relative z-1">
        <h1 className="display-4 fw-bolder mb-3">
          What do you want to listen to?
        </h1>
        <p className="fs-5 text-light mb-4 opacity-75 text-center" style={{ maxWidth: '600px' }}>
          Search for artists, songs, or playlists to discover your next favorite track.
        </p>
        <Button variant="primary" size="lg" className="rounded-pill px-5 py-3 fw-bold d-flex align-items-center gap-2 shadow">
          <span className="material-symbols-outlined">explore</span>
          Khám phá ngay
        </Button>
      </Container>
    </div>
  );
};

export default Banner;
