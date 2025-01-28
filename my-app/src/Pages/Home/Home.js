import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  // Remove accessToken from localStorage when the app starts
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      localStorage.removeItem("accessToken");
    }
  }, []);

  return (
    <div className="home-container">
      {/* Header section */}
      <div className="home-logo">
        <span className="logo-text">Welcome to ShowTime</span>
      </div>

      {/* Content section with a vertical divider */}
      <div className="content">
        {/* Registration Section */}
        <div className="section">
          <p className="tagline">New to the show? Start your journey here!</p>
          <Link to="/register" className="button">Sign Up</Link>
        </div>

        {/* Vertical Divider */}
        <div className="divider"></div>

        {/* Login Section */}
        <div className="section">
          <p className="tagline">Your next binge is one click away</p>
          <Link to="/login" className="button">Log In</Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
