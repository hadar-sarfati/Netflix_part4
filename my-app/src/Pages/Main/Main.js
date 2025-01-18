import React from 'react';
import './Main.css';
import TopMenu from './TopMenu/TopMenu';
import MoviePreview from './MoviePreview/MoviePreview';
import MoviesByCategory from './MoviesByCategory/MoviesByCategory';

const Main = () => {
  const handleSearch = (e) => {
    console.log('Searching:', e.target.value);
  };

  const handleLogout = () => {
    console.log('Logging out');
  };

  return (
    <div className="main-container">
      <TopMenu onSearch={handleSearch} onLogout={handleLogout} />
      <main className="main-content">
        <MoviePreview />
        <MoviesByCategory />
      </main>
    </div>
  );
};

export default Main;