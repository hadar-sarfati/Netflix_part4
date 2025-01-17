// MovieManager.js
import React, { useState, useEffect } from 'react';
import './Modal.css';

const MovieManager = ({ isOpen, action, onClose }) => {
    console.log('MovieManager rendered with isOpen:', isOpen); // Add this for debugging
    const [movieData, setMovieData] = useState({
        name: '',
        categories: [],
        year: '',
        duration: '',
        cast: [],
        description: '',
        path: ''
    });
    const [message, setMessage] = useState('');
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMovieData(prevState => ({
          ...prevState,
          [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (action === 'addMovie') {
                // ... rest of your handleSubmit code ...
            } 
            onClose();
        } catch (error) {
            setError(error.message);
        }
    };

    // Replace your current return statement with this:
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="register-container">
                    <h2>{action}</h2>
                    <button onClick={onClose} className="close-button">×</button>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="movieName">Movie Name:</label>
                            <input
                                id="movieName"
                                type="text"
                                name="name"
                                value={movieData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="categories">Categories:</label>
                            <input
                                id="categories"
                                type="text"
                                name="categories"
                                value={movieData.categories}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="year">Release Year:</label>
                            <input
                                id="year"
                                type="number"
                                name="year"
                                value={movieData.year}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="duration">Duration:</label>
                            <input
                                id="duration"
                                type="text"
                                name="duration"
                                value={movieData.duration}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="cast">Cast:</label>
                            <input
                                id="cast"
                                type="text"
                                name="cast"
                                value={movieData.cast}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Description:</label>
                            <input
                                id="description"
                                type="text"
                                name="description"
                                value={movieData.description}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="file">File:</label>
                            <input
                                id="file"
                                type="text"
                                name="path"
                                value={movieData.path}
                                onChange={handleChange}
                                placeholder="Insert URL of the file here:"
                            />
                        </div>

                        <button type="submit">Enter</button>
                    </form>

                    {message && (
                        <div className={message.includes('successful') ? 'success-message' : 'error-message'}>
                            {message}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MovieManager;