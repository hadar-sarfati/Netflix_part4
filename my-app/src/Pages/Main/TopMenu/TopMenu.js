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
    </div>
  );
};

export default TopMenu;