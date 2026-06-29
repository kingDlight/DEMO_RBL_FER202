import React from 'react';
import SearchBar from './SearchBar';

interface HeaderProps {
  cartCount: number;
  onSearch: (keyword: string) => void;
}

const Header: React.FC<HeaderProps> = ({ cartCount, onSearch }) => {
  return (
    <>
      {/* TopNavBar (Desktop) */}
      <nav className="hidden md:flex bg-[#15121b]/70 backdrop-blur-xl fixed top-0 w-full z-50 border-b border-white/10 shadow-xl justify-between items-center px-[32px] py-[16px] max-w-full">
        <div className="flex items-center gap-[32px]">
          <span className="font-display text-[24px] font-extrabold text-[#d2bbff] tracking-tight">Auralis</span>
          <div className="flex items-center gap-[16px]">
            <a className="text-[#ccc3d8] hover:text-[#e8dfee] transition-colors hover:bg-white/5 px-3 py-2 rounded-lg font-label-md text-[14px]" href="#">Home</a>
            <a className="text-[#d2bbff] font-bold border-b-2 border-[#d2bbff] pb-1 px-3 py-2 font-label-md text-[14px]" href="#">Discover</a>
            <a className="text-[#ccc3d8] hover:text-[#e8dfee] transition-colors hover:bg-white/5 px-3 py-2 rounded-lg font-label-md text-[14px]" href="#">Library</a>
            <a className="text-[#ccc3d8] hover:text-[#e8dfee] transition-colors hover:bg-white/5 px-3 py-2 rounded-lg font-label-md text-[14px]" href="#">Playlists</a>
            <a className="text-[#ccc3d8] hover:text-[#e8dfee] transition-colors hover:bg-white/5 px-3 py-2 rounded-lg font-label-md text-[14px]" href="#">Artists</a>
          </div>
        </div>
        <div className="flex items-center gap-[24px]">
          <SearchBar onSearch={onSearch} />
          
          {/* Icon giỏ hàng/thông báo */}
          <button className="relative text-[#ccc3d8] hover:text-[#e8dfee] hover:bg-white/5 p-2 rounded-full transition-all active:scale-95">
            <span className="material-symbols-outlined">notifications</span>
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-[#ffb4ab] text-[#690005] text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-[#15121b]">
                {cartCount}
              </span>
            )}
          </button>
          
          <button className="text-[#ccc3d8] hover:text-[#e8dfee] hover:bg-white/5 p-2 rounded-full transition-all active:scale-95">
            <span className="material-symbols-outlined">contrast</span>
          </button>
          <button className="bg-[#7c3aed] text-[#ede0ff] px-6 py-2 rounded-full font-label-md text-[14px] hover:bg-[#d2bbff] hover:text-[#3f008e] transition-all active:scale-95">Premium</button>
          <img alt="User avatar" className="w-10 h-10 rounded-full object-cover border border-[#4a4455]" src="/assets/user_avatar.png" />
        </div>
      </nav>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden bg-[#221e28]/80 backdrop-blur-xl fixed bottom-0 w-full z-50 border-t border-white/10 shadow-[0px_-10px_40px_rgba(0,0,0,0.4)] flex justify-around items-center px-4 py-3">
        <a className="flex flex-col items-center justify-center text-[#ccc3d8] hover:text-[#d2bbff] transition-colors scale-110 duration-200" href="#">
          <span className="material-symbols-outlined">home</span>
          <span className="font-label-sm text-[12px]">Home</span>
        </a>
        <a className="flex flex-col items-center justify-center text-[#d2bbff] scale-110 duration-200" href="#">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>explore</span>
          <span className="font-label-sm text-[12px]">Discover</span>
        </a>
        <a className="flex flex-col items-center justify-center text-[#ccc3d8] hover:text-[#d2bbff] transition-colors scale-110 duration-200" href="#">
          <span className="material-symbols-outlined">library_music</span>
          <span className="font-label-sm text-[12px]">Library</span>
        </a>
        <a className="flex flex-col items-center justify-center text-[#ccc3d8] hover:text-[#d2bbff] transition-colors scale-110 duration-200" href="#">
          <span className="material-symbols-outlined">playlist_play</span>
          <span className="font-label-sm text-[12px]">Playlists</span>
        </a>
        <a className="flex flex-col items-center justify-center text-[#ccc3d8] hover:text-[#d2bbff] transition-colors scale-110 duration-200" href="#">
          <span className="material-symbols-outlined">person</span>
          <span className="font-label-sm text-[12px]">Artists</span>
        </a>
      </nav>
    </>
  );
};

export default Header;
