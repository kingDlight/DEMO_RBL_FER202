import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Button, Card, Badge } from 'react-bootstrap';
import { TRACKS } from '../data/tracks';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

const TrackDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isDark } = useTheme();

  const track = TRACKS.find((t) => t.id === parseInt(id || '0', 10));

  if (!track) {
    return (
      <Container className="text-center py-5 text-body">
        <h2>Không tìm thấy bài hát</h2>
        <p>Bài hát bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
        <Button variant="outline-primary" onClick={() => navigate(-1)}>
          Quay lại
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-5 text-body">
      <div className="mb-4">
        <Link to="/" className="text-secondary text-decoration-none">Trang chủ</Link>
        <span className="mx-2 text-secondary">&gt;</span>
        <Link to="/tracks" className="text-secondary text-decoration-none">Nhạc</Link>
        <span className="mx-2 text-secondary">&gt;</span>
        <span>{track.title}</span>
      </div>

      <Card bg={isDark ? "dark" : "light"} text={isDark ? "white" : "dark"} className="border-0 shadow-lg" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="row g-0">
          <div className="col-md-5">
            <Card.Img src={track.image} alt={track.title} className="h-100 object-fit-cover" />
          </div>
          <div className="col-md-7">
            <Card.Body className="d-flex flex-column h-100 justify-content-center p-4">
              <Badge bg="secondary" className="align-self-start mb-2">{track.category}</Badge>
              <Card.Title as="h2" className="mb-3">{track.title}</Card.Title>
              <Card.Subtitle className="mb-4 text-muted fs-5">{track.artist}</Card.Subtitle>
              
              <div className="mb-4">
                {track.price > 0 ? (
                  <div className="d-flex align-items-baseline gap-2">
                    <span className="fs-3 fw-bold text-primary">${track.price}</span>
                    <span className="text-decoration-line-through text-muted">${track.originalPrice}</span>
                  </div>
                ) : (
                  <span className="fs-3 fw-bold text-success">Free</span>
                )}
              </div>
              
              <p className="mb-4">
                <strong>Còn lại:</strong> {track.stock} bản
              </p>

              <div className="d-flex gap-3 mt-auto">
                <Button variant="primary" onClick={() => addToCart(track)}>
                  Thêm vào giỏ hàng
                </Button>
                <Button variant="outline-light" onClick={() => navigate(-1)}>
                  Quay lại
                </Button>
              </div>
            </Card.Body>
          </div>
        </div>
      </Card>
    </Container>
  );
};

export default TrackDetailPage;
