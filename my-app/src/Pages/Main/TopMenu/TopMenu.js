import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TopMenu.css';

const TopMenu = ({ onSearch, onLogout, user }) => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/Main');
  };

  const handleAdminClick = () => {
    navigate('/Admin');
  };

  return (
    <div className="top-menu">
      <button onClick={handleHomeClick}>Home</button>
      {user?.admin && (
        <button onClick={handleAdminClick}>Admin</button>
      )}
      <button onClick={onLogout}>Log Out</button>
      <button>
        🌙
      </button>
    </div>
  );
};

export default TopMenu;