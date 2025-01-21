import React, { useState, useEffect } from 'react';
import './Main.css';
import TopMenu from './TopMenu/TopMenu';
import MoviePreview from './MoviePreview/MoviePreview';
import MoviesByCategory from './MoviesByCategory/MoviesByCategory';
import fetchLoginUser from "../Login/fetchLoginUser";
import { useNavigate } from 'react-router-dom';
import themes from "../theme"; // Make sure this path is correct

const Main = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  
  // Add theme state management
  const [currentTheme, setCurrentTheme] = useState(() => 
    localStorage.getItem("theme") || "dark"
  );

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

  // Add theme effect
  useEffect(() => {
    const root = document.documentElement;
    const themeColors = themes[currentTheme];
    
    if (themeColors) {
      Object.entries(themeColors).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
      });
    }
    localStorage.setItem("theme", currentTheme);
  }, [currentTheme]);

  const handleSearch = (e) => {
    console.log('Searching:', e.target.value);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
    navigate('/');
  };

  const toggleTheme = () => {
    setCurrentTheme(prevTheme => prevTheme === "light" ? "dark" : "light");
  };

  return (
    <div className={`main-container ${currentTheme}`}>
      <TopMenu 
        onSearch={handleSearch}
        onLogout={handleLogout}
        toggleTheme={toggleTheme}
        currentTheme={currentTheme}
        user={user}
      />
      <MoviePreview />
      <MoviesByCategory />
    </div>
  );
};

export default Main;