import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

import Home from "./Pages/Home/Home";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import Main from "./Pages/Main/Main";
import MovieDetails from "./Pages/MovieDetails/MovieDetails";
import VideoPlayer from "./Pages/VideoPlayer/VideoPlayer";
import SearchResults from "./Pages/SearchResults/SearchResults";
import Admin from "./Pages/Admin/Admin";

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link> | 
        <Link to="/login">Login</Link> | 
        <Link to="/register">Register</Link> | 
        <Link to="/main">Main</Link> | 
        <Link to="/video-player">Video Player</Link> | 
        <Link to="/search-results">Search Results</Link> | 
        <Link to="/admin">Admin</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/main" element={<Main />} />
        <Route path="/movies/:id/details" element={<MovieDetails />} />
        <Route path="/video-player" element={<VideoPlayer />} />
        <Route path="/search-results" element={<SearchResults />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;

