import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (keyword: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [keyword, setKeyword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedKeyword = keyword.trim();
    
    // Validation
    if (trimmedKeyword.length > 0 && trimmedKeyword.length < 2) {
      setError('Search keyword must be at least 2 characters.');
      return;
    }
    
    setError('');
    onSearch(trimmedKeyword);
  };

  const handleClear = () => {
    setKeyword('');
    setError('');
    onSearch(''); // Reset search results as well
  };

  return (
    <div className="relative flex flex-col">
      <form onSubmit={handleSubmit} className="relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#ccc3d8]">search</span>
        <input 
          className="bg-[#2c2833] border-[#4a4455] text-[#e8dfee] rounded-full pl-10 pr-10 py-2 focus:border-[#7c3aed] focus:ring-[#7c3aed] font-body-md text-[16px] w-64 outline-none transition-all" 
          placeholder="Search tracks..." 
          type="text" 
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
            if (error) setError('');
          }}
        />
        {keyword !== '' && (
          <button 
            type="button" 
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#ccc3d8] hover:text-[#e8dfee] flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        )}
      </form>
      {error && (
        <div className="absolute top-[calc(100%+12px)] left-1/2 -translate-x-1/2 bg-[#410002] border border-[#93000a] text-[#ffb4ab] text-[12px] font-bold px-3 py-1.5 rounded-lg whitespace-nowrap shadow-[0_4px_12px_rgba(232,74,95,0.15)] z-50 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[14px]">error</span>
          <span>Please enter at least 2 characters.</span>
          {/* Mũi tên chỉ lên của tooltip */}
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#410002] border-t border-l border-[#93000a] rotate-45"></div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
