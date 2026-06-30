import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export interface Track {
  id: number;
  title: string;
  artist: string;
  image: string;
  price: number;
  originalPrice: number;
  stock: number;
  category?: string;
}

interface TrackCardProps {
  track: Track;
  onPlay: (track: Track) => void;
  onAddToCart: (track: Track) => void;
}

const TrackCard: React.FC<TrackCardProps> = ({ track, onPlay, onAddToCart }) => {
  const navigate = useNavigate();
  const isOutOfStock = track.stock === 0;
  const hasDiscount = track.originalPrice > track.price;
  const discountPercent = hasDiscount 
    ? Math.round(((track.originalPrice - track.price) / track.originalPrice) * 100) 
    : 0;

  const handleGoToDetail = () => {
    navigate(`/tracks/${track.id}`);
  };

  return (
    <Card className={`h-100 shadow-sm auralis-card border-0 text-white ${isOutOfStock ? 'opacity-75' : ''}`}>
      <div className="position-relative overflow-hidden group" style={{ cursor: 'pointer' }} onClick={handleGoToDetail}>
        <Card.Img 
          variant="top" 
          src={track.image} 
          alt={track.title}
          className="object-fit-cover"
          style={{ aspectRatio: '1/1', transition: 'transform 0.5s ease' }}
          onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />
        
        {/* Discount Badge */}
        {hasDiscount && !isOutOfStock && (
          <Badge bg="danger" className="position-absolute top-0 start-0 m-2 z-1 shadow">
            -{discountPercent}%
          </Badge>
        )}

        {/* Hover overlay for Play button */}
        {!isOutOfStock && (
          <div className="position-absolute top-50 start-50 translate-middle">
            <Button 
              variant="primary" 
              className="rounded-circle p-3 d-flex align-items-center justify-content-center shadow"
              style={{ width: '48px', height: '48px', opacity: 0.9 }}
              onClick={(e) => {
                e.stopPropagation(); // Ngăn sự kiện click Card
                onPlay(track);
              }}
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
            </Button>
          </div>
        )}
      </div>

      <Card.Body className="d-flex flex-column">
        {track.category && (
          <div className="mb-2">
            <Badge bg="info" className="text-dark fw-bold">{track.category}</Badge>
          </div>
        )}
        <Card.Title 
          className="fs-6 fw-bold text-truncate mb-1" 
          style={{ cursor: 'pointer' }}
          onClick={handleGoToDetail}
        >
          {track.title}
        </Card.Title>
        <Card.Subtitle className="text-secondary small mb-3 text-truncate">
          {track.artist}
        </Card.Subtitle>
        
        <div className="mt-auto">
          <div className="d-flex align-items-center gap-2 mb-3">
            <span className="fw-bold text-success">
              {track.price === 0 ? "Free" : `$${track.price.toFixed(2)}`}
            </span>
            {hasDiscount && (
              <span className="text-secondary small text-decoration-line-through">
                ${track.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {isOutOfStock ? (
            <p className="text-danger small fw-semibold text-center mb-0">Not Available</p>
          ) : (
            <Button 
              variant="primary" 
              size="sm" 
              className="w-100 fw-bold d-flex align-items-center justify-content-center gap-2"
              onClick={() => onAddToCart(track)}
            >
              <span className="material-symbols-outlined fs-6">add_shopping_cart</span>
              Add to Cart
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default TrackCard;
