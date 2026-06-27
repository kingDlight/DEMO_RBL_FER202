import React from 'react';

const MusicCard: React.FC = () => {
  // Dữ liệu hardcode trực tiếp trong component (không dùng props theo đúng TODO Tuần 2)
  const musicData = {
    title: "Late Night Vibes",
    artist: "Curated by Auralis",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBXgu00OTJNCxz1JCmNZZ0YJPPrwsKXqeGGKJlUfqDoqy4PGI_o91mdzfgCxttI8ZbVXCuROGYFpdUE2bcvuaQ9Ke7tD6itfcHSBgn3evuajxeKfUj-AqZ-1L8f3_2nndUWBgHPPoQkO3qckY4xZgLqCV5S9vVwlQIYNuFQMjjoUBAiRBwwd3xKIw1_kPRlhUWcUWhPsNh5IvlNvc47vWlQ7-nW2o6Q7Wy1YPyMCxUg3c9yvwkrPmQ7_mcJeB3ej3JKj_3cz9wFmnFh",
    salePrice: "Free",
    originalPrice: "$1.99"
  };

  return (
    <div className="group relative bg-[#1d1a24] rounded-xl overflow-hidden hover:bg-[#37333e] transition-colors cursor-pointer w-64 shadow-lg border border-white/5">
      <div className="relative w-full aspect-square overflow-hidden">
        {/* Ảnh bìa */}
        <img 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
          alt={musicData.title} 
          src={musicData.image} 
        />
        
        {/* Lớp phủ khi hover chứa các nút chức năng */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
          {/* Nút Play/Thêm vào giỏ (chưa có chức năng) */}
          <button className="w-12 h-12 rounded-full bg-[#7c3aed] text-[#ede0ff] flex items-center justify-center hover:scale-110 transition-transform shadow-[0_4px_12px_rgba(124,58,237,0.4)]">
            <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
          </button>
          
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full bg-[#221e28]/80 text-[#e8dfee] flex items-center justify-center hover:bg-[#3c3742] hover:text-[#d2bbff] transition-colors">
              <span className="material-symbols-outlined">add</span>
            </button>
            <button className="w-10 h-10 rounded-full bg-[#221e28]/80 text-[#e8dfee] flex items-center justify-center hover:bg-[#3c3742] hover:text-[#ffb4ab] transition-colors">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        {/* Tên bài/playlist */}
        <h3 className="font-label-md text-[16px] text-[#e8dfee] truncate font-bold">{musicData.title}</h3>
        
        {/* Tác giả */}
        <p className="font-label-sm text-[14px] text-[#ccc3d8] truncate mt-1">{musicData.artist}</p>
        
        {/* Giá bán & Giá gốc (Để lách luật theo đúng format yêu cầu của cô giáo) */}
        <div className="mt-3 flex items-center gap-2">
          <span className="font-bold text-[#4ae176] text-[14px]">{musicData.salePrice}</span>
          <span className="text-[#958da1] text-[12px] line-through">{musicData.originalPrice}</span>
        </div>
      </div>
    </div>
  );
};

export default MusicCard;
