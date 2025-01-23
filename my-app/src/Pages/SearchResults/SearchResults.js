import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './SearchResults.css';
import fetchLoginUser from "../Login/fetchLoginUser";

const SearchResults = () => {
  // State management
  const [user, setUser] = useState(null);
  const [currentTheme, setCurrentTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  // Hooks for navigation and location
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get initial query from navigation state
  useEffect(() => {
    const initialQuery = location.state?.initialQuery;
    if (initialQuery) {
      setQuery(initialQuery);
      handleSearch(initialQuery);
    }
  }, [location.state]);

  // Authentication check
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
    }
  }, [navigate]);

  // Search API call
  const handleSearch = async (searchQuery = query) => {
    if (!searchQuery) return;

    const token = localStorage.getItem('accessToken');
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/movies/search/${searchQuery}`, {
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

  return (
    <div className={`search-results theme-${currentTheme}`}>
      <input
        type="text"
        placeholder="Search for movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
      />
      <button onClick={() => handleSearch()}>Search</button>
      {loading ? (
        <div className="loading"></div>
      ) : (
        <div className="movies-by-category">
          {movies.length > 0 ? (
            movies.map((movie) => (
              <div 
                key={movie._id} 
                className="movie-card"
                onClick={() => handleMovieClick(movie._id)}
              >
                <h3>{movie.name}</h3>
                <p>Category: {movie.categories.map((cat) => cat.name).join(', ')}</p>
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