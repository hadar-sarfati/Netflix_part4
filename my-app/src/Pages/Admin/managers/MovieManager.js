// MovieManager.js
import React, { useState, useEffect } from 'react';
import './Modal.css';

const MovieManager = ({ isOpen, action, movieToEdit, onClose }) => {
    const [movieData, setMovieData] = useState({
        name: '',
        categories: '',
        year: '',
        duration: '',
        cast: '',
        description: '',
        path: ''
    });
    const [path, setPath] = useState('');
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMovieData(prevState => ({
          ...prevState,
          [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 500 * 1024 * 1024) { // 500MB limit
                setMessage('File size too large. Please choose a file under 500MB.');
                e.target.value = ''; // Reset the input
                return;
            }
            setPath(file);
            setMessage(''); // Clear any error messages
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const submitMovieData = new FormData();
            const categoriesArray = movieData.categories.split(',').map(cat => cat.trim());
            // Add all form fields to FormData
            Object.keys(movieData).forEach(key => {
                submitMovieData.append(key, key === 'categories' ? JSON.stringify(categoriesArray) : movieData[key]);
            });
            // Add path if selected
            if (path) {
                submitMovieData.set('path', path);
            }
            
            let url = 'http://localhost:3000/api/movies';
            let meth = 'POST';

            if (action === 'editMovie' && movieToEdit) {
                console.log('Editing movie:', movieToEdit._id);
                url += `/${movieToEdit._id}`;
                meth = 'PUT';
            } else if (action === 'deleteMovie') {
                url += `/${movieToEdit._id}`;
                meth = 'DELETE';
            }

            const response = await fetch(url, {
                method: meth,
                headers: {
                    'X-User-Id': '678a3e123688b3f70e75ef34'
                },
                body: submitMovieData
            });

            if (response.ok) {
                setMessage(`${action === 'editMovie' ? 'Edit' : 'Add'} Movie successful!`);
            } else {
                const errorData = await response.json();
                setMessage(errorData.error || `${action === 'editMovie' ? 'Edit' : 'Add'} Movie failed`);
            }
        } catch (error) {
            setMessage(`An error occurred during ${action === 'editMovie' ? 'editing' : 'adding'} movie`);
        }

        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="admin-container">
                    <div className="admin-header">
                        <h2>{action}</h2>
                    </div>
                    <button onClick={onClose} className="close-button">×</button>
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
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
                            <label htmlFor="path">File:</label>
                            <input
                                id="path"
                                type="file"
                                name="path"
                                value={movieData.path}
                                onChange={handleFileChange}
                                placeholder="Enter movie path"
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