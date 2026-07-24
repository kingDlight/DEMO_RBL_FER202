import React from 'react';
import { useTheme } from '../context/ThemeContext';

// Migrated from React-Bootstrap to Tailwind CSS (Week 10 — feature/tailwind)
// No Bootstrap classes used in this component
const Banner: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <div className={`relative overflow-hidden shadow-lg ${isDark ? 'bg-gradient-to-r from-gray-900 via-violet-900 to-indigo-900 text-white' : 'bg-gradient-to-r from-violet-600 to-indigo-700 text-white'}`}>
      {/* Decorative background blobs */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute -top-10 -left-10 w-64 h-64 rounded-full bg-purple-400 blur-3xl"></div>
        <div className="absolute -bottom-10 -right-10 w-64 h-64 rounded-full bg-blue-400 blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-[1152px] mx-auto px-4 py-16 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
          What do you want to listen to?
        </h1>
        <p className="text-lg md:text-xl mb-8 opacity-80 max-w-[576px]">
          Search for artists, songs, or playlists to discover your next favorite track.
        </p>
        <button className="flex items-center gap-2 bg-white text-violet-700 font-semibold px-8 py-3 rounded-full hover:bg-violet-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0">
          <span className="material-symbols-outlined">explore</span>
          Khám phá ngay
        </button>
      </div>
    </div>
  );
};

export default Banner;
