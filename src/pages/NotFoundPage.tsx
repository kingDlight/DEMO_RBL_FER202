import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <Container className="text-center py-5 text-white d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
      <h1 className="display-1 fw-bold text-primary">404</h1>
      <h2 className="mb-4">Trang không tồn tại</h2>
      <p className="mb-4 text-muted">Có vẻ như bạn đã đi lạc. Đường dẫn bạn đang tìm kiếm không có thật hoặc đã bị di dời.</p>
      <Link to="/">
        <Button variant="outline-light" size="lg">Quay về Trang chủ</Button>
      </Link>
    </Container>
  );
};

export default NotFoundPage;
