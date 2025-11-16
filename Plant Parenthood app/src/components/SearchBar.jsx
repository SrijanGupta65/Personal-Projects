import React from 'react';

export default function SearchBar({ onSearch }) {
  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    onSearch(searchTerm);
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '20px',
      padding: '0 20px'
    }}>
      <input
        type="text"
        className="search-bar"
        placeholder="Search by title, author, or tags..."
        onChange={handleSearch}
        style={{
          width: '100%',
          maxWidth: '600px',
          padding: '12px 20px',
          fontSize: '16px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          outline: 'none',
          transition: 'all 0.2s ease',
          ':focus': {
            borderColor: '#4a6b57',
            boxShadow: '0 0 0 2px rgba(74, 107, 87, 0.2)'
          }
        }}
      />
    </div>
  );
}