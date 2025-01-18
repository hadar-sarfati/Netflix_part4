import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './TopMenu.css';

const TopMenu = ({ onSearch, onLogout }) => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleHomeClick = () => {
    navigate('/'); // Navigate to the home page without reloading
  };

  return (
    <div className="top-menu">
      <button className="home-button" onClick={handleHomeClick}>
        Home
      </button>
      <input 
        type="text"
        placeholder="Search..."
        className="search-bar"
        onChange={onSearch}
      />
      <button 
        className="logout-button"
        onClick={onLogout}
      >
        Log Out
      </button>
      {/* Light/Dark Mode Button */}
      <button className="theme-toggle-button">
        🌙 {/* This can be a sun/moon emoji or icon for theme toggle */}
      </button>
    </div>
  );
};

export default TopMenu;
