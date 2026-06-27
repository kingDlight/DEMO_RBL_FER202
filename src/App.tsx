import React from 'react';
import Header from './components/Header';
import Banner from './components/Banner';
import CategoryList from './components/CategoryList';
import MusicGrid from './components/MusicGrid';
import Footer from './components/Footer';

// Tích hợp toàn bộ component cho Tuần 2 theo đúng thứ tự
const App: React.FC = () => {
  return (
    <div className="bg-[#0f172a] text-[#e8dfee] font-body-md min-h-screen flex flex-col pb-[120px] lg:pb-0 overflow-x-hidden">
      {/* 1. Header Navigation */}
      <Header />
      
      <main className="flex-grow w-full max-w-screen-2xl mx-auto pt-[80px]">
        {/* 2. Hero Banner */}
        <Banner />
        
        {/* 3. Category List (có Conditional Rendering bên trong) */}
        <CategoryList />
        
        {/* 4. Grid hiển thị nhạc */}
        <MusicGrid />
      </main>
      
      {/* 5. Footer & Player Bar */}
      <Footer />
    </div>
  );
};

export default App;
