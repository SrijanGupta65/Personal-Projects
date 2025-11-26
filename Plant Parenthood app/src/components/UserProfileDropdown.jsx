import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export default function UserProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="user-profile-container" ref={dropdownRef}>
      <button
        className="user-profile-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className="user-avatar">
          {user.name ? user.name[0].toUpperCase() : '?'}
        </div>
      </button>

      {isOpen && (
        <div className="user-dropdown">
          <div className="user-info">
            <div className="user-name">{user.name}</div>
            <div className="user-email">{user.email}</div>
          </div>
          <div className="dropdown-divider" />
          <button className="logout-button" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      )}
    </div>
  );
} 