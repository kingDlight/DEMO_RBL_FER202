import React from 'react';
import { Navbar, Nav, Container, Badge, Button } from 'react-bootstrap';
import { NavLink, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  isAuthenticated: boolean;
  onLoginToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ isAuthenticated, onLoginToggle }) => {
  const { totalItems } = useCart();
  const { isDark, toggleTheme } = useTheme();

  return (
    <Navbar bg={isDark ? "dark" : "light"} variant={isDark ? "dark" : "light"} expand="lg" fixed="top" className={isDark ? "navbar-dark shadow-lg" : "shadow-sm border-bottom"}>
      <Container fluid="xxl">
        <Navbar.Brand as={Link} to="/" className="fs-4 fw-bold text-primary tracking-tight">
          Auralis
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto mb-2 mb-lg-0 gap-lg-3 ms-lg-4">
            <Nav.Link as={NavLink} to="/" end className="px-3 py-2 rounded fw-medium">
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/tracks" className="px-3 py-2 rounded fw-medium">
              Library
            </Nav.Link>
            <Nav.Link as={NavLink} to="/admin/tracks" className="px-3 py-2 rounded fw-medium">
              Admin
            </Nav.Link>
          </Nav>
          
          <div className="d-flex align-items-center gap-3">
            {/* Cart Icon */}
            <Link to="/cart" className={`p-2 position-relative text-decoration-none ${isDark ? 'text-secondary hover-text-light' : 'text-muted hover-text-dark'}`}>
              <span className="material-symbols-outlined fs-5">shopping_cart</span>
              {totalItems > 0 && (
                <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle border border-dark rounded-circle" style={{ fontSize: '0.65rem' }}>
                  {totalItems}
                </Badge>
              )}
            </Link>
            
            <Button variant="link" onClick={toggleTheme} className={`p-2 text-decoration-none ${isDark ? 'text-secondary hover-text-light' : 'text-muted hover-text-dark'}`}>
              <span className="material-symbols-outlined fs-5">contrast</span>
            </Button>
            
            <Button 
              variant={isAuthenticated ? "outline-danger" : "outline-success"} 
              onClick={onLoginToggle} 
              className="rounded-pill px-4 py-2 fw-semibold"
            >
              {isAuthenticated ? "Logout" : "Login"}
            </Button>
            
            <img 
              alt="User avatar" 
              className="rounded-circle border border-secondary object-fit-cover" 
              style={{ width: '40px', height: '40px' }}
              src="/assets/user_avatar.png" 
            />
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
