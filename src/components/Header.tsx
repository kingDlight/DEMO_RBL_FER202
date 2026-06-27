import React from 'react';

const Header: React.FC = () => {
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
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#ccc3d8]">search</span>
            <input className="bg-[#2c2833] border-[#4a4455] text-[#e8dfee] rounded-full pl-10 pr-4 py-2 focus:border-[#7c3aed] focus:ring-[#7c3aed] font-body-md text-[16px] w-64" placeholder="Search..." type="text" />
          </div>
          
          {/* Icon giỏ hàng/thông báo với số 0 (Hardcode theo requirement) */}
          <button className="relative text-[#ccc3d8] hover:text-[#e8dfee] hover:bg-white/5 p-2 rounded-full transition-all active:scale-95">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-0 right-0 bg-[#ffb4ab] text-[#690005] text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-[#15121b]">
              0
            </span>
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
