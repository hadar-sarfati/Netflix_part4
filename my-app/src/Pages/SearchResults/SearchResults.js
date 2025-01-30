import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './SearchResults.css';
import fetchLoginUser from "../Login/fetchLoginUser";

const SearchResults = () => {
  // State management for user data, theme, search query, and movies
  const [user, setUser] = useState(null);
  const [currentTheme, setCurrentTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  // Hooks for navigation and location state
  const navigate = useNavigate();
  const location = useLocation();
  
  // Initialize search with query from navigation state if available
  useEffect(() => {
    const initialQuery = location.state?.initialQuery;
    if (initialQuery) {
      setQuery(initialQuery);
      handleSearch(initialQuery);
    }
  }, [location.state]);

  // Check authentication and redirect to login if needed
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/Login');
    } else {
      fetchLoginUser(token, setUser).catch((error) => {
        console.error('Error fetching user details:', error);
        localStorage.removeItem('accessToken');
        navigate('/Login');
      });
      setCurrentTheme(localStorage.getItem('theme') || 'dark');
    }
  }, [navigate]);

  // Handle search API call
  const handleSearch = async (searchQuery = query) => {
    if (!searchQuery) return;

    const token = localStorage.getItem('accessToken');
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/movies/search/${searchQuery}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  // Navigate to movie details page
  const handleMovieClick = (movieId) => {
    navigate(`/movies/${movieId}/details`);
  };

  // Navigate to main page when clicking the logo
  const handleHomeClick = () => {
    navigate('/Main');
  };

  return (
    <div className={`search-results theme-${currentTheme}`}>
      {/* Logo section */}
      <div className="logo-container" onClick={handleHomeClick}>
        <span className="logo-text">ShowTime</span>
      </div>

      {/* Search section with input and button in one container */}
      <div className="search-container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for movies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={() => handleSearch()}>Search</button>
        </div>
      </div>

      {/* Movies display section */}
      {loading ? (
        <div className="loading"></div>
      ) : (
        <div className="movie-list">
          {movies.length > 0 ? (
            movies.map((movie) => (
              <div 
                key={movie._id} 
                className="movie-card"
                onClick={() => handleMovieClick(movie._id)}
              >
                <img src={`http://localhost:3000/${movie.previewImage}`} alt={movie.name} className="movie-preview" />
                <h3>{movie.name}</h3>
              </div>
            ))
          ) : (
            <p>No movies found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResults;