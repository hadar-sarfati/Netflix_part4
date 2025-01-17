import React from 'react';
import './Main.css';

const Main = () => {
  const handleSearch = (e) => {
    // Handle search logic
    console.log('Searching:', e.target.value);
  };

  const handleLogout = () => {
    // Handle logout logic
    console.log('Logging out');
  };

  return (
    <div className="main-container">
      <div className="top-menu">
        <button className="home-button">
          Home
        </button>
        
        <input 
          type="text"
          placeholder="Search..."
          className="search-bar"
          onChange={handleSearch}
        />
        
        <button 
          className="logout-button"
          onClick={handleLogout}
        >
          Log Out
        </button>
      </div>

      <main className="main-content">
        <h1>Welcome to the App</h1>
        <p>This is the main content area of your application.</p>
      </main>
    </div>
  );
};

export default Main;

