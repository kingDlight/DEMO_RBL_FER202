import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

interface CategoryListProps {
  categories: string[];
  activeCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({ categories, activeCategory, onSelectCategory }) => {
  return (
    <Container fluid className="px-0">
      {categories && categories.length > 0 ? (
        <Row xs={2} sm={3} md={4} lg={6} className="g-3">
          {categories.map((cat, index) => {
            const isActive = activeCategory === cat || (activeCategory === null && cat === 'All');
            return (
              <Col key={index}>
                <Card 
                  className={`text-center h-100 auralis-card cursor-pointer border-0 ${isActive ? 'bg-primary text-white' : 'text-body'}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => onSelectCategory(cat === 'All' ? null : cat)}
                >
                  <Card.Body className="p-3 d-flex align-items-center justify-content-center">
                    <Card.Text className="mb-0 fw-semibold text-truncate">
                      {cat}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      ) : (
        <div className="text-secondary">Không có danh mục nào.</div>
      )}
    </Container>
  );
};

export default CategoryList;
