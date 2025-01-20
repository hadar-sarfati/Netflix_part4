import React, { useState, useEffect } from 'react';
import './Main.css';
import TopMenu from './TopMenu/TopMenu';
import MoviePreview from './MoviePreview/MoviePreview';
import MoviesByCategory from './MoviesByCategory/MoviesByCategory';
import fetchLoginUser from "../Login/fetchLoginUser";
import { useNavigate } from 'react-router-dom';

const Main = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/Login');
    } else {
      fetchLoginUser(token, setUser)
        .catch((error) => {
          console.error('Error fetching user details:', error);
          localStorage.removeItem('accessToken');
          navigate('/Login');
        });
    }
  }, [navigate]);

  const handleSearch = (e) => {
    console.log('Searching:', e.target.value);
  };

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem('accessToken');
    // Clear the user state
    setUser(null);
    // Navigate to the home page
    navigate('/');
  };

  return (
    <div className="main">
      <TopMenu 
       onSearch={handleSearch}
       onLogout={handleLogout}
       user={user} 
       />
      <div className="welcome-message">
        Welcome, {user ? user.username : 'Loading...'}
      </div>
      <MoviePreview />
      <MoviesByCategory />
    </div>
  );
};

export default Main;