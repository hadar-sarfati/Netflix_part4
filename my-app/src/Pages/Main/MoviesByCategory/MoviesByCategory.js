import React, { useState, useEffect } from 'react';
import './MoviesByCategory.css';
import { useNavigate } from 'react-router-dom';

const MoviesByCategory = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate hook for navigation

  useEffect(() => {
    const fetchMovies = async () => {
      const token = localStorage.getItem('accessToken');
      try {
        const response = await fetch('http://localhost:3001/api/movies', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch movies');
        }

        const data = await response.json();

        // Set the movies data (keeping categories and movie lists intact)
        setMovies(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Function to handle movie click and navigate to movie details page
  const handleMovieClick = (movieId) => {
    navigate(`/movies/${movieId}/details`);
  };

  // Render loading, error, or movie categories
  if (loading) {
    return <div></div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="movies-by-category">
      {movies
        .filter((category) => category.movies.length > 0) // Exclude categories with no movies
        .map((category) => (
          <div key={category.category} className="category-container">
            <h2>{category.category}</h2>
            <div className="movie-list">
              {category.movies.map((movie) => (
                <div
                  key={movie._id}
                  className="movie-card"
                  onClick={() => handleMovieClick(movie._id)} // Call the handleMovieClick on click
                >
                  <img src={`http://localhost:3001/${movie.previewImage}`} alt={movie.name} className="movie-preview" />
                  <h3>{movie.name}</h3> {/* Display movie name */}
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default MoviesByCategory;