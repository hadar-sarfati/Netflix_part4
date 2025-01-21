import React, { useRef, useEffect, useState } from 'react';
import './MoviePreview.css';

const MoviePreview = () => {
  const videoRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [randomMoviePath, setRandomMoviePath] = useState('');

  useEffect(() => {
    // Fetch movies and pick a random one
    const fetchMovies = async () => {
      const token = localStorage.getItem('accessToken');
      try {
        const response = await fetch('http://localhost:3001/api/movies', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch movies');
        }

        const data = await response.json();
        console.log('Fetched Categories:', data);

        // Filter non-empty categories
        const nonEmptyCategories = data.filter(
          (category) => category.movies && category.movies.length > 0
        );

        if (nonEmptyCategories.length > 0) {
          // Choose a random category
          const randomCategory =
            nonEmptyCategories[Math.floor(Math.random() * nonEmptyCategories.length)];

          // Choose a random movie within the chosen category
          const randomMovie =
            randomCategory.movies[Math.floor(Math.random() * randomCategory.movies.length)];

          const randomMovieID = randomMovie._id;

          console.log('Random Category:', randomCategory);
          console.log('Random Movie:', randomMovie);

          // Fetch details for the random movie
          await fetchMovieDetails(randomMovieID, token);
        } else {
          console.warn('No non-empty categories available.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchMovieDetails = async (id, token) => {
      try {
        const response = await fetch(`http://localhost:3001/api/movies/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch movie details');
        }

        const movieDetails = await response.json();
        console.log('Fetched Movie Details:', movieDetails);

        // Assume movieDetails contains a 'path' field
        setRandomMoviePath(movieDetails.path);
      } catch (err) {
        console.error('Error fetching movie details:', err.message);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener('error', (e) => {
        console.error('Video Error:', videoRef.current.error);
      });
    }
  }, []);

  if (loading) {
    return <div></div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="movie-preview-container">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="background-video"
      >
        {randomMoviePath && (
          <source src={`http://localhost:3001${randomMoviePath}`} type="video/mp4" />
        )}
      </video>
      <p>randomMoviePath: {randomMoviePath}</p>
      <div className="fade-overlay"></div>
    </div>
  );
};

export default MoviePreview;

