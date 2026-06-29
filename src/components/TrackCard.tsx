import React from 'react';

export interface Track {
  id: number;
  title: string;
  artist: string;
  image: string;
  price: number;
  originalPrice: number;
  stock: number;
}

interface TrackCardProps {
  track: Track;
  onPlay: (track: Track) => void;
}

const TrackCard: React.FC<TrackCardProps> = ({ track, onPlay }) => {
  const isOutOfStock = track.stock === 0;
  const hasDiscount = track.originalPrice > track.price;
  const discountPercent = hasDiscount 
    ? Math.round(((track.originalPrice - track.price) / track.originalPrice) * 100) 
    : 0;

  return (
    <div className={`group relative bg-[#1d1a24] rounded-xl overflow-hidden transition-colors w-64 shadow-lg border border-white/5 ${isOutOfStock ? 'opacity-70' : 'hover:bg-[#37333e] cursor-pointer'}`}>
      <div className="relative w-full aspect-square overflow-hidden">
        {/* Ảnh bìa */}
        <img 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
          alt={track.title} 
          src={track.image} 
        />
        
        {/* Discount Badge */}
        {hasDiscount && !isOutOfStock && (
          <div className="absolute top-3 left-3 bg-[#e84a5f] text-white text-xs font-bold px-2 py-1 rounded-md z-10 shadow-md">
            -{discountPercent}%
          </div>
        )}

        {/* Lớp phủ khi hover chứa các nút chức năng */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
          {/* Nút Play/Thêm vào giỏ */}
          <button 
            className="w-12 h-12 rounded-full bg-[#7c3aed] text-[#ede0ff] flex items-center justify-center hover:scale-110 transition-transform shadow-[0_4px_12px_rgba(124,58,237,0.4)] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed disabled:bg-gray-500"
            onClick={() => onPlay(track)}
            disabled={isOutOfStock}
          >
            <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
          </button>
          
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full bg-[#221e28]/80 text-[#e8dfee] flex items-center justify-center hover:bg-[#3c3742] hover:text-[#d2bbff] transition-colors disabled:opacity-50" disabled={isOutOfStock}>
              <span className="material-symbols-outlined">add</span>
            </button>
            <button className="w-10 h-10 rounded-full bg-[#221e28]/80 text-[#e8dfee] flex items-center justify-center hover:bg-[#3c3742] hover:text-[#ffb4ab] transition-colors disabled:opacity-50" disabled={isOutOfStock}>
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        {/* Tên bài/playlist */}
        <h3 className="font-label-md text-[16px] text-[#e8dfee] truncate font-bold">{track.title}</h3>
        
        {/* Tác giả */}
        <p className="font-label-sm text-[14px] text-[#ccc3d8] truncate mt-1">{track.artist}</p>
        
        {/* Giá bán & Giá gốc */}
        <div className="mt-3 flex items-center gap-2">
          <span className="font-bold text-[#4ae176] text-[14px]">
            {track.price === 0 ? "Free" : `$${track.price.toFixed(2)}`}
          </span>
          {hasDiscount && (
            <span className="text-[#958da1] text-[12px] line-through">${track.originalPrice.toFixed(2)}</span>
          )}
        </div>
        
        {/* Trạng thái kho (stock) */}
        {isOutOfStock && (
          <p className="text-[#e84a5f] text-[12px] mt-1 font-medium">Not Available</p>
        )}
      </div>
    </div>
  );
};

export default TrackCard;
