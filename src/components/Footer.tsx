import React from 'react';
import { Container } from 'react-bootstrap';

const Footer: React.FC = () => {
  return (
    <>
      {/* Footer Content */}
      <footer className="mt-5 border-top border-secondary pt-4" style={{ backgroundColor: '#1d1a24', paddingBottom: '120px' }}>
        <Container fluid="xxl" className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-4">
          <div className="d-flex align-items-center gap-2">
            <span className="fs-4 fw-bolder text-primary">Auralis</span>
            <span className="text-secondary ms-2 small">© {new Date().getFullYear()} Auralis Audio. All rights reserved.</span>
          </div>
          <div className="d-flex gap-3">
            <a className="text-secondary hover-text-light text-decoration-none" href="#">
              <span className="material-symbols-outlined p-2 rounded-circle" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>share</span>
            </a>
            <a className="text-secondary hover-text-light text-decoration-none" href="#">
              <span className="material-symbols-outlined p-2 rounded-circle" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>help</span>
            </a>
            <a className="text-secondary hover-text-light text-decoration-none" href="#">
              <span className="material-symbols-outlined p-2 rounded-circle" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>settings</span>
            </a>
          </div>
        </Container>
      </footer>

      {/* The Player Bar (Desktop Persistent) */}
      <div className="d-none d-md-flex position-fixed bottom-0 start-0 w-100 border-top border-secondary z-3 align-items-center justify-content-between px-4 py-2" style={{ backgroundColor: 'rgba(30, 41, 59, 0.95)', backdropFilter: 'blur(10px)', height: '90px' }}>
        {/* Now Playing Info */}
        <div className="d-flex align-items-center gap-3 w-25">
          <img 
            className="rounded shadow-sm object-fit-cover" 
            style={{ width: '56px', height: '56px' }}
            alt="Album cover" 
            src="/assets/album_cover.png" 
          />
          <div>
            <p className="text-light fw-medium mb-0 text-truncate" style={{ cursor: 'pointer' }}>Chromatic Surge</p>
            <p className="text-secondary small mb-0 text-truncate" style={{ cursor: 'pointer' }}>Audio Kinetic</p>
          </div>
          <span className="material-symbols-outlined text-success ms-2" style={{ fontVariationSettings: "'FILL' 1", cursor: 'pointer' }}>favorite</span>
        </div>

        {/* Player Controls */}
        <div className="d-flex flex-column align-items-center justify-content-center w-50">
          <div className="d-flex align-items-center gap-4">
            <span className="material-symbols-outlined text-secondary hover-text-light" style={{ cursor: 'pointer' }}>shuffle</span>
            <span className="material-symbols-outlined text-secondary hover-text-light fs-4" style={{ cursor: 'pointer' }}>skip_previous</span>
            <button className="btn btn-success rounded-circle d-flex align-items-center justify-content-center shadow-lg border-0" style={{ width: '40px', height: '40px' }}>
              <span className="material-symbols-outlined text-dark" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
            </button>
            <span className="material-symbols-outlined text-secondary hover-text-light fs-4" style={{ cursor: 'pointer' }}>skip_next</span>
            <span className="material-symbols-outlined text-secondary hover-text-light" style={{ cursor: 'pointer' }}>repeat</span>
          </div>
          <div className="w-100 d-flex align-items-center gap-2 mt-1" style={{ maxWidth: '400px' }}>
            <span className="text-secondary" style={{ fontSize: '10px', width: '32px', textAlign: 'right' }}>1:24</span>
            <div className="flex-grow-1 position-relative" style={{ height: '4px', backgroundColor: '#37333e', borderRadius: '4px', cursor: 'pointer' }}>
              <div className="position-absolute top-0 start-0 h-100 bg-primary rounded-pill" style={{ width: '33%' }}></div>
            </div>
            <span className="text-secondary" style={{ fontSize: '10px', width: '32px' }}>3:45</span>
          </div>
        </div>

        {/* Extra Controls */}
        <div className="d-flex align-items-center justify-content-end gap-3 w-25 text-secondary">
          <span className="material-symbols-outlined hover-text-light" style={{ cursor: 'pointer' }}>queue_music</span>
          <span className="material-symbols-outlined hover-text-light" style={{ cursor: 'pointer' }}>speaker</span>
          <div className="d-flex align-items-center gap-2" style={{ width: '100px' }}>
            <span className="material-symbols-outlined hover-text-light" style={{ cursor: 'pointer' }}>volume_up</span>
            <div className="flex-grow-1 position-relative" style={{ height: '4px', backgroundColor: '#37333e', borderRadius: '4px', cursor: 'pointer' }}>
              <div className="position-absolute top-0 start-0 h-100 bg-light rounded-pill" style={{ width: '66%' }}></div>
            </div>
          </div>
          <span className="material-symbols-outlined hover-text-light ms-2" style={{ cursor: 'pointer' }}>open_in_full</span>
        </div>
      </div>
    </>
  );
};

export default Footer;
