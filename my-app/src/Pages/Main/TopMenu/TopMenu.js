import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TopMenu.css';

const TopMenu = ({ onSearch, onLogout, toggleTheme, currentTheme, user }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleHomeClick = () => {
    navigate('/Main');
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    if (event.key === 'Enter' && searchQuery.trim() !== '') {
      event.preventDefault();
      const query = encodeURIComponent(searchQuery);
      navigate(`/movies/search/${query}`);
    }
  };

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    }
  };

  const handleThemeToggle = () => {
    console.log('Theme toggle clicked. Current theme:', currentTheme); // Debug log
    if (toggleTheme) {
      toggleTheme();
    }
  };

  // Check if the user is an admin
  const isAdmin = user?.admin === true;

  return (
    <div className="top-menu" data-theme={currentTheme}>
      <img
        src="ShowTimeLogo.png"
        alt="Home"
        className="home-image"
        onClick={handleHomeClick}
      />
      <div className={`welcome-message ${currentTheme}`}>
        Welcome {user ? user.username : 'Loading...'}
      </div>
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
