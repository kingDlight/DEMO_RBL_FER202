import React from 'react';

const Footer: React.FC = () => {
  return (
    <>
      {/* Footer Content */}
      <footer className="mt-[64px] border-t border-white/10 pt-[32px] pb-[120px] flex flex-col md:flex-row justify-between items-center px-[32px] gap-[24px] bg-[#1d1a24]">
        <div className="flex items-center gap-[8px]">
          <span className="font-display text-[24px] font-extrabold text-[#d2bbff]">Auralis</span>
          <span className="font-body-md text-[#ccc3d8] ml-[8px]">© 2024 Auralis Audio. All rights reserved.</span>
        </div>
        <div className="flex gap-[16px]">
          <a className="text-[#ccc3d8] hover:text-[#d2bbff] transition-colors p-2 rounded-full hover:bg-white/5" href="#">
            <span className="material-symbols-outlined">share</span>
          </a>
          <a className="text-[#ccc3d8] hover:text-[#d2bbff] transition-colors p-2 rounded-full hover:bg-white/5" href="#">
            <span className="material-symbols-outlined">help</span>
          </a>
          <a className="text-[#ccc3d8] hover:text-[#d2bbff] transition-colors p-2 rounded-full hover:bg-white/5" href="#">
            <span className="material-symbols-outlined">settings</span>
          </a>
        </div>
      </footer>

      {/* The Player Bar (Desktop Persistent) */}
      <div className="hidden md:flex fixed bottom-0 left-0 w-full h-[96px] bg-[#1e293b]/70 backdrop-blur-xl border-t border-[#37333e]/50 z-[60] px-[32px] items-center justify-between">
        {/* Now Playing Info */}
        <div className="flex items-center gap-[16px] w-1/4">
          <img 
            className="w-14 h-14 rounded-md shadow-md object-cover" 
            alt="Album cover" 
            src="/assets/album_cover.png" 
          />
          <div>
            <p className="font-body-md text-[#e8dfee] font-medium line-clamp-1 hover:underline cursor-pointer">Chromatic Surge</p>
            <p className="font-label-sm text-[#ccc3d8] line-clamp-1 hover:underline cursor-pointer">Audio Kinetic</p>
          </div>
          <span className="material-symbols-outlined text-[#4ae176] ml-[8px] cursor-pointer" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
        </div>

        {/* Player Controls */}
        <div className="flex flex-col items-center justify-center w-2/4">
          <div className="flex items-center gap-[24px]">
            <span className="material-symbols-outlined text-[#ccc3d8] hover:text-[#e8dfee] cursor-pointer">shuffle</span>
            <span className="material-symbols-outlined text-[#ccc3d8] hover:text-[#e8dfee] cursor-pointer text-3xl">skip_previous</span>
            <button className="w-10 h-10 rounded-full bg-[#22c55e] flex items-center justify-center text-[#15121b] hover:scale-105 transition-transform shadow-lg">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
            </button>
            <span className="material-symbols-outlined text-[#ccc3d8] hover:text-[#e8dfee] cursor-pointer text-3xl">skip_next</span>
            <span className="material-symbols-outlined text-[#ccc3d8] hover:text-[#e8dfee] cursor-pointer">repeat</span>
          </div>
          <div className="w-full flex items-center gap-[8px] mt-[4px] max-w-md">
            <span className="text-[10px] text-[#ccc3d8] w-8 text-right">1:24</span>
            <div className="h-1 bg-[#37333e] rounded-full flex-grow relative group cursor-pointer">
              <div className="absolute top-0 left-0 h-full bg-[#7c3aed] rounded-full w-1/3 group-hover:bg-[#22c55e] transition-colors"></div>
              <div className="absolute top-1/2 -mt-1.5 left-1/3 -ml-1.5 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow"></div>
            </div>
            <span className="text-[10px] text-[#ccc3d8] w-8">3:45</span>
          </div>
        </div>

        {/* Extra Controls */}
        <div className="flex items-center justify-end gap-[16px] w-1/4 text-[#ccc3d8]">
          <span className="material-symbols-outlined hover:text-[#e8dfee] cursor-pointer">queue_music</span>
          <span className="material-symbols-outlined hover:text-[#e8dfee] cursor-pointer">speaker</span>
          <div className="flex items-center gap-[8px] w-24">
            <span className="material-symbols-outlined hover:text-[#e8dfee] cursor-pointer">volume_up</span>
            <div className="h-1 bg-[#37333e] rounded-full flex-grow relative group cursor-pointer">
              <div className="absolute top-0 left-0 h-full bg-white rounded-full w-2/3 group-hover:bg-[#22c55e]"></div>
            </div>
          </div>
          <span className="material-symbols-outlined hover:text-[#e8dfee] cursor-pointer ml-[8px]">open_in_full</span>
        </div>
      </div>
    </>
  );
};

export default Footer;
