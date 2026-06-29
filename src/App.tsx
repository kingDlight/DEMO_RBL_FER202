import React, { useState } from 'react';
import Header from './components/Header';
import Banner from './components/Banner';
import CategoryList from './components/CategoryList';
import TrackGrid from './components/TrackGrid';
import Footer from './components/Footer';
import SectionWrapper from './components/SectionWrapper';
import type { Track } from './components/TrackCard';

export interface CartItem extends Track {
  quantity: number;
}

// Dữ liệu mock
const CATEGORIES = ["All", "Electronic", "Synthwave", "Lo-Fi", "Ambient", "Pop", "Rock", "Jazz"];

const TRACKS: Track[] = [
  { id: 1, title: "Late Night Vibes", artist: "Curated by Auralis", image: "/assets/album_cover.png", price: 0, originalPrice: 1.99, stock: 100, category: "Lo-Fi" },
  { id: 2, title: "Resonance", artist: "HOME", image: "/assets/album_cover.png", price: 1.49, originalPrice: 1.99, stock: 50, category: "Synthwave" },
  { id: 3, title: "Nightcall", artist: "Kavinsky", image: "/assets/album_cover.png", price: 0.99, originalPrice: 0.99, stock: 0, category: "Electronic" },
  { id: 4, title: "Pacific Coast Highway", artist: "Kavinsky", image: "/assets/album_cover.png", price: 2.99, originalPrice: 3.99, stock: 20, category: "Synthwave" }
];

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [keyword, setKeyword] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handlePlay = (track: Track) => {
    console.log(`Đang phát bài hát: ${track.title} - ${track.artist}`);
  };

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

  const handleSearch = (newKeyword: string) => {
    setKeyword(newKeyword);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const filteredTracks = TRACKS.filter((track) => {
    const matchKw = !keyword || track.title.toLowerCase().includes(keyword.toLowerCase());
    const matchCat = activeCategory === null || track.category === activeCategory;
    return matchKw && matchCat;
  });

  return (
    <div className="bg-[#0f172a] text-[#e8dfee] font-body-md min-h-screen flex flex-col pb-[120px] lg:pb-0 overflow-x-hidden">
      {/* 1. Header Navigation */}
      <Header cartCount={totalItems} onSearch={handleSearch} />
      
      <main className="flex-grow w-full max-w-screen-2xl mx-auto pt-[80px]">
        {/* 2. Hero Banner */}
        <Banner />
        
        {/* 3. Category List bọc trong SectionWrapper */}
        <SectionWrapper title="Browse Categories">
          <CategoryList 
            categories={CATEGORIES} 
            activeCategory={activeCategory} 
            onSelectCategory={setActiveCategory} 
          />
        </SectionWrapper>
        
        {/* 4. Grid hiển thị nhạc bọc trong SectionWrapper */}
        <SectionWrapper 
          title="Trending Playlists" 
          subtitle="Top tracks curated just for you this week"
        >
          <TrackGrid 
            tracks={filteredTracks} 
            onPlay={handlePlay} 
            onAddToCart={handleAddToCart} 
          />
        </SectionWrapper>
      </main>
      
      {/* 5. Footer & Player Bar */}
      <Footer />
    </div>
  );
};

export default App;
