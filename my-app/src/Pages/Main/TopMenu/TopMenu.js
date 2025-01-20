import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TopMenu.css';

const TopMenu = ({ onSearch, onLogout, toggleTheme, currentTheme }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    if (event.key === 'Enter' && searchQuery.trim() !== '') {
      event.preventDefault(); // Prevent page reload
      const query = encodeURIComponent(searchQuery); // Encode query for URL
      window.location.href = `http://localhost:3000/movies/search/${query}`; // Navigate to the search URL
    }
  };


  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    }
  };

  const handleThemeToggle = () => {
    if (toggleTheme) {
      toggleTheme();
    }
  };

  return (
    <div className="top-menu">
      <button className="home-button" onClick={handleHomeClick}>
        Home
      </button>
      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search..."
          className="search-bar"
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyDown={handleSearchSubmit}
        />
      </div>
      <div className="buttons-container">
        <button className="theme-toggle-button" onClick={handleThemeToggle}>
          {currentTheme === 'dark' ? '☀️' : '🌙'}
        </button>
        <button className="logout-button" onClick={handleLogoutClick}>
          Log Out
        </button>
      </div>
    </div>
  );
};

export default TopMenu;