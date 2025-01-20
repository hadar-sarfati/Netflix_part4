import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TopMenu.css';

const TopMenu = ({ onSearch, onLogout }) => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <div className="top-menu">
      <button onClick={handleHomeClick}>Home</button>
      <button onClick={onLogout}>Log Out</button>
      <button>
        🌙
      </button>
    </div>
  );
};

export default TopMenu;