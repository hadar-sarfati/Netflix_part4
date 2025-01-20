import React, { useState, useEffect } from 'react';
import './MovieList.css';
import { useNavigate } from 'react-router-dom';

const MovieList = ({ onMovieSelect }) => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchMovies = async () => {
        try {
          const token = localStorage.getItem('accessToken');
          const response = await fetch('http://localhost:3000/api/movies', {
            headers: {
              'Authorization': `Bearer ${token}`, 
            },
          });
  
          if (!response.ok) {
            throw new Error('Failed to fetch movies');
          }
  
          const data = await response.json();
          console.log(data);
          setMovies(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchMovies();
    }, []);
  
    if (error) {
      return <div>Error: {error}</div>;
    }
  
    return (
      <div className="movies-by-category">
        {movies.map((category) => (
          <div key={category.category} className="category-container">
            <h2>{category.category}</h2>
            {category.movies.length > 0 ? (
              <div className="movie-list">
                {category.movies.map((movie) => (
                  <div
                    key={movie._id}
                    className="movie-card"
                    onClick={() => onMovieSelect(movie)} // Use the onMovieSelect function
                  >
                    <h3>{movie.name}</h3>
                  </div>
                ))}
              </div>
            ) : (
              <p>No movies in this category.</p>
            )}
          </div>
        ))}
      </div>
    );
};

export default MovieList;