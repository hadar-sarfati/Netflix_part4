import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to the Netflix App</h1>
      <p>If you are new, register now:</p>
      <Link to="/register" className="button">Register</Link>
      <p>Already have an account?</p>
      <Link to="/login" className="button">Login</Link>
    </div>
  );
}

export default Home;
