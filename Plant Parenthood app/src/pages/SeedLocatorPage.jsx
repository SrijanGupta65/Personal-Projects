import React, { useState, useEffect, useCallback } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import FilterSidebar from '../components/FilterSidebar';
import ShopList from '../components/ShopList';
import shopsData from '../../public/data/shops'; 

export default function SeedLocatorPage() {
  const [allShops, setAllShops] = useState([]);
  const [filteredShops, setFilteredShops] = useState([]);
  const [filters, setFilters] = useState({ zipCode: '', distance: 10 });
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false); 
  const [mainSearchQuery, setMainSearchQuery] = useState('');

  const MOBILE_BREAKPOINT = 768; 


  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= MOBILE_BREAKPOINT);
  const [searchBarWidth, setSearchBarWidth] = useState(window.innerWidth >= MOBILE_BREAKPOINT ? '600px' : '350px');

  useEffect(() => {
    setAllShops(shopsData);
  }, []);

  const applyFilters = useCallback(() => {
    let currentFiltered = allShops;

    if (mainSearchQuery) {
      const lowerCaseQuery = mainSearchQuery.toLowerCase();
      currentFiltered = currentFiltered.filter(shop =>
        shop.name.toLowerCase().includes(lowerCaseQuery) ||
        shop.description.toLowerCase().includes(lowerCaseQuery) ||
        shop.address.toLowerCase().includes(lowerCaseQuery) 
      );
    }

    if (filters.zipCode) {
      currentFiltered = currentFiltered.filter(shop =>
        shop.address.toLowerCase().includes(filters.zipCode.toLowerCase())
      );
    }

    if (filters.distance) {
       currentFiltered = currentFiltered.filter(shop => shop.id <= filters.distance);
     }

    setFilteredShops(currentFiltered);
  }, [allShops, filters, mainSearchQuery]);

  useEffect(() => {
    applyFilters();
  }, [allShops, filters, applyFilters]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const currentIsDesktop = window.innerWidth >= MOBILE_BREAKPOINT;
      setIsDesktop(currentIsDesktop);
      setSearchBarWidth(currentIsDesktop ? '600px' : '350px');
      if (currentIsDesktop) {
        setIsMobileFilterOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMobileFilter = () => {
    setIsMobileFilterOpen(prev => !prev);
  };

  const closeMobileFilter = () => {
    setIsMobileFilterOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      const searchContainer = document.getElementById('mainSearchBarContainer');
      if (searchContainer) {
        if (window.innerWidth >= 768) {
          searchContainer.style.maxWidth = '600px';
        } else {
          searchContainer.style.maxWidth = '350px';
        }
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); 

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <NavBar />
      <div style={pageStyles.headerContainer}>
        <h1 style={pageStyles.pageTitle}>Shop Seeds Locally in Washington</h1>
        <div style={pageStyles.mainSearchBarContainer}>
          <div style={{
            display: 'flex',
            width: '100%',
            maxWidth: searchBarWidth,
            gap: '10px',
            alignItems: 'center',
          }}>
            <input 
              id='mainSearchBarContainer'
              type="text"
              placeholder="Search for Shops by Name, Description, or Address... "    
              value={mainSearchQuery}
              onChange={(e) => setMainSearchQuery(e.target.value)}
              style={pageStyles.mainSearchInput}
            />
            {!isDesktop && (
              <button onClick={toggleMobileFilter} style={pageStyles.filterIcon}>
                <span role="img" aria-label="filter-icon">⚙️</span>
              </button>
            )}
          </div>
        </div>
      </div>
      
      <main style={pageStyles.mainContent}>
        {(isDesktop || isMobileFilterOpen) && (
          <FilterSidebar
            onFilterChange={handleFilterChange}
            isMobileOpen={isMobileFilterOpen}
            onClose={closeMobileFilter}
            isDesktop={isDesktop}
          />
        )}
        <ShopList shops={filteredShops} />
      </main>
      <Footer />
    </>
  );
}

const pageStyles = {
  headerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto 20px',
    padding: '0 20px',
    gap: '20px',
  },
  pageTitle: {
    color: '#333',
    fontSize: '2.2em',
    fontFamily: 'Arial, sans-serif',
    margin: 0,
    textAlign: 'center',
  },
  mainContent: {
    display: 'flex',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    gap: '20px',
  },
  mobileFilterTrigger: {
    display: 'flex',
    width: '100%',
    marginBottom: '20px',
    padding: '0 20px',
    boxSizing: 'border-box',
  },
  mobileZipInput: {
    flexGrow: 1,
    padding: '10px 15px',
    border: '1px solid #ccc',
    borderRadius: '4px 0 0 4px',
    fontSize: '1em',
    outline: 'none',
  },
  mainSearchBarContainer: {
    display: 'flex',
    width: '100%',
    maxWidth: '500px',
    gap: '10px',
    alignItems: 'center',
    margin: '0 auto',
    paddingLeft: '20px',
  },
  mainSearchInput: {
    flex: 1,
    padding: '10px 15px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '1em',
    outline: 'none',
    height: '42px',
    maxWidth: '600px',
  },
  filterIcon: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1.2em',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    height: '42px', 
    width: '42px', 
  },
};