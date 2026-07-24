import React, { forwardRef, useState } from 'react';

interface SearchBarProps {
  onSearch: (keyword: string) => void;
}

const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(({ onSearch }, ref) => {
  const [keyword, setKeyword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedKeyword = keyword.trim();

    if (trimmedKeyword.length > 0 && trimmedKeyword.length < 2) {
      setError('Please enter at least 2 characters.');
      return;
    }

    setError('');
    onSearch(trimmedKeyword);
  };

  const handleClear = () => {
    setKeyword('');
    setError('');
    onSearch('');
  };

  return (
    <div className="relative w-full">
      <form className="flex w-full items-center" onSubmit={handleSubmit}>
        <div className="flex w-full items-center overflow-hidden rounded-full border border-outline-variant bg-surface-container-high shadow-sm">
          <span className="material-symbols-outlined ml-md text-on-surface-variant">
            search
          </span>
          <input
            ref={ref}
            type="text"
            placeholder="Search tracks..."
            value={keyword}
            onChange={(e) => {
              const value = e.target.value;
              setKeyword(value);
              onSearch(value);
              if (error) setError('');
            }}
            className="min-w-0 flex-1 bg-transparent px-sm py-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none"
          />
          {keyword !== '' && (
            <button
              type="button"
              onClick={handleClear}
              className="mr-sm flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-on-surface/10 hover:text-on-surface"
              aria-label="Clear search"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          )}
        </div>
      </form>

      {error && (
        <div className="absolute left-1/2 top-full z-10 mt-sm flex -translate-x-1/2 items-center gap-xs rounded-lg bg-error-container px-md py-sm text-sm font-semibold text-on-error-container shadow-lg">
          <span className="material-symbols-outlined text-sm">error</span>
          {error}
        </div>
      )}
    </div>
  );
});

SearchBar.displayName = 'SearchBar';

export default SearchBar;
