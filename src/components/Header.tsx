import React from 'react';
import { Navbar, Nav, Container, Badge, Button } from 'react-bootstrap';
import { NavLink, Link } from 'react-router-dom';
import SearchBar from './SearchBar';

interface HeaderProps {
  cartCount: number;
  onSearch: (keyword: string) => void;
  isAuthenticated: boolean;
  onLoginToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartCount, onSearch, isAuthenticated, onLoginToggle }) => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top" className="navbar-dark shadow-lg">
      <Container fluid="xxl">
        <Navbar.Brand as={Link} to="/" className="fs-4 fw-bold text-primary tracking-tight">
          Auralis
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto mb-2 mb-lg-0 gap-lg-3 ms-lg-4">
            <Nav.Link as={NavLink} to="/" end className="px-3 py-2 rounded text-secondary hover-text-light">
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/tracks" className="px-3 py-2 rounded text-secondary hover-text-light">
              Library
            </Nav.Link>
            <Nav.Link as={NavLink} to="/admin/tracks" className="px-3 py-2 rounded text-secondary hover-text-light">
              Admin
            </Nav.Link>
          </Nav>
          
          <div className="d-flex align-items-center gap-3">
            <SearchBar onSearch={onSearch} />
            
            {/* Cart Icon */}
            <Link to="/cart" className="text-secondary hover-text-light p-2 position-relative text-decoration-none">
              <span className="material-symbols-outlined fs-5">shopping_cart</span>
              {cartCount > 0 && (
                <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle border border-dark rounded-circle" style={{ fontSize: '0.65rem' }}>
                  {cartCount}
                </Badge>
              )}
            </Link>
            
            <Button variant="link" className="text-secondary hover-text-light p-2 text-decoration-none">
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
