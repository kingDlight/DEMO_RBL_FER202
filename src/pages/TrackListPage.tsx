import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import SectionWrapper from '../components/SectionWrapper';
import CategoryList from '../components/CategoryList';
import TrackGrid from '../components/TrackGrid';
import { CATEGORIES, TRACKS } from '../data/tracks';
import type { Track } from '../components/TrackCard';

interface TrackListPageProps {
  keyword: string;
  onAddToCart: (track: Track) => void;
}

const TrackListPage: React.FC<TrackListPageProps> = ({ keyword, onAddToCart }) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredTracks = TRACKS.filter((track) => {
    const matchKw = !keyword || track.title.toLowerCase().includes(keyword.toLowerCase());
    const matchCat = activeCategory === null || track.category === activeCategory;
    return matchKw && matchCat;
  });

  const handlePlay = (track: Track) => {
    console.log(`Đang phát bài hát: ${track.title} - ${track.artist}`);
  };

  return (
    <Container fluid="xxl">
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
        <TrackGrid 
          tracks={filteredTracks} 
          onPlay={handlePlay} 
          onAddToCart={onAddToCart} 
        />
      </SectionWrapper>
    </Container>
  );
};

export default TrackListPage;
