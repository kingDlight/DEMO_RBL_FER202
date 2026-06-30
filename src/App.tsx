import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import AdminTable from './components/AdminTable';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import TrackListPage from './pages/TrackListPage';
import TrackDetailPage from './pages/TrackDetailPage';
import CartPage from './pages/CartPage';
import NotFoundPage from './pages/NotFoundPage';
import { TRACKS } from './data/tracks';
import type { Track } from './components/TrackCard';

export interface CartItem extends Track {
  quantity: number;
}

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [keyword, setKeyword] = useState<string>('');
  
  // Mock authentication state for ProtectedRoute demonstration
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const handleAddToCart = (track: Track) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === track.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === track.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...track, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (id: number, delta: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + delta } : item
      )
    );
  };

  const handleRemoveFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const handleSearch = (newKeyword: string) => {
    setKeyword(newKeyword);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="d-flex flex-column min-vh-100 pb-5 pb-lg-0">
      <Header 
        cartCount={totalItems} 
        onSearch={handleSearch} 
        isAuthenticated={isAuthenticated} 
        onLoginToggle={() => setIsAuthenticated(!isAuthenticated)} 
      />
      
      <main className="flex-grow-1 w-100 pt-5 mt-4">
        <Routes>
          <Route path="/" element={<HomePage keyword={keyword} onAddToCart={handleAddToCart} />} />
          <Route path="/tracks" element={<TrackListPage keyword={keyword} onAddToCart={handleAddToCart} />} />
          <Route path="/tracks/:id" element={<TrackDetailPage onAddToCart={handleAddToCart} />} />
          <Route path="/cart" element={
            <CartPage 
              cartItems={cart} 
              onUpdateQuantity={handleUpdateQuantity} 
              onRemove={handleRemoveFromCart} 
            />
          } />
          <Route path="/admin/tracks" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AdminTable initialTracks={TRACKS} />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  );
};

export default App;
