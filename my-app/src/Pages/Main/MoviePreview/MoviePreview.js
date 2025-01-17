import React, { useRef, useEffect } from 'react';
import './MoviePreview.css';

const MoviePreview = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener('error', (e) => {
        console.error('Video Error:', videoRef.current.error);
      });
    }
  }, []);

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
        <source 
          src="http://localhost:3001/video" 
          type="video/mp4"
        />
      </video>
      <div className="fade-overlay"></div>
    </div>
  );
};

export default MoviePreview;

