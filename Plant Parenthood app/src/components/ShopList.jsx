// src/components/ShopList.js
import React from 'react';
import ShopCard from './ShopCard';

const ShopList = ({ shops }) => {
  if (!shops || shops.length === 0) {
    return <p style={{ textAlign: 'center', color: '#555' }}>No shops found matching your criteria.</p>;
  }

  return (
    <div style={shopListStyles.container}>
      {shops.map(shop => (
        <ShopCard key={shop.id} shop={shop} />
      ))}
    </div>
  );
};

const shopListStyles = {
  container: {
    flexGrow: 1, 
    padding: '20px',
  },
};

export default ShopList;