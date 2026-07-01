import React, { useState, useEffect, useRef } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import SectionWrapper from '../components/SectionWrapper';
import CategoryList from '../components/CategoryList';
import TrackGrid from '../components/TrackGrid';
import SearchBar from '../components/SearchBar';
import { CATEGORIES } from '../data/tracks';
import type { Track } from '../components/TrackCard';
import { useCart } from '../context/CartContext';
import { useFetch } from '../hooks/useFetch';
import { useDebounce } from '../hooks/useDebounce';

const TrackListPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [keyword, setKeyword] = useState<string>('');
  const debouncedKeyword = useDebounce(keyword, 400);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { totalItems } = useCart();

  // Prepare params for json-server (filtering on backend)
  const queryParams: Record<string, any> = {};
  if (debouncedKeyword) queryParams.q = debouncedKeyword;
  if (activeCategory) queryParams.category = activeCategory;

  // Custom Hook replaces useEffect + Axios logic
  const { data: tracks, loading, error } = useFetch<Track[]>('/tracks', queryParams);

  // Effect 1: Update document title
  useEffect(() => {
    const originalTitle = 'Auralis Bookstore';
    document.title = totalItems > 0 ? `(${totalItems}) Auralis Library` : originalTitle;
    
    return () => { 
      document.title = originalTitle;
    };
  }, [totalItems]);

  // Effect 2: Auto-focus search input after loading
  useEffect(() => {
    if (!loading && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [loading]);

  const handlePlay = (track: Track) => {
    console.log(`Đang phát bài hát: ${track.title} - ${track.artist}`);
  };

  return (
    <Container fluid="xxl">
      {/* Search Section */}
      <div className="py-4 d-flex flex-column align-items-center justify-content-center">
        <h2 className="display-6 fw-bold mb-4">Discover Music</h2>
        <div style={{ maxWidth: '600px', width: '100%' }}>
          <SearchBar ref={searchInputRef} onSearch={setKeyword} />
        </div>
      </div>

      <SectionWrapper title="Browse Categories">
        <CategoryList 
          categories={CATEGORIES} 
          activeCategory={activeCategory} 
          onSelectCategory={setActiveCategory} 
        />
      </SectionWrapper>
      
      <SectionWrapper 
        title="Trending Playlists" 
        subtitle="Top tracks curated just for you this week"
      >
        {loading ? (
          <div className="d-flex justify-content-center align-items-center py-5">
            <Spinner animation="border" variant="primary" />
            <span className="ms-3 text-secondary">Loading tracks...</span>
          </div>
        ) : error ? (
          <div className="alert alert-danger" role="alert">
            Failed to fetch tracks. Please check if json-server is running.
          </div>
        ) : (
          <TrackGrid 
            tracks={tracks || []} 
            onPlay={handlePlay} 
          />
        )}
      </SectionWrapper>
    </Container>
  );
};

export default TrackListPage;
