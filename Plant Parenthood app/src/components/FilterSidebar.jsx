import React, { useState, useEffect } from 'react';

const FilterSidebar = ({ onFilterChange, isMobileOpen, onClose, isDesktop }) => {
  const [zipCode, setZipCode] = useState('');
  const [distance, setDistance] = useState('10'); 

  useEffect(() => {
    onFilterChange({ zipCode, distance: parseInt(distance) });
  }, [zipCode, distance, onFilterChange]);

  const handleZipCodeChange = (e) => {
    setZipCode(e.target.value);
  };

  const handleDistanceChange = (e) => {
    setDistance(e.target.value);
  };

  return (
    <div style={{
      ...sidebarStyles.container,
      ...(isMobileOpen && !isDesktop ? sidebarStyles.mobileContainer : {})
    }}>
      {!isDesktop && (
        <button onClick={onClose} style={sidebarStyles.closeButton}>
          ✕
        </button>
      )}
      <h3 style={sidebarStyles.header}>Filter</h3>
      <div style={sidebarStyles.filterGroup}>
        <label htmlFor="zipCode" style={sidebarStyles.label}>Zip Code</label>
        <input
          type="text"
          id="zipCode"
          value={zipCode}
          onChange={handleZipCodeChange}
          placeholder="Enter code..."
          style={sidebarStyles.input}
        />
      </div>

      <div style={sidebarStyles.filterGroup}>
        <h4 style={sidebarStyles.subHeader}>Distance</h4>
        {['5', '10', '25', '50', '100'].map((dist) => (
          <div key={dist} style={sidebarStyles.radioItem}>
            <input
              type="radio"
              id={`dist-${dist}`}
              name="distance"
              value={dist}
              checked={distance === dist}
              onChange={handleDistanceChange}
              style={sidebarStyles.radioInput}
            />
            <label htmlFor={`dist-${dist}`} style={sidebarStyles.radioLabel}>
              {dist} miles
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

const sidebarStyles = {
  container: {
    width: '250px',
    backgroundColor: '#f0f0f0',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginRight: '20px',
    flexShrink: 0,
  },
  mobileContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100vh',
    width: '250px',
    zIndex: 1000,
    margin: 0,
    borderRadius: 0,
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    padding: '5px',
    color: '#666',
  },
  header: {
    marginTop: 0,
    marginBottom: '20px',
    color: '#333',
  },
  filterGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold',
    color: '#555',
  },
  input: {
    width: 'calc(100% - 20px)', // Adjust for padding
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '1em',
  },
  subHeader: {
    marginTop: 0,
    marginBottom: '10px',
    color: '#555',
  },
  radioItem: {
    marginBottom: '5px',
    display: 'flex',
    alignItems: 'center',
  },
  radioInput: {
    marginRight: '8px',
  },
  radioLabel: {
    color: '#666',
  },
};

export default FilterSidebar;