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

const App: React.FC = () => {
  // Mock authentication state for ProtectedRoute demonstration
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  return (
    <div className="d-flex flex-column min-vh-100 pb-5 pb-lg-0">
      <Header 
        isAuthenticated={isAuthenticated} 
        onLoginToggle={() => setIsAuthenticated(!isAuthenticated)} 
      />
      
      <main className="flex-grow-1 w-100 pt-5 mt-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tracks" element={<TrackListPage />} />
          <Route path="/tracks/:id" element={<TrackDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
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
