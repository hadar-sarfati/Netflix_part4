import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './MovieDetails.css';
import fetchLoginUser from "../Login/fetchLoginUser";

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]); // New state for categories
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async (token) => {
      try {
        const response = await fetch('http://localhost:3000/api/categories', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }

        const data = await response.json();
        setCategories(data); // Save categories
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    const fetchMovieDetails = async (token) => {
      try {
        const response = await fetch(`http://localhost:3000/api/movies/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch movie details');
        }

        const data = await response.json();
        setMovie(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchRecommendations = async (token) => {
      try {
        const response = await fetch(`http://localhost:3000/api/movies/${id}/recommend`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch recommendations');
        }

        const data = await response.json();
        setRecommendations(data.recommendations || []);
      } catch (err) {
        console.error('Error fetching recommendations:', err);
      }
    };

    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/Login');
    } else {
      // Fetch user and categories
      fetchLoginUser(token, setUser)
        .catch((error) => {
          console.error('Error fetching user details:', error);
          localStorage.removeItem('accessToken');
          navigate('/Login');
        });

      fetchCategories(token);
      fetchMovieDetails(token);
      fetchRecommendations(token);
    }
  }, [id, navigate]);


  const handlePlayMovie = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/Login');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/movies/${id}/recommend`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to send play movie request');
      }

      const data = await response.json();
    } catch (error) {
      console.error('Error playing movie:', error.message);
    }
    navigate(`/VideoPlayer/${id}`);
  };

  const handleBackToHome = () => {
    navigate('/Main'); // Navigate to the home page
  };

  if (loading) {
    return <div></div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!movie) {
    return <div>No movie data found</div>;
  }

  // Create a lookup map for categories by their ObjectId
  const categoryNames = categories.reduce((acc, category) => {
    acc[category._id] = category.name;
    return acc;
  }, {});


  return (
    <div
      className="movie-details"
      style={{ backgroundImage: `url(http://localhost:3000/${movie.previewImage})` }}
    >
      <button onClick={handleBackToHome} className="back-home-button">
        ←
      </button>
      <h1>{movie.name}</h1>
      <p><strong>Movie Name:</strong> {movie.name}</p>
      <p><strong>Categories:</strong> {movie.categories.length > 0 ? movie.categories.map((categoryId) => categoryNames[categoryId] || 'Unknown category').join(', ') : 'No categories available'}</p>
      <p><strong>Year:</strong> {movie.year ? movie.year : 'No year available'}</p>
      <p><strong>Duration:</strong> {movie.duration ? movie.duration : 'No duration available'}</p>
      <p><strong>Cast:</strong> {movie.cast.length > 0 ? movie.cast.join(', ') : 'No cast available'}</p>
      <p><strong>Description:</strong> {movie.description ? movie.description : 'No description available'}</p>

      <button className="play-movie-button" onClick={handlePlayMovie}>
        Play ▶
      </button>

      <div className="recommendations">
        <h2>Recommended Movies</h2>
        {recommendations.length > 0 ? (
          <ul>
            {recommendations.map((rec) => (
              <li key={rec._id}>
                <strong>{rec.name}</strong> ({rec.movieId})
              </li>
            ))}
          </ul>
        ) : (
          <p>No recommendations available</p>
        )}
      </div>
  </div>
  );
};

export default MovieDetails;
