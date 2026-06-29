import React, { useState } from 'react';
import { Form, InputGroup, Button, Badge } from 'react-bootstrap';

interface SearchBarProps {
  onSearch: (keyword: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
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
    <div className="position-relative">
      <Form onSubmit={handleSubmit} className="d-flex align-items-center">
        <InputGroup className="bg-dark rounded-pill overflow-hidden border border-secondary" style={{ width: '250px' }}>
          <InputGroup.Text className="bg-transparent border-0 text-secondary">
            <span className="material-symbols-outlined fs-6">search</span>
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Search tracks..."
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              if (error) setError('');
            }}
            className="bg-transparent border-0 text-light shadow-none"
          />
          {keyword !== '' && (
            <Button variant="link" onClick={handleClear} className="text-secondary hover-text-light text-decoration-none border-0 p-2 d-flex align-items-center justify-content-center">
              <span className="material-symbols-outlined fs-6">close</span>
            </Button>
          )}
        </InputGroup>
      </Form>
      {error && (
        <div className="position-absolute top-100 start-50 translate-middle-x mt-2">
          <Badge bg="danger" className="p-2 d-flex align-items-center gap-1 shadow">
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>error</span>
            {error}
          </Badge>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
