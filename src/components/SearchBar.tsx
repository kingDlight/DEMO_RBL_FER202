import React, { useState, forwardRef } from 'react';
import { Form, InputGroup, Button, Badge } from 'react-bootstrap';
import { useTheme } from '../context/ThemeContext';

interface SearchBarProps {
  onSearch: (keyword: string) => void;
}

const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(({ onSearch }, ref) => {
  const [keyword, setKeyword] = useState('');
  const [error, setError] = useState('');
  const { isDark } = useTheme();

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
    <div className="position-relative w-100">
      <Form onSubmit={handleSubmit} className="d-flex align-items-center w-100">
        <InputGroup className={`${isDark ? 'bg-dark' : 'bg-light'} rounded-pill overflow-hidden border ${isDark ? 'border-secondary' : 'border-light-subtle'} w-100 shadow-sm`}>
          <InputGroup.Text className={`bg-transparent border-0 ${isDark ? 'text-secondary' : 'text-muted'}`}>
            <span className="material-symbols-outlined fs-6">search</span>
          </InputGroup.Text>
          <Form.Control
            ref={ref}
            type="text"
            placeholder="Search tracks..."
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              if (error) setError('');
            }}
            className={`bg-transparent border-0 ${isDark ? 'text-light' : 'text-dark'} shadow-none`}
          />
          {keyword !== '' && (
            <Button variant="link" onClick={handleClear} className={`${isDark ? 'text-secondary hover-text-light' : 'text-muted hover-text-dark'} text-decoration-none border-0 p-2 d-flex align-items-center justify-content-center`}>
              <span className="material-symbols-outlined fs-6">close</span>
            </Button>
          )}
        </InputGroup>
      </Form>
      {error && (
        <div className="position-absolute top-100 start-50 translate-middle-x mt-2 z-3">
          <Badge bg="danger" className="p-2 d-flex align-items-center gap-1 shadow">
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>error</span>
            {error}
          </Badge>
        </div>
      )}
    </div>
  );
});

SearchBar.displayName = 'SearchBar';

export default SearchBar;
