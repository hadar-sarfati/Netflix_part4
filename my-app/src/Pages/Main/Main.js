import React, { useState, useEffect } from 'react';
import './Main.css';
import TopMenu from './TopMenu/TopMenu';
import MoviePreview from './MoviePreview/MoviePreview';
import MoviesByCategory from './MoviesByCategory/MoviesByCategory';
import fetchLoginUser from "../Login/fetchLoginUser";
import { useNavigate } from 'react-router-dom';

const Main = () => {
  // State for storing user data
  const [user, setUser] = useState(null);
  // Hook for programmatic navigation
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is logged in
    const token = localStorage.getItem('accessToken');
    if (!token) {
      // If not logged in, navigate to the login page
      navigate('/Login');
    } else {
      // Fetch login user details using the token
      fetchLoginUser(token, setUser)
        .catch((error) => {
          console.error('Error fetching user details:', error);
          // If there's an error, remove the token and navigate to login
          localStorage.removeItem('accessToken');
          navigate('/Login');
        });
    }
  }, [navigate]);

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
      <h1>Welcome, {user ? user.username : 'Loading...'}</h1>
        <MoviePreview />
        <MoviesByCategory />
      </main>
    </div>
  );
};

export default Main;