import React from 'react';
import { Navbar, Nav, Container, Badge, Button } from 'react-bootstrap';
import SearchBar from './SearchBar';

interface HeaderProps {
  cartCount: number;
  onSearch: (keyword: string) => void;
  onNavigate: (view: 'home' | 'admin') => void;
  view: 'home' | 'admin';
}

const Header: React.FC<HeaderProps> = ({ cartCount, onSearch, onNavigate, view }) => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top" className="navbar-dark shadow-lg">
      <Container fluid="xxl">
        <Navbar.Brand href="#" className="fs-4 fw-bold text-primary tracking-tight" onClick={() => onNavigate('home')}>
          Auralis
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto mb-2 mb-lg-0 gap-lg-3 ms-lg-4">
            <Nav.Link href="#" active={view === 'home'} onClick={() => onNavigate('home')} className={`px-3 py-2 rounded ${view === 'home' ? 'fw-bold' : 'text-secondary hover-text-light'}`}>Home</Nav.Link>
            <Nav.Link href="#" active={view === 'admin'} onClick={() => onNavigate('admin')} className={`px-3 py-2 rounded ${view === 'admin' ? 'fw-bold' : 'text-secondary hover-text-light'}`}>Admin</Nav.Link>
            <Nav.Link href="#" className="text-secondary hover-text-light px-3 py-2 rounded">Library</Nav.Link>
            <Nav.Link href="#" className="text-secondary hover-text-light px-3 py-2 rounded">Playlists</Nav.Link>
          </Nav>
          
          <div className="d-flex align-items-center gap-3">
            <SearchBar onSearch={onSearch} />
            
            {/* Cart Icon / Notifications */}
            <Button variant="link" className="text-secondary hover-text-light p-2 position-relative text-decoration-none">
              <span className="material-symbols-outlined fs-5">notifications</span>
              {cartCount > 0 && (
                <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle border border-dark rounded-circle" style={{ fontSize: '0.65rem' }}>
                  {cartCount}
                </Badge>
              )}
            </Button>
            
            <Button variant="link" className="text-secondary hover-text-light p-2 text-decoration-none">
              <span className="material-symbols-outlined fs-5">contrast</span>
            </Button>
            
            <Button variant="primary" className="rounded-pill px-4 py-2 fw-semibold text-white">
              Premium
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
