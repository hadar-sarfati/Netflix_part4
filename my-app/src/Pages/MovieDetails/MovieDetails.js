import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './MovieDetails.css'; // Assuming you have styling for this component
// import fetchLoginUser from "../Login/fetchLoginUser";
// import { useNavigate } from 'react-router-dom';

const MovieDetails = () => {
  // // State for storing user data
  // const [user, setUser] = useState(null);
  // // Hook for programmatic navigation
  const navigate = useNavigate();

  // useEffect(() => {
  //   // Check if the user is logged in
  //   const token = localStorage.getItem('accessToken');
  //   if (!token) {
  //     // If not logged in, navigate to the login page
  //     navigate('/Login');
  //   } else {
  //     // Fetch login user details using the token
  //     fetchLoginUser(token, setUser)
  //       .catch((error) => {
  //         console.error('Error fetching user details:', error);
  //         // If there's an error, remove the token and navigate to login
  //         localStorage.removeItem('accessToken');
  //         navigate('/Login');
  //       });
  //   }
  // }, [navigate]);
  const { id } = useParams(); // Get the movieId from the URL parameters
  const [movie, setMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`http://localhost:3000/api/movies/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch movie details');
        }

        const data = await response.json();
        setMovie(data); // Set the fetched movie data
      } catch (err) {
        setError(err.message); // Set the error if any occurs
      } finally {
        setLoading(false); // Set loading to false once fetching is complete
      }
    };

    const fetchRecommendations = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`http://localhost:3001/api/movies/${id}/recommend`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch recommendations');
        }

        const data = await response.json();
        setRecommendations(data.recommendations || []); // Set the fetched recommendations
      } catch (err) {
        console.error('Error fetching recommendations:', err);
      }
    };

    fetchMovieDetails();
    fetchRecommendations();
  }, [id]); // Re-run the effect when the id changes

  // Render loading, error, or movie details
  if (loading) {
    return <div></div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!movie) {
    return <div>No movie data found</div>;
  }

  const handlePlayMovie = () => {
    // Logic to play the movie, like redirecting to a player page or showing a player component
    console.log(`Playing movie: ${movie.name}`);
    navigate(`/VideoPlayer/${movie._id}`);
    // You could replace the log with actual functionality, like opening a movie player
  };

  return (
    <div className="movie-details">
      <h1>{movie.name}</h1>
      <p><strong>Movie Name:</strong> {movie.name}</p>
      <p><strong>Movie ID:</strong> {movie.movieId}</p>
      <p><strong>Categories:</strong> {movie.categories.join(', ')}</p>
      <p><strong>Cast:</strong> {movie.cast.length > 0 ? movie.cast.join(', ') : 'No cast available'}</p>
      <p><strong>Users:</strong> {movie.users.length > 0 ? movie.users.join(', ') : 'No users available'}</p>

      {/* Play button */}
      <button className="play-movie-button" onClick={handlePlayMovie}>
        Play {movie.name}
      </button>

      {/* Recommendations Section */}
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


