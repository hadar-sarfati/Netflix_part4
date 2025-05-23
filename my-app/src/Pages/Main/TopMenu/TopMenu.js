import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TopMenu.css';

const TopMenu = ({ onLogout, toggleTheme, currentTheme, user }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Navigate to main page
  const handleHomeClick = () => {
    navigate('/Main');
  };

  // Update search query state
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Handle Enter key in search bar
  const handleSearchSubmit = (event) => {
    if (event.key === 'Enter' && searchQuery.trim() !== '') {
      event.preventDefault();
      navigate('/SearchResults', { state: { initialQuery: searchQuery } });
      setSearchQuery(''); // Clear search after submission
    }
  };

  // Handle logout action
  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    }
  };

  // Toggle theme between light and dark
  const handleThemeToggle = () => {
    if (toggleTheme) {
      toggleTheme();
    }
  };

  // Check if user has admin privileges
  const isAdmin = user?.admin === true;

  return (
    <div className="top-menu" data-theme={currentTheme}>
      <div className="home-logo" onClick={handleHomeClick}>
        <span className="logo-text">ShowTime</span>
      </div>
      <div className={`welcome-message ${currentTheme}`}>
        Welcome {user ? user.username : 'Loading...'}
      </div>
      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Find a movie or a show"
          className="search-bar"
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyDown={handleSearchSubmit}
        />
      </div>
      <button className="theme-toggle-button" onClick={handleThemeToggle}>
        {currentTheme === 'dark' ? '☀️' : '🌙'}
      </button>
      <div className="buttons-container">
        {isAdmin && (
          <button className="manage-button" onClick={() => navigate('/admin')}>
            Manage
          </button>
        )}
        <button className="logout-button" onClick={handleLogoutClick}>
          Log Out
        </button>
      </div>
    </div>
  );
};

export default TopMenu;