// VideoPlayer.js
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios'; // or whatever HTTP client you're using
import './VideoPlayer.css';
// import fetchLoginUser from "../Login/fetchLoginUser";
// import { useNavigate } from 'react-router-dom';

const VideoPlayer = ({ movieId }) => {
  // // State for storing user data
  // const [user, setUser] = useState(null);
  // // Hook for programmatic navigation
  // const navigate = useNavigate();

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

  const [isPaused, setIsPaused] = useState(true);
  const [showButton, setShowButton] = useState(false);
  const [quality, setQuality] = useState('720');
  const [movieData, setMovieData] = useState(null);
  const playerRef = useRef(null);
  

  // Fetch movie data when component mounts
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        console.log('movieId:', movieId);
        const response = await axios.get(`http://localhost:3000/api/movies/${movieId}`);
        setMovieData(response.data);
      } catch (error) {
        console.error('Error fetching movie:', error);
      }
    };

    fetchMovie();
    console.log('movieData name:', movieData.name);
    console.log('movieData videoPath:', movieData.path);
  }, [movieData, movieId]);

  const handlePlayPause = () => {
    if (playerRef.current.paused) {
      playerRef.current.play();
      setIsPaused(false);
    } else {
      playerRef.current.pause();
      setIsPaused(true);
    }
  };

  const handleQualityChange = (e) => {
    setQuality(e.target.value);
    playerRef.current.src = `${movieData.path}.mp4`;
    playerRef.current.play();
    setIsPaused(false);
  };

  if (!movieData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="video-container">
      <h1 style={{ display: 'none' }}>{movieData.title}</h1>
      
      <select 
        id="quality" 
        style={{ display: 'none' }}
        value={quality}
        onChange={handleQualityChange}
      >
        <option value="720">720p</option>
        <option value="480">480p</option>
        <option value="360">360p</option>
      </select>

      <video
        ref={playerRef}
        width="480"
        autoPlay
        muted
        onMouseEnter={() => setShowButton(true)}
        onMouseLeave={() => setShowButton(false)}
      >
        <source src={`${movieData.path}.mp4`} type="video/mp4" />
      </video>

      <button
        className={`play-pause-btn ${showButton ? 'visible' : ''}`}
        onClick={handlePlayPause}
        onMouseEnter={() => setShowButton(true)}
        onMouseLeave={() => setShowButton(false)}
      >
        {isPaused ? 'Play' : 'Pause'}
      </button>
    </div>
  );
};

export default VideoPlayer;