import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import hamburgerMenu from '../assets/img/green-hamburger-menu2.svg';
import homeIcon from '../assets/icons/home-page-icon.svg';
import forumIcon from '../assets/icons/forum-page-icon.svg';
import seedFinderIcon from '../assets/icons/seed-finder-icon.svg';
import recommendedIcon from '../assets/icons/recommended-page-icon.svg';
import UserProfileDropdown from './UserProfileDropdown';
import { useUser } from '../context/UserContext';

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();

  const handleToggle = () => setMenuOpen((open) => !open);
  const handleClose = () => setMenuOpen(false);

  return (
    <header>
      <nav className="navbar">
        {/* Persistent Desktop Navigation - Title */}
        <h1 
          className="navbar-title desktop-nav-item"
          onClick={() => navigate('/home')}
          style={{ 
            cursor: 'pointer',
            transition: 'opacity 0.2s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          Plant Parenthood
        </h1>

        {/* Persistent Desktop Navigation - Links */}
        <ul className="nav-links desktop-nav-item">
          <li><a href="/home">Dashboard</a></li>
          <li><a href="/community-forum">Community Forum</a></li>
          <li><a href="/seed-page">Seed Finder</a></li>
          <li><a href="/recommend-page">Recommendations</a></li>
        </ul>

        {/* User Profile Dropdown */}
        {user ? (
          <UserProfileDropdown />
        ) : (
          <button 
            className="login-button"
            onClick={() => navigate('/login')}
            style={{
              background: 'none',
              border: '2px solid white',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '20px',
              cursor: 'pointer',
              marginLeft: '20px'
            }}
          >
            Log In
          </button>
        )}

        {/* Hamburger Button for Mobile - to be shown/hidden with CSS */}
        <button
          className="hamburger menu-toggle mobile-nav-trigger"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="sidebar-drawer"
          onClick={handleToggle}
        >
          <img src={hamburgerMenu} alt="Menu" style={{ width: 42, height: 42 }} />
        </button>
        <h1 className="mobile-greeting-section" style={{ fontFamily: 'inherit', fontWeight: 700, fontSize: '2.5rem', color: '#205624', margin: 0 }}>
          {user ? `Hello, ${user.name}!` : 'Hello!'}
        </h1>

        {/* Sidebar Drawer for Mobile - controlled by menuOpen state */}
        {menuOpen && (
          <>
            <div
              className="sidebar-overlay"
              onClick={handleClose}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(0,0,0,0.15)',
                zIndex: 1000,
              }}
            />
            <aside
              className="sidebar-drawer"
              style={{
                position: 'fixed',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100%',
                height: '100vh',
                background: '#CDDBC8',
                zIndex: 1001,
                padding: '30px 24px',
                boxSizing: 'border-box',
                transition: 'transform 0.3s ease-out',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0 20px' }}>
                <h1 
                  onClick={() => {
                    handleClose();
                    navigate('/home');
                  }}
                  style={{ 
                    fontFamily: "'DM Serif Display', serif", 
                    fontWeight: 700, 
                    fontSize: '32px', 
                    color: '#205624', 
                    margin: '20px 0',
                    cursor: 'pointer',
                    transition: 'opacity 0.2s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  Plant Parenthood
                </h1>
                <button onClick={handleClose} aria-label="Close sidebar" style={{ background: 'none', border: 'none', color: '#205624', cursor: 'pointer', padding: '0' }}>
                  <svg width="38" height="32" viewBox="0 0 24 24" fill="none" stroke="#205624" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                </button>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '20px', display: 'flex', flexDirection: 'column', gap: '35px' }}>
                <li>
                  <a href="/home" style={{ display: 'flex', alignItems: 'center', fontSize: '24px', color: '#205624', textDecoration: 'none', fontWeight: 500 }}>
                    <img src={homeIcon} alt="" style={{ width: '24px', height: '24px', marginRight: '16px' }} />
                    Dashboard
                  </a>
                </li>
                <li>
                  <a href="/community-forum" style={{ display: 'flex', alignItems: 'center', fontSize: '24px', color: '#205624', textDecoration: 'none', fontWeight: 500 }}>
                    <img src={forumIcon} alt="" style={{ width: '24px', height: '24px', marginRight: '16px' }} />
                    Community Forum
                  </a>
                </li>
                <li>
                  <a href="/seed-page" style={{ display: 'flex', alignItems: 'center', fontSize: '24px', color: '#205624', textDecoration: 'none', fontWeight: 500 }}>
                    <img src={seedFinderIcon} alt="" style={{ width: '24px', height: '24px', marginRight: '16px' }} />
                    Seed Finder
                  </a>
                </li>
                <li>
                  <a href="/recommend-page" style={{ display: 'flex', alignItems: 'center', fontSize: '24px', color: '#205624', textDecoration: 'none', fontWeight: 500 }}>
                    <img src={recommendedIcon} alt="" style={{ width: '24px', height: '24px', marginRight: '16px' }} />
                    Recommendations
                  </a>
                </li>
                {user && (
                  <li>
                    <button
                      onClick={() => {
                        handleClose();
                        navigate('/login');
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '24px',
                        color: '#dc3545',
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer',
                        fontWeight: 500,
                      }}
                    >
                      Log Out
                    </button>
                  </li>
                )}
              </ul>
            </aside>
          </>
        )}
      </nav>
    </header>
  );
}