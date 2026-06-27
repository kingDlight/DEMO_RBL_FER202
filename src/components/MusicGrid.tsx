import React from 'react';
import MusicCard from './MusicCard';

const MusicGrid: React.FC = () => {
  // Khai báo biến mảng dữ liệu (3-4 object) theo đúng yêu cầu
  const MUSIC_DATA = [
    { id: 1, title: "Neon Streets", artist: "Midnight Syndicate" },
    { id: 2, title: "Resonance", artist: "HOME" },
    { id: 3, title: "Nightcall", artist: "Kavinsky" },
    { id: 4, title: "Pacific Coast Highway", artist: "Kavinsky" }
  ];

  return (
    <section className="px-[16px] md:px-[32px] mb-[64px]">
      <div className="flex justify-between items-end mb-[24px]">
        <h2 className="font-headline-lg text-[32px] font-bold text-[#e8dfee]">Trending Playlists</h2>
        <a className="font-label-md text-[14px] text-[#d2bbff] hover:text-[#7c3aed] transition-colors cursor-pointer">
          View All
        </a>
      </div>
      
      {/* Thay Bootstrap grid (container/row/col) bằng Tailwind Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[24px]">
        {/* Dùng .map() duyệt mảng để render list <MusicCard /> */}
        {MUSIC_DATA.map((item) => (
          /* Lưu ý: Do MusicCard hiện đang bị yêu cầu "không dùng props" ở Task C, 
             nên list render ra sẽ hiển thị các card giống hệt nhau (hardcode). 
             Điều này hoàn toàn đúng ý đồ bài tập Tuần 2 để học cú pháp .map() */
          <div key={item.id} className="flex justify-center">
             <MusicCard />
          </div>
        ))}
      </div>
    </section>
  );
};

export default MusicGrid;
