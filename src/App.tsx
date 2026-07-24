import React, { Suspense, lazy } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import PlayerBar from './components/PlayerBar';
import BottomNav from './components/BottomNav';
import HomeLayout from './layouts/HomeLayout';
import PlayerLayout from './layouts/PlayerLayout';
import StandardLayout from './layouts/StandardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import { usePlayer } from './context/player';
import { ToastContainer } from './components/ToastContainer';

import { AnimatePresence } from 'framer-motion';

const HomePage = lazy(() => import('./pages/HomePage'));
const TrackListPage = lazy(() => import('./pages/TrackListPage'));
const TrackDetailPage = lazy(() => import('./pages/TrackDetailPage'));
const LibraryPage = lazy(() => import('./pages/LibraryPage'));
const PlaylistPage = lazy(() => import('./pages/PlaylistPage'));
const ArtistsPage = lazy(() => import('./pages/ArtistsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const AdminPage = lazy(() => import('./pages/AdminPage'));

const PageSpinner = () => (
  <div className="flex min-h-[60vh] items-center justify-center gap-md text-on-surface-variant">
    <div className="h-9 w-9 animate-spin rounded-full border-2 border-outline-variant border-t-primary" />
    <span className="font-label-md text-label-md">Loading page...</span>
  </div>
);

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { hasActiveTrack } = usePlayer();
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="min-h-screen bg-background text-on-background antialiased pb-20 md:pb-0">
      {!isLoginPage && <Header />}
      <ToastContainer />
      {!isLoginPage && <BottomNav />}
      {!isLoginPage && hasActiveTrack && <PlayerBar />}

      <Suspense fallback={<PageSpinner />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/login" element={<LoginPage />} />

            <Route element={<HomeLayout />}>
              <Route path="/" element={<HomePage />} />
            </Route>

            <Route element={<PlayerLayout />}>
              <Route path="/tracks" element={<TrackListPage />} />
              <Route path="/library" element={<LibraryPage />} />
              <Route path="/playlist/:id?" element={<PlaylistPage />} />
              <Route path="/artists" element={<ArtistsPage />} />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <ProfilePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <AdminPage />
                  </ProtectedRoute>
                } 
              />
            </Route>

            <Route element={<StandardLayout />}>
              <Route path="/tracks/:id" element={<TrackDetailPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </AnimatePresence>
      </Suspense>
    </div>
  );
};

export default App;
