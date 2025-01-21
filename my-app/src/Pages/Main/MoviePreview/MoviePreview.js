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
        console.log(data); // Log to verify the fetched movies

        // Pick a random movie and set its path
        if (data && data.length > 0) {
          const randomMovie = data[Math.floor(Math.random() * data.length)];
          setRandomMoviePath(randomMovie.path); // Assume each movie has a `path` field
          console.log("MyRandomMovie: ");
          console.log(randomMovie);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
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
    return <div>Loading...</div>;
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
          <source src={`http://localhost:3001/${randomMoviePath}`} type="video/mp4" />
        )}
      </video>
      <p>randomMoviePath</p>
      <div className="fade-overlay"></div>
    </div>
  );
};

export default MoviePreview;
