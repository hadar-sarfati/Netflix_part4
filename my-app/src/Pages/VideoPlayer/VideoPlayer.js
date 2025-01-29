import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './VideoPlayer.css';
import fetchLoginUser from "../Login/fetchLoginUser";


const VideoPlayer = () => {
  const navigate = useNavigate();
  const { id } = useParams();                                   // Get the movieId from the URL
  const [user, setUser] = useState(null);                       // New state for user
  const [moviePath, setMoviePath] = useState(null);             // New state for movie path
  const [isPaused, setIsPaused] = useState(false);              // New state for video playback - played or paused
  const [showButton, setShowButton] = useState(false);          // New state for play/pause button visibility
  const [showBackButton, setShowBackButton] = useState(false);  // New state for back button visibility
  const playerRef = useRef(null);                               // Ref for video player
  const timeoutRef = useRef(null);                              // Ref for timeout
  const isHoveringButton = useRef(false);                       // Ref for button hover state

  // Event handler for mouse moves
  const handleMouseMove = () => {
    if (!isHoveringButton.current) {
      setShowButton(true);
      setShowBackButton(true);
      resetHideTimer();
    }
  };
  
  const handleMouseEnter = () => {
    isHoveringButton.current = true;
    setShowButton(true); 
  };
  
  const handleMouseLeave = () => {
    isHoveringButton.current = false;
    resetHideTimer();
  };
  
  // Timers for hiding buttons
  const resetHideTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      if (!isHoveringButton.current) {
        setShowButton(false);
        setShowBackButton(false);  // Hide back button after delay
      }
    }, 2000);
  };
  
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Fetch movie data when component mounts
  useEffect(() => {
    // Ensure movieId is not undefined before making request
    if (!id) return;  
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/Login');
      return;
    }
  
    // Fetch user and categories
    fetchLoginUser(token, setUser)
      .catch((error) => {
        console.error('Error fetching user details:', error);
        localStorage.removeItem('accessToken');
        navigate('/Login');
      });
  
    // Function to fetch movie details
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/movies/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch movie details');
        }
  
        const movieDetails = await response.json();
  
        // Set the path to the movie file
        setMoviePath(movieDetails.path);
      } catch (err) {
        console.error('Error fetching movie details:', err.message);
      }
    };
  
    fetchMovieDetails(); 
  }, [id, navigate]);

  const handlePlayPause = () => {
    if (playerRef.current.paused) {
      playerRef.current.play();
      setIsPaused(false);
    } else {
      playerRef.current.pause();
      setIsPaused(true);
    }
  };

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.addEventListener('error', (e) => {
        console.error('Video Error:', playerRef.current.error);
      });
    }
  }, []);

  // Show loading message if movie data hasn't loaded yet
  if (!moviePath) {
    return <div>Loading...</div>;
  }

  return (
    <div className="video-container" 
      onMouseMove={handleMouseMove}>
      <button className={`back-btn ${showBackButton ? 'visible' : ''}`} 
        onClick={() => navigate(`/movies/${id}/details`)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}>
        ←
      </button>
      <video
        ref={playerRef}
        autoPlay
        muted
        loop
        playsInline
        className="play-video"
      >
        {moviePath && (
          <source src={`http://localhost:3000/${moviePath}`} type="video/mp4" />
        )}
        <p>moviePath: {moviePath}</p>
      </video>
      <button
        className={`play-pause-btn ${showButton ? 'visible' : ''}`}
        onClick={handlePlayPause}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {isPaused ? '▶' : '⏸'}
      </button>
    </div>
  );
};

export default VideoPlayer;