import React, { useState, useEffect } from 'react';

const ShopCard = ({ shop }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleVisitStore = () => {
    if (shop.websiteUrl) {
      window.open(shop.websiteUrl, '_blank');
    }
  };
  
  return (
    <div style={{
      ...shopCardStyles.card,
      ...(isMobile ? shopCardStyles.mobileCard : {})
    }}>
      <img src={shop.imageUrl} alt={shop.name} style={{
        ...shopCardStyles.image,
        ...(isMobile ? shopCardStyles.mobileImage : {})
      }} />
      <div style={{
        ...shopCardStyles.content,
        ...(isMobile ? shopCardStyles.mobileContent : {})
      }}>
        <h3 style={shopCardStyles.name}>{shop.name}</h3>
        <a 
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shop.address)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            ...shopCardStyles.address,
            textDecoration: 'none',
            cursor: 'pointer',
            ':hover': {
              textDecoration: 'underline'
            }
          }}
        >
          {shop.address}
        </a>
        <p style={shopCardStyles.description}>{shop.description}</p>
        <button 
          onClick={handleVisitStore}
          style={{
            ...shopCardStyles.button,
            opacity: shop.websiteUrl ? 1 : 0.5,
            cursor: shop.websiteUrl ? 'pointer' : 'not-allowed'
          }}
        >
          {shop.websiteUrl ? 'Visit store →' : 'Website not available'}
        </button>
      </div>
    </div>
  );
};

const shopCardStyles = {
  card: {
    display: 'flex',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '20px',
    overflow: 'hidden',
    border: '1px solid #ddd',
    width: '100%',
    maxWidth: '800px',
    minHeight: '200px',
  },
  mobileCard: {
    flexDirection: 'column',
    minHeight: 'auto',
  },
  image: {
    width: '200px',
    height: '200px',
    objectFit: 'cover',
    flexShrink: 0,
  },
  mobileImage: {
    width: '100%',
    height: '200px',
  },
  content: {
    padding: '20px',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  mobileContent: {
    padding: '15px',
  },
  name: {
    margin: '0 0 10px 0',
    color: '#333',
    fontSize: '1.2em',
    fontWeight: 'bold',
  },
  address: {
    margin: '0 0 10px 0',
    color: '#666',
    fontSize: '0.9em',
  },
  description: {
    margin: '0 0 15px 0',
    color: '#555',
    fontSize: '0.9em',
    flexGrow: 1,
  },
  button: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.9em',
    alignSelf: 'flex-start',
  },
};

export default ShopCard;