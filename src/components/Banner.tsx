import React from 'react';

const Banner: React.FC = () => {
  return (
    <div className="relative w-full h-[400px] flex items-center justify-center overflow-hidden mb-[64px] mt-[80px]">
      <div className="absolute inset-0 z-0">
        {/* Dùng biểu thức JS trong JSX: style={{ background: '...' }} theo đúng yêu cầu */}
        <div 
          className="w-full h-full opacity-60" 
          style={{ background: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB212qMvV2n5oO8-E9GfH6O3x8mGf7kP9_xMvK-Z6lJ2kOQnQy_u1u_vM-s3n0lP1O8cO8kH3T6W_jRkC3tGfF7E2B4l2_v4Z6T_v9fV0nQ_bL3X_n0L3Q_wN_qM_bN_wN_vJ_qK_pL') center / cover no-repeat", filter: "blur(4px)" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#15121b] via-[#15121b]/80 to-transparent"></div>
      </div>
      
      <div className="relative z-10 text-center px-[16px] flex flex-col items-center">
        {/* Tiêu đề lớn */}
        <h1 className="font-display text-[48px] text-[#e8dfee] mb-[8px] font-extrabold tracking-tight">
          What do you want to listen to?
        </h1>
        
        {/* Mô tả ngắn */}
        <p className="font-body-lg text-[#ccc3d8] mb-[32px] max-w-2xl text-[18px]">
          Search for artists, songs, or playlists to discover your next favorite track.
        </p>
        
        {/* Nút "Khám phá ngay" theo đúng yêu cầu TODO của cô */}
        <button className="bg-[#7c3aed] text-white px-8 py-4 rounded-full font-bold text-[18px] hover:bg-[#d2bbff] hover:text-[#25005a] transition-all shadow-[0_0_20px_rgba(124,58,237,0.5)] active:scale-95 flex items-center gap-2">
          <span className="material-symbols-outlined">explore</span>
          Khám phá ngay
        </button>
      </div>
    </div>
  );
};

export default Banner;
