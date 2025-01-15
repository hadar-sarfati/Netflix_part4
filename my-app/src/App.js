import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Main from "./pages/Main/Main";
import MovieDetails from "./pages/MovieDetails/MovieDetails";
import VideoPlayer from "./pages/VideoPlayer/VideoPlayer";
import SearchResults from "./pages/SearchResults/SearchResults";
import Admin from "./pages/Admin/Admin";

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link> | 
        <Link to="/login">Login</Link> | 
        <Link to="/register">Register</Link> | 
        <Link to="/main">Main</Link> | 
        <Link to="/movie-details">Movie Details</Link> | 
        <Link to="/video-player">Video Player</Link> | 
        <Link to="/search-results">Search Results</Link> | 
        <Link to="/admin">Admin</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/main" element={<Main />} />
        <Route path="/movie-details" element={<MovieDetails />} />
        <Route path="/video-player" element={<VideoPlayer />} />
        <Route path="/search-results" element={<SearchResults />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
