import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import Banner from '../components/Banner';
import SectionWrapper from '../components/SectionWrapper';
import CategoryList from '../components/CategoryList';
import TrackGrid from '../components/TrackGrid';
import { CATEGORIES, TRACKS } from '../data/tracks';
import type { Track } from '../components/TrackCard';

const HomePage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredTracks = TRACKS.filter((track) => {
    const matchCat = activeCategory === null || track.category === activeCategory;
    return matchCat;
  });

  const handlePlay = (track: Track) => {
    console.log(`Đang phát bài hát: ${track.title} - ${track.artist}`);
  };

  return (
    <Container fluid="xxl">
      <Banner />
      
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
        />
      </SectionWrapper>
    </Container>
  );
};

export default HomePage;
